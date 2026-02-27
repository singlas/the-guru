import { useState } from "react";
import { markRulesSeen } from "../utils/helpers";
import { Button } from "./Button";
import { SacredLotus, SacredDivider } from "./Patterns";

export function Rules({ onDone }) {
  const [page, setPage] = useState(0);

  const pages = [
    {
      title: "Welcome",
      body: (
        <div className="space-y-6">
          <p className="text-[#F5EFE0]/80 leading-relaxed">
            <span className="font-display text-xl text-[#E8D5A3]">GitaVerse</span> is a card game
            where ancient wisdom meets modern life. Players take turns as{" "}
            <span className="text-[#C9A962] font-medium">Seekers</span> presenting real-world
            dilemmas while{" "}
            <span className="text-[#C9A962] font-medium">Wise Gurus</span> respond with
            teachings from the Bhagavad Gita.
          </p>
          <p className="text-[#F5EFE0]/60 leading-relaxed">
            No prior knowledge of the Gita is needed. Just a willingness to think, listen, and
            share wisdom with family and friends.
          </p>
          <div className="flex items-center justify-center gap-8 mt-8 py-5 rounded-2xl bg-[#2D1F1A]/40 border border-[#C9A962]/10">
            <div className="text-center">
              <span className="font-display text-3xl text-[#C9A962]">3–8</span>
              <p className="text-[#F5EFE0]/50 text-sm mt-1">Players</p>
            </div>
            <div className="w-px h-10 bg-[#C9A962]/20" />
            <div className="text-center">
              <span className="font-display text-3xl text-[#C9A962]">~20</span>
              <p className="text-[#F5EFE0]/50 text-sm mt-1">Minutes</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "The Path",
      body: (
        <div className="space-y-5">
          {[
            {
              num: "१",
              title: "The Seeker Speaks",
              desc: "Draw a scenario card and read your dilemma aloud to the group.",
            },
            {
              num: "२",
              title: "Gurus Contemplate",
              desc: "Pass the phone to each Guru privately. They select one wisdom card from their hand.",
            },
            {
              num: "३",
              title: "Wisdom Revealed",
              desc: "Each Guru shares their chosen verse and explains how it addresses the dilemma.",
            },
            {
              num: "४",
              title: "Seeker's Choice",
              desc: "Award the round to the Guru whose wisdom resonated most deeply.",
            },
          ].map(({ num, title, desc }, i) => (
            <div
              key={i}
              className="flex gap-4 items-start p-4 rounded-xl bg-[#2D1F1A]/30 border border-[#C9A962]/10"
            >
              <div className="w-10 h-10 rounded-full bg-[#6B2D3C]/40 border border-[#C9A962]/30 flex items-center justify-center text-[#C9A962] font-display text-lg shrink-0">
                {num}
              </div>
              <div>
                <p className="text-[#E8D5A3] font-medium mb-1">{title}</p>
                <p className="text-[#F5EFE0]/60 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Scoring",
      body: (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#2D1F1A]/40 border border-[#C9A962]/15">
            <p className="text-[#C9A962] font-display text-lg mb-2">Simple Mode</p>
            <p className="text-[#F5EFE0]/70 text-sm leading-relaxed">
              Each scenario won earns 1 point. The player with the most points at the end
              becomes the ultimate Wisdom Seeker.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#2D1F1A]/40 border border-[#C9A962]/15">
            <p className="text-[#C9A962] font-display text-lg mb-2">Advanced Mode</p>
            <p className="text-[#F5EFE0]/70 text-sm leading-relaxed mb-4">
              Each scenario has a depth score from 1 to 5. Deeper dilemmas reward more points.
            </p>
            <div className="flex justify-between gap-2">
              {[
                { s: 1, l: "Light" },
                { s: 2, l: "Clear" },
                { s: 3, l: "Deep" },
                { s: 4, l: "Profound" },
                { s: 5, l: "Sacred" },
              ].map((x) => (
                <div
                  key={x.s}
                  className="flex-1 text-center py-3 rounded-xl bg-[#6B2D3C]/20 border border-[#C9A962]/10"
                >
                  <div className="font-display text-xl text-[#C9A962]">{x.s}</div>
                  <div className="text-[#F5EFE0]/40 text-xs mt-1">{x.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Wisdom",
      body: (
        <div className="space-y-4">
          {[
            "There is no 'correct' answer. The Seeker chooses whoever resonates most with their heart.",
            "Wisdom cards cycle back when the deck empties, allowing verses to find new contexts.",
            "Try playing anonymously — Gurus submit cards face-down so the Seeker judges wisdom alone.",
            "For swifter games, give Gurus 30 breaths to share their insight.",
            "The deepest joy comes when Gurus weave creative connections between ancient words and present moments.",
          ].map((text, i) => (
            <div
              key={i}
              className="flex gap-3 items-start"
            >
              <span className="text-[#C9A962]/60 mt-1.5">◆</span>
              <p className="text-[#F5EFE0]/70 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div
      className="h-full flex flex-col"
      style={{
        background: "linear-gradient(180deg, #1A1412 0%, #2D1F1A 50%, #1A1412 100%)",
      }}
    >
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-6 pb-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl text-[#C9A962]">{pages[page].title}</h2>
          <div className="flex gap-2">
            {pages.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === page ? "bg-[#C9A962] w-6" : "bg-[#C9A962]/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div>{pages[page].body}</div>
      </div>

      {/* Sticky footer */}
      <div className="shrink-0 p-6 bg-gradient-to-t from-[#1A1412] via-[#1A1412] to-transparent">
        <div className="flex gap-3">
          {page > 0 && (
            <Button variant="secondary" onClick={() => setPage(page - 1)} className="flex-1">
              Back
            </Button>
          )}
          {page < pages.length - 1 ? (
            <Button onClick={() => setPage(page + 1)} className="flex-1">
              Continue
            </Button>
          ) : (
            <Button
              onClick={() => {
                markRulesSeen();
                onDone();
              }}
              className="flex-1"
            >
              Begin the Journey
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
