import { useState } from "react";

// お題確認フェーズ（スマホ回し）
// 重要: 他人のお題が一瞬でも見えないよう、
//   ・各プレイヤーはまず「渡してください」画面から始まる
//   ・お題は「押している間」だけ描画される（離すと即DOMから消える）
//   ・次の人へ進むとき holding/subPhase をリセットしてから描画する
export default function RevealScreen({ players, onDone }) {
  const [index, setIndex] = useState(0);
  const [subPhase, setSubPhase] = useState("pass"); // "pass" | "view"
  const [holding, setHolding] = useState(false);

  const player = players[index];
  const isLast = index === players.length - 1;

  // 「受け取った」→ お題を見る画面へ
  function handleReceived() {
    setHolding(false);
    setSubPhase("view");
  }

  // 「確認した」→ 次の人の受け渡し画面へ（必ずpassから／お題は非表示）
  function handleConfirmed() {
    if (isLast) {
      onDone();
      return;
    }
    setHolding(false);
    setSubPhase("pass");
    setIndex(index + 1);
  }

  // ── 受け渡し画面 ──
  if (subPhase === "pass") {
    return (
      <div className="reveal-screen pass">
        <div className="pass-card">
          <p className="pass-count">{index + 1} / {players.length} 人目</p>
          <span className="pass-emoji">📱</span>
          <h2 className="pass-name">{player.name} さん</h2>
          <p className="pass-instruction">に渡してください</p>
          <p className="pass-warn">他の人に画面を見られないように！</p>
        </div>
        <button className="btn btn-primary btn-large" onClick={handleReceived}>
          受け取った
        </button>
      </div>
    );
  }

  // ── お題確認画面（押している間だけ表示）──
  return (
    <div className="reveal-screen view">
      <p className="view-name">{player.name} さんのお題</p>

      <button
        className={`reveal-hold ${holding ? "holding" : ""}`}
        onPointerDown={() => setHolding(true)}
        onPointerUp={() => setHolding(false)}
        onPointerLeave={() => setHolding(false)}
        onPointerCancel={() => setHolding(false)}
        // タップ長押し時のコンテキストメニュー等を抑止
        onContextMenu={(e) => e.preventDefault()}
      >
        {holding ? (
          <span className="topic-word">{player.topic}</span>
        ) : (
          <span className="hold-hint">
            ここを押している間
            <br />
            お題が表示されます
          </span>
        )}
      </button>

      <p className="view-help">指を離すと隠れます。覚えたら次へ。</p>

      <button className="btn btn-secondary btn-large" onClick={handleConfirmed}>
        {isLast ? "全員確認できた" : "確認した（次の人へ）"}
      </button>
    </div>
  );
}
