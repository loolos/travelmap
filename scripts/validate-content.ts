import { validateContent } from '../src/data/validate';
import { readRawContent, publicFileExists } from '../src/data/rawFilesNode';

const { errors, warnings, bundle } = validateContent(readRawContent(), publicFileExists);
warnings.forEach((w) => console.warn(`⚠️  ${w}`));
errors.forEach((e) => console.error(`❌ ${e}`));
if (errors.length) {
  console.error(`\nContent validation failed: ${errors.length} error(s).`);
  process.exit(1);
}
const ready = bundle!.places.filter((p) => p.status === 'ready').length;
console.log(`✅ Content OK: ${bundle!.places.length} places (${ready} ready), ${bundle!.notes.length} notes, ${warnings.length} warning(s).`);
