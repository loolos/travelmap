# travelmap

Egypt Explorer：離線優先的埃及互動地圖（PWA）。規格見 docs/。

🌐 網站：**https://loolos.github.io/travelmap/**（手機用 Safari 開啟後「加入主畫面」即可離線使用）

🌐 網站：**https://loolos.github.io/travelmap/**（手機用 Safari 開啟後「加入主畫面」即可離線使用）


## 開發

```bash
npm ci
npm run dev        # 本機開發 http://localhost:5173/travelmap/
npm run validate   # 內容校驗（少字、3 個找找看、連結、簡體字…）
npm test           # 單元測試
npm run build      # 校驗 + 型別檢查 + 建置 + 體積報告
npm run preview    # 以 /travelmap/ 子路徑預覽建置結果（Service Worker 只在這裡生效）
npm run e2e        # Playwright 離線測試（需先 build）
```

- 內容：`src/content/`（`places/*.json`、`notes.json`、`assets.json`、`sources.json`、`activities.json`）。`status: "draft"` 的地點只顯示名稱與問題。
- 關鍵圖片：`public/media/`（WebP，納入離線核心包）。
- 部署：push 到 `main` 後，GitHub Actions 會測試並部署到 GitHub Pages（Settings → Pages → Source 需設為 **GitHub Actions**）。
- 規格與排程：`docs/PRODUCT_DESIGN.md`、`docs/IMPLEMENTATION_PLAN.md`。
