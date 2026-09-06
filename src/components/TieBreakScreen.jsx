export default function TieBreakScreen({ players, candidateIndices, onDone }) {
  const names = candidateIndices.map((index) => players[index].name);
  return (
    <div className="tiebreak-screen">
      <span className="tiebreak-emoji">⚖️</span>
      <p className="phase-kicker">最多票が同数！</p>
      <h2>延長トーク</h2>
      <p className="tiebreak-names">{names.join(" さん・")} さん</p>
      <p className="tiebreak-copy">
        同票候補はそれぞれ短く弁明してください。その後、全員でもう一度投票します。
      </p>
      <div className="rule-note">
        再投票でも同票なら、ウルフの逃げ切り勝ちです。
      </div>
      <button className="btn btn-primary btn-large" onClick={onDone}>
        弁明できた・再投票へ
      </button>
    </div>
  );
}
