// お題データ
// 各ペアは「似ているが微妙に違う」もの。
// citizen / wolf の振り分けはゲーム開始時にランダムに入れ替えるため、
// ここでの citizen / wolf はあくまで「ペアの組み合わせ」を表す。
// 各カテゴリ最低20ペア、合計100ペア以上。

export const CATEGORIES = {
  food: "食べ物",
  place: "場所",
  daily: "日常",
  entertainment: "エンタメ",
  mix: "全部ミックス",
};

const topics = {
  // ── 食べ物（25ペア）──
  food: [
    { citizen: "ラーメン", wolf: "うどん" },
    { citizen: "寿司", wolf: "刺身" },
    { citizen: "カレーライス", wolf: "ハヤシライス" },
    { citizen: "そば", wolf: "そうめん" },
    { citizen: "ハンバーグ", wolf: "ステーキ" },
    { citizen: "たこ焼き", wolf: "明石焼き" },
    { citizen: "おにぎり", wolf: "いなり寿司" },
    { citizen: "餃子", wolf: "焼売" },
    { citizen: "プリン", wolf: "ゼリー" },
    { citizen: "クレープ", wolf: "ガレット" },
    { citizen: "食パン", wolf: "フランスパン" },
    { citizen: "コーヒー", wolf: "紅茶" },
    { citizen: "唐揚げ", wolf: "竜田揚げ" },
    { citizen: "牛丼", wolf: "豚丼" },
    { citizen: "アイスクリーム", wolf: "ジェラート" },
    { citizen: "チャーハン", wolf: "ピラフ" },
    { citizen: "味噌汁", wolf: "豚汁" },
    { citizen: "ホットケーキ", wolf: "ワッフル" },
    { citizen: "ポテトチップス", wolf: "フライドポテト" },
    { citizen: "オムライス", wolf: "オムレツ" },
    { citizen: "焼きそば", wolf: "焼きうどん" },
    { citizen: "メロンパン", wolf: "あんパン" },
    { citizen: "天ぷら", wolf: "フライ" },
    { citizen: "ショートケーキ", wolf: "ロールケーキ" },
    { citizen: "コロッケ", wolf: "メンチカツ" },
  ],

  // ── 場所（25ペア）──
  place: [
    { citizen: "温泉", wolf: "銭湯" },
    { citizen: "海", wolf: "プール" },
    { citizen: "図書館", wolf: "本屋" },
    { citizen: "公園", wolf: "広場" },
    { citizen: "映画館", wolf: "劇場" },
    { citizen: "コンビニ", wolf: "スーパー" },
    { citizen: "美容院", wolf: "床屋" },
    { citizen: "病院", wolf: "薬局" },
    { citizen: "動物園", wolf: "水族館" },
    { citizen: "山", wolf: "丘" },
    { citizen: "カフェ", wolf: "喫茶店" },
    { citizen: "居酒屋", wolf: "バー" },
    { citizen: "ホテル", wolf: "旅館" },
    { citizen: "空港", wolf: "駅" },
    { citizen: "神社", wolf: "お寺" },
    { citizen: "遊園地", wolf: "テーマパーク" },
    { citizen: "ジム", wolf: "プール" },
    { citizen: "デパート", wolf: "ショッピングモール" },
    { citizen: "学校", wolf: "塾" },
    { citizen: "川", wolf: "湖" },
    { citizen: "牧場", wolf: "農場" },
    { citizen: "アパート", wolf: "マンション" },
    { citizen: "屋上", wolf: "ベランダ" },
    { citizen: "キャンプ場", wolf: "グランピング" },
    { citizen: "博物館", wolf: "美術館" },
  ],

  // ── 日常（25ペア）──
  daily: [
    { citizen: "歯ブラシ", wolf: "歯間ブラシ" },
    { citizen: "傘", wolf: "レインコート" },
    { citizen: "枕", wolf: "クッション" },
    { citizen: "鉛筆", wolf: "シャープペン" },
    { citizen: "財布", wolf: "ポーチ" },
    { citizen: "腕時計", wolf: "目覚まし時計" },
    { citizen: "スリッパ", wolf: "サンダル" },
    { citizen: "扇風機", wolf: "エアコン" },
    { citizen: "ノート", wolf: "メモ帳" },
    { citizen: "石鹸", wolf: "ボディソープ" },
    { citizen: "掃除機", wolf: "ほうき" },
    { citizen: "毛布", wolf: "布団" },
    { citizen: "メガネ", wolf: "サングラス" },
    { citizen: "リュック", wolf: "トートバッグ" },
    { citizen: "ハンカチ", wolf: "ティッシュ" },
    { citizen: "電車", wolf: "バス" },
    { citizen: "自転車", wolf: "バイク" },
    { citizen: "冷蔵庫", wolf: "冷凍庫" },
    { citizen: "シャワー", wolf: "湯船" },
    { citizen: "ボールペン", wolf: "マジック" },
    { citizen: "靴下", wolf: "タイツ" },
    { citizen: "マグカップ", wolf: "湯のみ" },
    { citizen: "洗濯機", wolf: "乾燥機" },
    { citizen: "鍵", wolf: "暗証番号" },
    { citizen: "スマホ", wolf: "タブレット" },
  ],

  // ── エンタメ（25ペア）──
  entertainment: [
    { citizen: "カラオケ", wolf: "ライブ" },
    { citizen: "野球", wolf: "ソフトボール" },
    { citizen: "漫画", wolf: "小説" },
    { citizen: "ゲームセンター", wolf: "ボウリング場" },
    { citizen: "サッカー", wolf: "フットサル" },
    { citizen: "ドラマ", wolf: "映画" },
    { citizen: "ギター", wolf: "ベース" },
    { citizen: "トランプ", wolf: "花札" },
    { citizen: "ダーツ", wolf: "ビリヤード" },
    { citizen: "アニメ", wolf: "特撮" },
    { citizen: "釣り", wolf: "潮干狩り" },
    { citizen: "テニス", wolf: "バドミントン" },
    { citizen: "ピアノ", wolf: "オルガン" },
    { citizen: "将棋", wolf: "囲碁" },
    { citizen: "スキー", wolf: "スノーボード" },
    { citizen: "マラソン", wolf: "ウォーキング" },
    { citizen: "手品", wolf: "腹話術" },
    { citizen: "卓球", wolf: "テニス" },
    { citizen: "コンサート", wolf: "フェス" },
    { citizen: "ボードゲーム", wolf: "カードゲーム" },
    { citizen: "ヨガ", wolf: "ピラティス" },
    { citizen: "サーフィン", wolf: "ボディボード" },
    { citizen: "落語", wolf: "漫才" },
    { citizen: "バスケ", wolf: "ハンドボール" },
    { citizen: "ボクシング", wolf: "キックボクシング" },
  ],
};

// 「全部ミックス」用に全カテゴリを結合したリストを返す
export function getTopicPool(category) {
  if (category === "mix") {
    return [
      ...topics.food,
      ...topics.place,
      ...topics.daily,
      ...topics.entertainment,
    ];
  }
  return topics[category];
}

export default topics;
