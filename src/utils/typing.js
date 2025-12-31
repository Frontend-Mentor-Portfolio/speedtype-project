// Basic typing utilities for WPM, accuracy, diffing, and persistence

// Compute words per minute given correct characters and elapsed seconds
export function computeWPMRaw(correctChars, elapsedSeconds) {
  if (elapsedSeconds <= 0) return 0;
  const words = correctChars / 5;
  const minutes = elapsedSeconds / 60;
  return words / minutes;
}

export function computeWPM(correctChars, elapsedSeconds) {
  return Math.round(computeWPMRaw(correctChars, elapsedSeconds));
}

// Compute accuracy percentage
export function computeAccuracy(correctChars, incorrectChars) {
  const total = correctChars + incorrectChars;
  if (total === 0) return 100;
  return Math.round((correctChars / total) * 100);
}

// Compare typed input against the target text character-by-character
// Returns arrays of per-char statuses: 'correct' | 'incorrect' | 'pending'
export function diffCharacters(targetText, typedText) {
  const maxLen = Math.max(targetText.length, typedText.length);
  const statuses = [];
  let correct = 0;
  let incorrect = 0;

  for (let i = 0; i < maxLen; i++) {
    const t = targetText[i];
    const y = typedText[i];

    if (y === undefined) {
      statuses.push('pending');
    } else if (y === t) {
      statuses.push('correct');
      correct++;
    } else {
      statuses.push('incorrect');
      incorrect++;
    }
  }

  return { statuses, correct, incorrect };
}

// Personal best persistence
const PB_KEY = 'typing-pb-wpm';

export function loadPersonalBest() {
  const raw = localStorage.getItem(PB_KEY);
  return raw ? Number(raw) : null;
}

export function updatePersonalBest(wpm) {
  const current = loadPersonalBest();
  const EPS = 1e-9;
  if (current === null || wpm > current + EPS) {
    localStorage.setItem(PB_KEY, String(wpm));
    return { isNewBest: true, best: wpm };
  }
  return { isNewBest: false, best: current };
}