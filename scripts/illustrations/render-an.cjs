const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 750 } });
  for (const f of fs.readdirSync(__dirname).filter((x) => x.startsWith('an-') && x.endsWith('.svg'))) {
    await p.setContent(`<style>body{margin:0}</style>${fs.readFileSync(path.join(__dirname, f), 'utf8')}`);
    await p.screenshot({ path: path.join(__dirname, f.replace('.svg', '.png')) }); }
  await b.close(); })();
