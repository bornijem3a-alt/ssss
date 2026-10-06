export type Lang = 'en' | 'fr' | 'ar';
export const LANGS: Lang[] = ['en', 'fr', 'ar'];
export const LOCALE: Record<Lang, string> = { en: 'en-GB', fr: 'fr-FR', ar: 'ar-TN' };
export const HREF: Record<Lang, string> = { en: '/', fr: '/fr/', ar: '/ar/' };

interface Fact {
  label: string;
  value: string;
}
export interface Chapter {
  id: string;
  /** image slot in data/images.json */
  image: string;
  /** governorate ISO code, used to pull the census figure */
  iso: string;
  name: string;
  nameAr: string;
  place: string;
  text: string;
  facts: Fact[];
}
export interface CultureItem {
  image: string;
  group: 'crafts' | 'cuisine' | 'music' | 'festivals' | 'today';
  title: string;
  caption: string;
}

const en = {
  meta: {
    title: 'Tunisia / تونس: an interactive documentary',
    description:
      'A cinematic journey through Tunisia, from the blue doors of Sidi Bou Said to the dunes of the Sahara, and the people who live there today, told with official census data.',
  },
  nav: {
    skip: 'Skip to content',
    journey: 'Journey',
    map: 'Map',
    people: 'People',
    culture: 'Culture',
    sound: 'Ambient sound',
    soundOn: 'Sound on',
    soundOff: 'Sound off',
    language: 'Language',
  },
  hero: {
    eyebrow: 'An interactive documentary',
    title: 'Tunisia',
    subtitle: 'Between the Mediterranean and the Sahara: one shoreline, three thousand years, nearly twelve million voices.',
    cue: 'Scroll to begin',
  },
  journey: {
    kicker: 'Chapter I',
    title: 'The land',
    intro: 'Eight places, from the whitewashed north to the salt and sand of the south. Scroll to travel.',
    population: 'Governorate population (2024 census)',
    chapters: [
      {
        id: 'sidi-bou-said',
        image: 'sidibousaid',
        iso: 'TN-11',
        name: 'Sidi Bou Said & the Medina of Tunis',
        nameAr: 'سيدي بو سعيد ومدينة تونس العتيقة',
        place: 'Tunis',
        text: 'Blue shutters against lime-white walls. Below the cliff, the gulf. Inland, the medina’s covered souks smell of perfume and wool.',
        facts: [
          { label: 'Medina of Tunis', value: 'UNESCO World Heritage, 1979' },
          { label: 'Sidi Bou Said', value: 'Protected village since 1915' },
        ],
      },
      {
        id: 'carthage',
        image: 'carthage',
        iso: 'TN-11',
        name: 'Carthage',
        nameAr: 'قرطاج',
        place: 'Tunis',
        text: 'Phoenician harbour, Roman capital, ruins by the sea. The columns of the Antonine Baths still stand facing the water.',
        facts: [
          { label: 'Founded', value: '814 BCE, by tradition' },
          { label: 'Archaeological site', value: 'UNESCO World Heritage, 1979' },
        ],
      },
      {
        id: 'el-jem',
        image: 'eljem',
        iso: 'TN-53',
        name: 'El Jem',
        nameAr: 'الجم',
        place: 'Mahdia',
        text: 'A Roman amphitheatre rises above the olive plains, its honey-coloured arches still taller than the town around it.',
        facts: [
          { label: 'Built', value: 'c. 238 CE' },
          { label: 'Capacity', value: '≈ 35,000 spectators' },
          { label: 'Amphitheatre', value: 'UNESCO World Heritage, 1979' },
        ],
      },
      {
        id: 'kairouan',
        image: 'kairouan',
        iso: 'TN-41',
        name: 'Kairouan',
        nameAr: 'القيروان',
        place: 'Kairouan',
        text: 'A city of minarets and carpets. The marble courtyard of the Great Mosque has collected rain and prayer for thirteen centuries.',
        facts: [
          { label: 'Founded', value: '670 CE' },
          { label: 'Kairouan', value: 'UNESCO World Heritage, 1988' },
        ],
      },
      {
        id: 'djerba',
        image: 'djerba',
        iso: 'TN-82',
        name: 'Djerba',
        nameAr: 'جربة',
        place: 'Médenine',
        text: 'An island of white domes, olive groves and fishing nets, where communities have lived side by side for centuries.',
        facts: [
          { label: 'Area', value: '≈ 514 km², the largest island in North Africa' },
          { label: 'Djerba', value: 'UNESCO World Heritage, 2023' },
        ],
      },
      {
        id: 'tabarka',
        image: 'tabarka',
        iso: 'TN-32',
        name: 'Tabarka & the northern forests',
        nameAr: 'طبرقة وغابات الشمال',
        place: 'Jendouba',
        text: 'The green Tunisia: cork oaks on the Kroumirie hills, coral below the cliffs, and a Genoese fort facing the sea.',
        facts: [
          { label: 'Forests', value: 'Cork oak of the Kroumirie mountains' },
          { label: 'Fort', value: 'Genoese, 16th century' },
        ],
      },
      {
        id: 'matmata',
        image: 'matmata',
        iso: 'TN-81',
        name: 'Matmata',
        nameAr: 'مطماطة',
        place: 'Gabès',
        text: 'Amazigh homes dug into the earth around open courtyards, cool in summer and warm in winter.',
        facts: [
          { label: 'Architecture', value: 'Troglodyte pit houses' },
          { label: 'On screen', value: 'Star Wars, 1977' },
        ],
      },
      {
        id: 'sahara',
        image: 'chott',
        iso: 'TN-72',
        name: 'Tozeur, Chott el Jerid & the Sahara',
        nameAr: 'توزر وشط الجريد والصحراء',
        place: 'Tozeur · Kébili',
        text: 'Palm groves end where the salt begins. Beyond the shimmering chott, the dunes of the Grand Erg Oriental roll toward the horizon.',
        facts: [
          { label: 'Chott el Jerid', value: '≈ 7,000 km², the largest salt pan of the Sahara' },
          { label: 'Douz', value: 'Gateway to the Grand Erg Oriental' },
        ],
      },
    ] as Chapter[],
  },
  map: {
    kicker: 'Chapter II',
    title: 'Twenty-four governorates',
    intro: 'Hover, tap or use the list to explore each governorate. Colour shows population at the 2024 census.',
    capital: 'Capital',
    population: 'Population',
    share: 'Share of Tunisia',
    rank: 'Rank',
    of: 'of 24',
    listLabel: 'Governorates',
    noPhoto: 'Photograph to come',
    legendLow: 'fewer people',
    legendHigh: 'more people',
    source: 'Source: INS, RGPH 2024. Boundaries © OpenStreetMap contributors (geoBoundaries, ODbL).',
  },
  people: {
    kicker: 'Chapter III',
    title: 'The people',
    intro: 'Behind every landscape, a population that is growing more slowly, ageing gently and moving to the cities.',
    stats: {
      total: 'inhabitants counted on 6 November 2024',
      urban: 'live in urban areas',
      growth: 'average annual growth, 2014–2024',
      women: 'are women',
      seniors: 'are aged 60 or over (11.7% in 2014)',
    },
    growthTitle: 'A century of growth',
    growthDesc: 'Census counts (INS) and annual World Bank estimates. The two methods differ, so both are shown.',
    census: 'Census count (INS)',
    estimate: 'Annual estimate (World Bank)',
    urbanTitle: 'City and country',
    urban: 'Urban',
    rural: 'Rural',
    ageTitle: 'Age structure, 2024',
    ageDesc: 'Share of the population by age group.',
    ageTodo: 'A detailed five-year pyramid by sex will be added once the official INS table is transcribed (TODO).',
    years: 'years',
    govTitle: 'Population by governorate, 2024',
    govDesc: 'From Tunis (1.08 M) to Tozeur (120,000).',
    tableToggle: 'Show data table',
    sourceLabel: 'Source',
    todo: 'TODO: figure pending verification',
  },
  culture: {
    kicker: 'Chapter IV',
    title: 'Culture & daily life',
    intro: 'Hands, kitchens, songs and crowds, and a country that is also young, urban and connected.',
    groups: { crafts: 'Crafts', cuisine: 'Cuisine', music: 'Music', festivals: 'Festivals', today: 'Tunisia today' },
    items: [
      { image: 'ceramics', group: 'crafts', title: 'Ceramics of Nabeul', caption: 'On Cap Bon, potters glaze plates in cobalt, green and ochre.' },
      { image: 'chechia', group: 'crafts', title: 'Chechia', caption: 'The red felted cap, shaped and brushed by hand in the souks of Tunis.' },
      { image: 'carpets', group: 'crafts', title: 'Carpets of Kairouan', caption: 'Knotted wool in geometric medallions, a craft handed down through families.' },
      { image: 'couscous', group: 'cuisine', title: 'Couscous', caption: 'Steamed semolina, shared from one dish. Recognised by UNESCO in 2020 as heritage of the Maghreb.' },
      { image: 'brik', group: 'cuisine', title: 'Brik', caption: 'Paper-thin malsouka pastry folded around an egg and fried until golden.' },
      { image: 'makroudh', group: 'cuisine', title: 'Makroudh', caption: 'Semolina diamonds filled with dates and soaked in syrup, Kairouan’s sweet.' },
      { image: 'malouf', group: 'music', title: 'Malouf', caption: 'Tunisia’s Andalusian musical heritage, kept alive by the Rachidia institute since 1934.' },
      { image: 'carthage-festival', group: 'festivals', title: 'Carthage International Festival', caption: 'Summer nights of music inside the Roman theatre, held every year since 1964.' },
      { image: 'douz-festival', group: 'festivals', title: 'Sahara Festival of Douz', caption: 'Each winter, horsemen, poets and camel races gather at the gates of the desert.' },
      { image: 'avenue', group: 'today', title: 'Avenue Habib Bourguiba', caption: 'The capital’s boulevard: cafés, theatres and evening crowds.' },
      { image: 'cafe', group: 'today', title: 'Café culture', caption: 'Mint tea with pine nuts, conversation, and a view over the gulf.' },
      { image: 'insat', group: 'today', title: 'Engineers of tomorrow', caption: 'INSAT in Tunis trains the engineers and developers of a fast-growing tech scene.' },
      { image: 'skyline', group: 'today', title: 'Modern Tunis', caption: 'Seven in ten Tunisians now live in towns and cities.' },
      { image: 'artisan', group: 'today', title: 'Living crafts', caption: 'In Hergla, a craftsman turns metal and glass into lamps.' },
    ] as CultureItem[],
  },
  closing: {
    line: 'Night falls on the Erg. The story goes on, in twenty-four governorates and nearly twelve million voices.',
    lineAr: 'يحلّ الليل على العرق، وتستمرّ الحكاية',
    top: 'Back to the sea',
  },
  footer: {
    sources: 'Data sources',
    credits: 'Photographs',
    other: 'Other credits',
    pending: 'credit loading from Wikimedia Commons…',
    by: 'by',
    madeWith: 'Built with Astro, GSAP, Lenis, Leaflet and Chart.js. Figures marked TODO are deliberately left empty until verified.',
    photoTodo: 'Photograph to come',
  },
};

export type Strings = typeof en;

const fr: Strings = {
  meta: {
    title: 'Tunisie / تونس : un documentaire interactif',
    description:
      'Un voyage cinématographique à travers la Tunisie, des portes bleues de Sidi Bou Saïd aux dunes du Sahara, et ceux qui y vivent aujourd’hui, racontés avec les données officielles du recensement.',
  },
  nav: {
    skip: 'Aller au contenu',
    journey: 'Voyage',
    map: 'Carte',
    people: 'Population',
    culture: 'Culture',
    sound: 'Son d’ambiance',
    soundOn: 'Son activé',
    soundOff: 'Son coupé',
    language: 'Langue',
  },
  hero: {
    eyebrow: 'Un documentaire interactif',
    title: 'Tunisie',
    subtitle: 'Entre Méditerranée et Sahara : un rivage, trois mille ans d’histoire, près de douze millions de voix.',
    cue: 'Défiler pour commencer',
  },
  journey: {
    kicker: 'Chapitre I',
    title: 'La terre',
    intro: 'Huit lieux, du nord blanchi à la chaux au sel et au sable du sud. Faites défiler pour voyager.',
    population: 'Population du gouvernorat (recensement 2024)',
    chapters: [
      {
        ...en.journey.chapters[0],
        name: 'Sidi Bou Saïd et la médina de Tunis',
        text: 'Volets bleus sur murs blanchis à la chaux. Sous la falaise, le golfe. Dans la médina, les souks couverts sentent le parfum et la laine.',
        facts: [
          { label: 'Médina de Tunis', value: 'Patrimoine mondial de l’UNESCO, 1979' },
          { label: 'Sidi Bou Saïd', value: 'Village protégé depuis 1915' },
        ],
      },
      {
        ...en.journey.chapters[1],
        name: 'Carthage',
        text: 'Port phénicien, capitale romaine, ruines au bord de la mer. Les colonnes des thermes d’Antonin font toujours face à l’eau.',
        facts: [
          { label: 'Fondation', value: '814 av. J.-C., selon la tradition' },
          { label: 'Site archéologique', value: 'Patrimoine mondial de l’UNESCO, 1979' },
        ],
      },
      {
        ...en.journey.chapters[2],
        name: 'El Jem',
        text: 'Un amphithéâtre romain domine les plaines d’oliviers ; ses arches couleur de miel dépassent encore la ville qui l’entoure.',
        facts: [
          { label: 'Construction', value: 'vers 238 apr. J.-C.' },
          { label: 'Capacité', value: '≈ 35 000 spectateurs' },
          { label: 'Amphithéâtre', value: 'Patrimoine mondial de l’UNESCO, 1979' },
        ],
      },
      {
        ...en.journey.chapters[3],
        name: 'Kairouan',
        text: 'Ville de minarets et de tapis. La cour de marbre de la Grande Mosquée recueille la pluie et la prière depuis treize siècles.',
        facts: [
          { label: 'Fondation', value: '670 apr. J.-C.' },
          { label: 'Kairouan', value: 'Patrimoine mondial de l’UNESCO, 1988' },
        ],
      },
      {
        ...en.journey.chapters[4],
        name: 'Djerba',
        text: 'Une île de coupoles blanches, d’oliveraies et de filets de pêche, où des communautés vivent côte à côte depuis des siècles.',
        facts: [
          { label: 'Superficie', value: '≈ 514 km², la plus grande île d’Afrique du Nord' },
          { label: 'Djerba', value: 'Patrimoine mondial de l’UNESCO, 2023' },
        ],
      },
      {
        ...en.journey.chapters[5],
        name: 'Tabarka et les forêts du nord',
        text: 'La Tunisie verte : chênes-lièges sur les collines de Kroumirie, corail sous les falaises et un fort génois face à la mer.',
        facts: [
          { label: 'Forêts', value: 'Chêne-liège des monts de Kroumirie' },
          { label: 'Fort', value: 'Génois, XVIe siècle' },
        ],
      },
      {
        ...en.journey.chapters[6],
        name: 'Matmata',
        text: 'Des maisons amazighes creusées dans la terre autour de cours ouvertes, fraîches l’été et tièdes l’hiver.',
        facts: [
          { label: 'Architecture', value: 'Habitat troglodytique' },
          { label: 'À l’écran', value: 'Star Wars, 1977' },
        ],
      },
      {
        ...en.journey.chapters[7],
        name: 'Tozeur, le Chott el-Jérid et le Sahara',
        text: 'Les palmeraies s’arrêtent là où commence le sel. Au-delà du chott miroitant, les dunes du Grand Erg oriental roulent vers l’horizon.',
        facts: [
          { label: 'Chott el-Jérid', value: '≈ 7 000 km², le plus grand lac salé du Sahara' },
          { label: 'Douz', value: 'Porte du Grand Erg oriental' },
        ],
      },
    ],
  },
  map: {
    kicker: 'Chapitre II',
    title: 'Vingt-quatre gouvernorats',
    intro: 'Survolez, touchez ou utilisez la liste pour explorer chaque gouvernorat. La couleur indique la population au recensement de 2024.',
    capital: 'Chef-lieu',
    population: 'Population',
    share: 'Part de la Tunisie',
    rank: 'Rang',
    of: 'sur 24',
    listLabel: 'Gouvernorats',
    noPhoto: 'Photographie à venir',
    legendLow: 'moins peuplé',
    legendHigh: 'plus peuplé',
    source: 'Source : INS, RGPH 2024. Limites © contributeurs OpenStreetMap (geoBoundaries, ODbL).',
  },
  people: {
    kicker: 'Chapitre III',
    title: 'Les Tunisiens',
    intro: 'Derrière chaque paysage, une population qui croît plus lentement, vieillit doucement et rejoint les villes.',
    stats: {
      total: 'habitants recensés le 6 novembre 2024',
      urban: 'vivent en milieu urbain',
      growth: 'croissance annuelle moyenne, 2014–2024',
      women: 'sont des femmes',
      seniors: 'ont 60 ans ou plus (11,7 % en 2014)',
    },
    growthTitle: 'Un siècle de croissance',
    growthDesc: 'Recensements (INS) et estimations annuelles de la Banque mondiale. Les méthodes diffèrent : les deux sont affichées.',
    census: 'Recensement (INS)',
    estimate: 'Estimation annuelle (Banque mondiale)',
    urbanTitle: 'Ville et campagne',
    urban: 'Urbain',
    rural: 'Rural',
    ageTitle: 'Structure par âge, 2024',
    ageDesc: 'Part de la population par groupe d’âge.',
    ageTodo: 'Une pyramide détaillée par tranches de cinq ans et par sexe sera ajoutée après transcription du tableau officiel de l’INS (TODO).',
    years: 'ans',
    govTitle: 'Population par gouvernorat, 2024',
    govDesc: 'De Tunis (1,08 M) à Tozeur (120 000).',
    tableToggle: 'Afficher le tableau de données',
    sourceLabel: 'Source',
    todo: 'TODO : chiffre en attente de vérification',
  },
  culture: {
    kicker: 'Chapitre IV',
    title: 'Culture et vie quotidienne',
    intro: 'Des mains, des cuisines, des chants et des foules, et un pays aussi jeune, urbain et connecté.',
    groups: { crafts: 'Artisanat', cuisine: 'Cuisine', music: 'Musique', festivals: 'Festivals', today: 'La Tunisie d’aujourd’hui' },
    items: [
      { image: 'ceramics', group: 'crafts', title: 'Céramique de Nabeul', caption: 'Au cap Bon, les potiers émaillent les plats de cobalt, de vert et d’ocre.' },
      { image: 'chechia', group: 'crafts', title: 'Chéchia', caption: 'Le bonnet rouge en laine feutrée, façonné et brossé à la main dans les souks de Tunis.' },
      { image: 'carpets', group: 'crafts', title: 'Tapis de Kairouan', caption: 'Laine nouée en médaillons géométriques, un savoir-faire transmis en famille.' },
      { image: 'couscous', group: 'cuisine', title: 'Couscous', caption: 'Semoule cuite à la vapeur, partagée dans un même plat. Inscrit par l’UNESCO en 2020 comme patrimoine du Maghreb.' },
      { image: 'brik', group: 'cuisine', title: 'Brik', caption: 'Une feuille de malsouka très fine pliée autour d’un œuf et frite jusqu’à dorer.' },
      { image: 'makroudh', group: 'cuisine', title: 'Makroudh', caption: 'Losanges de semoule fourrés aux dattes et trempés dans le sirop, la douceur de Kairouan.' },
      { image: 'malouf', group: 'music', title: 'Malouf', caption: 'L’héritage musical andalou de la Tunisie, porté par La Rachidia depuis 1934.' },
      { image: 'carthage-festival', group: 'festivals', title: 'Festival international de Carthage', caption: 'Des nuits d’été en musique dans le théâtre romain, chaque année depuis 1964.' },
      { image: 'douz-festival', group: 'festivals', title: 'Festival du Sahara de Douz', caption: 'Chaque hiver, cavaliers, poètes et courses de dromadaires se retrouvent aux portes du désert.' },
      { image: 'avenue', group: 'today', title: 'Avenue Habib-Bourguiba', caption: 'Le boulevard de la capitale : cafés, théâtres et foule du soir.' },
      { image: 'cafe', group: 'today', title: 'Culture du café', caption: 'Thé à la menthe aux pignons, conversations et vue sur le golfe.' },
      { image: 'insat', group: 'today', title: 'Les ingénieurs de demain', caption: 'À Tunis, l’INSAT forme les ingénieurs et développeurs d’une scène tech en plein essor.' },
      { image: 'skyline', group: 'today', title: 'Tunis moderne', caption: 'Sept Tunisiens sur dix vivent aujourd’hui en ville.' },
      { image: 'artisan', group: 'today', title: 'Artisanat vivant', caption: 'À Hergla, un artisan transforme le métal et le verre en luminaires.' },
    ],
  },
  closing: {
    line: 'La nuit tombe sur l’Erg. L’histoire continue, dans vingt-quatre gouvernorats et près de douze millions de voix.',
    lineAr: 'يحلّ الليل على العرق، وتستمرّ الحكاية',
    top: 'Retour à la mer',
  },
  footer: {
    sources: 'Sources des données',
    credits: 'Photographies',
    other: 'Autres crédits',
    pending: 'crédit en cours de chargement depuis Wikimedia Commons…',
    by: 'par',
    madeWith: 'Réalisé avec Astro, GSAP, Lenis, Leaflet et Chart.js. Les chiffres marqués TODO sont volontairement laissés vides jusqu’à vérification.',
    photoTodo: 'Photographie à venir',
  },
};

const ar: Strings = {
  meta: {
    title: 'تونس / Tunisia: وثائقي تفاعلي',
    description:
      'رحلة سينمائية عبر تونس، من الأبواب الزرقاء في سيدي بو سعيد إلى كثبان الصحراء، ومع الناس الذين يعيشون فيها اليوم، مرويّة بأرقام التعداد الرسمي.',
  },
  nav: {
    skip: 'انتقل إلى المحتوى',
    journey: 'الرحلة',
    map: 'الخريطة',
    people: 'السكان',
    culture: 'الثقافة',
    sound: 'صوت محيطي',
    soundOn: 'الصوت مفعّل',
    soundOff: 'الصوت متوقف',
    language: 'اللغة',
  },
  hero: {
    eyebrow: 'وثائقي تفاعلي',
    title: 'Tunisia',
    subtitle: 'بين المتوسط والصحراء: ساحل واحد، ثلاثة آلاف عام، وقرابة اثني عشر مليون صوت.',
    cue: 'مرّر للبدء',
  },
  journey: {
    kicker: 'الفصل الأول',
    title: 'الأرض',
    intro: 'ثمانية أماكن، من الشمال الأبيض إلى ملح الجنوب ورماله. مرّر لتسافر.',
    population: 'سكان الولاية (تعداد 2024)',
    chapters: [
      {
        ...en.journey.chapters[0],
        name: 'سيدي بو سعيد ومدينة تونس العتيقة',
        nameAr: 'Sidi Bou Said & the Medina of Tunis',
        place: 'تونس',
        text: 'نوافذ زرقاء على جدران بيضاء بالجير. تحت الجرف، الخليج. وفي المدينة العتيقة، أسواق مسقوفة تفوح بالعطر والصوف.',
        facts: [
          { label: 'مدينة تونس العتيقة', value: 'تراث عالمي لليونسكو، 1979' },
          { label: 'سيدي بو سعيد', value: 'قرية محمية منذ 1915' },
        ],
      },
      {
        ...en.journey.chapters[1],
        name: 'قرطاج',
        nameAr: 'Carthage',
        place: 'تونس',
        text: 'ميناء فينيقي، عاصمة رومانية، وأطلال على البحر. ما تزال أعمدة حمامات أنطونيوس واقفة في مواجهة الماء.',
        facts: [
          { label: 'التأسيس', value: '814 ق.م، حسب الرواية' },
          { label: 'الموقع الأثري', value: 'تراث عالمي لليونسكو، 1979' },
        ],
      },
      {
        ...en.journey.chapters[2],
        name: 'الجم',
        nameAr: 'El Jem',
        place: 'المهدية',
        text: 'مسرح روماني يعلو سهول الزيتون، وأقواسه بلون العسل ما تزال أعلى من البلدة التي تحيط به.',
        facts: [
          { label: 'البناء', value: 'نحو 238 م' },
          { label: 'السعة', value: 'نحو 35,000 متفرج' },
          { label: 'المسرح', value: 'تراث عالمي لليونسكو، 1979' },
        ],
      },
      {
        ...en.journey.chapters[3],
        name: 'القيروان',
        nameAr: 'Kairouan',
        place: 'القيروان',
        text: 'مدينة المآذن والزرابي. صحن الجامع الكبير الرخامي يجمع المطر والصلاة منذ ثلاثة عشر قرناً.',
        facts: [
          { label: 'التأسيس', value: '670 م' },
          { label: 'القيروان', value: 'تراث عالمي لليونسكو، 1988' },
        ],
      },
      {
        ...en.journey.chapters[4],
        name: 'جربة',
        nameAr: 'Djerba',
        place: 'مدنين',
        text: 'جزيرة القباب البيضاء وغابات الزيتون وشباك الصيد، حيث تعايشت مجتمعات متنوعة جنباً إلى جنب منذ قرون.',
        facts: [
          { label: 'المساحة', value: 'نحو 514 كم²، أكبر جزيرة في شمال إفريقيا' },
          { label: 'جربة', value: 'تراث عالمي لليونسكو، 2023' },
        ],
      },
      {
        ...en.journey.chapters[5],
        name: 'طبرقة وغابات الشمال',
        nameAr: 'Tabarka & the northern forests',
        place: 'جندوبة',
        text: 'تونس الخضراء: أشجار الفلين على تلال خمير، ومرجان تحت الجروف، وحصن جنوي يطل على البحر.',
        facts: [
          { label: 'الغابات', value: 'فلين جبال خمير' },
          { label: 'الحصن', value: 'جنوي، القرن السادس عشر' },
        ],
      },
      {
        ...en.journey.chapters[6],
        name: 'مطماطة',
        nameAr: 'Matmata',
        place: 'قابس',
        text: 'بيوت أمازيغية محفورة في الأرض حول أفنية مكشوفة، باردة صيفاً ودافئة شتاءً.',
        facts: [
          { label: 'العمارة', value: 'مساكن حفرية' },
          { label: 'على الشاشة', value: 'حرب النجوم، 1977' },
        ],
      },
      {
        ...en.journey.chapters[7],
        name: 'توزر وشط الجريد والصحراء',
        nameAr: 'Tozeur, Chott el Jerid & the Sahara',
        place: 'توزر · قبلي',
        text: 'تنتهي الواحات حيث يبدأ الملح. وراء الشط المتلألئ، تتدحرج كثبان العرق الشرقي الكبير نحو الأفق.',
        facts: [
          { label: 'شط الجريد', value: 'نحو 7,000 كم²، أكبر سبخة في الصحراء الكبرى' },
          { label: 'دوز', value: 'بوابة العرق الشرقي الكبير' },
        ],
      },
    ],
  },
  map: {
    kicker: 'الفصل الثاني',
    title: 'أربع وعشرون ولاية',
    intro: 'مرّر المؤشر أو المس أو استعمل القائمة لاستكشاف كل ولاية. يدل اللون على عدد السكان في تعداد 2024.',
    capital: 'مركز الولاية',
    population: 'السكان',
    share: 'النسبة من تونس',
    rank: 'الترتيب',
    of: 'من 24',
    listLabel: 'الولايات',
    noPhoto: 'صورة قادمة',
    legendLow: 'سكان أقل',
    legendHigh: 'سكان أكثر',
    source: 'المصدر: المعهد الوطني للإحصاء، التعداد العام 2024. الحدود © مساهمو OpenStreetMap (geoBoundaries، ODbL).',
  },
  people: {
    kicker: 'الفصل الثالث',
    title: 'الناس',
    intro: 'وراء كل منظر، سكان ينمون بوتيرة أبطأ، ويتقدمون في العمر بهدوء، وينتقلون إلى المدن.',
    stats: {
      total: 'نسمة أُحصيت في 6 نوفمبر 2024',
      urban: 'يعيشون في الوسط الحضري',
      growth: 'متوسط النمو السنوي، 2014–2024',
      women: 'من السكان نساء',
      seniors: 'أعمارهم 60 سنة فأكثر (11.7% في 2014)',
    },
    growthTitle: 'قرن من النمو',
    growthDesc: 'تعدادات المعهد الوطني للإحصاء وتقديرات البنك الدولي السنوية. تختلف المنهجيتان، لذلك نعرض الاثنتين.',
    census: 'التعداد (المعهد الوطني للإحصاء)',
    estimate: 'تقدير سنوي (البنك الدولي)',
    urbanTitle: 'المدينة والريف',
    urban: 'حضري',
    rural: 'ريفي',
    ageTitle: 'الهرم العمري، 2024',
    ageDesc: 'نسبة السكان حسب الفئة العمرية.',
    ageTodo: 'سيُضاف هرم مفصّل بفئات خمسية وحسب الجنس بعد نقل الجدول الرسمي للمعهد الوطني للإحصاء (TODO).',
    years: 'سنة',
    govTitle: 'السكان حسب الولاية، 2024',
    govDesc: 'من تونس (1.08 مليون) إلى توزر (120 ألفاً).',
    tableToggle: 'عرض جدول البيانات',
    sourceLabel: 'المصدر',
    todo: 'TODO: رقم بانتظار التحقق',
  },
  culture: {
    kicker: 'الفصل الرابع',
    title: 'الثقافة والحياة اليومية',
    intro: 'أيادٍ ومطابخ وأغانٍ وحشود، وبلد شاب وحضري ومتصل أيضاً.',
    groups: { crafts: 'الحرف', cuisine: 'المطبخ', music: 'الموسيقى', festivals: 'المهرجانات', today: 'تونس اليوم' },
    items: [
      { image: 'ceramics', group: 'crafts', title: 'خزف نابل', caption: 'في الوطن القبلي، يزجّج الخزّافون الصحون بالأزرق والأخضر والمغرة.' },
      { image: 'chechia', group: 'crafts', title: 'الشاشية', caption: 'القبعة الحمراء من الصوف الملبّد، تُشكَّل وتُمشَّط يدوياً في أسواق تونس.' },
      { image: 'carpets', group: 'crafts', title: 'زربية القيروان', caption: 'صوف معقود في أشكال هندسية، حرفة تتوارثها العائلات.' },
      { image: 'couscous', group: 'cuisine', title: 'الكسكسي', caption: 'سميد مطهو بالبخار يُتقاسم من صحن واحد. أدرجته اليونسكو سنة 2020 تراثاً مغاربياً.' },
      { image: 'brik', group: 'cuisine', title: 'البريك', caption: 'ورقة ملسوقة رقيقة تُطوى حول بيضة وتُقلى حتى يذهب لونها.' },
      { image: 'makroudh', group: 'cuisine', title: 'المقروض', caption: 'معيّنات من السميد محشوة بالتمر ومغموسة في القطر، حلوى القيروان.' },
      { image: 'malouf', group: 'music', title: 'المالوف', caption: 'التراث الموسيقي الأندلسي لتونس، تحفظه الرشيدية منذ 1934.' },
      { image: 'carthage-festival', group: 'festivals', title: 'مهرجان قرطاج الدولي', caption: 'ليالٍ صيفية من الموسيقى داخل المسرح الروماني، كل عام منذ 1964.' },
      { image: 'douz-festival', group: 'festivals', title: 'مهرجان الصحراء بدوز', caption: 'كل شتاء، يلتقي الفرسان والشعراء وسباقات الإبل على أبواب الصحراء.' },
      { image: 'avenue', group: 'today', title: 'شارع الحبيب بورقيبة', caption: 'جادة العاصمة: مقاهٍ ومسارح وحشود المساء.' },
      { image: 'cafe', group: 'today', title: 'ثقافة المقهى', caption: 'شاي بالنعناع والبندق، وحديث، وإطلالة على الخليج.' },
      { image: 'insat', group: 'today', title: 'مهندسو الغد', caption: 'في تونس، يكوّن المعهد الوطني للعلوم التطبيقية والتكنولوجيا مهندسي ومطوري قطاع تقني متنامٍ.' },
      { image: 'skyline', group: 'today', title: 'تونس الحديثة', caption: 'سبعة من كل عشرة تونسيين يعيشون اليوم في المدن.' },
      { image: 'artisan', group: 'today', title: 'حرف حيّة', caption: 'في هرقلة، يحوّل حرفي المعدن والزجاج إلى ثريات.' },
    ],
  },
  closing: {
    line: 'يحلّ الليل على العرق، وتستمرّ الحكاية في أربع وعشرين ولاية وقرابة اثني عشر مليون صوت.',
    lineAr: 'Night falls on the Erg. The story goes on.',
    top: 'العودة إلى البحر',
  },
  footer: {
    sources: 'مصادر البيانات',
    credits: 'الصور',
    other: 'اعتمادات أخرى',
    pending: 'جارٍ تحميل الإسناد من ويكيميديا كومنز…',
    by: 'تصوير',
    madeWith: 'أُنجز باستخدام Astro وGSAP وLenis وLeaflet وChart.js. الأرقام الموسومة بـ TODO تُركت فارغة عمداً إلى حين التحقق منها.',
    photoTodo: 'صورة قادمة',
  },
};

export const STRINGS: Record<Lang, Strings> = { en, fr, ar };
