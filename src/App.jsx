import { useState, useRef } from "react";
import { SCENARIOS } from "./data/scenarios";
import { WISDOM } from "./data/wisdom";
import { CATEGORIES, CATEGORY_NAMES } from "./data/categories";
import { shuffle, draw, getGurus, loadHistory, saveHistory, hasSeenRules } from "./utils/helpers";
import { SacredLotus, SacredDivider } from "./components/Patterns";
import { Button, IconButton } from "./components/Button";
import { Rules } from "./components/Rules";
import { ScenarioCard, WisdomCard } from "./components/FlipCard";
import { GameScreen, ScoreChips, CenteredMessage, TimerBar } from "./components/GameScreen";

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
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [speedWisdom, setSpeedWisdom] = useState(false);
  const [reflectiveMode, setReflectiveMode] = useState(false);
  const [guruReady, setGuruReady] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [showHindi, setShowHindi] = useState(false); // Synchronized flip state for cards
  const [selectedCardIdx, setSelectedCardIdx] = useState(null); // Selected card in guruTurn
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
    setGuruReady(false);
    setTimerActive(false);
    setTimerSeconds(60);
    setShowHindi(false);
    setSelectedCardIdx(null);
  };

  const confirmCardSelection = () => {
    if (selectedCardIdx === null) return;
    const ci = selectedCardIdx;
    const gpi = gOrder.current[gIdx];
    const card = hands[gpi][ci];
    setHands((h) => h.map((hand, i) => (i === gpi ? hand.filter((_, j) => j !== ci) : hand)));
    setWDis((p) => [...p, card]);
    setSels((p) => ({ ...p, [gpi]: card }));
    setShowHindi(false); // Reset flip state when moving to next guru
    setSelectedCardIdx(null); // Reset selection
    if (gIdx < gOrder.current.length - 1) {
      setGIdx((p) => p + 1);
      setPhase("passing");
    } else {
      setRIdx(0);
      setGuruReady(false);
      setTimerActive(false);
      setTimerSeconds(60);
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
            Bring the Gita to your living room — one round, one verse, one conversation at a time.
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

          <p className="text-[#F5EFE0]/30 text-xs mt-4">A satsang for 3–8 Seekers</p>
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
    const GITA_CHARACTERS = {
      "Arjuna": "The warrior prince who seeks guidance",
      "Krishna": "The divine charioteer and teacher",
      "Draupadi": "The queen of unwavering faith",
      "Bhishma": "The grandsire bound by his vow",
      "Vidura": "The wise minister of dharma",
      "Yudhishthira": "The king who never spoke untruth",
      "Gandhari": "The blindfolded queen of sacrifice",
      "Kunti": "The mother who knew divine secrets",
      "Karna": "The generous warrior of tragic fate",
      "Sanjaya": "The narrator with divine sight",
      "Nakula": "The twin skilled in horse lore",
      "Sahadeva": "The twin who knew the future",
    };

    const add = () => {
      if (names.length < 8) setNames([...names, ""]);
    };
    const rm = (i) => {
      if (names.length > 3) setNames(names.filter((_, j) => j !== i));
    };
    const autoFill = () => {
      const charNames = Object.keys(GITA_CHARACTERS);
      const shuffled = [...charNames].sort(() => Math.random() - 0.5);
      setNames(shuffled.slice(0, names.length));
    };
    const shuffleOrder = () => {
      const shuffled = [...names].sort(() => Math.random() - 0.5);
      setNames(shuffled);
    };
    const getCharacterBio = (name) => GITA_CHARACTERS[name] || null;
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

          <div className="flex items-center justify-between mb-2">
            <h2 className="font-display text-2xl text-[#C9A962]">The Seekers</h2>
            <button
              onClick={autoFill}
              className="text-xs px-3 py-1.5 rounded-full border border-[#C9A962]/30 text-[#C9A962]/70 hover:text-[#C9A962] hover:border-[#C9A962]/50 transition-colors"
            >
              ✦ Suggest Names
            </button>
          </div>
          <p className="text-[#F5EFE0]/50 text-sm mb-6">Gather 3 to 8 souls for this journey</p>

          <div className="space-y-3 mb-4">
            {names.map((n, i) => {
              const bio = getCharacterBio(n);
              return (
                <div key={i}>
                  <div className="flex items-center gap-3">
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
                  {bio && (
                    <p className="text-[#C9A962]/50 text-xs ml-9 mt-1 italic">
                      ℹ {bio}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 mb-5">
            {names.length < 8 && (
              <button
                onClick={add}
                className="flex-1 py-3 rounded-xl border border-dashed border-[#C9A962]/30 text-[#C9A962]/60 hover:border-[#C9A962]/50 hover:text-[#C9A962] transition-colors text-sm"
              >
                + Add Seeker
              </button>
            )}
            {names.filter(n => n.trim()).length >= 2 && (
              <button
                onClick={shuffleOrder}
                className="py-3 px-4 rounded-xl border border-[#C9A962]/20 text-[#C9A962]/50 hover:border-[#C9A962]/40 hover:text-[#C9A962]/80 transition-colors text-sm"
              >
                🎲 Shuffle Order
              </button>
            )}
          </div>
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

    // Apply preset settings (doesn't start game immediately anymore)
    const selectPreset = (presetKey, presetMode, presetRounds, presetCats, scoreFilter = null) => {
      setSelectedPreset(presetKey);
      setMode(presetMode);
      setRounds(presetRounds);
      setCats(new Set(presetCats));
      setShowCustom(false);
    };

    // Start game with current settings
    const startWithSettings = () => {
      // Filter scenarios by category and optionally by score (for kid-friendly)
      let filteredScenarios = SCENARIOS.filter((s) => cats.has(s.cat));
      if (selectedPreset === "kids") {
        filteredScenarios = filteredScenarios.filter((s) => s.score <= 2);
      }
      filteredScenarios = shuffle(filteredScenarios);

      const sw = shuffle([...WISDOM]);
      let wd = [...sw], wdi = [];
      const h = players.map(() => {
        const r = draw(wd, wdi, 5);
        wd = r.deck;
        wdi = r.discard;
        return r.drawn;
      });

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
      setGameStats({ roundsPlayed: 0, catsUsed: [...cats] });
      setScreen("game");
    };

    const presets = [
      {
        key: "quick",
        label: "Quick Game",
        desc: "Simple scoring, 1 point per round",
        icon: "⚡",
        color: "#EAB308", // Yellow - Relationships
        mode: "simple",
        rounds: players.length,
        cats: ["Personal Dilemmas", "Relationship Situations", "Mind & Emotions", "Family & Parenting"],
      },
      {
        key: "kids",
        label: "Kid Friendly",
        desc: "Easy scenarios, simple rules",
        icon: "🌟",
        color: "#DB2777", // Pink - Family
        mode: "simple",
        rounds: Math.max(players.length, Math.min(players.length * 2, 8)),
        cats: ["Personal Dilemmas", "Relationship Situations", "Family & Parenting", "Mind & Emotions"],
      },
      {
        key: "deep",
        label: "Deep Contemplation",
        desc: "Advanced scoring (1-5 pts), profound themes",
        icon: "🪷",
        color: "#0D9488", // Teal - Spiritual
        mode: "advanced",
        rounds: players.length * 3,
        cats: ["Moral/Ethical Decisions", "Spiritual Growth", "Mind & Emotions", "Social Responsibility", "Wealth & Simplicity"],
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
          <p className="text-[#F5EFE0]/40 text-sm italic mb-6">How deep will you go?</p>

          {/* Preset Modes */}
          <div className="space-y-3 mb-4">
            {presets.map((p) => {
              const isSelected = selectedPreset === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => selectPreset(p.key, p.mode, p.rounds, p.cats)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left active:scale-[0.98] ${
                    isSelected
                      ? "border-[#C9A962] bg-[#C9A962]/10"
                      : "border-[#C9A962]/15 bg-[#2D1F1A]/40 hover:border-[#C9A962]/30"
                  }`}
                  style={isSelected ? { boxShadow: `0 0 20px ${p.color}20` } : {}}
                >
                  {/* Radio indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      isSelected ? "border-[#C9A962] bg-[#C9A962]" : "border-[#C9A962]/40"
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-[#1A1412]" />}
                  </div>
                  <span className="text-2xl">{p.icon}</span>
                  <div className="flex-1">
                    <span className="block text-[#E8D5A3] font-medium">{p.label}</span>
                    <span className="block text-[#F5EFE0]/40 text-xs mt-0.5">{p.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#C9A962]/15" />
            <span className="text-[#C9A962]/30 text-xs">or</span>
            <div className="flex-1 h-px bg-[#C9A962]/15" />
          </div>

          {/* Custom toggle */}
          <button
            onClick={() => {
              setShowCustom(!showCustom);
              if (!showCustom) setSelectedPreset(null);
            }}
            className={`w-full text-center text-sm py-3 transition-colors rounded-xl border ${
              showCustom || !selectedPreset
                ? "text-[#C9A962] border-[#C9A962]/30 bg-[#C9A962]/5"
                : "text-[#C9A962]/60 border-transparent hover:text-[#C9A962]"
            }`}
          >
            {showCustom ? "Hide custom options ▲" : "Customize settings ▼"}
          </button>

          {/* Custom Settings */}
          {showCustom && (
            <div className="mt-4 pt-4 border-t border-[#C9A962]/15">
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

              <p className="text-center text-[#F5EFE0]/30 text-xs mb-4">
                {scenarioCount} scenarios available
              </p>
            </div>
          )}

          {/* Game Variants - Always visible */}
          <div className="mt-4 pt-4 border-t border-[#C9A962]/10">
            <p className="text-[#E8D5A3] text-sm font-medium mb-3">Game Variants</p>

            {/* Speed Wisdom Toggle */}
            <button
              onClick={() => setSpeedWisdom(!speedWisdom)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border mb-2 transition-all ${
                speedWisdom
                  ? "border-[#C9A962]/40 bg-[#C9A962]/10"
                  : "border-[#C9A962]/15 bg-[#2D1F1A]/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">⏱</span>
                <div className="text-left">
                  <span className={`block text-sm ${speedWisdom ? "text-[#E8D5A3]" : "text-[#F5EFE0]/60"}`}>
                    Speed Wisdom
                  </span>
                  <span className="block text-[#F5EFE0]/40 text-xs">30-second timer for explanations</span>
                </div>
              </div>
              <div
                className={`w-10 h-6 rounded-full p-1 transition-all ${
                  speedWisdom ? "bg-[#C9A962]" : "bg-[#2D1F1A]"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    speedWisdom ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </div>
            </button>

            {/* Reflective Mode Toggle */}
            <button
              onClick={() => setReflectiveMode(!reflectiveMode)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                reflectiveMode
                  ? "border-[#C9A962]/40 bg-[#C9A962]/10"
                  : "border-[#C9A962]/15 bg-[#2D1F1A]/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🧘</span>
                <div className="text-left">
                  <span className={`block text-sm ${reflectiveMode ? "text-[#E8D5A3]" : "text-[#F5EFE0]/60"}`}>
                    Reflective Mode
                  </span>
                  <span className="block text-[#F5EFE0]/40 text-xs">No scoring, just sharing wisdom</span>
                </div>
              </div>
              <div
                className={`w-10 h-6 rounded-full p-1 transition-all ${
                  reflectiveMode ? "bg-[#C9A962]" : "bg-[#2D1F1A]"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    reflectiveMode ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="shrink-0 p-6 pt-4 bg-gradient-to-t from-[#1A1412] via-[#1A1412] to-transparent">
          <Button
            onClick={startWithSettings}
            disabled={!selectedPreset && !showCustom}
          >
            {selectedPreset
              ? `Begin ${presets.find(p => p.key === selectedPreset)?.label}`
              : "Enter the GitaVerse"
            }
          </Button>
          {!selectedPreset && !showCustom && (
            <p className="text-center text-[#F5EFE0]/40 text-xs mt-3">
              Select a path or customize settings to begin
            </p>
          )}
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
      // Compact scores for top bar - show leader or tied scores
      const maxScore = Math.max(...players.map(p => p.score));
      const leaders = players.filter(p => p.score === maxScore);
      const scoreDisplay = maxScore === 0
        ? `${players.length} players`
        : leaders.length === 1
          ? `${leaders[0].name}: ${maxScore} pts`
          : `Tied at ${maxScore}`;

      return (
        <GameScreen
          roundInfo={`Round ${rNum} of ${mr}`}
          topRightContent={scoreDisplay}
          title="The Seeker Speaks"
          instruction={`${seeker.name}, read the dilemma aloud`}
          contentCentered
          primaryAction={{ label: "Summon the Gurus", onClick: () => setPhase("passing") }}
        >
          {/* Scenario Card - centered with breathing room */}
          <ScenarioCard
            scenario={curS}
            category={cfg}
            mode={mode}
            syncFlipped={showHindi}
            onFlipChange={setShowHindi}
            showFlipHint
          />
        </GameScreen>
      );
    }

    // Passing Phase
    if (phase === "passing") {
      const gpi = gOrder.current[gIdx];
      const guru = players[gpi];
      return (
        <GameScreen
          roundInfo={`Round ${rNum} of ${mr}`}
          topRightContent={`Guru ${gIdx + 1} of ${gOrder.current.length}`}
          title="Gurus Contemplate"
          instruction="Pass the phone privately to each Guru"
          contentCentered
          primaryAction={{ label: `I am ${guru.name}`, onClick: () => setPhase("guruTurn") }}
        >
          <div className="animate-breathe mb-6">
            <SacredLotus size={100} />
          </div>
          <CenteredMessage
            title={guru.name}
            subtitle="Pass the phone to this Guru"
          />
        </GameScreen>
      );
    }

    // Guru Turn
    if (phase === "guruTurn") {
      const gpi = gOrder.current[gIdx];
      const guru = players[gpi];
      const hand = hands[gpi];
      return (
        <GameScreen
          roundInfo={`Round ${rNum} of ${mr}`}
          topRightContent={`${guru.name}'s Hand`}
          title="Gurus Contemplate"
          instruction="Select one wisdom card from your hand"
          primaryAction={selectedCardIdx !== null ? {
            label: "Play This Card",
            onClick: confirmCardSelection
          } : null}
        >
          {/* Scenario card - controls flip for all cards */}
          <div className="mb-4">
            <ScenarioCard
              scenario={curS}
              category={cfg}
              mode={mode}
              size="hand"
              syncFlipped={showHindi}
              onFlipChange={setShowHindi}
              showFlipHint
            />
          </div>

          {/* Divider with instruction */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-[#C9A962]/20" />
            <span className="text-[#C9A962]/60 text-xs uppercase tracking-wider">Choose your response</span>
            <div className="flex-1 h-px bg-[#C9A962]/20" />
          </div>

          {/* Wisdom cards - follow scenario card's flip state */}
          <div className="space-y-3">
            {hand.map((card, i) => (
              <WisdomCard
                key={card.id}
                wisdom={card}
                isSelectable={true}
                isSelected={selectedCardIdx === i}
                size="hand"
                onClick={() => setSelectedCardIdx(selectedCardIdx === i ? null : i)}
                syncFlipped={showHindi}
              />
            ))}
          </div>
        </GameScreen>
      );
    }

    // Reflect Phase
    if (phase === "reflect") {
      const rgi = gOrder.current[rIdx];
      const rg = players[rgi];
      const rc = sels[rgi];

      // Privacy mask - Guru must confirm they're ready before card is revealed
      if (!guruReady) {
        return (
          <GameScreen
            roundInfo={`Round ${rNum} of ${mr}`}
            topRightContent={`${rIdx + 1} of ${gOrder.current.length} Gurus`}
            title="Wisdom Revealed"
            instruction="Hand the phone to the Guru who will share"
            contentCentered
            primaryAction={{
              label: "I'm Ready to Share",
              onClick: () => {
                setGuruReady(true);
                if (speedWisdom) {
                  setTimerActive(true);
                  setTimerSeconds(60);
                }
              }
            }}
          >
            <div className="w-20 h-20 rounded-full bg-[#6B2D3C]/40 border-2 border-[#C9A962]/40 flex items-center justify-center mb-4">
              <span className="font-display text-3xl text-[#C9A962]">{rg.name[0]}</span>
            </div>
            <CenteredMessage
              title={rg.name}
              subtitle="Tap when ready to reveal your wisdom"
            />
            <div className="mt-6 p-4 rounded-xl bg-[#2D1F1A]/60 border border-[#C9A962]/15 max-w-xs">
              <p className="text-[#F5EFE0]/50 text-xs text-center">
                Your card will be revealed. Explain how it addresses the Seeker's dilemma.
              </p>
            </div>
          </GameScreen>
        );
      }

      // Card revealed - Guru explains their wisdom
      const handleNextGuru = () => {
        setGuruReady(false);
        setTimerActive(false);
        setTimerSeconds(60);
        setShowHindi(false);
        if (rIdx < gOrder.current.length - 1) {
          setRIdx((p) => p + 1);
        } else {
          setPhase("seekerPick");
        }
      };

      return (
        <GameScreen
          roundInfo={`Round ${rNum} of ${mr}`}
          topRightContent={`${rIdx + 1} of ${gOrder.current.length} Gurus`}
          title="Wisdom Revealed"
          instruction={`${rg.name}, explain how this wisdom addresses the dilemma`}
          primaryAction={{
            label: rIdx < gOrder.current.length - 1 ? "Hear Next Guru" : "Pass to Seeker",
            onClick: handleNextGuru
          }}
        >
          {/* Speed Wisdom Timer */}
          {speedWisdom && timerActive && (
            <TimerBar
              seconds={timerSeconds}
              maxSeconds={60}
              onTick={(s) => setTimerSeconds(s)}
              onComplete={handleNextGuru}
            />
          )}

          {/* Scenario reminder - controls flip for all cards */}
          <div className="mb-4">
            <ScenarioCard
              scenario={curS}
              category={cfg}
              mode={mode}
              size="hand"
              syncFlipped={showHindi}
              onFlipChange={setShowHindi}
              showFlipHint
            />
          </div>

          {/* Wisdom card with guru name - follows scenario flip */}
          <WisdomCard wisdom={rc} isSelectable={false} size="full" guruName={rg.name} syncFlipped={showHindi} />
        </GameScreen>
      );
    }

    // Seeker Pick
    if (phase === "seekerPick") {
      return (
        <GameScreen
          roundInfo={`Round ${rNum} of ${mr}`}
          topRightContent={`${seeker.name}'s choice`}
          title="Seeker's Choice"
          instruction="Whose wisdom resonated most? Tap to award the round"
        >
          {/* Scenario reminder - controls flip for all cards */}
          <div className="mb-4">
            <ScenarioCard
              scenario={curS}
              category={cfg}
              mode={mode}
              size="hand"
              syncFlipped={showHindi}
              onFlipChange={setShowHindi}
              showFlipHint
            />
          </div>

          {/* Guru wisdom cards - follow scenario flip */}
          <div className="space-y-3">
            {gOrder.current.map((gi) => {
              const g = players[gi];
              const card = sels[gi];
              return (
                <WisdomCard
                  key={gi}
                  wisdom={card}
                  isSelectable={true}
                  size="review"
                  guruName={g.name}
                  onClick={() => pickWinner(gi)}
                  syncFlipped={showHindi}
                />
              );
            })}
          </div>
        </GameScreen>
      );
    }

    // Score Update
    if (phase === "scoreUpdate") {
      const wp = players[winner];
      const pts = mode === "advanced" ? curS.score : 1;
      return (
        <GameScreen
          roundInfo={`Round ${rNum} of ${mr}`}
          topRightContent={`+${pts} ${pts === 1 ? "point" : "points"}`}
          title="Round Complete"
          instruction={`${wp.name} wins this round with the wisest counsel`}
          contentCentered
          primaryAction={{
            label: rNum >= (rounds || players.length * 2) ? "Final Wisdom" : "Next Round",
            onClick: nextRound
          }}
        >
          <div className="animate-breathe mb-4">
            <SacredLotus size={80} />
          </div>

          <CenteredMessage
            title={wp.name}
            subtitle="Wisest Guru"
          />

          {/* Standings */}
          <div className="w-full max-w-xs space-y-2 mt-6">
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
        </GameScreen>
      );
    }
  }

  // ─── GAME OVER ───
  if (screen === "gameover") {
    const sorted = [...players].sort((a, b) => b.score - a.score);
    const champ = sorted[0];
    const totalPts = players.reduce((s, p) => s + p.score, 0);

    return (
      <GameScreen
        roundInfo={`${gameStats.roundsPlayed} rounds played`}
        topRightContent={mode === "advanced" ? "Advanced" : "Simple"}
        title="Journey Complete"
        instruction={`${champ.name} emerges as the Ultimate Wisdom Seeker`}
        primaryAction={{
          label: "Journey Again",
          onClick: () => {
            setPlayers(players.map((p) => ({ ...p, score: 0, wins: 0 })));
            setScreen("settings");
          }
        }}
        secondaryAction={{
          label: "New Gathering",
          onClick: () => {
            setScreen("home");
            setPlayers([]);
            setNames(["", "", ""]);
          }
        }}
      >
        {/* Champion display */}
        <div className="flex flex-col items-center mb-6">
          <div className="animate-float mb-4">
            <SacredLotus size={80} />
          </div>
          <p className="font-display text-3xl text-[#E8D5A3]">{champ.name}</p>
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
      </GameScreen>
    );
  }

  return null;
}
