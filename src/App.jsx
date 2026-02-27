import { useState, useRef } from "react";
import { SCENARIOS } from "./data/scenarios";
import { WISDOM } from "./data/wisdom";
import { CATEGORIES, CATEGORY_NAMES } from "./data/categories";
import { shuffle, draw, getGurus, loadHistory, saveHistory, hasSeenRules } from "./utils/helpers";
import { GeometricPattern, WisdomPattern, Mandala } from "./components/Patterns";
import { Button } from "./components/Button";
import { Rules } from "./components/Rules";

const BG = "linear-gradient(180deg,#1B1B2F,#162447)";
const BG2 = "linear-gradient(135deg,#1B1B2F 0%,#162447 50%,#1F4068 100%)";
const BTN = "linear-gradient(135deg,#F59E0B,#D97706)";

export default function App() {
  const [screen, setScreen] = useState(() => (hasSeenRules() ? "home" : "rules"));
  const [players, setPlayers] = useState([]);
  const [names, setNames] = useState(["", "", ""]);
  const [mode, setMode] = useState("simple");
  const [cats, setCats] = useState(new Set(CATEGORY_NAMES.slice(0, 6)));
  const [rounds, setRounds] = useState(0);
  const [history, setHistory] = useState(() => loadHistory());

  // Game state
  const [skIdx, setSkIdx] = useState(0);
  const [rNum, setRNum] = useState(0);
  const [sDeck, setSDeck] = useState([]);
  const [wDeck, setWDeck] = useState([]);
  const [wDis, setWDis] = useState([]);
  const [hands, setHands] = useState([]);
  const [curS, setCurS] = useState(null);
  const [sels, setSels] = useState({});
  const [phase, setPhase] = useState("roundStart");
  const [gIdx, setGIdx] = useState(0);
  const [rIdx, setRIdx] = useState(0);
  const [winner, setWinner] = useState(null);
  const [gameStats, setGameStats] = useState({ roundsPlayed: 0, catsUsed: [] });
  const gOrder = useRef([]);

  const startGame = () => {
    const fs = shuffle(SCENARIOS.filter((s) => cats.has(s.cat)));
    const sw = shuffle([...WISDOM]);
    const rd = rounds || players.length * 2;
    let wd = [...sw],
      wdi = [];
    const h = players.map(() => {
      const r = draw(wd, wdi, 5);
      wd = r.deck;
      wdi = r.discard;
      return r.drawn;
    });
    setSDeck(fs);
    setWDeck(wd);
    setWDis(wdi);
    setHands(h);
    setSkIdx(0);
    setRNum(1);
    setSels({});
    setPhase("roundStart");
    setCurS(fs[0]);
    setScreen("game");
    gOrder.current = getGurus(0, players.length);
    setGIdx(0);
    setGameStats({ roundsPlayed: 0, catsUsed: [...cats] });
  };

  const startRound = (rn, si) => {
    gOrder.current = getGurus(si, players.length);
    setGIdx(0);
    setSels({});
    setRIdx(0);
    setWinner(null);
    setCurS(sDeck[rn - 1]);
    setPhase("roundStart");
  };

  const selectCard = (ci) => {
    const gpi = gOrder.current[gIdx];
    const card = hands[gpi][ci];
    setHands((h) => h.map((hand, i) => (i === gpi ? hand.filter((_, j) => j !== ci) : hand)));
    setWDis((p) => [...p, card]);
    setSels((p) => ({ ...p, [gpi]: card }));
    if (gIdx < gOrder.current.length - 1) {
      setGIdx((p) => p + 1);
      setPhase("passing");
    } else {
      setRIdx(0);
      setPhase("reflect");
    }
  };

  const pickWinner = (gpi) => {
    const pts = mode === "advanced" ? curS.score : 1;
    setPlayers((p) =>
      p.map((pl, i) => (i === gpi ? { ...pl, score: pl.score + pts, wins: pl.wins + 1 } : pl))
    );
    setWinner(gpi);
    setPhase("scoreUpdate");
    setGameStats((s) => ({ ...s, roundsPlayed: s.roundsPlayed + 1 }));
  };

  const nextRound = () => {
    let wd = [...wDeck],
      wdi = [...wDis];
    const nh = hands.map((h) => {
      const need = 5 - h.length;
      if (need <= 0) return h;
      const r = draw(wd, wdi, need);
      wd = r.deck;
      wdi = r.discard;
      return [...h, ...r.drawn];
    });
    setHands(nh);
    setWDeck(wd);
    setWDis(wdi);
    const mr = rounds || players.length * 2;
    if (rNum >= mr || rNum >= sDeck.length) {
      const entry = {
        date: new Date().toLocaleDateString(),
        mode,
        rounds: rNum,
        players: players.map((p) => ({ name: p.name, score: p.score, wins: p.wins })),
        winner: players.reduce((a, b) => (a.score > b.score ? a : b)).name,
      };
      const newHistory = [...history, entry];
      setHistory(newHistory);
      saveHistory(newHistory);
      setScreen("gameover");
      return;
    }
    const ns = (skIdx + 1) % players.length;
    setSkIdx(ns);
    setRNum((p) => p + 1);
    startRound(rNum + 1, ns);
  };

  // ─── RULES ───
  if (screen === "rules") return <Rules onDone={() => setScreen("home")} />;

  // ─── HOME ───
  if (screen === "home") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ background: BG2 }}
      >
        <Mandala />
        <h1
          className="text-4xl font-bold text-amber-400 mb-1"
          style={{ fontFamily: "Georgia,serif" }}
        >
          THE GURU
        </h1>
        <p className="text-amber-200/60 text-sm tracking-widest mb-8">WISDOM SEEKERS</p>
        <p className="text-slate-300/80 text-center text-sm mb-8 max-w-xs">
          Ancient wisdom meets modern dilemmas. Play with family and friends.
        </p>
        <Button onClick={() => setScreen("setup")}>New Game</Button>
        <div className="flex gap-4 mt-5">
          <button
            onClick={() => setScreen("rules")}
            className="text-slate-400 text-sm underline underline-offset-2"
          >
            How to Play
          </button>
          {history.length > 0 && (
            <button
              onClick={() => setScreen("history")}
              className="text-slate-400 text-sm underline underline-offset-2"
            >
              Past Games ({history.length})
            </button>
          )}
        </div>
        <p className="text-slate-600 text-xs mt-6">3–8 Players</p>
      </div>
    );
  }

  // ─── HISTORY ───
  if (screen === "history") {
    return (
      <div className="min-h-screen p-5" style={{ background: BG }}>
        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-2xl font-bold text-amber-400"
            style={{ fontFamily: "Georgia,serif" }}
          >
            Past Games
          </h2>
          <button onClick={() => setScreen("home")} className="text-slate-400 text-sm">
            ✕ Close
          </button>
        </div>
        {history.length === 0 ? (
          <p className="text-slate-500 text-sm">No games yet.</p>
        ) : (
          <div className="space-y-3">
            {[...history].reverse().map((g, i) => (
              <div
                key={i}
                className="rounded-xl p-4 bg-slate-800/40 border border-slate-700/50"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-amber-400 text-sm font-semibold">{g.winner} won!</span>
                  <span className="text-slate-500 text-xs">{g.date}</span>
                </div>
                <div className="flex gap-1 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-400">
                    {g.mode}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-400">
                    {g.rounds} rounds
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.players
                    .sort((a, b) => b.score - a.score)
                    .map((p, j) => (
                      <span
                        key={j}
                        className={`text-xs px-2 py-1 rounded ${
                          j === 0
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        {p.name}: {p.score}pts ({p.wins}w)
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── SETUP ───
  if (screen === "setup") {
    const add = () => {
      if (names.length < 8) setNames([...names, ""]);
    };
    const rm = (i) => {
      if (names.length > 3) setNames(names.filter((_, j) => j !== i));
    };
    const ok = names.filter((n) => n.trim()).length >= 3;
    return (
      <div className="min-h-screen p-5" style={{ background: BG }}>
        <button onClick={() => setScreen("home")} className="text-slate-500 text-sm mb-3">
          ← Back
        </button>
        <h2
          className="text-2xl font-bold text-amber-400 mb-1"
          style={{ fontFamily: "Georgia,serif" }}
        >
          Players
        </h2>
        <p className="text-slate-400 text-sm mb-5">Add 3–8 player names</p>
        <div className="space-y-3 mb-4">
          {names.map((n, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-amber-500/60 text-sm w-6">{i + 1}.</span>
              <input
                type="text"
                value={n}
                placeholder={`Player ${i + 1}`}
                onChange={(e) => {
                  const x = [...names];
                  x[i] = e.target.value;
                  setNames(x);
                }}
                className="flex-1 bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-base outline-none focus:border-amber-500"
              />
              {names.length > 3 && (
                <button onClick={() => rm(i)} className="text-slate-500 text-xl px-2">
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        {names.length < 8 && (
          <button
            onClick={add}
            className="w-full py-3 rounded-lg border border-dashed border-slate-600 text-slate-400 mb-5"
          >
            + Add Player
          </button>
        )}
        <Button
          disabled={!ok}
          onClick={() => {
            setPlayers(names.filter((n) => n.trim()).map((n) => ({ name: n.trim(), score: 0, wins: 0 })));
            setRounds(names.filter((n) => n.trim()).length * 2);
            setScreen("settings");
          }}
        >
          Next
        </Button>
      </div>
    );
  }

  // ─── SETTINGS ───
  if (screen === "settings") {
    const tog = (c) => {
      const s = new Set(cats);
      if (s.has(c)) {
        if (s.size > 3) s.delete(c);
      } else s.add(c);
      setCats(s);
    };
    const scenarioCount = SCENARIOS.filter((s) => cats.has(s.cat)).length;
    return (
      <div className="min-h-screen p-5" style={{ background: BG }}>
        <button onClick={() => setScreen("setup")} className="text-slate-500 text-sm mb-3">
          ← Back
        </button>
        <h2
          className="text-2xl font-bold text-amber-400 mb-5"
          style={{ fontFamily: "Georgia,serif" }}
        >
          Game Settings
        </h2>
        <p className="text-slate-300 text-sm font-semibold mb-2">Game Mode</p>
        <div className="flex gap-3 mb-5">
          {["simple", "advanced"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-3 rounded-lg text-sm font-semibold border ${
                mode === m
                  ? "border-amber-500 bg-amber-500/20 text-amber-400"
                  : "border-slate-700 text-slate-400"
              }`}
            >
              {m === "simple" ? "Simple" : "Advanced"}
            </button>
          ))}
        </div>
        <p className="text-slate-300 text-sm font-semibold mb-2">Rounds</p>
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={() => setRounds(Math.max(players.length, rounds - 1))}
            className="w-12 h-12 rounded-lg bg-slate-800 text-white text-2xl"
          >
            -
          </button>
          <div className="text-center">
            <span className="text-amber-400 text-3xl font-bold">{rounds}</span>
            <p className="text-slate-500 text-xs">rounds</p>
          </div>
          <button
            onClick={() => setRounds(Math.min(Math.min(scenarioCount, 30), rounds + 1))}
            className="w-12 h-12 rounded-lg bg-slate-800 text-white text-2xl"
          >
            +
          </button>
          <div className="ml-2 text-slate-500 text-xs leading-tight">
            <p>~{Math.round(rounds * 2.5)} min estimated</p>
            <p>
              Each player seeks {Math.floor(rounds / players.length)}–
              {Math.ceil(rounds / players.length)}x
            </p>
          </div>
        </div>
        <div className="flex gap-2 mb-5 mt-2">
          {[
            { l: "Quick", v: players.length },
            { l: "Standard", v: players.length * 2 },
            { l: "Long", v: players.length * 3 },
          ].map((x) => (
            <button
              key={x.l}
              onClick={() => setRounds(Math.min(scenarioCount, x.v))}
              className={`px-3 py-1.5 rounded-full text-xs border ${
                rounds === x.v
                  ? "border-amber-500 text-amber-400 bg-amber-500/10"
                  : "border-slate-700 text-slate-500"
              }`}
            >
              {x.l} ({x.v})
            </button>
          ))}
        </div>
        <p className="text-slate-300 text-sm font-semibold mb-2">
          Categories <span className="text-slate-500 font-normal">(pick 3+)</span>
        </p>
        <div className="space-y-2 mb-5">
          {CATEGORY_NAMES.map((c) => {
            const cfg = CATEGORIES[c];
            const sel = cats.has(c);
            return (
              <button
                key={c}
                onClick={() => tog(c)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all ${
                  sel ? "border-opacity-80" : "border-slate-700 opacity-40"
                }`}
                style={sel ? { borderColor: cfg.c, background: cfg.c + "15" } : {}}
              >
                <span className="text-lg">{cfg.i}</span>
                <span className={`text-sm font-medium ${sel ? "text-white" : "text-slate-500"}`}>
                  {c}
                </span>
                {sel && (
                  <span className="ml-auto text-xs" style={{ color: cfg.c }}>
                    {SCENARIOS.filter((s) => s.cat === c).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="text-center text-slate-500 text-xs mb-3">
          {scenarioCount} scenario cards available
        </div>
        <Button onClick={startGame}>Start Game</Button>
      </div>
    );
  }

  // ─── GAME ───
  if (screen === "game") {
    const seeker = players[skIdx];
    const mr = rounds || players.length * 2;
    const cfg = curS ? CATEGORIES[curS.cat] : {};

    if (phase === "roundStart") {
      return (
        <div className="min-h-screen p-5 flex flex-col" style={{ background: BG }}>
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-500 text-xs">
              Round {rNum}/{mr}
            </span>
            <span className="text-amber-400 text-xs font-semibold">
              {mode === "advanced" ? "Advanced" : "Simple"}
            </span>
          </div>
          <div className="text-center mb-5">
            <p className="text-slate-400 text-sm">The Seeker</p>
            <p className="text-2xl font-bold text-white" style={{ fontFamily: "Georgia,serif" }}>
              {seeker.name}
            </p>
          </div>
          <div
            className="relative rounded-2xl p-6 mb-5 overflow-hidden"
            style={{ background: cfg.bg, border: `2px solid ${cfg.c}40` }}
          >
            <GeometricPattern pattern={cfg.p} color={cfg.c} opacity={0.1} />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{cfg.i}</span>
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: cfg.c }}
                >
                  {curS.cat}
                </span>
                {mode === "advanced" && (
                  <span
                    className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold text-white"
                    style={{ background: cfg.c }}
                  >
                    {curS.score} pt{curS.score > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <p
                className="text-lg leading-relaxed"
                style={{ color: "#1a1a2e", fontFamily: "Georgia,serif" }}
              >
                "{curS.text}"
              </p>
            </div>
          </div>
          <p className="text-center text-amber-200/60 text-sm italic mb-5">
            "Oh wise gurus, I have come to you with my problem. Please give me a solution."
          </p>
          <div className="flex flex-wrap gap-2 mb-5 justify-center">
            {players.map((p, i) => (
              <div
                key={i}
                className={`px-3 py-1.5 rounded-full text-xs ${
                  i === skIdx
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {p.name}: {p.score}
              </div>
            ))}
          </div>
          <div className="mt-auto">
            <Button onClick={() => setPhase("passing")}>Begin Guru Responses</Button>
          </div>
        </div>
      );
    }

    if (phase === "passing") {
      const gpi = gOrder.current[gIdx];
      const guru = players[gpi];
      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center p-8"
          style={{ background: BG }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60" className="mb-6 opacity-40">
            <circle
              cx="30"
              cy="30"
              r="25"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeDasharray="4,4"
            />
            <circle
              cx="30"
              cy="30"
              r="15"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
          </svg>
          <p className="text-slate-400 text-sm mb-2">Pass the phone to</p>
          <p
            className="text-3xl font-bold text-amber-400 mb-1"
            style={{ fontFamily: "Georgia,serif" }}
          >
            {guru.name}
          </p>
          <p className="text-slate-500 text-xs mb-8">
            Guru {gIdx + 1} of {gOrder.current.length}
          </p>
          <Button onClick={() => setPhase("guruTurn")} className="max-w-xs">
            I'm {guru.name}
          </Button>
        </div>
      );
    }

    if (phase === "guruTurn") {
      const gpi = gOrder.current[gIdx];
      const guru = players[gpi];
      const hand = hands[gpi];
      return (
        <div className="min-h-screen p-5" style={{ background: BG }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-amber-400 text-sm font-semibold">{guru.name}'s Turn</span>
            <span className="text-slate-500 text-xs">Pick one wisdom card</span>
          </div>
          <div
            className="rounded-lg p-3 mb-4"
            style={{ background: cfg.c + "15", border: `1px solid ${cfg.c}30` }}
          >
            <p className="text-xs" style={{ color: cfg.c }}>
              {cfg.i} {curS.cat}
            </p>
            <p className="text-white text-sm mt-1">"{curS.text}"</p>
          </div>
          <div className="space-y-3">
            {hand.map((card, i) => (
              <button
                key={card.id}
                onClick={() => selectCard(i)}
                className="w-full text-left relative rounded-xl p-4 overflow-hidden border border-amber-800/30 active:scale-[0.98] transition-transform"
                style={{ background: "linear-gradient(135deg,#2a2215,#1e1a0e)" }}
              >
                <WisdomPattern size={50} />
                <div className="relative z-10 pl-10">
                  <p className="text-amber-500 text-xs font-semibold mb-1">BG {card.verse}</p>
                  <p className="text-amber-100 text-sm leading-relaxed">"{card.text}"</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (phase === "reflect") {
      const rgi = gOrder.current[rIdx];
      const rg = players[rgi];
      const rc = sels[rgi];
      return (
        <div className="min-h-screen p-5 flex flex-col" style={{ background: BG }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-500 text-xs">Reflect & Share</span>
            <span className="text-slate-500 text-xs">
              {rIdx + 1} of {gOrder.current.length}
            </span>
          </div>
          <div
            className="rounded-lg p-3 mb-4"
            style={{ background: cfg.c + "15", border: `1px solid ${cfg.c}30` }}
          >
            <p className="text-white text-sm">"{curS.text}"</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-slate-400 text-sm mb-2">Guru</p>
            <p
              className="text-2xl font-bold text-amber-400 mb-6"
              style={{ fontFamily: "Georgia,serif" }}
            >
              {rg.name}
            </p>
            <div
              className="w-full relative rounded-2xl p-6 overflow-hidden border border-amber-700/40"
              style={{ background: "linear-gradient(135deg,#2a2215,#1e1a0e)" }}
            >
              <WisdomPattern size={70} />
              <div className="relative z-10 pl-12">
                <p className="text-amber-500 text-sm font-semibold mb-2">BG {rc.verse}</p>
                <p
                  className="text-amber-100 text-lg leading-relaxed"
                  style={{ fontFamily: "Georgia,serif" }}
                >
                  "{rc.text}"
                </p>
              </div>
            </div>
            <p className="text-amber-200/40 text-sm italic mt-6 text-center">
              {rg.name}, share how this wisdom solves the dilemma.
            </p>
          </div>
          <Button
            onClick={() => {
              if (rIdx < gOrder.current.length - 1) setRIdx((p) => p + 1);
              else setPhase("seekerPick");
            }}
            className="mt-4"
          >
            {rIdx < gOrder.current.length - 1 ? "Next Guru" : "Seeker, Choose the Wisest"}
          </Button>
        </div>
      );
    }

    if (phase === "seekerPick") {
      return (
        <div className="min-h-screen p-5" style={{ background: BG }}>
          <div className="text-center mb-4">
            <p className="text-slate-400 text-sm">Seeker's Decision</p>
            <p
              className="text-xl font-bold text-amber-400"
              style={{ fontFamily: "Georgia,serif" }}
            >
              {seeker.name}, pick the wisest
            </p>
          </div>
          <div
            className="rounded-lg p-3 mb-5"
            style={{ background: cfg.c + "15", border: `1px solid ${cfg.c}30` }}
          >
            <p className="text-white text-sm">"{curS.text}"</p>
            {mode === "advanced" && (
              <p className="text-xs mt-1" style={{ color: cfg.c }}>
                Worth {curS.score} point{curS.score > 1 ? "s" : ""}
              </p>
            )}
          </div>
          <div className="space-y-3">
            {gOrder.current.map((gi) => {
              const g = players[gi];
              const card = sels[gi];
              return (
                <button
                  key={gi}
                  onClick={() => pickWinner(gi)}
                  className="w-full text-left relative rounded-xl p-4 overflow-hidden border border-slate-700 active:scale-[0.98] active:border-amber-500 transition-all"
                  style={{ background: "linear-gradient(135deg,#1a1a2e,#16213e)" }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                      {g.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-amber-400 text-sm font-semibold">{g.name}</p>
                      <p className="text-amber-600 text-xs mb-1">BG {card.verse}</p>
                      <p className="text-slate-300 text-sm leading-relaxed">"{card.text}"</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (phase === "scoreUpdate") {
      const wp = players[winner];
      const pts = mode === "advanced" ? curS.score : 1;
      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center p-8"
          style={{ background: BG }}
        >
          <svg width="80" height="80" viewBox="0 0 80 80" className="mb-6">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => (
              <ellipse
                key={a}
                cx="40"
                cy="40"
                rx="6"
                ry="25"
                fill="none"
                stroke="#F59E0B"
                strokeWidth=".8"
                opacity=".4"
                transform={`rotate(${a},40,40)`}
              />
            ))}
            <circle cx="40" cy="40" r="18" fill="#F59E0B" opacity=".15" />
            <text x="40" y="46" textAnchor="middle" fill="#F59E0B" fontSize="20" fontWeight="bold">
              +{pts}
            </text>
          </svg>
          <p className="text-slate-400 text-sm mb-2">Wisest Guru</p>
          <p
            className="text-3xl font-bold text-amber-400 mb-2"
            style={{ fontFamily: "Georgia,serif" }}
          >
            {wp.name}
          </p>
          <p className="text-slate-400 text-sm mb-8">
            +{pts} point{pts > 1 ? "s" : ""}
          </p>
          <div className="w-full max-w-xs space-y-2 mb-8">
            {[...players]
              .sort((a, b) => b.score - a.score)
              .map((p) => (
                <div
                  key={p.name}
                  className={`flex items-center justify-between px-4 py-2 rounded-lg ${
                    p.name === wp.name
                      ? "bg-amber-500/20 border border-amber-500/40"
                      : "bg-slate-800/40"
                  }`}
                >
                  <span
                    className={`text-sm ${
                      p.name === wp.name ? "text-amber-400 font-semibold" : "text-slate-400"
                    }`}
                  >
                    {p.name}
                  </span>
                  <span className="text-amber-400 font-bold">{p.score}</span>
                </div>
              ))}
          </div>
          <Button onClick={nextRound} className="max-w-xs">
            {rNum >= (rounds || players.length * 2) ? "Final Results" : "Next Round"}
          </Button>
        </div>
      );
    }
  }

  // ─── GAME OVER ───
  if (screen === "gameover") {
    const sorted = [...players].sort((a, b) => b.score - a.score);
    const champ = sorted[0];
    const totalPts = players.reduce((s, p) => s + p.score, 0);
    const medals = ["🥇", "🥈", "🥉"];
    return (
      <div className="min-h-screen p-6" style={{ background: BG2 }}>
        <div className="flex flex-col items-center pt-6 mb-8">
          <svg width="100" height="100" viewBox="0 0 100 100" className="mb-4">
            {Array.from({ length: 24 }).map((_, i) => (
              <ellipse
                key={i}
                cx="50"
                cy="50"
                rx="6"
                ry="38"
                fill="none"
                stroke="#F59E0B"
                strokeWidth=".6"
                opacity=".3"
                transform={`rotate(${i * 15},50,50)`}
              />
            ))}
            <circle cx="50" cy="50" r="22" fill="#F59E0B" opacity=".15" />
            <circle cx="50" cy="50" r="15" fill="#F59E0B" opacity=".1" />
          </svg>
          <p className="text-slate-400 text-sm mb-1">The Ultimate</p>
          <p
            className="text-3xl font-bold text-amber-400 mb-1"
            style={{ fontFamily: "Georgia,serif" }}
          >
            Wisdom Seeker
          </p>
          <p className="text-3xl font-bold text-white" style={{ fontFamily: "Georgia,serif" }}>
            {champ.name}
          </p>
          <p className="text-amber-500 text-lg mt-1">{champ.score} points</p>
        </div>

        {/* Leaderboard */}
        <div className="space-y-2 mb-6">
          {sorted.map((p, i) => {
            const pct = totalPts ? Math.round((p.score / totalPts) * 100) : 0;
            return (
              <div
                key={p.name}
                className={`rounded-xl p-4 ${
                  i === 0
                    ? "bg-amber-500/15 border border-amber-500/30"
                    : "bg-slate-800/40 border border-slate-700/30"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{medals[i] || `#${i + 1}`}</span>
                  <span className={`flex-1 font-semibold ${i === 0 ? "text-amber-400" : "text-slate-300"}`}>
                    {p.name}
                  </span>
                  <span className="text-amber-400 font-bold text-lg">{p.score}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-slate-700/50 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: i === 0 ? "#F59E0B" : "#64748B" }}
                    />
                  </div>
                  <span className="text-slate-500 text-xs">
                    {p.wins} win{p.wins !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Game stats */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { v: gameStats.roundsPlayed, l: "Rounds" },
            { v: players.length, l: "Players" },
            { v: mode === "advanced" ? "Scored" : "Simple", l: "Mode" },
          ].map((s, i) => (
            <div key={i} className="text-center p-3 rounded-lg bg-slate-800/30">
              <div className="text-amber-400 text-lg font-bold">{s.v}</div>
              <div className="text-slate-500 text-xs">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => {
              setPlayers(players.map((p) => ({ ...p, score: 0, wins: 0 })));
              setScreen("settings");
            }}
          >
            Rematch (Same Players)
          </Button>
          <button
            onClick={() => {
              setScreen("home");
              setPlayers([]);
              setNames(["", "", ""]);
            }}
            className="w-full py-3 rounded-xl border border-slate-700 text-slate-400"
          >
            New Game
          </button>
        </div>
      </div>
    );
  }

  return null;
}
