/**
 * 生存阿拉伯語: Egyptian colloquial Arabic (عامية مصرية), not Modern Standard Arabic.
 * `say` is a rough reading in Chinese characters for zh-Hant speakers; `latin` is a simple transliteration.
 * Where the form differs by the speaker's gender, the main line is what a man says and `alt` holds a woman's.
 */

export interface Line {
  ar: string;
  latin: string;
  say: string;
  /** Short label shown before an extra line (e.g. 女生說, 對方會回). */
  label?: string;
  zh?: string;
}

export interface Phrase extends Line {
  id: string;
  icon: string;
  zh: string;
  alt?: Line[];
  tip?: string;
}

export interface PhraseGroup {
  id: string;
  icon: string;
  title: string;
  phrases: Phrase[];
}

export const phraseGroups: PhraseGroup[] = [
  {
    id: 'hello',
    icon: '👋',
    title: '打招呼',
    phrases: [
      {
        id: 'salam',
        icon: '👋',
        zh: '你好',
        ar: 'السلام عليكم',
        latin: 'as-salāmu ʿalaykum',
        say: '阿薩拉姆 阿雷庫姆',
        alt: [{ label: '對方會回', ar: 'وعليكم السلام', latin: 'wa ʿalaykum as-salām', say: '瓦 阿雷庫姆 薩拉姆' }],
        tip: '最通用的問候，進店、上車都可以先說這句。',
      },
      {
        id: 'morning',
        icon: '☀️',
        zh: '早安',
        ar: 'صباح الخير',
        latin: 'ṣabāḥ il-kheer',
        say: '薩巴 伊勒黑爾',
        alt: [{ label: '對方會回', ar: 'صباح النور', latin: 'ṣabāḥ in-noor', say: '薩巴 伊努爾', zh: '早安（光明的早晨）' }],
      },
      { id: 'thanks', icon: '🙏', zh: '謝謝', ar: 'شكراً', latin: 'shukran', say: '舒克蘭' },
      { id: 'welcome', icon: '😊', zh: '不客氣', ar: 'عفواً', latin: 'ʿafwan', say: '阿夫萬' },
      {
        id: 'excuse',
        icon: '🙋',
        zh: '不好意思／請問',
        ar: 'لو سمحت',
        latin: 'law samaḥt',
        say: '勞 撒瑪荷特',
        alt: [{ label: '對女生說', ar: 'لو سمحتي', latin: 'law samaḥti', say: '勞 撒瑪荷蒂' }],
        tip: '叫服務生、問路、請人讓路都用這句，也可以當「請」。',
      },
      {
        id: 'yes-no',
        icon: '↕️',
        zh: '是／不是',
        ar: 'أيوه',
        latin: 'aywa',
        say: '欸瓦',
        alt: [{ label: '不是', ar: 'لأ', latin: 'laʾ', say: '拉' }],
      },
      { id: 'tamam', icon: '👌', zh: '好的／沒問題', ar: 'تمام', latin: 'tamām', say: '塔滿' },
      { id: 'bye', icon: '🖐️', zh: '再見', ar: 'مع السلامة', latin: 'maʿa as-salāma', say: '瑪阿 薩拉瑪' },
      {
        id: 'taiwan',
        icon: '🇹🇼',
        zh: '我從台灣來',
        ar: 'أنا من تايوان',
        latin: 'ana min Taywān',
        say: '阿娜 民 台灣',
        tip: '常會被問是不是中國或日本人，這句很好用。',
      },
      {
        id: 'inshallah',
        icon: '🤲',
        zh: '如果真主願意',
        ar: 'إن شاء الله',
        latin: 'in shāʾ allāh',
        say: '因夏阿拉',
        tip: '說到未來的事都會加這句，有時也代表「再說吧、不一定」。',
      },
    ],
  },
  {
    id: 'shop',
    icon: '🛍️',
    title: '購物殺價',
    phrases: [
      { id: 'bikam', icon: '💬', zh: '多少錢？', ar: 'بكام؟', latin: 'bikām?', say: '比卡姆' },
      { id: 'expensive', icon: '😱', zh: '太貴了', ar: 'غالي أوي', latin: 'ghāli awi', say: '嘎利 阿威' },
      {
        id: 'cheaper',
        icon: '⬇️',
        zh: '可以便宜一點嗎？',
        ar: 'ممكن أرخص؟',
        latin: 'mumkin arkhaṣ?',
        say: '姆姆金 阿爾哈斯',
      },
      {
        id: 'last',
        icon: '🤝',
        zh: '最後價格？',
        ar: 'آخر كلام؟',
        latin: 'ākhir kalām?',
        say: '阿希爾 卡蘭',
        tip: '字面是「最後一句話？」，殺價收尾的經典句。',
      },
      { id: 'no-thanks', icon: '✋', zh: '不用了，謝謝', ar: 'لا، شكراً', latin: 'lā, shukran', say: '拉，舒克蘭', tip: '對小販最好用的一句，邊說邊繼續走。' },
      {
        id: 'looking',
        icon: '👀',
        zh: '我只是看看',
        ar: 'بتفرج بس',
        latin: 'batfarrag bass',
        say: '巴特法拉格 巴斯',
      },
      {
        id: 'dont-want',
        icon: '🙅',
        zh: '我不要',
        ar: 'مش عايز',
        latin: 'mish ʿāyiz',
        say: '米須 艾耶茲',
        alt: [{ label: '女生說', ar: 'مش عايزة', latin: 'mish ʿayza', say: '米須 艾札' }],
      },
      {
        id: 'leave',
        icon: '🚶',
        zh: '別煩我',
        ar: 'سيبني في حالي',
        latin: 'sībni fi ḥāli',
        say: '西布尼 菲 哈利',
        tip: '遇到一直跟著的人再用，語氣要堅定但不必生氣。',
      },
      {
        id: 'photo',
        icon: '📷',
        zh: '可以拍照嗎？',
        ar: 'ممكن أصور؟',
        latin: 'mumkin aṣawwar?',
        say: '姆姆金 阿掃瓦爾',
        tip: '拍人之前先問，有人會要小費。',
      },
      {
        id: 'no-change',
        icon: '🪙',
        zh: '我沒有零錢',
        ar: 'معنديش فكة',
        latin: 'maʿandīsh fakka',
        say: '瑪安迪須 法卡',
      },
      {
        id: 'baksheesh',
        icon: '💵',
        zh: '小費',
        ar: 'بقشيش',
        latin: 'baʾshīsh',
        say: '巴可西須',
        tip: '在埃及到處會聽到。廁所、幫忙拍照、指路都可能被要。',
      },
    ],
  },
  {
    id: 'go',
    icon: '🧭',
    title: '問路交通',
    phrases: [
      {
        id: 'where',
        icon: '❓',
        zh: '……在哪裡？',
        ar: 'فين ...؟',
        latin: 'fēn ...?',
        say: '費恩 ……',
        tip: '後面接地名就好，例如「費恩 金字塔」。',
      },
      {
        id: 'toilet',
        icon: '🚻',
        zh: '廁所在哪裡？',
        ar: 'فين الحمام؟',
        latin: 'fēn il-ḥammām?',
        say: '費恩 伊勒哈瑪姆',
      },
      {
        id: 'dirs',
        icon: '↔️',
        zh: '右邊／左邊／直走',
        ar: 'يمين',
        latin: 'yimīn',
        say: '伊明',
        alt: [
          { label: '左邊', ar: 'شمال', latin: 'shimāl', say: '須瑪勒' },
          { label: '直走', ar: 'على طول', latin: 'ʿala ṭūl', say: '阿拉 圖勒' },
        ],
      },
      {
        id: 'stop',
        icon: '🛑',
        zh: '在這裡停車',
        ar: 'على جنب هنا',
        latin: 'ʿala gamb hina',
        say: '阿拉 甘布 希那',
        tip: '字面是「靠邊，這裡」。',
      },
      { id: 'slow', icon: '🐢', zh: '慢一點', ar: 'بالراحة', latin: 'bir-rāḥa', say: '比拉哈' },
      {
        id: 'meter',
        icon: '🚕',
        zh: '請跳錶',
        ar: 'شغل العداد',
        latin: 'shaghghal il-ʿaddād',
        say: '沙加勒 伊勒阿達德',
        tip: '計程車沒有錶就先談好價錢再上車。',
      },
    ],
  },
  {
    id: 'eat',
    icon: '🍽️',
    title: '吃喝',
    phrases: [
      { id: 'water', icon: '💧', zh: '水', ar: 'مية', latin: 'mayya', say: '麥呀' },
      { id: 'tea', icon: '🫖', zh: '茶', ar: 'شاي', latin: 'shāy', say: '夏伊' },
      {
        id: 'no-sugar',
        icon: '🍬',
        zh: '不要加糖',
        ar: 'من غير سكر',
        latin: 'min gheer sukkar',
        say: '民 給爾 蘇卡爾',
        tip: '埃及茶和咖啡預設很甜，怕甜就先說。',
      },
      { id: 'no-spicy', icon: '🌶️', zh: '不要辣', ar: 'من غير شطة', latin: 'min gheer shaṭṭa', say: '民 給爾 夏塔' },
      {
        id: 'veg',
        icon: '🌱',
        zh: '我吃素',
        ar: 'أنا نباتي',
        latin: 'ana nabāti',
        say: '阿娜 那巴提',
        alt: [{ label: '女生說', ar: 'أنا نباتية', latin: 'ana nabatiyya', say: '阿娜 那巴提亞' }],
      },
      { id: 'menu', icon: '📋', zh: '請給我菜單', ar: 'ممكن المنيو؟', latin: 'mumkin il-menyu?', say: '姆姆金 伊勒menu' },
      {
        id: 'bill',
        icon: '🧾',
        zh: '請結帳',
        ar: 'الحساب لو سمحت',
        latin: 'il-ḥisāb law samaḥt',
        say: '伊勒希薩布 勞撒瑪荷特',
      },
      { id: 'yummy', icon: '😋', zh: '很好吃！', ar: 'حلو أوي', latin: 'ḥilw awi', say: '希魯 阿威' },
    ],
  },
  {
    id: 'help',
    icon: '🆘',
    title: '緊急',
    phrases: [
      { id: 'help', icon: '🆘', zh: '救命！', ar: 'الحقوني!', latin: 'ilḥaʾūni!', say: '伊勒哈烏尼' },
      {
        id: 'doctor',
        icon: '🩺',
        zh: '我需要醫生',
        ar: 'محتاج دكتور',
        latin: 'miḥtāg doktōr',
        say: '米赫塔格 多克托爾',
        alt: [{ label: '女生說', ar: 'محتاجة دكتور', latin: 'miḥtāga doktōr', say: '米赫塔加 多克托爾' }],
      },
      {
        id: 'sick',
        icon: '🤒',
        zh: '我不舒服',
        ar: 'أنا تعبان',
        latin: 'ana taʿbān',
        say: '阿娜 塔阿班',
        alt: [{ label: '女生說', ar: 'أنا تعبانة', latin: 'ana taʿbāna', say: '阿娜 塔阿巴那' }],
      },
      { id: 'hospital', icon: '🏥', zh: '醫院', ar: 'مستشفى', latin: 'mustashfa', say: '穆斯塔須法' },
      { id: 'pharmacy', icon: '💊', zh: '藥局', ar: 'صيدلية', latin: 'ṣaydaliyya', say: '塞達利亞' },
      {
        id: 'lost',
        icon: '🗺️',
        zh: '我迷路了',
        ar: 'أنا تايه',
        latin: 'ana tāyih',
        say: '阿娜 塔耶',
        alt: [{ label: '女生說', ar: 'أنا تايهة', latin: 'ana tayha', say: '阿娜 塔伊哈' }],
      },
      {
        id: 'police',
        icon: '👮',
        zh: '叫警察',
        ar: 'اتصل بالبوليس',
        latin: 'ittiṣil bil-bolīs',
        say: '伊提希勒 比勒波利斯',
        tip: '埃及電話：觀光警察 126、警察 122、救護車 123。',
      },
    ],
  },
];

export interface NumberWord {
  n: number;
  ar: string;
  latin: string;
  say: string;
}

/** Egyptian colloquial number words for reading prices. */
export const numberWords: NumberWord[] = [
  { n: 0, ar: 'صفر', latin: 'ṣifr', say: '斯弗爾' },
  { n: 1, ar: 'واحد', latin: 'wāḥid', say: '瓦希德' },
  { n: 2, ar: 'اتنين', latin: 'itnēn', say: '伊特寧' },
  { n: 3, ar: 'تلاتة', latin: 'talāta', say: '塔拉塔' },
  { n: 4, ar: 'أربعة', latin: 'arbaʿa', say: '阿爾巴阿' },
  { n: 5, ar: 'خمسة', latin: 'khamsa', say: '哈姆薩' },
  { n: 6, ar: 'ستة', latin: 'sitta', say: '西塔' },
  { n: 7, ar: 'سبعة', latin: 'sabʿa', say: '薩巴阿' },
  { n: 8, ar: 'تمانية', latin: 'tamanya', say: '塔瑪尼亞' },
  { n: 9, ar: 'تسعة', latin: 'tisʿa', say: '提斯阿' },
  { n: 10, ar: 'عشرة', latin: 'ʿashara', say: '阿夏拉' },
  { n: 20, ar: 'عشرين', latin: 'ʿishrīn', say: '伊須林' },
  { n: 50, ar: 'خمسين', latin: 'khamsīn', say: '哈姆辛' },
  { n: 100, ar: 'مية', latin: 'miyya', say: '米亞' },
  { n: 200, ar: 'ميتين', latin: 'mitēn', say: '米滕' },
  { n: 500, ar: 'خمسمية', latin: 'khumsumiyya', say: '胡姆蘇米亞' },
  { n: 1000, ar: 'ألف', latin: 'alf', say: '阿勒夫' },
];

export const pound: Line = { ar: 'جنيه', latin: 'gineh', say: '基內', zh: '埃及鎊' };

const EASTERN = '٠١٢٣٤٥٦٧٨٩';
/** 250 → ٢٥٠ (Arabic-Indic digits are still written left to right). */
export const toArabicDigits = (s: string) => s.replace(/[0-9]/g, (d) => EASTERN[Number(d)]);
/** ٢٥٠ → 250; also accepts Persian-style ۰-۹. */
export const fromArabicDigits = (s: string) =>
  s.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x660)).replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x6f0));

export const allPhrases = phraseGroups.flatMap((g) => g.phrases.map((p) => ({ ...p, group: g.id })));
