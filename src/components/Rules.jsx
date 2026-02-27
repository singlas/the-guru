import { useState } from "react";
import { markRulesSeen } from "../utils/helpers";

const BG = "linear-gradient(180deg,#1B1B2F,#162447)";
const BTN = "linear-gradient(135deg,#F59E0B,#D97706)";

export function Rules({ onDone }) {
  const [page, setPage] = useState(0);

  const pages = [
    {
      title: "Welcome",
      body: (
        <div className="space-y-4">
          <p className="text-slate-300 text-sm leading-relaxed">
            The Guru is a card game where ancient wisdom meets modern life. Players take turns as{" "}
            <span className="text-amber-400 font-semibold">Seekers</span> presenting real-world
            dilemmas. The other players — the{" "}
            <span className="text-amber-400 font-semibold">Wise Gurus</span> — respond using wisdom
            cards from the Bhagavad Gita.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            No prior knowledge of the Gita is needed. Just a willingness to think, listen, and have
            fun with family and friends.
          </p>
          <div className="flex items-center gap-3 mt-4 p-3 rounded-lg bg-slate-800/40">
            <span className="text-2xl">3–8</span>
            <span className="text-slate-400 text-sm">Players</span>
            <span className="text-2xl ml-4">20'</span>
            <span className="text-slate-400 text-sm">Average game</span>
          </div>
        </div>
      ),
    },
    {
      title: "How It Works",
      body: (
        <div className="space-y-3">
          {[
            ["1", "The Seeker draws a scenario card and reads it aloud to the group."],
            ["2", "Phone is passed to each Guru privately. They pick one wisdom card from their hand of 5."],
            ["3", "All picks are revealed. Each Guru verbally explains how their chosen wisdom solves the dilemma."],
            ["4", "The Seeker awards the round to the Guru with the most insightful response."],
          ].map(([num, text]) => (
            <div key={num} className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm font-bold shrink-0">
                {num}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Scoring",
      body: (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-slate-800/40">
            <p className="text-amber-400 text-sm font-semibold mb-1">Simple Mode</p>
            <p className="text-slate-300 text-sm">Each scenario won = 1 point. Most points wins.</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/40">
            <p className="text-amber-400 text-sm font-semibold mb-1">Advanced Mode (Scored)</p>
            <p className="text-slate-300 text-sm">
              Each scenario has a difficulty score (1–5 points). Harder dilemmas are worth more.
              Total points wins.
            </p>
          </div>
          <div className="grid grid-cols-5 gap-1 mt-2">
            {[
              { s: 1, l: "Easy", c: "#6EE7B7" },
              { s: 2, l: "Simple", c: "#A7F3D0" },
              { s: 3, l: "Medium", c: "#FCD34D" },
              { s: 4, l: "Hard", c: "#FCA5A5" },
              { s: 5, l: "Deep", c: "#F87171" },
            ].map((x) => (
              <div key={x.s} className="text-center p-2 rounded-lg" style={{ background: x.c + "20" }}>
                <div className="text-lg font-bold" style={{ color: x.c }}>
                  {x.s}
                </div>
                <div className="text-xs text-slate-400">{x.l}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Tips",
      body: (
        <div className="space-y-3">
          {[
            "✨ There's no 'correct' answer. The Seeker picks whoever resonates most with them.",
            "🔄 Wisdom cards get recycled when the deck runs out, so the same verse can appear in new contexts.",
            "🎭 Try the 'Anonymous' variant: Gurus submit cards face-down so the Seeker doesn't know who played what.",
            "⏱️ For faster games, set a 30-second limit for Guru explanations.",
            "💡 The game is most fun when Gurus get creative with how they connect the wisdom to the scenario.",
          ].map((text, i) => (
            <p key={i} className="text-slate-300 text-sm leading-relaxed">
              {text}
            </p>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-5 flex flex-col" style={{ background: BG }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-amber-400" style={{ fontFamily: "Georgia,serif" }}>
          {pages[page].title}
        </h2>
        <div className="flex gap-1">
          {pages.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i === page ? "bg-amber-400" : "bg-slate-700"}`}
            />
          ))}
        </div>
      </div>
      <div className="flex-1">{pages[page].body}</div>
      <div className="flex gap-3 mt-6">
        {page > 0 && (
          <button
            onClick={() => setPage(page - 1)}
            className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400"
          >
            Back
          </button>
        )}
        {page < pages.length - 1 ? (
          <button
            onClick={() => setPage(page + 1)}
            className="flex-1 py-4 rounded-xl text-lg font-semibold text-slate-900"
            style={{ background: BTN }}
          >
            Next
          </button>
        ) : (
          <button
            onClick={() => {
              markRulesSeen();
              onDone();
            }}
            className="flex-1 py-4 rounded-xl text-lg font-semibold text-slate-900"
            style={{ background: BTN }}
          >
            Got it, let's play!
          </button>
        )}
      </div>
    </div>
  );
}
