// ゲームのコアロジック（お題割り当て・勝敗判定）
import { getTopicPool } from "./topics.js";

// 0以上 max未満の整数をランダムに返す
function randInt(max) {
  return Math.floor(Math.random() * max);
}

// 配列からn個の異なるインデックスをランダムに選ぶ
function pickDistinctIndices(length, n) {
  const indices = Array.from({ length }, (_, i) => i);
  // フィッシャー・イェーツでシャッフル
  for (let i = indices.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, n);
}

// ペアを一意に識別するキー（連続出題の回避に使用）
export function pairKey(pair) {
  return [pair.citizen, pair.wolf].sort().join("⇔");
}

// お題ペアを1つ選ぶ。直前と同じペアは避ける。
export function pickTopicPair(category, lastKey) {
  const pool = getTopicPool(category);
  let candidates = pool;
  if (lastKey && pool.length > 1) {
    const filtered = pool.filter((p) => pairKey(p) !== lastKey);
    if (filtered.length > 0) candidates = filtered;
  }
  const base = candidates[randInt(candidates.length)];
  // どちらの語を「市民側」「ウルフ側」にするかを毎回ランダムに入れ替える
  const swap = Math.random() < 0.5;
  const citizenWord = swap ? base.wolf : base.citizen;
  const wolfWord = swap ? base.citizen : base.wolf;
  return { citizenWord, wolfWord, key: pairKey(base) };
}

// プレイヤーへお題とウルフ役を割り当てる
export function assignRoles(names, wolfCount, category, lastKey) {
  const { citizenWord, wolfWord, key } = pickTopicPair(category, lastKey);
  const wolfIndices = new Set(pickDistinctIndices(names.length, wolfCount));

  const players = names.map((name, i) => {
    const isWolf = wolfIndices.has(i);
    return {
      name,
      isWolf,
      topic: isWolf ? wolfWord : citizenWord,
    };
  });

  return { players, citizenWord, wolfWord, pairKey: key };
}

// 投票を集計して結果を返す
// votes: voterIndex -> votedPlayerIndex の配列
export function tallyVotes(votes, players) {
  const counts = new Array(players.length).fill(0);
  votes.forEach((target) => {
    if (typeof target === "number") counts[target] += 1;
  });

  const maxVotes = Math.max(...counts);
  const topIndices = counts
    .map((c, i) => (c === maxVotes ? i : -1))
    .filter((i) => i >= 0);

  // 同票（最多票が複数）かどうか
  const isTie = topIndices.length > 1;
  // 最多票が1人だけならその人が追放される
  const ejectedIndex = isTie ? null : topIndices[0];

  return { counts, maxVotes, topIndices, isTie, ejectedIndex };
}

// 勝敗を判定する
// 仕様: 最多票の人がウルフなら市民チームの勝ち。
//       同票（デフォルト）はウルフの勝ち。
// 戻り値の winner: "citizen" | "wolf" | "pending"（逆転チャレンジ待ち）
export function judge(tally, players, reversalRule) {
  const { isTie, ejectedIndex } = tally;

  // 同票 → デフォルトでウルフの勝ち
  if (isTie) {
    return { winner: "wolf", reason: "tie", ejectedIndex: null };
  }

  const ejected = players[ejectedIndex];
  const caughtWolf = ejected.isWolf;

  if (!caughtWolf) {
    // 市民を追放してしまった → ウルフの勝ち
    return { winner: "wolf", reason: "wrongEject", ejectedIndex };
  }

  // ウルフを追放できた
  if (reversalRule) {
    // 逆転ルールON: ウルフの当てチャレンジ待ち
    return { winner: "pending", reason: "reversalChance", ejectedIndex };
  }
  // 市民チームの勝ち
  return { winner: "citizen", reason: "caughtWolf", ejectedIndex };
}
