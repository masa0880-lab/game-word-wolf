import { useState } from "react";

// 投票フェーズ（スマホ回し）
// 自分には投票できない。投票後すぐ次の人への受け渡し画面を挟み、
// 前の人の投票内容が見えないようにする。
export default function VoteScreen({ players, onSubmit }) {
  const [voter, setVoter] = useState(0);
  const [subPhase, setSubPhase] = useState("pass"); // "pass" | "vote"
  const [votes, setVotes] = useState(() => new Array(players.length).fill(null));

  const current = players[voter];
  const isLast = voter === players.length - 1;

  function handleReceived() {
    setSubPhase("vote");
  }

  function handleVote(targetIndex) {
    const newVotes = [...votes];
    newVotes[voter] = targetIndex;

    if (isLast) {
      // 最後の投票 → 集計へ
      onSubmit(newVotes);
      return;
    }
    setVotes(newVotes);
    setSubPhase("pass");
    setVoter(voter + 1);
  }

  // ── 受け渡し画面 ──
  if (subPhase === "pass") {
    return (
      <div className="vote-screen pass">
        <div className="pass-card">
          <p className="pass-count">投票 {voter + 1} / {players.length} 人目</p>
          <span className="pass-emoji">🗳️</span>
          <h2 className="pass-name">{current.name} さん</h2>
          <p className="pass-instruction">に渡してください</p>
          <p className="pass-warn">前の人の投票が見えないうちに渡そう</p>
        </div>
        <button className="btn btn-primary btn-large" onClick={handleReceived}>
          受け取った
        </button>
      </div>
    );
  }

  // ── 投票画面 ──
  return (
    <div className="vote-screen choose">
      <h2 className="vote-title">{current.name} さんの投票</h2>
      <p className="vote-sub">ウルフだと思う人をタップ</p>

      <div className="vote-list">
        {players.map((p, i) =>
          i === voter ? null : (
            <button
              key={i}
              className="vote-option"
              onClick={() => handleVote(i)}
            >
              {p.name}
            </button>
          )
        )}
      </div>
    </div>
  );
}
