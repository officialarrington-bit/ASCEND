import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// GitHub Pages serves this project under /ASCEND/ rather than at the domain root.
const output = 'docs';
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
cpSync('dist', output, { recursive: true });

const assets = join(output, 'assets');
for (const filename of readdirSync(assets)) {
  if (!filename.endsWith('.js') && !filename.endsWith('.css')) continue;
  const path = join(assets, filename);
  const source = readFileSync(path, 'utf8');
  writeFileSync(path, source.replaceAll('/images/', '/ASCEND/images/'));
}
writeFileSync(join(output, '.nojekyll'), '');
