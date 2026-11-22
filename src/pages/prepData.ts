/** 行前準備 checklist. Rules change: every item that cites a rule names its source below, checked 2026-11. */
export interface PrepItem {
  id: string;
  title: string;
  detail: string;
  /** Default: must do / must bring (checkbox). 'suggest' = recommended (checkbox + 💡). 'info' = advisory, no checkbox. */
  kind?: 'suggest' | 'info';
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
    title: '證件與手續',
    items: [
      { id: 'passport', title: '護照（效期 6 個月以上）', detail: '入境時護照效期須有 6 個月以上，以回程日起算最保險。' },
      {
        id: 'visa',
        title: '埃及簽證',
        detail:
          '中華民國護照可事先在埃及官方網站申請電子簽（單次約 US$30），或在主要國際機場辦落地簽（US$30，另有手續費）。外交部資料最後更新於 2022 年，出發前請上官網再確認；跟團的話問旅行社是否代辦。',
      },
      { id: 'insurance', title: '旅遊保險', detail: '選有海外醫療和緊急後送的保單，確認有涵蓋浮潛等水上活動。' },
      { id: 'return-ticket', kind: 'suggest', title: '回程機票（印出或存在手機）', detail: '曾有航空公司因旅客沒有回程或續程機票而拒絕登機。' },
      { id: 'copies', kind: 'suggest', title: '證件影本與照片備份', detail: '護照、簽證、機票、保單拍照存手機和雲端，另印一份和正本分開放；再帶 2 張大頭照備用。護照遺失補辦很費時。' },
      {
        id: 'register',
        kind: 'suggest',
        title: '外交部「出國登錄」',
        detail:
          '台灣在埃及沒有代表處，由駐約旦代表處兼管。急難救助專線：+886-800-085-095；駐約旦代表處緊急電話：+962-79-5552605。',
      },
      { id: 'clinic', kind: 'suggest', title: '旅遊醫學門診', detail: '埃及不強制打疫苗；只有從黃熱病流行國家入境（或在當地轉機超過 12 小時）才要黃熱病疫苗證明。A 型肝炎、傷寒疫苗是建議，可在出發前 4–6 週到疾管署特約的旅遊醫學門診評估。' },
    ],
  },
  {
    icon: '💵',
    title: '錢',
    items: [
      { id: 'usd', title: '美元小鈔', detail: '準備一疊 1、5、10 美元的新鈔，付小費和雜支最方便。破舊或有折痕的鈔票常被拒收。' },
      { id: 'card', title: '信用卡（開通海外交易）', detail: '飯店和大型商店可刷卡，市集、小費、廁所要現金。出發前開通海外交易和消費通知；帶兩張不同發卡組織的卡更保險。' },
      { id: 'wallet', kind: 'suggest', title: '零錢包＋貼身腰包', detail: '小費用的零錢和大鈔分開放，付錢時不用掏出整疊；護照和備用卡放貼身腰包。' },
      { id: 'egp', kind: 'info', title: '埃及鎊到當地再換', detail: '到當地用 ATM 或銀行換。換大額埃及鎊時保留銀行水單，當地嚴查黑市換匯。' },
    ],
  },
  {
    icon: '🔌',
    title: '電子用品',
    items: [
      { id: 'plug', title: '轉接頭（C／F 型）', detail: '埃及是 220V、兩圓孔插座。台灣的扁腳插頭需要轉接頭；電器標示 100–240V 才能直接用。' },
      { id: 'charger', title: '手機充電器與線', detail: '多孔 USB 充電器最省插座，飯店插座常常不多。' },
      { id: 'powerbank', kind: 'suggest', title: '行動電源（放隨身行李）', detail: '行動電源不能托運。沙漠露營沒有插座，帶一顆大容量的。' },
      { id: 'esim', kind: 'suggest', title: 'eSIM 或當地 SIM 卡', detail: '可先買 eSIM，或在機場買當地 SIM 卡（需出示護照）。沙漠裡多半沒訊號。' },
      { id: 'camera', kind: 'suggest', title: '相機、記憶卡、備用電池', detail: '神殿和墓室光線暗，手機以外多一台相機更好拍。部分景點拍照要另外買票。' },
    ],
  },
  {
    icon: '👕',
    title: '衣著',
    items: [
      { id: 'layers', title: '保暖外套（羽絨或刷毛）', detail: '12 月白天約 20 幾度，早晚涼；沙漠夜裡可能接近 0°C。採洋蔥式穿法，一件保暖外套最重要。' },
      { id: 'tops', title: '長袖上衣、長褲', detail: '透氣的長袖長褲擋太陽也擋沙，參觀清真寺也合適。' },
      { id: 'modest', title: '遮肩膝的衣服、頭巾', detail: '參觀清真寺要遮住肩膀和膝蓋，女生帶一條頭巾，進去要脫鞋。' },
      { id: 'shoes', title: '好走的包鞋', detail: '神殿地面不平，沙漠有沙和碎石，選包住腳趾的鞋。' },
      { id: 'sun', title: '帽子、太陽眼鏡、防曬乳', detail: '冬天陽光仍強，神殿和沙漠都少遮蔭。' },
      { id: 'beanie', kind: 'suggest', title: '毛帽、手套、厚襪', detail: '沙漠露營和清晨熱氣球最冷，這幾樣最需要，又不佔空間。' },
      { id: 'sandals', kind: 'suggest', title: '拖鞋', detail: '飯店、遊輪和海邊用，進清真寺脫鞋時也方便。' },
      { id: 'scarf', kind: 'suggest', title: '大圍巾', detail: '擋風擋沙、保暖、進清真寺當頭巾，一條多用。' },
    ],
  },
  {
    icon: '💊',
    title: '藥品與盥洗',
    items: [
      { id: 'meds', title: '常備藥', detail: '腸胃藥、止瀉藥、暈車暈船藥、感冒藥、個人處方藥（附英文藥名說明）。' },
      { id: 'toiletries', title: '個人盥洗用品', detail: '牙刷牙膏、洗面乳、刮鬍刀等；液體放隨身行李要符合 100 ml 規定。' },
      { id: 'tissues', title: '隨身衛生紙', detail: '埃及很多公共廁所沒有衛生紙，有時還要付一點小費。' },
      { id: 'dry', kind: 'suggest', title: '護唇膏、乳液', detail: '沙漠和尼羅河谷都很乾燥，嘴唇和手容易裂。' },
      { id: 'mask', kind: 'suggest', title: '口罩或面罩', detail: '擋沙塵；搭吉普車進沙漠時特別有用。' },
      { id: 'glasses', kind: 'suggest', title: '備用眼鏡', detail: '戴隱形眼鏡的人帶副眼鏡，風沙大時換眼鏡比較舒服。' },
      { id: 'sanitizer', kind: 'suggest', title: '乾洗手、酒精濕巾', detail: '吃東西前用，市集和沙漠不一定有地方洗手。' },
    ],
  },
  {
    icon: '🏕️',
    title: '沙漠露營',
    items: [
      { id: 'headlamp', title: '頭燈＋備用電池', detail: '營地晚上很暗，上廁所也要用；觀星時調成紅光或最暗。' },
      { id: 'wipes', title: '濕紙巾、垃圾袋', detail: '沙漠沒有廁所和洗手台，垃圾要自己帶走。' },
      { id: 'sleeping', kind: 'suggest', title: '睡袋內套', detail: '先問業者有沒有提供睡袋和毯子；怕冷或在意衛生的話，帶一個睡袋內套。' },
      { id: 'ziplock', kind: 'suggest', title: '夾鏈袋', detail: '把手機、相機、電池裝起來防沙。' },
    ],
  },
  {
    icon: '🤿',
    title: '紅海浮潛',
    items: [
      { id: 'swimsuit', title: '泳衣', detail: '浮潛和飯店泳池都用得到。' },
      { id: 'snorkel', kind: 'suggest', title: '長袖防曬衣', detail: '比防曬乳更護礁也更保暖。12 月海水約 23–25°C，怕冷可以租防寒衣。' },
      { id: 'phonepouch', kind: 'suggest', title: '防水手機袋', detail: '上船後手機才不怕潑濕。' },
      { id: 'towel', kind: 'suggest', title: '快乾毛巾', detail: '船上和海邊用，輕又不佔空間。' },
      { id: 'mask-rx', kind: 'suggest', title: '有度數的蛙鏡', detail: '面鏡業者有租；近視深的可以自備有度數的。' },
    ],
  },
  {
    icon: '🎒',
    title: '其他',
    items: [
      { id: 'daypack', title: '隨身小背包', detail: '一日行程裝水、外套、防曬乳。' },
      { id: 'pen', kind: 'suggest', title: '原子筆', detail: '飛機上和入境時可能要填表。' },
      { id: 'bottle', kind: 'suggest', title: '水壺', detail: '把買來的大瓶裝水分裝帶著走，少買小瓶。' },
    ],
  },
  {
    icon: '⚠️',
    title: '注意事項',
    items: [
      { id: 'water', kind: 'info', title: '只喝瓶裝水', detail: '刷牙也用瓶裝水，少吃生菜、冰塊和路邊未煮熟的食物。' },
      { id: 'drone', kind: 'info', title: '不帶空拍機', detail: '外交部提醒：請勿攜帶空拍機入境，也不要做未經許可的攝影。' },
      { id: 'antiques', kind: 'info', title: '不買古物、不撿石頭貝殼', detail: '文物、化石、珊瑚、貝殼、遺跡碎片都不要買或撿；複製品留著有品名和日期的收據。' },
      { id: 'police', kind: 'info', title: '不拍軍警和執法人員', detail: '軍警設施和執法人員不要拍照錄影；海關查驗行李請配合。' },
    ],
  },
];

/** December climate normals (1991–2020 where stated) for the route. */
export interface WeatherRow {
  id: string;
  place: string;
  range: string;
  detail: string;
}
export const decemberWeather: WeatherRow[] = [
  { id: 'cairo', place: '開羅／吉薩 Cairo & Giza', range: '11–21°C', detail: '白天舒適、早晚涼，要帶外套。12 月平均有約 2 天下小雨，是行程中最可能遇到雨的地方。' },
  { id: 'desert', place: '黑白沙漠 White Desert', range: '6–22°C', detail: '巴哈利亞 Bahariya 一帶夜裡平均 6–8°C，太陽下山後氣溫掉得很快。附近法拉弗拉 Farafra 12 月紀錄最低 −2.1°C。露營時夜裡有風會更冷，帶羽絨或刷毛外套、毛帽、厚襪。' },
  { id: 'luxor', place: '路克索 Luxor', range: '9–24°C', detail: '日夜溫差約 15°C。坐熱氣球的清晨最冷，帶外套，中午可以穿短袖。幾乎不下雨。' },
  { id: 'aswan', place: '亞斯文 Aswan', range: '11–24°C', detail: '埃及最乾的地方之一，12 月平均 0 天下雨。白天日照強，神殿少遮蔭，戴帽子。' },
  { id: 'redsea', place: '紅海 Hurghada', range: '13–24°C', detail: '海水約 23–25°C，比夏天涼，浮潛久了會冷，可以租 3mm 防寒衣或穿長袖防曬衣。船上風大，上岸後要披件外套。' },
  { id: 'daylight', place: '日照與天黑', range: '約 17:00 天黑', detail: '白天只有約 10.5 小時，天亮約 6:15–6:35，天黑約 17:00–17:20（越南邊越晚）。12 月埃及用 UTC+2，比台灣慢 6 小時。戶外行程早點出門。' },
];

export const prepSources = [
  { title: '外交部領事事務局：埃及（簽證及入境須知，2022-06-21 更新）', url: 'https://www.boca.gov.tw/sp-foof-countrycp-01-244-28874-02-1.html' },
  { title: '埃及電子簽證官方網站', url: 'https://visa2egypt.gov.eg/eVisa/' },
  { title: '外交部領事事務局：出國登錄', url: 'https://www.boca.gov.tw/' },
  { title: '衛生福利部疾病管制署：旅遊醫學', url: 'https://www.cdc.gov.tw/' },
  { title: 'Climates to Travel：埃及 12 月氣候（1991–2020 平均）', url: 'https://www.climatestotravel.com/weatherbymonth/egypt/december' },
  { title: 'Wikipedia：Farafra 氣候表（12 月紀錄最低溫）', url: 'https://en.wikipedia.org/wiki/Farafra,_Egypt' },
  { title: 'seatemperature.net：赫爾格達 12 月海水溫度', url: 'https://seatemperature.net/monthly/hurghada-sea-temperature-in-december-7355' },
];
