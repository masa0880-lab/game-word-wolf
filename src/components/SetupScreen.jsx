import { useEffect } from "react";
import { CATEGORIES } from "../topics.js";

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 10;

// 設定画面
export default function SetupScreen({ settings, onChange, onBack, onStart }) {
  const { playerCount, names, wolfCount, timeSeconds, category, reversalRule } = settings;

  // 人数変更時に名前配列の長さを合わせ、ウルフ人数の上限も補正する
  function setPlayerCount(count) {
    const newNames = Array.from({ length: count }, (_, i) => names[i] || "");
    // 6人未満ならウルフは1人固定
    const maxWolf = count >= 6 ? 2 : 1;
    onChange({
      playerCount: count,
      names: newNames,
      wolfCount: Math.min(wolfCount, maxWolf),
    });
  }

  function setName(i, value) {
    const newNames = [...names];
    newNames[i] = value;
    onChange({ names: newNames });
  }

  const canTwoWolves = playerCount >= 6;

  // 人数が6人未満になったらウルフ人数を1に補正（保険）
  useEffect(() => {
    if (!canTwoWolves && wolfCount !== 1) {
      onChange({ wolfCount: 1 });
    }
  }, [canTwoWolves, wolfCount, onChange]);

  return (
    <div className="setup-screen">
      <header className="screen-header">
        <button className="btn-text" onClick={onBack}>← 戻る</button>
        <h2>設定</h2>
        <span className="spacer" />
      </header>

      <div className="setup-body">
        {/* 参加人数 */}
        <section className="setup-section">
          <label className="setup-label">参加人数</label>
          <div className="stepper">
            <button
              className="stepper-btn"
              onClick={() => setPlayerCount(Math.max(MIN_PLAYERS, playerCount - 1))}
              disabled={playerCount <= MIN_PLAYERS}
              aria-label="人数を減らす"
            >
              −
            </button>
            <span className="stepper-value">{playerCount}人</span>
            <button
              className="stepper-btn"
              onClick={() => setPlayerCount(Math.min(MAX_PLAYERS, playerCount + 1))}
              disabled={playerCount >= MAX_PLAYERS}
              aria-label="人数を増やす"
            >
              ＋
            </button>
          </div>
        </section>

        {/* 名前入力 */}
        <section className="setup-section">
          <label className="setup-label">参加者の名前（省略可）</label>
          <div className="name-list">
            {Array.from({ length: playerCount }, (_, i) => (
              <input
                key={i}
                className="name-input"
                type="text"
                inputMode="text"
                maxLength={10}
                placeholder={`プレイヤー${i + 1}`}
                value={names[i] || ""}
                onChange={(e) => setName(i, e.target.value)}
              />
            ))}
          </div>
        </section>

        {/* ウルフの人数 */}
        <section className="setup-section">
          <label className="setup-label">ウルフの人数</label>
          <div className="choice-row">
            <button
              className={`chip ${wolfCount === 1 ? "chip-active" : ""}`}
              onClick={() => onChange({ wolfCount: 1 })}
            >
              1人
            </button>
            <button
              className={`chip ${wolfCount === 2 ? "chip-active" : ""}`}
              onClick={() => canTwoWolves && onChange({ wolfCount: 2 })}
              disabled={!canTwoWolves}
            >
              2人
            </button>
          </div>
          {!canTwoWolves && (
            <p className="setup-hint">※ 6人以上で2人ウルフを選べます</p>
          )}
        </section>

        {/* 議論時間 */}
        <section className="setup-section">
          <label className="setup-label">議論時間</label>
          <div className="choice-row">
            {[
              { v: 60, label: "1分" },
              { v: 180, label: "3分" },
              { v: 300, label: "5分" },
            ].map((opt) => (
              <button
                key={opt.v}
                className={`chip ${timeSeconds === opt.v ? "chip-active" : ""}`}
                onClick={() => onChange({ timeSeconds: opt.v })}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        {/* お題カテゴリ */}
        <section className="setup-section">
          <label className="setup-label">お題カテゴリ</label>
          <div className="choice-grid">
            {Object.entries(CATEGORIES).map(([key, label]) => (
              <button
                key={key}
                className={`chip ${category === key ? "chip-active" : ""}`}
                onClick={() => onChange({ category: key })}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* 逆転勝利ルール */}
        <section className="setup-section">
          <label className="setup-label">逆転勝利ルール</label>
          <button
            className={`toggle ${reversalRule ? "toggle-on" : ""}`}
            onClick={() => onChange({ reversalRule: !reversalRule })}
            role="switch"
            aria-checked={reversalRule}
          >
            <span className="toggle-knob" />
            <span className="toggle-label">{reversalRule ? "ON" : "OFF"}</span>
          </button>
          <p className="setup-hint">
            追放されたウルフが市民のお題を当てたら逆転勝利
          </p>
        </section>
      </div>

      <div className="setup-footer">
        <button className="btn btn-primary btn-large" onClick={onStart}>
          この設定で開始
        </button>
      </div>
    </div>
  );
}
