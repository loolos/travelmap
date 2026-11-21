/** 行前準備 checklist. Rules change: every item that cites a rule names its source below, checked 2026-11. */
export interface PrepItem {
  id: string;
  title: string;
  detail: string;
}
export interface PrepGroup {
  icon: string;
  title: string;
  items: PrepItem[];
}

export const CHECKED_AT = '2026 年 11 月';

export const prepGroups: PrepGroup[] = [
  {
    icon: '🛂',
    title: '證件與簽證',
    items: [
      { id: 'passport', title: '護照效期 6 個月以上', detail: '入境時護照效期須有 6 個月以上，以回程日起算最保險。' },
      {
        id: 'visa',
        title: '辦好埃及簽證',
        detail:
          '中華民國護照可事先在埃及官方網站申請電子簽（單次約 US$30），或在主要國際機場辦落地簽（US$30，另有手續費）。外交部資料最後更新於 2022 年，出發前請上官網再確認；跟團的話問旅行社是否代辦。',
      },
      { id: 'return-ticket', title: '回程機票印出或存好', detail: '曾有航空公司因旅客沒有回程或續程機票而拒絕登機。' },
      {
        id: 'register',
        title: '外交部「出國登錄」',
        detail:
          '台灣在埃及沒有代表處，由駐約旦代表處兼管。急難救助專線：+886-800-085-095；駐約旦代表處緊急電話：+962-79-5552605。',
      },
      { id: 'copies', title: '證件拍照備份', detail: '護照、簽證、機票、保單拍照存手機和雲端，另印一份和正本分開放。護照遺失補辦很費時。' },
      { id: 'insurance', title: '旅遊保險', detail: '選有海外醫療和緊急後送的保單，確認有涵蓋浮潛等水上活動。' },
    ],
  },
  {
    icon: '💵',
    title: '錢',
    items: [
      { id: 'usd', title: '美元小鈔', detail: '準備一疊 1、5、10 美元的新鈔，付小費和雜支最方便。破舊或有折痕的鈔票常被拒收。' },
      { id: 'egp', title: '埃及鎊', detail: '到當地用 ATM 或銀行換。換大額埃及鎊時保留銀行水單，當地嚴查黑市換匯。' },
      { id: 'card', title: '信用卡開通海外交易', detail: '飯店和大型商店可刷卡，市集、小費、廁所要現金。出發前開通海外交易和消費通知。' },
    ],
  },
  {
    icon: '📶',
    title: '網路與電',
    items: [
      { id: 'esim', title: '網路：eSIM 或當地 SIM 卡', detail: '可先買 eSIM，或在機場買當地 SIM 卡（需出示護照）。沙漠裡多半沒訊號。' },
      { id: 'plug', title: '轉接頭（C／F 型）', detail: '埃及是 220V、兩圓孔插座。台灣的扁腳插頭需要轉接頭；電器標示 100–240V 才能直接用。' },
      { id: 'powerbank', title: '行動電源放隨身行李', detail: '行動電源不能托運。沙漠露營沒有插座，帶一顆大容量的。' },
    ],
  },
  {
    icon: '👕',
    title: '衣著',
    items: [
      { id: 'layers', title: '洋蔥式穿法＋保暖外套', detail: '12 月白天約 20 幾度，早晚涼；沙漠夜裡可能接近 0°C，帶羽絨或刷毛外套、毛帽。' },
      { id: 'modest', title: '遮肩膝的衣服、頭巾', detail: '參觀清真寺要遮住肩膀和膝蓋，女生帶一條頭巾，進去要脫鞋。' },
      { id: 'sun', title: '防曬：帽子、太陽眼鏡、防曬乳', detail: '冬天陽光仍強，神殿和沙漠都少遮蔭。' },
      { id: 'shoes', title: '好走的包鞋', detail: '神殿地面不平，沙漠有沙和碎石，選包住腳趾的鞋。' },
    ],
  },
  {
    icon: '💊',
    title: '健康',
    items: [
      { id: 'clinic', title: '出發前 4–6 週看旅遊醫學門診', detail: '由醫師評估需要的疫苗（例如 A 型肝炎、傷寒）和藥物。' },
      { id: 'meds', title: '常備藥', detail: '腸胃藥、止瀉藥、暈車暈船藥、個人處方藥（附英文藥名說明）。' },
      { id: 'water', title: '只喝瓶裝水', detail: '刷牙也用瓶裝水，少吃生菜、冰塊和路邊未煮熟的食物。' },
      { id: 'dry', title: '對付乾燥和沙塵', detail: '護唇膏、乳液、口罩或圍巾擋沙；戴隱形眼鏡的人帶副眼鏡備用。' },
    ],
  },
  {
    icon: '🏕️',
    title: '沙漠露營與紅海',
    items: [
      { id: 'headlamp', title: '頭燈＋備用電池', detail: '營地晚上很暗，上廁所也要用；觀星時調成紅光或最暗。' },
      { id: 'sleeping', title: '確認睡袋與寢具', detail: '先問業者有沒有提供睡袋和毯子，怕冷可以帶睡袋內套。' },
      { id: 'wipes', title: '濕紙巾、衛生紙、垃圾袋', detail: '沙漠沒有廁所和洗手台，垃圾要自己帶走。' },
      { id: 'snorkel', title: '浮潛用品', detail: '泳衣、防曬衣（比防曬乳更護礁）、防水手機袋。面鏡業者有租，近視可自備有度數的。' },
    ],
  },
  {
    icon: '⚠️',
    title: '不要帶、不要做',
    items: [
      { id: 'drone', title: '不帶空拍機', detail: '外交部提醒：請勿攜帶空拍機入境，也不要做未經許可的攝影。' },
      { id: 'antiques', title: '不買古物、不撿石頭貝殼', detail: '文物、化石、珊瑚、貝殼、遺跡碎片都不要買或撿；複製品留著有品名和日期的收據。' },
      { id: 'police', title: '不拍軍警和執法人員', detail: '軍警設施和執法人員不要拍照錄影；海關查驗行李請配合。' },
    ],
  },
  {
    icon: '📱',
    title: '這個 App',
    items: [
      { id: 'offline', title: '下載離線內容', detail: '到「離線下載」頁下載全部內容，最好在有 Wi-Fi 的地方。' },
      { id: 'airplane', title: '開飛航模式測一次', detail: '開飛航模式後重開 App，確認地圖、地點和互動都打得開。' },
      { id: 'homescreen', title: '加到主畫面', detail: 'iPhone 用 Safari 的「分享 → 加入主畫面」，像一般 App 一樣打開。' },
    ],
  },
];

export const prepSources = [
  { title: '外交部領事事務局：埃及（簽證及入境須知，2022-06-21 更新）', url: 'https://www.boca.gov.tw/sp-foof-countrycp-01-244-28874-02-1.html' },
  { title: '埃及電子簽證官方網站', url: 'https://visa2egypt.gov.eg/eVisa/' },
  { title: '外交部領事事務局：出國登錄', url: 'https://www.boca.gov.tw/' },
  { title: '衛生福利部疾病管制署：旅遊醫學', url: 'https://www.cdc.gov.tw/' },
];
