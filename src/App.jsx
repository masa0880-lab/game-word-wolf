import { useReducer, useCallback } from "react";
import { assignRoles } from "./game.js";
import TitleScreen from "./components/TitleScreen.jsx";
import SetupScreen from "./components/SetupScreen.jsx";
import RevealScreen from "./components/RevealScreen.jsx";
import DiscussionScreen from "./components/DiscussionScreen.jsx";
import VoteScreen from "./components/VoteScreen.jsx";
import ResultScreen from "./components/ResultScreen.jsx";

// 既定の設定
const defaultSettings = {
  playerCount: 4,
  names: ["", "", "", ""],
  wolfCount: 1,
  timeSeconds: 180,
  category: "food",
  reversalRule: false,
};

const initialState = {
  phase: "title", // title → setup → reveal → discussion → vote → result
  settings: defaultSettings,
  players: [], // { name, isWolf, topic }
  citizenWord: "",
  wolfWord: "",
  lastPairKey: null, // 連続出題回避用
  votes: [], // voterIndex -> votedPlayerIndex
};

// 名前が空ならデフォルト名（プレイヤーN）を補う
function resolveNames(names, count) {
  return Array.from({ length: count }, (_, i) => {
    const n = (names[i] || "").trim();
    return n !== "" ? n : `プレイヤー${i + 1}`;
  });
}

function reducer(state, action) {
  switch (action.type) {
    case "GO_TITLE":
      return { ...initialState, lastPairKey: state.lastPairKey };

    case "GO_SETUP":
      return { ...state, phase: "setup" };

    case "UPDATE_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.payload } };

    // 設定確定 → 役割を割り当ててお題確認フェーズへ
    case "START_GAME": {
      const { settings } = state;
      const names = resolveNames(settings.names, settings.playerCount);
      const { players, citizenWord, wolfWord, pairKey } = assignRoles(
        names,
        settings.wolfCount,
        settings.category,
        state.lastPairKey
      );
      return {
        ...state,
        phase: "reveal",
        players,
        citizenWord,
        wolfWord,
        lastPairKey: pairKey,
        votes: new Array(players.length).fill(null),
      };
    }

    case "GO_DISCUSSION":
      return { ...state, phase: "discussion" };

    case "GO_VOTE":
      return { ...state, phase: "vote", votes: new Array(state.players.length).fill(null) };

    case "SUBMIT_VOTES":
      return { ...state, phase: "result", votes: action.payload };

    // 同じメンバーで再戦（設定を引き継ぎ、役割を再割り当て）
    case "REMATCH": {
      const { settings } = state;
      const names = state.players.map((p) => p.name);
      const { players, citizenWord, wolfWord, pairKey } = assignRoles(
        names,
        settings.wolfCount,
        settings.category,
        state.lastPairKey
      );
      return {
        ...state,
        phase: "reveal",
        players,
        citizenWord,
        wolfWord,
        lastPairKey: pairKey,
        votes: new Array(players.length).fill(null),
      };
    }

    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const go = useCallback((type, payload) => dispatch({ type, payload }), []);

  // フェーズに応じた画面を返す
  let screen;
  switch (state.phase) {
    case "title":
      screen = <TitleScreen onStart={() => go("GO_SETUP")} />;
      break;
    case "setup":
      screen = (
        <SetupScreen
          settings={state.settings}
          onChange={(payload) => go("UPDATE_SETTINGS", payload)}
          onBack={() => go("GO_TITLE")}
          onStart={() => go("START_GAME")}
        />
      );
      break;
    case "reveal":
      screen = (
        <RevealScreen
          players={state.players}
          onDone={() => go("GO_DISCUSSION")}
        />
      );
      break;
    case "discussion":
      screen = (
        <DiscussionScreen
          seconds={state.settings.timeSeconds}
          onDone={() => go("GO_VOTE")}
          onQuit={() => go("GO_TITLE")}
        />
      );
      break;
    case "vote":
      screen = (
        <VoteScreen
          players={state.players}
          onSubmit={(votes) => go("SUBMIT_VOTES", votes)}
        />
      );
      break;
    case "result":
      screen = (
        <ResultScreen
          players={state.players}
          votes={state.votes}
          citizenWord={state.citizenWord}
          wolfWord={state.wolfWord}
          reversalRule={state.settings.reversalRule}
          onRematch={() => go("REMATCH")}
          onRestart={() => go("GO_TITLE")}
        />
      );
      break;
    default:
      screen = null;
  }

  return (
    <div className="app">
      {/* phaseをkeyにしてフェーズ遷移時にフェードアニメーションを発火 */}
      <div key={state.phase} className="screen-fade">
        {screen}
      </div>
    </div>
  );
}
