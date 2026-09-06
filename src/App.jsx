import { useReducer, useCallback } from "react";
import { assignRoles, addRoundScore, judge, pickFirstSpeaker, tallyVotes } from "./game.js";
import TitleScreen from "./components/TitleScreen.jsx";
import SetupScreen from "./components/SetupScreen.jsx";
import RevealScreen from "./components/RevealScreen.jsx";
import DiscussionScreen from "./components/DiscussionScreen.jsx";
import VoteScreen from "./components/VoteScreen.jsx";
import ResultScreen from "./components/ResultScreen.jsx";
import FinalDefenseScreen from "./components/FinalDefenseScreen.jsx";
import TieBreakScreen from "./components/TieBreakScreen.jsx";

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
  phase: "title", // title → setup → reveal → discussion → defense → vote → result
  settings: defaultSettings,
  players: [], // { name, isWolf, topic }
  citizenWord: "",
  wolfWord: "",
  usedPairKeys: [], // 同一セッションの使用済みお題
  firstSpeakerIndex: null,
  votes: [], // voterIndex -> votedPlayerIndex
  voteRound: 0,
  runoffCandidates: [],
  scores: { citizen: 0, wolf: 0, rounds: 0 },
  reversalResult: null,
};

// 名前が空ならデフォルト名（プレイヤーN）を補う
function resolveNames(names, count) {
  return Array.from({ length: count }, (_, i) => {
    const n = (names[i] || "").trim();
    return n !== "" ? n : `プレイヤー${i + 1}`;
  });
}

function beginRound(state, names) {
  const { settings } = state;
  const { players, citizenWord, wolfWord, pairKey } = assignRoles(
    names,
    settings.wolfCount,
    settings.category,
    state.usedPairKeys
  );
  const usedPairKeys = state.usedPairKeys.includes(pairKey)
    ? [pairKey]
    : [...state.usedPairKeys, pairKey];
  return {
    ...state,
    phase: "reveal",
    players,
    citizenWord,
    wolfWord,
    usedPairKeys,
    firstSpeakerIndex: pickFirstSpeaker(players.length),
    votes: new Array(players.length).fill(null),
    voteRound: 0,
    runoffCandidates: [],
    reversalResult: null,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "GO_TITLE":
      return { ...initialState, usedPairKeys: state.usedPairKeys };

    case "GO_SETUP":
      return { ...state, phase: "setup" };

    case "UPDATE_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.payload } };

    // 設定確定 → 役割を割り当ててお題確認フェーズへ
    case "START_GAME": {
      const { settings } = state;
      const names = resolveNames(settings.names, settings.playerCount);
      return beginRound(state, names);
    }

    case "GO_DISCUSSION":
      return { ...state, phase: "discussion" };

    case "GO_DEFENSE":
      return { ...state, phase: "defense" };

    case "GO_VOTE":
      return { ...state, phase: "vote", votes: new Array(state.players.length).fill(null) };

    case "SUBMIT_VOTES": {
      const tally = tallyVotes(action.payload, state.players);
      if (tally.isTie && state.voteRound === 0) {
        return {
          ...state,
          phase: "tiebreak",
          votes: action.payload,
          runoffCandidates: tally.topIndices,
        };
      }
      const result = judge(tally, state.players, state.settings.reversalRule);
      return {
        ...state,
        phase: "result",
        votes: action.payload,
        scores: result.winner === "pending"
          ? state.scores
          : addRoundScore(state.scores, result.winner),
      };
    }

    case "START_RUNOFF":
      return {
        ...state,
        phase: "vote",
        voteRound: 1,
        votes: new Array(state.players.length).fill(null),
      };

    case "RESOLVE_REVERSAL": {
      if (state.reversalResult) return state;
      const winner = action.payload === "hit" ? "wolf" : "citizen";
      return {
        ...state,
        reversalResult: action.payload,
        scores: addRoundScore(state.scores, winner),
      };
    }

    // 同じメンバーで再戦（設定を引き継ぎ、役割を再割り当て）
    case "REMATCH": {
      const names = state.players.map((p) => p.name);
      return beginRound(state, names);
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
          firstSpeaker={state.players[state.firstSpeakerIndex]}
          scores={state.scores}
          onDone={() => go("GO_DEFENSE")}
          onQuit={() => go("GO_TITLE")}
        />
      );
      break;
    case "defense":
      screen = (
        <FinalDefenseScreen
          players={state.players}
          firstSpeakerIndex={state.firstSpeakerIndex}
          onDone={() => go("GO_VOTE")}
        />
      );
      break;
    case "vote":
      screen = (
        <VoteScreen
          players={state.players}
          candidateIndices={state.voteRound === 1 ? state.runoffCandidates : null}
          isRunoff={state.voteRound === 1}
          onSubmit={(votes) => go("SUBMIT_VOTES", votes)}
        />
      );
      break;
    case "tiebreak":
      screen = (
        <TieBreakScreen
          players={state.players}
          candidateIndices={state.runoffCandidates}
          onDone={() => go("START_RUNOFF")}
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
          reversalResult={state.reversalResult}
          scores={state.scores}
          isRunoff={state.voteRound === 1}
          onReversalResult={(result) => go("RESOLVE_REVERSAL", result)}
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
