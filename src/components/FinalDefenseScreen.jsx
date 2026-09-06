import { useEffect, useState } from "react";

const SECONDS_PER_PERSON = 15;

export default function FinalDefenseScreen({ players, firstSpeakerIndex, onDone }) {
  const order = players.map((_, offset) => (firstSpeakerIndex + offset) % players.length);
  const [turn, setTurn] = useState(0);
  const [remaining, setRemaining] = useState(SECONDS_PER_PERSON);
  const isLast = turn === order.length - 1;

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setTimeout(() => setRemaining((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining]);

  function next() {
    if (isLast) {
      onDone();
      return;
    }
    setTurn((value) => value + 1);
    setRemaining(SECONDS_PER_PERSON);
  }

  const player = players[order[turn]];
  return (
    <div className="defense-screen">
      <p className="phase-kicker">投票前のラストチャンス</p>
      <h2>🗣️ 最終弁明</h2>
      <p className="defense-progress">{turn + 1} / {players.length} 人目</p>
      <div className="defense-card" aria-live="polite">
        <strong>{player.name} さん</strong>
        <span>怪しまれている点や、お題の印象を一言！</span>
        <span className={remaining <= 5 ? "defense-time urgent" : "defense-time"}>
          {remaining}秒
        </span>
      </div>
      <button className="btn btn-primary btn-large" onClick={next}>
        {isLast ? "投票へ進む" : remaining === 0 ? "次の人へ" : "話し終えた"}
      </button>
    </div>
  );
}
