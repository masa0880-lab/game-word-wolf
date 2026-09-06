import { useState, useEffect, useMemo } from "react";
import { tallyVotes, judge } from "../game.js";
import { ConfirmDialog } from "./Modal.jsx";

// 結果発表画面
export default function ResultScreen({
  players,
  votes,
  citizenWord,
  wolfWord,
  reversalRule,
  reversalResult,
  scores,
  isRunoff,
  onReversalResult,
  onRematch,
  onRestart,
}) {
  const [stage, setStage] = useState("drumroll"); // "drumroll" | "reveal"
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);

  // 集計と一次判定（投票が変わらない限り再計算しない）
  const tally = useMemo(() => tallyVotes(votes, players), [votes, players]);
  const baseJudge = useMemo(
    () => judge(tally, players, reversalRule),
    [tally, players, reversalRule]
  );

  // ドラムロール演出（2.4秒）
  useEffect(() => {
    const t = setTimeout(() => setStage("reveal"), 2400);
    return () => clearTimeout(t);
  }, []);

  // 最終的な勝者を決定（逆転チャレンジを加味）
  let finalWinner = baseJudge.winner;
  if (baseJudge.winner === "pending") {
    if (reversalResult === "hit") finalWinner = "wolf";
    else if (reversalResult === "miss") finalWinner = "citizen";
  }

  const wolves = players.filter((p) => p.isWolf);
  const ejected =
    baseJudge.ejectedIndex != null ? players[baseJudge.ejectedIndex] : null;

  if (stage === "drumroll") {
    return (
      <div className="result-screen drumroll">
        <span className="drum-emoji">🥁</span>
        <p className="drum-text">結果発表…</p>
        <div className="drum-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    );
  }

  // 勝敗バナーの文言
  const winnerInfo = {
    citizen: { label: "市民チームの勝ち！", cls: "win-citizen", emoji: "🎉" },
    wolf: { label: "ウルフの勝ち！", cls: "win-wolf", emoji: "🐺" },
  };
  const showWinner = finalWinner !== "pending" ? winnerInfo[finalWinner] : null;
  const isRoundResolved = baseJudge.winner !== "pending" || reversalResult !== null;

  return (
    <div className="result-screen reveal">
      {/* 勝敗バナー（逆転チャレンジ待ちのときは出さない） */}
      {showWinner && (
        <div className={`winner-banner ${showWinner.cls}`}>
          <span className="winner-emoji">{showWinner.emoji}</span>
          <span className="winner-label">{showWinner.label}</span>
        </div>
      )}

      {/* 追放された人 / 同票 */}
      <section className="result-section">
        <h3 className="result-heading">投票の結果</h3>
        {tally.isTie ? (
          <p className="result-eject tie">
            {isRunoff
              ? "再投票も同票 → ウルフが逃げ切り！"
              : "最多票が同数でした"}
          </p>
        ) : (
          <p className="result-eject">
            最多票で追放されたのは <strong>{ejected.name}</strong> さん
            （{tally.maxVotes}票）
            {ejected.isWolf ? " … ウルフ的中！" : " … ウルフではなかった…"}
          </p>
        )}
      </section>

      {/* 逆転チャレンジ（ウルフを追放＆逆転ルールON） */}
      {baseJudge.winner === "pending" && reversalResult === null && (
        <section className="result-section reversal-challenge">
          <h3 className="result-heading">⚡ 逆転チャレンジ</h3>
          <p className="reversal-text">
            追放されたウルフ（<strong>{ejected.name}</strong> さん）は、
            市民のお題が何だったか口頭で当ててください。
          </p>
          <div className="confirm-actions">
            <button
              className="btn btn-danger"
              onClick={() => onReversalResult("miss")}
            >
              外した
            </button>
            <button
              className="btn btn-primary"
              onClick={() => onReversalResult("hit")}
            >
              当てた（逆転！）
            </button>
          </div>
        </section>
      )}

      {/* ウルフの正体とお題の全公開 */}
      <section className="result-section">
        <h3 className="result-heading">お題の答え</h3>
        <div className="answer-words">
          <div className="answer-word citizen">
            <span className="answer-label">市民</span>
            <span className="answer-value">{citizenWord}</span>
          </div>
          <div className="answer-word wolf">
            <span className="answer-label">ウルフ</span>
            <span className="answer-value">{wolfWord}</span>
          </div>
        </div>
        <p className="wolves-line">
          ウルフ: {wolves.map((w) => w.name).join("・")}
        </p>
      </section>

      {/* 全員のお題・投票内訳 */}
      <section className="result-section">
        <h3 className="result-heading">全員の内訳</h3>
        <ul className="player-result-list">
          {players.map((p, i) => (
            <li
              key={i}
              className={`player-result-row ${p.isWolf ? "is-wolf" : ""}`}
            >
              <span className="pr-name">
                {p.isWolf ? "🐺 " : ""}
                {p.name}
              </span>
              <span className="pr-topic">「{p.topic}」</span>
              <span className="pr-votes">{tally.counts[i]}票</span>
            </li>
          ))}
        </ul>
      </section>

      {isRoundResolved && (
        <>
          <section className="score-board" aria-label="連戦スコア">
            <span>通算 {scores.rounds}戦</span>
            <strong>市民 {scores.citizen}</strong>
            <span>―</span>
            <strong>{scores.wolf} ウルフ</strong>
          </section>

          <div className="result-actions">
            <button className="btn btn-primary btn-large" onClick={onRematch}>
              同じメンバーでもう一度
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowRestartConfirm(true)}
            >
              最初から
            </button>
          </div>
        </>
      )}

      <ConfirmDialog
        open={showRestartConfirm}
        message="タイトルに戻りますか？人数や名前などの設定もリセットされます。"
        confirmLabel="最初から"
        onConfirm={onRestart}
        onCancel={() => setShowRestartConfirm(false)}
      />
    </div>
  );
}
