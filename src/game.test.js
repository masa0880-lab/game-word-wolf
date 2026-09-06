import { afterEach, describe, expect, it, vi } from "vitest";
import {
  addRoundScore,
  assignRoles,
  judge,
  pairKey,
  pickFirstSpeaker,
  pickTopicPair,
  tallyVotes,
} from "./game.js";
import { getTopicPool } from "./topics.js";

afterEach(() => vi.restoreAllMocks());

describe("お題と役割", () => {
  it("使用済みのお題を候補から外す", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const firstKey = pairKey(getTopicPool("food")[0]);
    const picked = pickTopicPair("food", [firstKey]);
    expect(picked.key).toBe(pairKey(getTopicPool("food")[1]));
  });

  it("全問使用後は候補をリセットする", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const allKeys = getTopicPool("food").map(pairKey);
    expect(pickTopicPair("food", allKeys).key).toBe(allKeys[0]);
  });

  it("指定人数のウルフだけを割り当てる", () => {
    const result = assignRoles(["A", "B", "C", "D"], 2, "food", []);
    expect(result.players.filter((player) => player.isWolf)).toHaveLength(2);
    expect(new Set(result.players.map((player) => player.topic))).toHaveLength(2);
  });

  it("第一発言者は範囲内で選び、不正人数ではnull", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    expect(pickFirstSpeaker(4)).toBe(3);
    expect(pickFirstSpeaker(0)).toBeNull();
  });
});

describe("投票と勝敗", () => {
  const players = [
    { name: "A", isWolf: false },
    { name: "B", isWolf: true },
    { name: "C", isWolf: false },
    { name: "D", isWolf: false },
  ];

  it("最多票の一人を追放する", () => {
    const tally = tallyVotes([1, 0, 1, 1], players);
    expect(tally).toMatchObject({ counts: [1, 3, 0, 0], isTie: false, ejectedIndex: 1 });
    expect(judge(tally, players, false).winner).toBe("citizen");
  });

  it("同票は再投票後の逃げ切り判定に使える", () => {
    const tally = tallyVotes([1, 0, 1, 0], players);
    expect(tally.topIndices).toEqual([0, 1]);
    expect(judge(tally, players, false)).toMatchObject({ winner: "wolf", reason: "tie" });
  });

  it("逆転ルールではウルフ的中後に判定を保留する", () => {
    const tally = tallyVotes([1, 0, 1, 1], players);
    expect(judge(tally, players, true).winner).toBe("pending");
  });
});

describe("連戦スコア", () => {
  it("勝者と試合数のみを加算する", () => {
    const scores = { citizen: 1, wolf: 2, rounds: 3 };
    expect(addRoundScore(scores, "citizen")).toEqual({ citizen: 2, wolf: 2, rounds: 4 });
    expect(addRoundScore(scores, "pending")).toBe(scores);
  });
});
