import { useState, useEffect, useRef } from "react";
import { ConfirmDialog } from "./Modal.jsx";
import { drawQuestion } from "../questions.js";

// 残り時間を mm:ss にフォーマット
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// 終了時の通知（バイブ＋ビープ音）。非対応環境では無視。
function notifyEnd() {
  // Vibration API
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate([200, 100, 200, 100, 400]);
  }
  // WebAudioで短いビープ音（音声ファイル不要）
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.value = 0.15;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
    osc.onended = () => ctx.close();
  } catch {
    // 何もしない
  }
}

// 議論フェーズ
export default function DiscussionScreen({ seconds, firstSpeaker, scores, onDone, onQuit }) {
  const [remaining, setRemaining] = useState(seconds);
  const [showQuit, setShowQuit] = useState(false);
  const [question, setQuestion] = useState(() => drawQuestion());
  const endedRef = useRef(false);

  // 1秒ごとのカウントダウン
  useEffect(() => {
    if (remaining <= 0) {
      if (!endedRef.current) {
        endedRef.current = true;
        notifyEnd();
        // 少し余韻を持たせてから投票へ
        const t = setTimeout(onDone, 800);
        return () => clearTimeout(t);
      }
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, onDone]);

  const isUrgent = remaining <= 10 && remaining > 0;

  return (
    <div className="discussion-screen">
      <h2 className="discussion-title">議論タイム</h2>
      <p className="discussion-sub">お題について話そう（お題の単語は言わない！）</p>

      <div className="speaker-card" aria-live="polite">
        <span>🎤 第一発言者</span>
        <strong>{firstSpeaker?.name ?? "プレイヤー"} さん</strong>
      </div>

      <section className="question-card" aria-labelledby="question-title">
        <p id="question-title">💬 困ったときの質問カード</p>
        <strong>{question.text}</strong>
        <button
          className="btn-text"
          onClick={() => setQuestion(drawQuestion(question.index))}
        >
          別の質問を引く
        </button>
      </section>

      <div className={`timer ${isUrgent ? "timer-urgent" : ""} ${remaining <= 0 ? "timer-done" : ""}`}>
        {remaining > 0 ? formatTime(remaining) : "終了！"}
      </div>

      <p className="discussion-note">
        通算 {scores.rounds}戦：市民 {scores.citizen}勝 / ウルフ {scores.wolf}勝
      </p>

      <button
        className="btn btn-primary btn-large"
        onClick={onDone}
        disabled={remaining <= 0}
      >
        議論を終了して最終弁明へ
      </button>
      <button className="btn-text" onClick={() => setShowQuit(true)}>
        ゲームをやめる
      </button>

      <ConfirmDialog
        open={showQuit}
        message="ゲームを中断してタイトルに戻りますか？進行中のゲームは失われます。"
        confirmLabel="やめる"
        onConfirm={onQuit}
        onCancel={() => setShowQuit(false)}
      />
    </div>
  );
}
