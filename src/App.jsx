import { useState, useRef } from "react";
import { SCENARIOS } from "./data/scenarios";
import { WISDOM } from "./data/wisdom";
import { CATEGORIES, CATEGORY_NAMES } from "./data/categories";
import { shuffle, draw, getGurus, loadHistory, saveHistory, hasSeenRules } from "./utils/helpers";
import { GeometricPattern, WisdomPattern, SacredLotus, SacredDivider } from "./components/Patterns";
import { Button, IconButton } from "./components/Button";
import { Rules } from "./components/Rules";

export default function App() {
  const [screen, setScreen] = useState(() => (hasSeenRules() ? "home" : "rules"));
  const [players, setPlayers] = useState([]);
  const [names, setNames] = useState(["", "", ""]);
  const [mode, setMode] = useState("simple");
  const [cats, setCats] = useState(new Set(CATEGORY_NAMES.slice(0, 6)));
  const [rounds, setRounds] = useState(0);
  const [history, setHistory] = useState(() => loadHistory());
  const [viewingGame, setViewingGame] = useState(null); // For viewing past game details

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
  const [showCustom, setShowCustom] = useState(false);
  const gOrder = useRef([]);

  const startGame = () => {
    const fs = shuffle(SCENARIOS.filter((s) => cats.has(s.cat)));
    const sw = shuffle([...WISDOM]);
    const rd = rounds || players.length * 2;
    let wd = [...sw], wdi = [];
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
    let wd = [...wDeck], wdi = [...wDis];
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
        className="h-full flex flex-col"
        style={{
          background: "radial-gradient(ellipse at center top, #2D1F1A 0%, #1A1412 60%, #1A1412 100%)",
        }}
      >
        {/* Centered content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="animate-float">
            <SacredLotus size={120} />
          </div>

          <h1 className="font-display text-4xl text-[#C9A962] mt-5 tracking-wide">
            GitaVerse
          </h1>
          <p className="text-[#C9A962]/50 text-sm tracking-[0.3em] uppercase mt-1">
            Wisdom Seekers
          </p>

          <SacredDivider width={180} className="my-6 opacity-60" />

          <p className="text-[#F5EFE0]/60 text-center text-sm leading-relaxed max-w-xs">
            Where ancient wisdom meets modern dilemmas. A journey of reflection with family and friends.
          </p>
        </div>

        {/* Footer */}
        <div className="shrink-0 p-6 pt-0 flex flex-col items-center">
          <Button onClick={() => setScreen("setup")} className="max-w-xs w-full">
            Begin Journey
          </Button>

          <div className="flex gap-6 mt-5">
            <button
              onClick={() => setScreen("rules")}
              className="text-[#C9A962]/60 text-sm hover:text-[#C9A962] transition-colors"
            >
              How to Play
            </button>
            {history.length > 0 && (
              <button
                onClick={() => {
                  setViewingGame(null);
                  setScreen("history");
                }}
                className="text-[#C9A962]/60 text-sm hover:text-[#C9A962] transition-colors"
              >
                Past Games
              </button>
            )}
          </div>

          <p className="text-[#F5EFE0]/30 text-xs mt-4">3–8 Seekers</p>
        </div>
      </div>
    );
  }

  // ─── HISTORY ───
  if (screen === "history") {
    // Viewing a specific past game
    if (viewingGame !== null) {
      const game = [...history].reverse()[viewingGame];
      const sorted = [...game.players].sort((a, b) => b.score - a.score);
      const champ = sorted[0];
      const totalPts = game.players.reduce((s, p) => s + p.score, 0);

      return (
        <div
          className="h-full flex flex-col"
          style={{
            background: "radial-gradient(ellipse at center top, #2D1F1A 0%, #1A1412 60%, #1A1412 100%)",
          }}
        >
          <div className="flex-1 overflow-y-auto p-6">
            {/* Back button */}
            <button
              onClick={() => setViewingGame(null)}
              className="text-[#C9A962]/60 text-sm hover:text-[#C9A962] transition-colors mb-4"
            >
              ← Back to Past Journeys
            </button>

            <div className="flex flex-col items-center pt-4 mb-8">
              <div className="animate-float">
                <SacredLotus size={100} />
              </div>

              <p className="text-[#F5EFE0]/40 text-xs mt-4 mb-1">{game.date}</p>
              <p className="text-[#F5EFE0]/50 text-sm mb-1">The Ultimate</p>
              <p className="font-display text-2xl text-[#C9A962]">Wisdom Seeker</p>
              <p className="font-display text-3xl text-[#E8D5A3] mt-2">{champ.name}</p>
              <p className="text-[#C9A962] text-lg mt-1">{champ.score} points</p>
            </div>

            {/* Leaderboard */}
            <div className="space-y-3 mb-6">
              {sorted.map((p, i) => {
                const pct = totalPts ? Math.round((p.score / totalPts) * 100) : 0;
                const medals = ["🥇", "🥈", "🥉"];
                return (
                  <div
                    key={p.name}
                    className={`rounded-2xl p-4 ${
                      i === 0
                        ? "bg-[#C9A962]/10 border border-[#C9A962]/30"
                        : "bg-[#2D1F1A]/50 border border-[#C9A962]/10"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl w-8">{medals[i] || `#${i + 1}`}</span>
                      <span
                        className={`flex-1 font-medium ${i === 0 ? "text-[#C9A962]" : "text-[#E8D5A3]/80"}`}
                      >
                        {p.name}
                      </span>
                      <span className="text-[#C9A962] font-display text-xl">{p.score}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full bg-[#2D1F1A] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            background: i === 0 ? "#C9A962" : "#6B2D3C",
                          }}
                        />
                      </div>
                      <span className="text-[#F5EFE0]/40 text-xs">
                        {p.wins} {p.wins === 1 ? "win" : "wins"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { v: game.rounds, l: "Rounds" },
                { v: game.players.length, l: "Seekers" },
                { v: game.mode === "advanced" ? "Depth" : "Simple", l: "Mode" },
              ].map((s, i) => (
                <div key={i} className="text-center p-4 rounded-xl bg-[#2D1F1A]/40 border border-[#C9A962]/10">
                  <div className="text-[#C9A962] font-display text-xl">{s.v}</div>
                  <div className="text-[#F5EFE0]/40 text-xs mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // History list
    return (
      <div
        className="h-full flex flex-col"
        style={{ background: "linear-gradient(180deg, #1A1412 0%, #2D1F1A 50%, #1A1412 100%)" }}
      >
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl text-[#C9A962]">Past Journeys</h2>
            <button
              onClick={() => {
                setViewingGame(null);
                setScreen("home");
              }}
              className="text-[#C9A962]/60 hover:text-[#C9A962] transition-colors"
            >
              ✕
            </button>
          </div>

          {history.length === 0 ? (
            <p className="text-[#F5EFE0]/40 text-sm text-center mt-20">No journeys yet.</p>
          ) : (
            <div className="space-y-4">
              {[...history].reverse().map((g, i) => (
                <button
                  key={i}
                  onClick={() => setViewingGame(i)}
                  className="w-full text-left rounded-2xl p-5 bg-[#2D1F1A]/50 border border-[#C9A962]/10 hover:border-[#C9A962]/30 hover:bg-[#2D1F1A]/70 transition-all active:scale-[0.98]"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[#C9A962] font-display text-lg">{g.winner}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#F5EFE0]/30 text-xs">{g.date}</span>
                      <span className="text-[#C9A962]/40">→</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <span className="text-xs px-3 py-1 rounded-full bg-[#6B2D3C]/30 text-[#E8D5A3]/70 border border-[#C9A962]/10">
                      {g.mode}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-[#6B2D3C]/30 text-[#E8D5A3]/70 border border-[#C9A962]/10">
                      {g.rounds} rounds
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[...g.players]
                      .sort((a, b) => b.score - a.score)
                      .map((p, j) => (
                        <span
                          key={j}
                          className={`text-xs px-3 py-1.5 rounded-lg ${
                            j === 0
                              ? "bg-[#C9A962]/20 text-[#E8D5A3] border border-[#C9A962]/30"
                              : "bg-[#2D1F1A]/60 text-[#F5EFE0]/50"
                          }`}
                        >
                          {p.name}: {p.score}
                        </span>
                      ))}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
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
      <div
        className="h-full flex flex-col"
        style={{ background: "linear-gradient(180deg, #1A1412 0%, #2D1F1A 50%, #1A1412 100%)" }}
      >
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 pb-0">
          <button
            onClick={() => setScreen("home")}
            className="text-[#C9A962]/60 text-sm hover:text-[#C9A962] transition-colors mb-6"
          >
            ← Return
          </button>

          <h2 className="font-display text-2xl text-[#C9A962] mb-2">The Seekers</h2>
          <p className="text-[#F5EFE0]/50 text-sm mb-6">Gather 3 to 8 souls for this journey</p>

          <div className="space-y-3 mb-5">
            {names.map((n, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[#C9A962]/40 font-display text-lg w-6">{i + 1}</span>
                <input
                  type="text"
                  value={n}
                  placeholder={`Seeker ${i + 1}`}
                  onChange={(e) => {
                    const x = [...names];
                    x[i] = e.target.value;
                    setNames(x);
                  }}
                  className="flex-1 bg-[#2D1F1A]/60 border border-[#C9A962]/20 rounded-xl px-4 py-3.5 text-[#F5EFE0] placeholder-[#F5EFE0]/30 text-base"
                />
                {names.length > 3 && (
                  <button
                    onClick={() => rm(i)}
                    className="text-[#C9A962]/40 hover:text-[#C9A962] text-xl px-2 transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {names.length < 8 && (
            <button
              onClick={add}
              className="w-full py-3.5 rounded-xl border border-dashed border-[#C9A962]/30 text-[#C9A962]/60 hover:border-[#C9A962]/50 hover:text-[#C9A962] transition-colors"
            >
              + Add Seeker
            </button>
          )}
        </div>

        {/* Sticky footer */}
        <div className="shrink-0 p-6 bg-gradient-to-t from-[#1A1412] via-[#1A1412] to-transparent">
          <Button
            disabled={!ok}
            onClick={() => {
              setPlayers(names.filter((n) => n.trim()).map((n) => ({ name: n.trim(), score: 0, wins: 0 })));
              setRounds(names.filter((n) => n.trim()).length * 2);
              setScreen("settings");
            }}
          >
            Continue
          </Button>
        </div>
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

    // Preset configurations - these start the game immediately
    const applyPresetAndStart = (presetMode, presetRounds, presetCats) => {
      const selectedCats = new Set(presetCats);
      const filteredScenarios = shuffle(SCENARIOS.filter((s) => selectedCats.has(s.cat)));
      const sw = shuffle([...WISDOM]);
      let wd = [...sw], wdi = [];
      const h = players.map(() => {
        const r = draw(wd, wdi, 5);
        wd = r.deck;
        wdi = r.discard;
        return r.drawn;
      });

      setMode(presetMode);
      setRounds(presetRounds);
      setCats(selectedCats);
      setSDeck(filteredScenarios);
      setWDeck(wd);
      setWDis(wdi);
      setHands(h);
      setSkIdx(0);
      setRNum(1);
      setSels({});
      setPhase("roundStart");
      setCurS(filteredScenarios[0]);
      gOrder.current = getGurus(0, players.length);
      setGIdx(0);
      setGameStats({ roundsPlayed: 0, catsUsed: [...selectedCats] });
      setScreen("game");
    };

    const presets = [
      {
        key: "quick",
        label: "Quick Game",
        desc: "Fast & fun",
        icon: "⚡",
        apply: () => applyPresetAndStart(
          "simple",
          players.length,
          ["Personal Dilemmas", "Relationship Situations", "Mind & Emotions", "Family & Parenting"]
        ),
      },
      {
        key: "kids",
        label: "Kid Friendly",
        desc: "Family safe",
        icon: "🌟",
        apply: () => applyPresetAndStart(
          "simple",
          Math.max(players.length, Math.min(players.length * 2, 8)),
          ["Personal Dilemmas", "Relationship Situations", "Family & Parenting", "Mind & Emotions"]
        ),
      },
      {
        key: "deep",
        label: "Deep",
        desc: "Contemplative",
        icon: "🪷",
        apply: () => applyPresetAndStart(
          "advanced",
          players.length * 3,
          ["Moral/Ethical Decisions", "Spiritual Growth", "Mind & Emotions", "Social Responsibility", "Wealth & Simplicity"]
        ),
      },
    ];

    return (
      <div
        className="h-full flex flex-col"
        style={{ background: "linear-gradient(180deg, #1A1412 0%, #2D1F1A 50%, #1A1412 100%)" }}
      >
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 pb-4">
          <button
            onClick={() => setScreen("setup")}
            className="text-[#C9A962]/60 text-sm hover:text-[#C9A962] transition-colors mb-6"
          >
            ← Return
          </button>

          <h2 className="font-display text-2xl text-[#C9A962] mb-2">Choose Your Path</h2>
          <p className="text-[#F5EFE0]/40 text-sm mb-6">Select a journey type</p>

          {/* Preset Modes */}
          <div className="space-y-3 mb-6">
            {presets.map((p) => (
              <button
                key={p.key}
                onClick={() => {
                  p.apply();
                  setShowCustom(false);
                }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border border-[#C9A962]/20 bg-[#2D1F1A]/40 hover:border-[#C9A962]/40 hover:bg-[#2D1F1A]/60 transition-all text-left active:scale-[0.98]"
              >
                <span className="text-2xl">{p.icon}</span>
                <div className="flex-1">
                  <span className="block text-[#E8D5A3] font-medium">{p.label}</span>
                  <span className="block text-[#F5EFE0]/40 text-xs mt-0.5">{p.desc}</span>
                </div>
                <span className="text-[#C9A962]/40">→</span>
              </button>
            ))}
          </div>

          {/* Custom toggle */}
          <button
            onClick={() => setShowCustom(!showCustom)}
            className="w-full text-center text-[#C9A962]/60 text-sm py-3 hover:text-[#C9A962] transition-colors"
          >
            {showCustom ? "Hide custom options ▲" : "Customize settings ▼"}
          </button>

          {/* Custom Settings */}
          {showCustom && (
            <div className="mt-4 pt-4 border-t border-[#C9A962]/10">
              {/* Game Mode */}
              <p className="text-[#E8D5A3] text-sm font-medium mb-3">Scoring</p>
              <div className="flex gap-3 mb-5">
                {[
                  { key: "simple", label: "Simple", desc: "1 pt each" },
                  { key: "advanced", label: "Advanced", desc: "By depth" },
                ].map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setMode(m.key)}
                    className={`flex-1 py-3 rounded-xl text-center transition-all ${
                      mode === m.key
                        ? "bg-[#C9A962]/20 border-[#C9A962] text-[#E8D5A3] border"
                        : "bg-[#2D1F1A]/40 border-[#C9A962]/20 text-[#F5EFE0]/50 border"
                    }`}
                  >
                    <span className="block font-medium text-sm">{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Rounds */}
              <p className="text-[#E8D5A3] text-sm font-medium mb-3">Rounds</p>
              <div className="flex items-center gap-4 mb-5">
                <IconButton onClick={() => setRounds(Math.max(players.length, rounds - 1))}>−</IconButton>
                <div className="text-center flex-1">
                  <span className="font-display text-3xl text-[#C9A962]">{rounds}</span>
                </div>
                <IconButton onClick={() => setRounds(Math.min(Math.min(scenarioCount, 30), rounds + 1))}>+</IconButton>
              </div>

              {/* Categories */}
              <p className="text-[#E8D5A3] text-sm font-medium mb-3">
                Categories <span className="text-[#F5EFE0]/30">(3+ required)</span>
              </p>
              <div className="space-y-2 mb-4">
                {CATEGORY_NAMES.map((c) => {
                  const cfg = CATEGORIES[c];
                  const sel = cats.has(c);
                  return (
                    <button
                      key={c}
                      onClick={() => tog(c)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all ${
                        sel
                          ? "border-[#C9A962]/30 bg-[#2D1F1A]/50"
                          : "border-[#C9A962]/10 bg-[#2D1F1A]/20 opacity-50"
                      }`}
                    >
                      <span className="text-base" style={{ color: sel ? cfg.c : "#555" }}>
                        {cfg.i}
                      </span>
                      <span className={`text-sm ${sel ? "text-[#E8D5A3]" : "text-[#F5EFE0]/40"}`}>
                        {c}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="text-center text-[#F5EFE0]/30 text-xs">
                {scenarioCount} scenarios
              </p>
            </div>
          )}
        </div>

        {/* Sticky footer */}
        <div className="shrink-0 p-6 pt-4 bg-gradient-to-t from-[#1A1412] via-[#1A1412] to-transparent">
          <Button onClick={startGame}>Enter the GitaVerse</Button>
        </div>
      </div>
    );
  }

  // ─── GAME ───
  if (screen === "game") {
    const seeker = players[skIdx];
    const mr = rounds || players.length * 2;
    const cfg = curS ? CATEGORIES[curS.cat] : {};

    // Round Start
    if (phase === "roundStart") {
      return (
        <div
          className="h-full flex flex-col"
          style={{ background: "linear-gradient(180deg, #1A1412 0%, #2D1F1A 50%, #1A1412 100%)" }}
        >
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[#F5EFE0]/40 text-sm">
                Round {rNum} of {mr}
              </span>
              <span className="text-[#C9A962]/60 text-xs px-3 py-1 rounded-full border border-[#C9A962]/20">
                {mode === "advanced" ? "Advanced" : "Simple"}
              </span>
            </div>

            <div className="text-center mb-6">
              <p className="text-[#F5EFE0]/50 text-sm">The Seeker</p>
              <p className="font-display text-3xl text-[#C9A962] mt-1">{seeker.name}</p>
            </div>

            {/* Scenario Card */}
            <div
              className="relative rounded-2xl p-6 mb-6 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${cfg.c}15 0%, ${cfg.c}08 100%)`,
                border: `1px solid ${cfg.c}30`,
              }}
            >
              <GeometricPattern pattern={cfg.p} color={cfg.c} opacity={0.15} size={90} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">{cfg.i}</span>
                  <span className="text-xs font-medium tracking-wide" style={{ color: cfg.c }}>
                    {curS.cat}
                  </span>
                  {mode === "advanced" && (
                    <span
                      className="ml-auto px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ background: `${cfg.c}30`, color: cfg.c }}
                    >
                      {curS.score} {curS.score === 1 ? "point" : "points"}
                    </span>
                  )}
                </div>
                <p className="font-display text-xl text-[#F5EFE0] leading-relaxed">
                  "{curS.text}"
                </p>
              </div>
            </div>

            <p className="text-center text-[#C9A962]/50 text-sm italic mb-4 px-4">
              "O wise gurus, I bring you my dilemma. Share your wisdom."
            </p>

            {/* Scores */}
            <div className="flex flex-wrap gap-2 justify-center">
              {players.map((p, i) => (
                <div
                  key={i}
                  className={`px-3 py-1.5 rounded-full text-xs ${
                    i === skIdx
                      ? "bg-[#C9A962]/20 text-[#C9A962] border border-[#C9A962]/40"
                      : "bg-[#2D1F1A]/60 text-[#F5EFE0]/50"
                  }`}
                >
                  {p.name}: {p.score}
                </div>
              ))}
            </div>
          </div>

          {/* Sticky footer */}
          <div className="shrink-0 p-6 pt-4 bg-gradient-to-t from-[#1A1412] via-[#1A1412] to-transparent">
            <Button onClick={() => setPhase("passing")}>Summon the Gurus</Button>
          </div>
        </div>
      );
    }

    // Passing Phase
    if (phase === "passing") {
      const gpi = gOrder.current[gIdx];
      const guru = players[gpi];
      return (
        <div
          className="h-full flex flex-col items-center justify-center p-8"
          style={{ background: "linear-gradient(180deg, #1A1412 0%, #2D1F1A 50%, #1A1412 100%)" }}
        >
          <div className="animate-breathe mb-8">
            <SacredLotus size={100} />
          </div>

          <p className="text-[#F5EFE0]/50 text-sm mb-2">Pass the phone to</p>
          <p className="font-display text-4xl text-[#C9A962] mb-2">{guru.name}</p>
          <p className="text-[#F5EFE0]/30 text-sm mb-10">
            Guru {gIdx + 1} of {gOrder.current.length}
          </p>

          <Button onClick={() => setPhase("guruTurn")} className="max-w-xs">
            I am {guru.name}
          </Button>
        </div>
      );
    }

    // Guru Turn
    if (phase === "guruTurn") {
      const gpi = gOrder.current[gIdx];
      const guru = players[gpi];
      const hand = hands[gpi];
      return (
        <div
          className="h-full flex flex-col"
          style={{ background: "linear-gradient(180deg, #1A1412 0%, #2D1F1A 50%, #1A1412 100%)" }}
        >
          <div className="flex-1 overflow-y-auto p-6">
            {/* Header */}
            <div className="text-center mb-4">
              <p className="text-[#F5EFE0]/50 text-sm">Guru</p>
              <p className="font-display text-2xl text-[#C9A962]">{guru.name}</p>
            </div>

            {/* Scenario reminder */}
            <div
              className="rounded-xl p-4 mb-4"
              style={{ background: `${cfg.c}10`, border: `1px solid ${cfg.c}20` }}
            >
              <p className="text-xs mb-1" style={{ color: cfg.c }}>
                {cfg.i} The Seeker asks:
              </p>
              <p className="text-[#F5EFE0]/80 text-sm">"{curS.text}"</p>
            </div>

            {/* Instruction */}
            <div className="text-center mb-4">
              <p className="text-[#C9A962] text-sm font-medium">👆 Tap a wisdom card to select</p>
              <p className="text-[#F5EFE0]/40 text-xs mt-1">Choose the verse that best answers this dilemma</p>
            </div>

            {/* Wisdom cards */}
            <div className="space-y-3">
              {hand.map((card, i) => (
                <button
                  key={card.id}
                  onClick={() => selectCard(i)}
                  className="w-full text-left relative rounded-2xl p-4 overflow-hidden border-2 border-[#C9A962]/20 active:scale-[0.98] active:border-[#C9A962] transition-all hover:border-[#C9A962]/50"
                  style={{
                    background: "linear-gradient(135deg, #2D1F1A 0%, #1A1412 100%)",
                  }}
                >
                  <WisdomPattern size={45} />
                  <div className="relative z-10 pl-11">
                    <p className="text-[#C9A962] text-xs font-medium mb-1.5">
                      BG {card.verse}
                    </p>
                    <p className="text-[#E8D5A3] text-sm leading-relaxed">"{card.text}"</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Reflect Phase
    if (phase === "reflect") {
      const rgi = gOrder.current[rIdx];
      const rg = players[rgi];
      const rc = sels[rgi];
      return (
        <div
          className="h-full flex flex-col"
          style={{ background: "linear-gradient(180deg, #1A1412 0%, #2D1F1A 50%, #1A1412 100%)" }}
        >
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[#F5EFE0]/40 text-sm">Reflection</span>
              <span className="text-[#F5EFE0]/40 text-sm">
                {rIdx + 1} of {gOrder.current.length}
              </span>
            </div>

            {/* Scenario reminder */}
            <div
              className="rounded-xl p-4 mb-6"
              style={{ background: `${cfg.c}10`, border: `1px solid ${cfg.c}20` }}
            >
              <p className="text-[#F5EFE0]/70 text-sm">"{curS.text}"</p>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-[#F5EFE0]/50 text-sm mb-2">Guru</p>
              <p className="font-display text-3xl text-[#C9A962] mb-6">{rg.name}</p>

              {/* Wisdom card display */}
              <div
                className="w-full relative rounded-2xl p-5 overflow-hidden border border-[#C9A962]/25"
                style={{
                  background: "linear-gradient(135deg, #2D1F1A 0%, #1A1412 100%)",
                }}
              >
                <WisdomPattern size={60} />
                <div className="relative z-10 pl-12">
                  <p className="text-[#C9A962] text-sm font-medium mb-2">
                    BG {rc.verse}
                  </p>
                  <p className="font-display text-lg text-[#E8D5A3] leading-relaxed">
                    "{rc.text}"
                  </p>
                </div>
              </div>

              <p className="text-[#C9A962]/40 text-sm italic mt-6 text-center px-4">
                {rg.name}, explain how this wisdom answers the dilemma
              </p>
            </div>
          </div>

          {/* Sticky footer */}
          <div className="shrink-0 p-6 pt-4 bg-gradient-to-t from-[#1A1412] via-[#1A1412] to-transparent">
            <Button
              onClick={() => {
                if (rIdx < gOrder.current.length - 1) setRIdx((p) => p + 1);
                else setPhase("seekerPick");
              }}
            >
              {rIdx < gOrder.current.length - 1 ? "Next Guru" : "Seeker's Choice"}
            </Button>
          </div>
        </div>
      );
    }

    // Seeker Pick
    if (phase === "seekerPick") {
      return (
        <div
          className="h-full flex flex-col"
          style={{ background: "linear-gradient(180deg, #1A1412 0%, #2D1F1A 50%, #1A1412 100%)" }}
        >
          <div className="flex-1 overflow-y-auto p-6">
            <div className="text-center mb-4">
              <p className="text-[#F5EFE0]/50 text-sm">Seeker</p>
              <p className="font-display text-2xl text-[#C9A962] mt-1">{seeker.name}</p>
            </div>

            {/* Scenario */}
            <div
              className="rounded-xl p-4 mb-4"
              style={{ background: `${cfg.c}10`, border: `1px solid ${cfg.c}20` }}
            >
              <p className="text-[#F5EFE0]/70 text-sm">"{curS.text}"</p>
              {mode === "advanced" && (
                <p className="text-xs mt-2" style={{ color: cfg.c }}>
                  Worth {curS.score} {curS.score === 1 ? "point" : "points"}
                </p>
              )}
            </div>

            {/* Instruction */}
            <p className="text-center text-[#C9A962] text-sm font-medium mb-4">
              👆 Tap to award the round
            </p>

            {/* Guru options */}
            <div className="space-y-3">
              {gOrder.current.map((gi) => {
                const g = players[gi];
                const card = sels[gi];
                return (
                  <button
                    key={gi}
                    onClick={() => pickWinner(gi)}
                    className="w-full text-left rounded-2xl p-4 border-2 border-[#C9A962]/15 active:scale-[0.98] active:border-[#C9A962] transition-all hover:border-[#C9A962]/40"
                    style={{ background: "linear-gradient(135deg, #2D1F1A 0%, #1A1412 100%)" }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-display bg-[#6B2D3C]/40 text-[#C9A962] border border-[#C9A962]/30 shrink-0">
                        {g.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#C9A962] font-medium">{g.name}</p>
                        <p className="text-[#C9A962]/50 text-xs mb-1">BG {card.verse}</p>
                        <p className="text-[#E8D5A3]/80 text-sm leading-relaxed">"{card.text}"</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // Score Update
    if (phase === "scoreUpdate") {
      const wp = players[winner];
      const pts = mode === "advanced" ? curS.score : 1;
      return (
        <div
          className="h-full flex flex-col"
          style={{ background: "linear-gradient(180deg, #1A1412 0%, #2D1F1A 50%, #1A1412 100%)" }}
        >
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="animate-breathe mb-4">
              <SacredLotus size={90} />
            </div>

            <p className="text-[#F5EFE0]/50 text-sm mb-1">Wisest Guru</p>
            <p className="font-display text-3xl text-[#C9A962] mb-1">{wp.name}</p>
            <p className="text-[#C9A962]/60 text-lg mb-6">
              +{pts} {pts === 1 ? "point" : "points"}
            </p>

            {/* Standings */}
            <div className="w-full max-w-xs space-y-2">
              {[...players]
                .sort((a, b) => b.score - a.score)
                .map((p) => (
                  <div
                    key={p.name}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl ${
                      p.name === wp.name
                        ? "bg-[#C9A962]/15 border border-[#C9A962]/30"
                        : "bg-[#2D1F1A]/50"
                    }`}
                  >
                    <span
                      className={`text-sm ${
                        p.name === wp.name ? "text-[#C9A962] font-medium" : "text-[#F5EFE0]/60"
                      }`}
                    >
                      {p.name}
                    </span>
                    <span className="text-[#C9A962] font-display text-lg">{p.score}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Sticky footer */}
          <div className="shrink-0 p-6 pt-4 bg-gradient-to-t from-[#1A1412] via-[#1A1412] to-transparent">
            <Button onClick={nextRound}>
              {rNum >= (rounds || players.length * 2) ? "Final Wisdom" : "Next Round"}
            </Button>
          </div>
        </div>
      );
    }
  }

  // ─── GAME OVER ───
  if (screen === "gameover") {
    const sorted = [...players].sort((a, b) => b.score - a.score);
    const champ = sorted[0];
    const totalPts = players.reduce((s, p) => s + p.score, 0);

    return (
      <div
        className="h-full flex flex-col"
        style={{
          background: "radial-gradient(ellipse at center top, #2D1F1A 0%, #1A1412 60%, #1A1412 100%)",
        }}
      >
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col items-center pt-4 mb-8">
            <div className="animate-float">
              <SacredLotus size={100} />
            </div>

            <p className="text-[#F5EFE0]/50 text-sm mt-6 mb-1">The Ultimate</p>
            <p className="font-display text-2xl text-[#C9A962]">Wisdom Seeker</p>
            <p className="font-display text-4xl text-[#E8D5A3] mt-2">{champ.name}</p>
            <p className="text-[#C9A962] text-xl mt-2">{champ.score} points</p>
          </div>

          {/* Leaderboard */}
          <div className="space-y-3 mb-6">
            {sorted.map((p, i) => {
              const pct = totalPts ? Math.round((p.score / totalPts) * 100) : 0;
              const medals = ["🥇", "🥈", "🥉"];
              return (
                <div
                  key={p.name}
                  className={`rounded-2xl p-4 ${
                    i === 0
                      ? "bg-[#C9A962]/10 border border-[#C9A962]/30"
                      : "bg-[#2D1F1A]/50 border border-[#C9A962]/10"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl w-8">{medals[i] || `#${i + 1}`}</span>
                    <span
                      className={`flex-1 font-medium ${i === 0 ? "text-[#C9A962]" : "text-[#E8D5A3]/80"}`}
                    >
                      {p.name}
                    </span>
                    <span className="text-[#C9A962] font-display text-xl">{p.score}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-[#2D1F1A] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: i === 0 ? "#C9A962" : "#6B2D3C",
                        }}
                      />
                    </div>
                    <span className="text-[#F5EFE0]/40 text-xs">
                      {p.wins} {p.wins === 1 ? "win" : "wins"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { v: gameStats.roundsPlayed, l: "Rounds" },
              { v: players.length, l: "Seekers" },
              { v: mode === "advanced" ? "Depth" : "Simple", l: "Mode" },
            ].map((s, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-[#2D1F1A]/40 border border-[#C9A962]/10">
                <div className="text-[#C9A962] font-display text-xl">{s.v}</div>
                <div className="text-[#F5EFE0]/40 text-xs mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky footer */}
        <div className="shrink-0 p-6 pt-4 bg-gradient-to-t from-[#1A1412] via-[#1A1412] to-transparent">
          <div className="space-y-3">
            <Button
              onClick={() => {
                setPlayers(players.map((p) => ({ ...p, score: 0, wins: 0 })));
                setScreen("settings");
              }}
            >
              Journey Again
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setScreen("home");
                setPlayers([]);
                setNames(["", "", ""]);
              }}
            >
              New Gathering
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
