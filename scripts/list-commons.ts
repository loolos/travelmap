/** Temporary helper: lists the image files used in some articles, to pick `file` entries. */
import { writeFileSync } from 'node:fs';
const UA = 'travelmap-build/1.0 (https://github.com/loolos/travelmap)';
const articles = ['Karnak', 'Luxor Temple', 'Abu Simbel temples', 'Great Pyramid of Giza', 'Akh-menu', 'Battle of Kadesh', 'Precinct of Amun-Re', 'Hatshepsut', 'Temple of Edfu', 'Small Temple of Abu Simbel', 'Luxor'];
let out = '';
for (const t of articles) {
  const url = 'https://en.wikipedia.org/w/api.php?' + new URLSearchParams({ format: 'json', formatversion: '2', action: 'query', prop: 'images', imlimit: '300', titles: t, redirects: '1' });
  const j = await (await fetch(url, { headers: { 'User-Agent': UA } })).json();
  out += `## ${t}\n` + ((j.query.pages[0]?.images ?? []) as { title: string }[]).map((i) => i.title).join('\n') + '\n';
}
writeFileSync('scripts/commons-candidates.txt', out);
