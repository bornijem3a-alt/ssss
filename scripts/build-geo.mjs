// Simplifies the geoBoundaries ADM1 file into a lightweight GeoJSON for the map.
// Source: geoBoundaries gbOpen TUN ADM1 (OpenStreetMap / Wambacher, ODbL 1.0).
import mapshaper from 'mapshaper';

const input = 'data/source/geoBoundaries-TUN-ADM1_simplified.geojson';
const output = 'public/data/governorates.geojson';

await mapshaper.runCommands(
  `-i ${input} -simplify 8% keep-shapes -filter-fields shapeISO,shapeName ` +
    `-rename-fields iso=shapeISO,name=shapeName -o ${output} precision=0.0001 format=geojson`
);
console.log(`wrote ${output}`);
