// Fisher-Yates shuffle
export const shuffle = (array) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// Draw cards from deck, recycling discard pile if needed
export const draw = (deck, discard, count) => {
  let d = [...deck];
  let di = [...discard];
  const drawn = [];

  for (let i = 0; i < count; i++) {
    if (!d.length) {
      d = shuffle(di);
      di = [];
    }
    if (d.length) {
      drawn.push(d.pop());
    }
  }

  return { drawn, deck: d, discard: di };
};

// Get guru indices for a round (everyone except seeker)
export const getGurus = (seekerIndex, playerCount) => {
  const gurus = [];
  for (let i = 1; i < playerCount; i++) {
    gurus.push((seekerIndex + i) % playerCount);
  }
  return gurus;
};

// Storage helpers
const HISTORY_KEY = "guru_history";
const RULES_KEY = "guru_rules_seen";

export const loadHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
};

export const saveHistory = (history) => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-20)));
  } catch {
    // Ignore storage errors
  }
};

export const hasSeenRules = () => {
  try {
    return localStorage.getItem(RULES_KEY) === "1";
  } catch {
    return false;
  }
};

export const markRulesSeen = () => {
  try {
    localStorage.setItem(RULES_KEY, "1");
  } catch {
    // Ignore storage errors
  }
};
