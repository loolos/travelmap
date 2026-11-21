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
  const download = page.getByRole('button', { name: '下載全部核心內容' });
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
  await page.getByRole('link', { name: /人面獅身像/ }).click();
  await expect(page.getByRole('heading', { name: '人面獅身像' })).toBeVisible();
});

test('removing one cached file makes the offline page report not-ready', async ({ page }) => {
  await page.goto('./');
  await waitForServiceWorker(page);
  await page.goto('./#/offline');
  const status = page.getByTestId('offline-status');
  await page.getByRole('button', { name: '下載全部核心內容' }).click().catch(() => undefined);
  await expect(status).toHaveAttribute('data-ready', 'true', { timeout: 30_000 });

  await page.evaluate(async () => {
    const cache = await caches.open('travelmap-core');
    const keys = await cache.keys();
    await cache.delete(keys[0]);
  });
  await page.reload();
  await expect(page.getByTestId('offline-status')).toHaveAttribute('data-ready', 'false');
  await page.getByRole('button', { name: '下載全部核心內容' }).click();
  await expect(page.getByTestId('offline-status')).toHaveAttribute('data-ready', 'true', { timeout: 30_000 });
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

test('pyramid-build flagship: adjust, see bottleneck, explanation, reset', async ({ page }) => {
  await page.goto('./#/place/giza-khufu');
  await page.getByRole('link', { name: /建造金字塔/ }).click();
  await expect(page.getByText('最慢的環節')).toBeVisible();
  const quarry = page.getByRole('slider', { name: '採石人力' });
  await quarry.focus();
  for (let i = 0; i < 15; i++) await quarry.press('ArrowRight');
  await page.getByRole('button', { name: '看解釋' }).click();
  await expect(page.getByText('遊戲假設')).toBeVisible();
  await page.getByRole('button', { name: '重來' }).click();
  await expect(page.getByText('30.7 年')).toBeVisible();
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
