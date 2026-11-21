import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = 'dist';
const walk = (d: string): string[] =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
let shell = 0;
let core = 0;
for (const f of walk(dist)) {
  const size = statSync(f).size;
  if (relative(dist, f).startsWith('media')) core += size;
  else shell += size;
}
const mb = (b: number) => (b / 1024 / 1024).toFixed(2);
console.log(`📦 App Shell: ${mb(shell)} MB (budget 2–5 MB)`);
console.log(`📦 Core media: ${mb(core)} MB (target ≤ 40 MB, limit 60 MB)`);
if (core > 60 * 1024 * 1024) {
  console.error('❌ Core exceeds 60 MB');
  process.exit(1);
}
