/**
 * Ambient soundscape, synthesised with the Web Audio API (no audio files):
 * slow Mediterranean swell, a breath of desert wind, and a low drone tuned
 * to D and A. Off by default; only starts after the visitor presses the button.
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function noiseBuffer(ac: AudioContext, seconds = 4) {
  const buf = ac.createBuffer(1, ac.sampleRate * seconds, ac.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    // brown-ish noise: integrated white noise
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    data[i] = last * 3.2;
  }
  return buf;
}

function lfo(ac: AudioContext, freq: number, depth: number, target: AudioParam) {
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.frequency.value = freq;
  g.gain.value = depth;
  o.connect(g).connect(target);
  o.start();
}

function build(): AudioContext {
  const ac = new AudioContext();
  master = ac.createGain();
  master.gain.value = 0;
  master.connect(ac.destination);

  // Sea swell
  const sea = ac.createBufferSource();
  sea.buffer = noiseBuffer(ac);
  sea.loop = true;
  const seaFilter = ac.createBiquadFilter();
  seaFilter.type = 'lowpass';
  seaFilter.frequency.value = 420;
  const seaGain = ac.createGain();
  seaGain.gain.value = 0.35;
  lfo(ac, 0.085, 0.25, seaGain.gain);
  lfo(ac, 0.085, 180, seaFilter.frequency);
  sea.connect(seaFilter).connect(seaGain).connect(master);
  sea.start();

  // Wind
  const wind = ac.createBufferSource();
  wind.buffer = noiseBuffer(ac, 6);
  wind.loop = true;
  const windFilter = ac.createBiquadFilter();
  windFilter.type = 'bandpass';
  windFilter.frequency.value = 900;
  windFilter.Q.value = 0.8;
  const windGain = ac.createGain();
  windGain.gain.value = 0.05;
  lfo(ac, 0.031, 400, windFilter.frequency);
  wind.connect(windFilter).connect(windGain).connect(master);
  wind.start();

  // Drone (D2 + A2), barely there
  [73.42, 110].forEach((f, i) => {
    const o = ac.createOscillator();
    o.type = 'sine';
    o.frequency.value = f;
    const g = ac.createGain();
    g.gain.value = 0.025;
    lfo(ac, 0.05 + i * 0.03, 0.012, g.gain);
    o.connect(g).connect(master!);
    o.start();
  });
  return ac;
}

export function initSound() {
  const btn = document.querySelector<HTMLButtonElement>('[data-sound]');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const on = btn.getAttribute('aria-pressed') !== 'true';
    if (on && !ctx) ctx = build();
    if (!ctx || !master) return;
    if (on) await ctx.resume();
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(on ? 0.6 : 0, now + 1.6);
    if (!on) setTimeout(() => ctx?.state === 'running' && btn.getAttribute('aria-pressed') === 'false' && ctx.suspend(), 1800);
    btn.setAttribute('aria-pressed', String(on));
    btn.title = (on ? btn.dataset.on : btn.dataset.off) ?? '';
  });
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend();
    else if (btn.getAttribute('aria-pressed') === 'true') ctx.resume();
  });
}
