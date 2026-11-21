import { expect, test, type Page } from '@playwright/test';

async function waitForServiceWorker(page: Page) {
  await page.waitForFunction(async () => {
    const reg = await navigator.serviceWorker.ready;
    return !!reg.active;
  });
  // The first load isn't controlled yet; reload so the SW serves the page.
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
}

test('downloads core, then works fully offline after a reload', async ({ page, context }) => {
  await page.goto('./');
  await expect(page.locator('[aria-label="埃及地圖"]')).toBeVisible();
  await waitForServiceWorker(page);

  await page.goto('./#/offline');
  const status = page.getByTestId('offline-status');
  const download = page.getByRole('button', { name: '下載離線內容並檢查更新' });
  if (await download.isVisible().catch(() => false)) await download.click().catch(() => undefined);
  await expect(status).toHaveAttribute('data-ready', 'true', { timeout: 30_000 });

  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('[aria-label="埃及地圖"]')).toBeVisible();
  await expect(page.getByTestId('offline-status')).toHaveAttribute('data-ready', 'true');

  // Deep hash link survives an offline reload, and the hero image comes from the core cache.
  await page.goto('./#/place/giza-khufu');
  await page.reload();
  await expect(page.getByRole('heading', { name: '胡夫金字塔' })).toBeVisible();
  const hero = page.locator('figure img');
  await expect(hero).toBeVisible();
  const type = await page.evaluate(async (src) => (await fetch(src)).headers.get('content-type'), (await hero.getAttribute('src'))!);
  expect(type).toContain('image/webp');
  expect(await hero.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(100);

  // Menu still works offline and jumps to another place.
  await page.getByRole('button', { name: /目錄/ }).click();
  await page.getByRole('searchbox', { name: '搜尋' }).fill('人面');
  await page.getByRole('link', { name: /人面獅身像/ }).click();
  await expect(page.getByRole('heading', { name: '人面獅身像' })).toBeVisible();
});

test('removing one cached file makes the offline page report not-ready', async ({ page }) => {
  await page.goto('./');
  await waitForServiceWorker(page);
  await page.goto('./#/offline');
  const status = page.getByTestId('offline-status');
  await page.getByRole('button', { name: /下載離線內容|檢查更新/ }).click().catch(() => undefined);
  await expect(status).toHaveAttribute('data-ready', 'true', { timeout: 30_000 });

  await page.evaluate(async () => {
    const cache = await caches.open('travelmap-core');
    const keys = await cache.keys();
    await cache.delete(keys[0]);
  });
  await page.reload();
  await expect(page.getByTestId('offline-status')).toHaveAttribute('data-ready', 'false');
  await page.getByRole('button', { name: '下載離線內容並檢查更新' }).click();
  await expect(page.getByTestId('offline-status')).toHaveAttribute('data-ready', 'true', { timeout: 30_000 });
  await expect(page.getByText('補齊了離線內容')).toBeVisible();
  // Same button again: nothing new, nothing missing.
  await page.getByRole('button', { name: '檢查更新' }).click();
  await expect(page.getByText('已是最新版本，離線內容也都齊全')).toBeVisible();
  await expect(page.getByText(/目前版本：/)).toBeVisible();
});

test('find-it checklist lights up the place and persists', async ({ page }) => {
  await page.goto('./#/place/giza-menkaure');
  await page.getByRole('tab', { name: /找找看/ }).click();
  for (const box of await page.getByRole('checkbox').all()) await box.check();
  await expect(page.getByText('全部找到了')).toBeVisible();
  await page.waitForTimeout(300); // let the IndexedDB write land
  await page.reload();
  await page.getByRole('tab', { name: /找找看/ }).click();
  await expect(page.getByText('全部找到了')).toBeVisible();
  await page.goto('./#/journal');
  await expect(page.getByRole('link', { name: '孟卡拉金字塔' })).toBeVisible();
});

test('pyramid-build flagship replays the construction step by step', async ({ page }) => {
  await page.goto('./#/place/giza-khufu');
  await page.getByRole('link', { name: /建造金字塔/ }).click();
  const next = page.getByRole('button', { name: /下一步/ });
  await expect(next).toBeDisabled();
  // 1. orient to north
  await page.getByRole('slider', { name: '地基方向' }).fill('0');
  await expect(page.getByText('對準了')).toBeVisible();
  await next.click();
  // 2. level the base with water
  for (const t of ['挖水道、灌水', '沿水面畫線', '鑿到線的高度']) await page.getByRole('button', { name: new RegExp(t) }).click();
  await expect(page.getByText('高低差只有約 2 公分', { exact: false })).toBeVisible();
  await next.click();
  // 3. dig the descending passage
  for (let i = 0; i < 5; i++) await page.getByRole('button', { name: /往下挖/ }).click();
  await expect(page.getByText('沒完成的地下墓室')).toBeVisible();
  await next.click();
  // 4. worker bottleneck
  await expect(page.getByText('最慢的環節')).toBeVisible();
  const quarry = page.getByRole('slider', { name: '採石人力' });
  await quarry.focus();
  for (let i = 0; i < 15; i++) await quarry.press('ArrowRight');
  await page.getByRole('button', { name: '重設人力' }).click();
  await expect(page.getByText('30.7 年')).toBeVisible();
  await page.getByRole('button', { name: '我找到瓶頸了' }).click();
  await next.click();
  // 5. ramp theories
  await page.getByRole('button', { name: '繞行坡道' }).click();
  await expect(page.getByText('哈特努布', { exact: false })).toBeVisible();
  await next.click();
  // 6. casing and capstone
  await page.getByRole('button', { name: /鋪上白色外層石/ }).click();
  await page.getByRole('button', { name: /放上頂石/ }).click();
  await page.getByRole('button', { name: '看完整解釋' }).click();
  await expect(page.getByText('證據等級')).toBeVisible();
});

test('find-it hint shows text and a circled spot on the photo', async ({ page }) => {
  await page.goto('./#/place/giza-sphinx');
  await page.getByRole('tab', { name: /找找看/ }).click();
  await page.getByRole('button', { name: /鼻子缺損/ }).click();
  await expect(page.getByText('原本鼻子的位置')).toBeVisible();
  await expect(page.getByText('看圈起來的地方')).toBeVisible();
});

test('white-desert timeline steps to the end and explains', async ({ page }) => {
  await page.goto('./#/place/white-desert/white-desert-story');
  const slider = page.getByRole('slider', { name: '時間軸' });
  await slider.focus();
  for (let i = 0; i < 4; i++) await slider.press('ArrowRight');
  await page.getByRole('button', { name: '頂層較軟' }).click();
  await page.getByRole('button', { name: '看解釋' }).click();
  await expect(page.getByText('差異侵蝕')).toBeVisible();
});

test('dam flagship: too much water runs dry, a middle release copes, no dam floods and dries', async ({ page }) => {
  await page.goto('./#/place/aswan-high-dam/dam-control');
  await expect(page.getByText('下游缺水')).toBeVisible();
  const slider = page.getByRole('slider', { name: '每月放水量' });
  await slider.focus();
  for (let i = 0; i < 5; i++) await slider.press('ArrowLeft');
  await expect(page.getByText('平穩度過')).toBeVisible();
  await page.getByRole('button', { name: '沒有高壩' }).click();
  await expect(page.getByText('又淹又乾')).toBeVisible();
  await page.getByRole('button', { name: '看解釋' }).click();
  await expect(page.getByText('遊戲假設')).toBeVisible();
});

test('lock sim explains a wrong move and lets the boat through', async ({ page }) => {
  await page.goto('./#/place/esna-lock/esna-lock-sim');
  await page.getByRole('button', { name: '開上游閘門' }).click();
  await expect(page.getByRole('status')).toContainText('水壓');
  for (const a of ['閘室灌水', '開上游閘門', '船前進', '關上游閘門', '閘室放水', '開下游閘門', '船前進'])
    await page.getByRole('button', { name: a, exact: true }).click();
  await expect(page.getByRole('status')).toContainText('通過了');
});

test('ticking a deity in a find list collects it in the deity book', async ({ page }) => {
  await page.goto('./#/place/kom-ombo');
  await page.getByRole('tab', { name: /找找看/ }).click();
  await page.getByRole('checkbox', { name: /鱷魚頭人身/ }).check();
  await page.goto('./#/deities');
  await expect(page.getByText(/已收集\s*1\s*\/\s*10/)).toBeVisible();
  await page.getByRole('button', { name: /索貝克/ }).click();
  await expect(page.getByRole('link', { name: '孔翁波神殿' })).toBeVisible();
});

test('karnak timeline grows the temple westward and explains', async ({ page }) => {
  await page.goto('./#/place/karnak/karnak-timeline');
  const slider = page.getByRole('slider', { name: '時間軸' });
  await slider.focus();
  for (let i = 0; i < 4; i++) await slider.press('ArrowRight');
  await expect(page.getByText('第一塔門始終沒有完工', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: '看解釋' }).click();
  await expect(page.getByText('往回穿越兩千年', { exact: false })).toBeVisible();
});

test('cartouche maker writes a name with the bundled font and saves a PNG', async ({ page }) => {
  await page.goto('./#/place/karnak');
  await page.getByRole('tab', { name: /找找看/ }).click();
  await page.getByRole('button', { name: /方尖碑/ }).click();
  await page.getByRole('link', { name: '王名圈產生器' }).click();
  const input = page.getByRole('textbox', { name: /名字/ });
  await input.fill('Lily');
  await expect(page.getByRole('img', { name: /王名圈：獅子、蘆葦、獅子、雙蘆葦/ })).toBeVisible();
  expect(await page.evaluate(() => document.fonts.check('40px Hiero', '\u{130ED}'))).toBe(true);
  await page.getByRole('button', { name: '直排' }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: '存成圖片' }).click();
  expect((await download).suggestedFilename()).toBe('cartouche-lily.png');
});

test('knowledge cards live apart from travel tips', async ({ page }) => {
  await page.goto('./#/map');
  await page.getByRole('button', { name: /目錄/ }).click();
  await expect(page.getByRole('link', { name: /美食圖鑑/ })).toHaveCount(0); // folded
  await page.getByRole('button', { name: /^知識/ }).click();
  await page.getByRole('link', { name: /美食圖鑑/ }).click();
  await expect(page.getByText(/柯夏莉/)).toBeVisible();
  await page.goto('./#/notes');
  await expect(page.getByText('實用短語')).toBeVisible();
  await expect(page.getByText('歷史小卡')).toHaveCount(0); // knowledge is kept out of 旅人手記
  await page.goto('./#/place/cairo');
  await page.getByRole('tab', { name: /重點/ }).click();
  await expect(page.getByText('延伸知識')).toBeVisible();
  await expect(page.getByText('1952 年革命與高壩')).toBeVisible();
  await page.getByRole('tab', { name: /手記/ }).click();
  await expect(page.getByText('1952 年革命與高壩')).toHaveCount(0);
});

test('menu folds by region and the glyph dictionary records sightings', async ({ page }) => {
  await page.goto('./#/map');
  await page.getByRole('button', { name: /目錄/ }).click();
  await page.getByRole('button', { name: /^地點/ }).click();
  await expect(page.getByRole('link', { name: /卡納克/ })).toHaveCount(0);
  await page.getByRole('dialog').getByRole('button', { name: /^路克索/ }).click();
  await expect(page.getByRole('link', { name: /卡納克/ })).toBeVisible();
  await page.getByRole('button', { name: /^知識/ }).click();
  await page.getByRole('link', { name: /象形文字小字典/ }).click();
  await page.getByRole('button', { name: /安卡/ }).click();
  await expect(page.getByText(/^生命。/)).toBeVisible();
  await page.getByRole('checkbox', { name: '我在牆上看到了' }).check();
  await expect(page.getByText(/打勾：\s*1\s*\/\s*13/)).toBeVisible();
  expect(await page.evaluate(() => document.fonts.check('40px Hiero', '\u{132F9}'))).toBe(true);
});

test('an uncollected deity can still be opened with its picture', async ({ page }) => {
  await page.goto('./#/deities');
  await page.getByRole('button', { name: /阿努比斯/ }).click();
  await expect(page.getByText(/尚未收集/)).toBeVisible();
  await expect(page.getByRole('img', { name: '阿努比斯的圖像' })).toBeVisible();
});

test('a place links to its era on the history timeline', async ({ page }) => {
  await page.goto('./#/place/abu-simbel');
  await page.getByRole('tab', { name: /重點/ }).click();
  await page.getByRole('link', { name: /當時是\s*新王國/ }).click();
  await expect(page).toHaveURL(/#\/timeline\/new-kingdom$/);
  await expect(page.getByRole('img', { name: /新王國的疆域示意圖/ })).toBeVisible();
  await page.getByRole('link', { name: /阿布辛貝神殿/ }).click();
  await expect(page).toHaveURL(/#\/place\/abu-simbel$/);
});

test('a place without find items hides the find tab', async ({ page }) => {
  await page.goto('./#/place/felucca');
  await expect(page.getByRole('tab', { name: /重點/ })).toBeVisible();
  await expect(page.getByRole('tab', { name: /找找看/ })).toHaveCount(0);
});

test('abu simbel move walks through the relocation to the sun festival', async ({ page }) => {
  await page.goto('./#/place/abu-simbel/abu-simbel-move');
  await page.getByRole('slider', { name: '水位' }).fill('100');
  await page.getByRole('button', { name: /下一步/ }).click();
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: /^鋸/ }).click();
  await page.getByRole('button', { name: /下一步/ }).click();
  await page.getByRole('slider', { name: '搬運進度' }).fill('100');
  await page.getByRole('button', { name: /下一步/ }).click();
  await page.getByRole('button', { name: /混凝土圓頂/ }).click();
  await page.getByRole('button', { name: /堆上岩石/ }).click();
  await page.getByRole('button', { name: /下一步/ }).click();
  await page.getByRole('slider', { name: '日期' }).fill('53');
  await expect(page.getByRole('img', { name: /2 月 22 日：陽光照進聖殿/ })).toBeVisible();
  await page.getByRole('button', { name: '看完整解釋' }).click();
  await expect(page.getByText(/約五十個國家/)).toBeVisible();
});

test('tutankhamun dig finds the tomb under the huts and opens it to the mask', async ({ page }) => {
  await page.goto('./#/place/tutankhamun-tomb/tut-dig');
  await page.getByRole('button', { name: /小岩坑/ }).click();
  await expect(page.getByText(/線索！/)).toBeVisible();
  await page.getByRole('button', { name: /工人小屋遺跡/ }).click();
  await expect(page.getByText(/找到了！/)).toBeVisible();
  for (let i = 0; i < 6; i++) await page.getByRole('button', { name: /^打開：/ }).click();
  await expect(page.getByText(/約 10 公斤重的黃金面具/)).toBeVisible();
  await page.getByRole('button', { name: '看完整解釋' }).click();
  await expect(page.getByText(/五千多件文物/)).toBeVisible();
});

test('mummy order accepts the steps only in the right order', async ({ page }) => {
  await page.goto('./#/place/valley-of-the-kings/mummy-order');
  await page.getByRole('button', { name: /泡鹼脫水/ }).click();
  await expect(page.getByRole('status')).toContainText('還太早');
  for (const step of ['清洗身體', '取出大腦', '取出內臟', '放進卡諾卜罈', '泡鹼脫水', '填充塗油', '包亞麻布', '戴面具入棺'])
    await page.getByRole('button', { name: new RegExp(step) }).click();
  await expect(page.getByText('排錯 1 次')).toBeVisible();
  await page.getByRole('button', { name: '看完整解釋' }).click();
  await expect(page.getByText(/和代表真理的羽毛比重量/)).toBeVisible();
});
