import { useState } from "react";
import Modal from "./Modal.jsx";

// タイトル画面
export default function TitleScreen({ onStart }) {
  const [showHowTo, setShowHowTo] = useState(false);

  return (
    <div className="title-screen">
      <div className="title-logo">
        <span className="title-emoji">🐺</span>
        <h1 className="title-text">ワードウルフ</h1>
        <p className="title-sub">スマホ1台で遊ぶ正体隠しゲーム</p>
      </div>

      <div className="title-actions">
        <button className="btn btn-primary btn-large" onClick={onStart}>
          ゲームを始める
        </button>
        <button className="btn btn-secondary" onClick={() => setShowHowTo(true)}>
          遊び方
        </button>
      </div>

      <Modal open={showHowTo} onClose={() => setShowHowTo(false)} title="遊び方">
        <ol className="howto-list">
          <li>全員に少しずつ違うお題が配られます。1人だけ違うお題の「ウルフ」がいます。</li>
          <li>自分のお題が多数派か少数派か分からないまま、お題について雑談します。</li>
          <li>お題の単語をそのまま言うのは禁止。それとなく探り合いましょう。</li>
          <li>質問カードも使いながら議論し、最後に一人ずつ15秒で弁明します。</li>
          <li>「ウルフだと思う人」に全員で投票します。同票なら延長後に再投票します。</li>
          <li>最多票がウルフなら市民チームの勝ち、外せばウルフの勝ちです。</li>
          <li>逆転ルールをONにすると、追放されたウルフが市民のお題を当てれば逆転勝利できます。</li>
        </ol>
        <p className="howto-note">スマホ1台を順番に回しながら遊んでください。</p>
      </Modal>
    </div>
  );
}
