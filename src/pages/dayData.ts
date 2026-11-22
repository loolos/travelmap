/** 古埃及人的一天: pick a role, step through one day. Mostly New Kingdom Thebes (c. 1550–1070 BC), the era most of the itinerary's temples and tombs come from. */

export type DayLinkKind = 'place' | 'activity' | 'food' | 'artifact' | 'deity' | 'glyph' | 'role';
export interface DayLink {
  kind: DayLinkKind;
  id: string;
}

export interface DayMoment {
  /** Time of day 0 (before dawn) … 1 (night); drives the sun in the sky picture. */
  t: number;
  time: string;
  icon: string;
  /** Short headline shown by default (≤ 14 字). */
  title: string;
  /** Detail shown on tap. */
  body: string;
  links?: DayLink[];
}

export interface DayFact {
  icon: string;
  label: string;
  text: string;
}

export type Scene = 'field' | 'cliff' | 'town' | 'temple' | 'palace' | 'house';

export interface DayRole {
  id: string;
  name: string;
  icon: string;
  /** 2–6 字 tag under the name. */
  tag: string;
  scene: Scene;
  facts: DayFact[];
  moments: DayMoment[];
  sources: { title: string; url: string }[];
}

export const dayRoles: DayRole[] = [
  {
    id: 'farmer',
    name: '農夫',
    icon: '🌾',
    tag: '九成的人',
    scene: 'field',
    facts: [
      { icon: '🍞', label: '吃', text: '麵包、啤酒、洋蔥、豆子。肉很少吃，節慶才有。' },
      { icon: '👕', label: '穿', text: '一條亞麻纏腰布，多半赤腳。女人穿簡單的直筒長裙。' },
      { icon: '🏠', label: '住', text: '兩三間的泥磚屋，夏天熱就睡屋頂。' },
      { icon: '⚖️', label: '地位', text: '多數土地屬於法老、神廟或貴族，農夫耕作後繳一大部分收成，泛濫季還要服勞役。' },
    ],
    moments: [
      {
        t: 0.08,
        time: '清晨',
        icon: '🌅',
        title: '天一亮就下田',
        body: '太陽還沒出來就起床，吃一塊麵包配洋蔥，喝點啤酒，全家連小孩一起出門。趁涼快的時候把最重的活做完。',
      },
      {
        t: 0.3,
        time: '上午',
        icon: '🌱',
        title: '看季節做事',
        body: '古埃及一年三季，全看尼羅河：泛濫季（田被淹，農夫被徵去蓋神廟、金字塔）、生長季（水退後撒種，再趕羊群把種子踩進泥裡）、收穫季（用鐮刀割麥，驢子馱到打穀場）。',
        links: [{ kind: 'activity', id: 'nile-year' }],
      },
      {
        t: 0.5,
        time: '中午',
        icon: '🧅',
        title: '樹蔭下吃午餐',
        body: '還是麵包，加上洋蔥、韭蔥、黃瓜、扁豆。啤酒是每天的飲料：濃稠、酒精很低、有營養，比河水乾淨。今天埃及的大餅跟當年的麵包是同一個傳統。',
        links: [{ kind: 'food', id: 'aish-baladi' }],
      },
      {
        t: 0.66,
        time: '下午',
        icon: '📏',
        title: '書記來量田收稅',
        body: '收成前，書記帶著繩子來丈量田地、估算產量，照比例收穀物稅。墓裡的壁畫畫過交不出稅的農夫被拖去挨打。',
        links: [{ kind: 'role', id: 'scribe' }],
      },
      {
        t: 0.82,
        time: '傍晚',
        icon: '🐄',
        title: '餵牲口、打水澆菜',
        body: '牽牛、驢回家，再用「桔槔」（一根長桿，一頭綁桶一頭綁石頭）從水渠打水澆菜園。這種工具新王國時開始普及，尼羅河邊用了三千年。',
        links: [{ kind: 'place', id: 'nile' }],
      },
      {
        t: 1,
        time: '夜晚',
        icon: '🌙',
        title: '在屋頂上睡覺',
        body: '油燈很珍貴，天黑沒多久就睡了。夏夜屋裡悶熱，一家人鋪蓆子睡在平屋頂上。',
      },
    ],
    sources: [
      { title: 'Wikipedia: Agriculture in ancient Egypt', url: 'https://en.wikipedia.org/wiki/Agriculture_in_ancient_Egypt' },
      { title: 'Wikipedia: Shadoof', url: 'https://en.wikipedia.org/wiki/Shadoof' },
    ],
  },
  {
    id: 'artisan',
    name: '造墓工匠',
    icon: '🔨',
    tag: '帝王谷',
    scene: 'cliff',
    facts: [
      { icon: '🍞', label: '吃', text: '國家按月配給小麥、大麥（做麵包和啤酒），另外送魚、蔬菜和燈油。' },
      { icon: '👕', label: '穿', text: '纏腰布或短裙，工作時頭上綁布擋灰。' },
      { icon: '🏠', label: '住', text: '代爾麥地那工匠村，約 70 戶擠在一道圍牆裡，就在帝王谷旁邊的山谷。' },
      { icon: '⚖️', label: '地位', text: '待遇不錯、很多人識字。拉美西斯三世時配給遲發，工人放下工具抗議，是史上最早有紀錄的罷工。' },
    ],
    moments: [
      {
        t: 0.08,
        time: '清晨',
        icon: '🥾',
        title: '翻過山去上班',
        body: '工匠住在代爾麥地那村，每天沿山路翻過山脊走到帝王谷，大約一小時。這條步道今天還在。',
        links: [{ kind: 'place', id: 'valley-of-the-kings' }],
      },
      {
        t: 0.3,
        time: '上午',
        icon: '🖌️',
        title: '在墓裡鑿石、畫壁畫',
        body: '工班分左右兩組，各負責墓道的一邊。石匠先鑿、再抹灰泥，畫師用紅線打草稿，領班用黑線修改，最後上色。墓裡沒有光，靠加了鹽的油燈照明，比較不冒煙。',
        links: [{ kind: 'place', id: 'tutankhamun-tomb' }],
      },
      {
        t: 0.5,
        time: '中午',
        icon: '🍞',
        title: '兩班之間吃飯',
        body: '一天分上午、下午兩班，中間休息吃飯。吃的是配給的麵包和啤酒，加上魚和洋蔥。',
      },
      {
        t: 0.66,
        time: '下午',
        icon: '📝',
        title: '請假要寫條子',
        body: '書記在陶片上記下誰沒來、為什麼：被蠍子咬、眼睛痛、在家釀啤酒、幫過世的兄弟做防腐…這些「請假條」很多都留下來了。',
        links: [{ kind: 'artifact', id: 'ostraca' }],
      },
      {
        t: 0.82,
        time: '傍晚',
        icon: '🏕️',
        title: '睡在山上的工寮',
        body: '工作期間不一定回村，常住在山脊上的石屋營地。古埃及一「週」十天，工匠大約做八天休兩天。',
      },
      {
        t: 1,
        time: '休假日',
        icon: '🎨',
        title: '幫自己做墳墓',
        body: '休假時接私活賺外快：幫人做棺材、雕像。他們也替自己蓋小墓，畫得和法老的一樣精彩。',
        links: [{ kind: 'activity', id: 'weighing-heart' }],
      },
    ],
    sources: [
      { title: 'Wikipedia: Deir el-Medina', url: 'https://en.wikipedia.org/wiki/Deir_el-Medina' },
    ],
  },
  {
    id: 'scribe',
    name: '書記',
    icon: '✍️',
    tag: '會寫字的人',
    scene: 'town',
    facts: [
      { icon: '🍞', label: '吃', text: '麵包、啤酒之外，常有魚、偶爾有肉，還有無花果、椰棗。' },
      { icon: '👕', label: '穿', text: '白色亞麻短裙，有地位的穿得更長、更細。' },
      { icon: '🏠', label: '住', text: '城裡較寬敞的泥磚房，有院子。' },
      { icon: '⚖️', label: '地位', text: '識字的人估計不到百分之五。書記免服勞役，可以一路升到宰相。' },
    ],
    moments: [
      {
        t: 0.1,
        time: '清晨',
        icon: '🎒',
        title: '帶著調色盤出門',
        body: '書記的工具：一束蘆葦筆、一塊有黑紅兩個墨槽的調色盤（黑是碳黑、紅是赭石，紅色用來寫標題和重點），加上一小壺水。',
      },
      {
        t: 0.3,
        time: '上午',
        icon: '📚',
        title: '從小抄書練字',
        body: '男孩很小就進書記學校，一遍遍抄寫經典文章。莎草紙很貴，練習寫在陶片和石灰岩片上。日常用的是手寫體「僧侶體」，象形文字主要刻在神廟和墓上。',
        links: [{ kind: 'place', id: 'karnak' }],
      },
      {
        t: 0.5,
        time: '中午',
        icon: '🌴',
        title: '吃得比農夫好',
        body: '薪水以糧食支付，書記拿得多，午餐除了麵包，還有魚、椰棗、無花果。',
        links: [{ kind: 'food', id: 'dates' }],
      },
      {
        t: 0.66,
        time: '下午',
        icon: '🧮',
        title: '量田、點數、算稅',
        body: '去田裡丈量、估算收成，清點牛群，登記工人出勤、配給。埃及人用分數計算麵包和啤酒怎麼分。',
        links: [{ kind: 'role', id: 'farmer' }],
      },
      {
        t: 0.82,
        time: '傍晚',
        icon: '✉️',
        title: '替人寫信、記帳',
        body: '不識字的人要寄信、立遺囑、打官司，都得找書記。書記常把自己雕成盤腿坐著、腿上攤開莎草紙的樣子。',
      },
      {
        t: 1,
        time: '夜晚',
        icon: '📜',
        title: '老師說：當書記最好',
        body: '一篇古代課文《職業的諷刺》，是父親勸兒子好好讀書：農夫被蟲咬、漁夫怕鱷魚、洗衣工整天泡在河裡…只有書記不用流汗。學生得一遍遍抄這篇。',
      },
    ],
    sources: [
      { title: 'Wikipedia: Scribe (Ancient Egypt)', url: 'https://en.wikipedia.org/wiki/Scribe#Ancient_Egypt' },
      { title: 'Wikipedia: The Satire of the Trades', url: 'https://en.wikipedia.org/wiki/The_Satire_of_the_Trades' },
    ],
  },
  {
    id: 'priest',
    name: '祭司',
    icon: '🪔',
    tag: '服侍神',
    scene: 'temple',
    facts: [
      { icon: '🍞', label: '吃', text: '吃神「吃剩」的供品。希羅多德記載祭司不吃魚、不碰豆子。' },
      { icon: '👕', label: '穿', text: '只穿白色亞麻和莎草涼鞋，不能穿羊毛或皮革。每隔一天剃光全身毛髮。' },
      { icon: '🏠', label: '住', text: '值班時住在神廟區，平常住在家裡。' },
      { icon: '⚖️', label: '地位', text: '大神廟擁有大片土地、牛群和工人，阿蒙神廟富可敵國。' },
    ],
    moments: [
      {
        t: 0,
        time: '黎明前',
        icon: '💧',
        title: '先在聖湖洗澡',
        body: '祭司要保持潔淨，在神廟的聖湖裡洗身體，白天兩次、晚上兩次。卡納克神廟的聖湖今天還有水。',
        links: [{ kind: 'place', id: 'karnak' }],
      },
      {
        t: 0.1,
        time: '日出',
        icon: '🔑',
        title: '叫醒神像',
        body: '打開最深處聖殿的門封，對神像唱晨歌、焚香，替神像洗淨、塗油、換新衣、上妝。只有高階祭司能進聖殿，一般人一輩子都看不到神像。',
        links: [{ kind: 'deity', id: 'amun' }],
      },
      {
        t: 0.3,
        time: '上午',
        icon: '🍖',
        title: '端早餐給神',
        body: '擺上麵包、肉、水果、啤酒讓神「享用」。儀式結束後，這些供品撤下來分給祭司和神廟人員吃。',
      },
      {
        t: 0.5,
        time: '中午',
        icon: '🔄',
        title: '一年只上班三個月',
        body: '大多數祭司是兼職：分成四班輪值，每班值一個月、休三個月，休息時回家當書記、工匠或地主。',
      },
      {
        t: 0.7,
        time: '節日',
        icon: '🎉',
        title: '扛神像出巡',
        body: '節慶時神像坐進聖船，由祭司扛在肩上出廟遊行，百姓終於能沿路「看見」神。奧佩特節就是從卡納克走到路克索神廟。',
        links: [{ kind: 'activity', id: 'opet-festival' }],
      },
      {
        t: 1,
        time: '夜晚',
        icon: '✨',
        title: '看星星報時',
        body: '有些祭司專門在夜裡觀星，依星星升起的時間把夜晚分成十二個小時，好在正確的時刻做儀式。',
        links: [{ kind: 'activity', id: 'desert-night-sky' }],
      },
    ],
    sources: [
      { title: 'Wikipedia: Ancient Egyptian priest', url: 'https://en.wikipedia.org/wiki/Ancient_Egyptian_priest' },
      { title: 'Herodotus, Histories 2.37', url: 'https://en.wikisource.org/wiki/History_of_Herodotus/Book_2' },
    ],
  },
  {
    id: 'pharaoh',
    name: '法老',
    icon: '👑',
    tag: '神的兒子',
    scene: 'palace',
    facts: [
      { icon: '🍞', label: '吃', text: '牛肉、鴨鵝、魚、水果、蜂蜜糕點和葡萄酒。圖坦卡門墓裡的酒罐標了年份、產地和釀酒師，像今天的酒標。' },
      { icon: '👕', label: '穿', text: '極細的亞麻、王冠、額前的聖蛇，典禮時戴假鬍子，連女法老哈特謝普蘇特也戴。' },
      { icon: '🏠', label: '住', text: '宮殿其實是泥磚蓋的，石頭留給神廟和陵墓，所以宮殿幾乎都沒留下來。' },
      { icon: '⚖️', label: '地位', text: '被當成活著的神、天地秩序的維護者。一登基就開始蓋自己的墓。' },
    ],
    moments: [
      {
        t: 0.08,
        time: '清晨',
        icon: '🪞',
        title: '沐浴、畫眼線',
        body: '侍從替法老沐浴、塗香油，畫上黑色眼線（男女都畫，還能減少陽光刺眼），戴上假髮和王冠。',
        links: [{ kind: 'glyph', id: 'uraeus' }],
      },
      {
        t: 0.25,
        time: '上午',
        icon: '🙏',
        title: '向神獻祭',
        body: '理論上法老是全國每座神廟的大祭司，所以每座神廟牆上都畫著他在獻祭。實際上每天的儀式由祭司代理。',
        links: [{ kind: 'place', id: 'luxor-temple' }],
      },
      {
        t: 0.45,
        time: '中午',
        icon: '⚖️',
        title: '聽宰相報告',
        body: '宰相每天報告國事：尼羅河水位、各地收成和稅、工程進度、外國使節。法老的命令就是法律。',
        links: [{ kind: 'activity', id: 'nile-floodplain' }],
      },
      {
        t: 0.6,
        time: '下午',
        icon: '🍷',
        title: '宴席',
        body: '烤牛、烤鵝、無花果、蜂蜜糕點，配葡萄酒和啤酒。樂師彈琴、舞者表演，賓客頭上戴著香膏錐。',
        links: [{ kind: 'artifact', id: 'tut-lotus-cup' }],
      },
      {
        t: 0.8,
        time: '傍晚',
        icon: '🏹',
        title: '駕戰車打獵',
        body: '在沙漠邊緣駕戰車追獵、射箭，展現力量。圖坦卡門墓裡就有好幾輛戰車和弓。',
        links: [{ kind: 'artifact', id: 'tut-chariots' }],
      },
      {
        t: 1,
        time: '夜晚',
        icon: '🎲',
        title: '下塞尼特棋',
        body: '塞尼特是古埃及最流行的棋，上至法老下至工匠都在玩，後來還被當成靈魂通過冥界的象徵，所以也放進墓裡。',
        links: [{ kind: 'artifact', id: 'tut-senet' }],
      },
    ],
    sources: [
      { title: 'Wikipedia: Pharaoh', url: 'https://en.wikipedia.org/wiki/Pharaoh' },
      { title: 'Wikipedia: Senet', url: 'https://en.wikipedia.org/wiki/Senet' },
    ],
  },
  {
    id: 'housewife',
    name: '家庭主婦',
    icon: '🏺',
    tag: '家的女主人',
    scene: 'house',
    facts: [
      { icon: '🍞', label: '吃', text: '自己磨麵粉、烤麵包、釀啤酒，全家吃的都經她的手。' },
      { icon: '👕', label: '穿', text: '貼身的亞麻長裙，戴項鍊和護身符，用黑色眼影畫眼。' },
      { icon: '🏠', label: '住', text: '泥磚屋，屋後有小院子當廚房，擺著灶和陶罐。' },
      { icon: '⚖️', label: '地位', text: '可以擁有財產、簽約、離婚、上法庭作證，比同時代許多文明的女性自由。' },
    ],
    moments: [
      {
        t: 0.05,
        time: '清晨',
        icon: '🌾',
        title: '跪著磨麥子',
        body: '在石磨盤上來回推磨，磨麥子很花時間。麵粉裡常混著沙粒，所以很多木乃伊的牙齒都磨損得很嚴重。',
      },
      {
        t: 0.25,
        time: '上午',
        icon: '🍞',
        title: '烤麵包',
        body: '麵團放在太陽下發酵，再放進泥灶或陶模裡烤。上埃及到今天還在曬「太陽麵包」。',
        links: [{ kind: 'food', id: 'aish-shamsi' }],
      },
      {
        t: 0.45,
        time: '中午',
        icon: '🍺',
        title: '釀全家的啤酒',
        body: '把烤到半熟的麵包撕碎泡水，讓它發酵後過濾，就是每天喝的啤酒。濃稠得像粥，酒精很低。',
      },
      {
        t: 0.6,
        time: '下午',
        icon: '🧵',
        title: '紡線、織布',
        body: '把亞麻紡成線、織成布。家裡多出來的布、麵包，可以拿去市場換東西。',
      },
      {
        t: 0.75,
        time: '傍晚',
        icon: '🧺',
        title: '市場以物易物',
        body: '古埃及沒有錢幣，用東西換東西：一塊布換一條魚、一罐油換幾把蔬菜。價錢用銅或穀物的重量來比。',
        links: [{ kind: 'activity', id: 'market-bargain' }],
      },
      {
        t: 1,
        time: '夜晚',
        icon: '🧿',
        title: '替孩子掛護身符',
        body: '小孩容易生病，媽媽替他們掛上荷魯斯之眼之類的護身符保平安。今天埃及人掛的藍眼睛，是類似的心意。',
        links: [{ kind: 'glyph', id: 'wedjat' }],
      },
    ],
    sources: [
      { title: 'Wikipedia: Women in ancient Egypt', url: 'https://en.wikipedia.org/wiki/Women_in_ancient_Egypt' },
      { title: 'Wikipedia: Ancient Egyptian cuisine', url: 'https://en.wikipedia.org/wiki/Ancient_Egyptian_cuisine' },
    ],
  },
];

export const dayRoleById = new Map(dayRoles.map((r) => [r.id, r]));
