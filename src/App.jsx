import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { getRandomPrompt } from './data/prompts';
import {
  computeAccuracy,
  computeWPM,
  computeWPMRaw,
  diffCharacters,
  loadPersonalBest,
  updatePersonalBest,
} from './utils/typing';

import logoSmall from '../assets/images/logo-small.svg';
import iconPersonalBest from '../assets/images/icon-personal-best.svg';
import iconRestart from '../assets/images/icon-restart.svg';
import iconCompleted from '../assets/images/icon-completed.svg';
import iconNewPb from '../assets/images/icon-new-pb.svg';
import patternStar1 from '../assets/images/pattern-star-1.svg';
import patternStar2 from '../assets/images/pattern-star-2.svg';
import patternConfetti from '../assets/images/pattern-confetti.svg';

const TIMED_DEFAULT_SECONDS = 60;

function formatTime(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  if (seconds === 60) return '0:60';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function mapDifficultyToDataKey(difficulty) {
  if (difficulty === 'easy') return 'beginner';
  if (difficulty === 'medium') return 'intermediate';
  return 'advanced';
}

function mapTextCategoryToTags(textCategory) {
  if (textCategory === 'quotes') return ['quote'];
  if (textCategory === 'lyrics') return ['lyrics'];
  if (textCategory === 'code') return ['code'];
  return undefined;
}

function formatKeyLabel(code, fallback) {
  if (code === 'Space') return 'Space';
  if (code === 'Backspace') return 'Bksp';
  if (code === 'Enter') return 'Enter';
  if (code === 'Tab') return 'Tab';
  if (code === 'CapsLock') return 'Caps';
  if (code === 'ShiftLeft' || code === 'ShiftRight') return 'Shift';
  if (code === 'ControlLeft' || code === 'ControlRight') return 'Ctrl';
  if (code === 'AltLeft' || code === 'AltRight') return 'Alt';
  if (code === 'MetaLeft' || code === 'MetaRight') return 'Meta';
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  return fallback ?? code;
}

function isPrintableKeyEvent(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return false;
  return typeof e.key === 'string' && e.key.length === 1;
}

function getCategoryLabel(textCategory) {
  if (textCategory === 'quotes') return 'Quotes';
  if (textCategory === 'lyrics') return 'Lyrics';
  if (textCategory === 'code') return 'Code';
  return 'All';
}

function formatCardDate(d = new Date()) {
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}

async function canvasToBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/png');
  });
}

async function generateShareCardPngBlob({
  wpm,
  accuracy,
  correctChars,
  incorrectChars,
  mode,
  timedSeconds,
  elapsedSeconds,
  category,
  personalBest,
}) {
  const width = 1080;
  const height = 566;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#0b0b0b');
  bg.addColorStop(0.55, '#101827');
  bg.addColorStop(1, '#0b0b0b');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.fillRect(60, 60, width - 120, height - 120);

  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 60, width - 120, height - 120);

  ctx.fillStyle = 'rgba(46, 156, 255, 0.85)';
  ctx.fillRect(60, 60, 8, height - 120);

  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.font = '800 44px system-ui, -apple-system, Segoe UI, Roboto, Arial';
  ctx.fillText('Typing Speed Test', 92, 140);

  ctx.fillStyle = 'rgba(255,255,255,0.70)';
  ctx.font = '700 22px system-ui, -apple-system, Segoe UI, Roboto, Arial';
  const modeLabel = mode === 'timed' ? `Timed (${timedSeconds}s)` : 'Passage';
  ctx.fillText(`${modeLabel} • ${category} • ${formatCardDate()}`, 92, 182);

  const cards = [
    { label: 'WPM', value: String(wpm) },
    { label: 'Accuracy', value: `${accuracy}%` },
    { label: 'Time', value: `${elapsedSeconds}s` },
    { label: 'Best', value: `${personalBest} WPM` },
  ];

  const cardTop = 230;
  const cardW = 220;
  const cardH = 150;
  const gap = 24;
  const left = 92;
  for (let i = 0; i < cards.length; i++) {
    const x = left + i * (cardW + gap);
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.fillRect(x, cardTop, cardW, cardH);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, cardTop, cardW, cardH);

    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    ctx.font = '800 18px system-ui, -apple-system, Segoe UI, Roboto, Arial';
    ctx.fillText(cards[i].label, x + 18, cardTop + 38);

    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.font = '900 44px system-ui, -apple-system, Segoe UI, Roboto, Arial';
    ctx.fillText(cards[i].value, x + 18, cardTop + 104);
  }

  ctx.fillStyle = 'rgba(255,255,255,0.70)';
  ctx.font = '700 20px system-ui, -apple-system, Segoe UI, Roboto, Arial';
  ctx.fillText(`Characters: ${correctChars} correct / ${incorrectChars} incorrect`, 92, 460);

  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = '700 18px system-ui, -apple-system, Segoe UI, Roboto, Arial';
  ctx.fillText('frontendmentor.io • share your progress', 92, 500);

  return await canvasToBlob(canvas);
}

function App() {
  const inputRef = useRef(null);
  const pbAtStartRef = useRef(null);
  const shareMenuRef = useRef(null);

  const [difficulty, setDifficulty] = useState('easy');
  const [mode, setMode] = useState('timed');
  const [timedSeconds, setTimedSeconds] = useState(TIMED_DEFAULT_SECONDS);
  const [textCategory, setTextCategory] = useState('all');

  const [isDifficultyMenuOpen, setIsDifficultyMenuOpen] = useState(false);
  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);
  const [isTimedMenuOpen, setIsTimedMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isCategoryDesktopMenuOpen, setIsCategoryDesktopMenuOpen] = useState(false);

  const [targetText, setTargetText] = useState('');
  const [typedText, setTypedText] = useState('');
  const [totalIncorrect, setTotalIncorrect] = useState(0);

  const [isRunning, setIsRunning] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  const [timeRemaining, setTimeRemaining] = useState(TIMED_DEFAULT_SECONDS);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const [personalBest, setPersonalBest] = useState(0);
  const [resultVariant, setResultVariant] = useState('complete');

  const [keyStats, setKeyStats] = useState({});
  const [heatmapMode, setHeatmapMode] = useState('frequency');

  const [isHeatmapMobile, setIsHeatmapMobile] = useState(() => {
    try {
      return window.matchMedia && window.matchMedia('(max-width: 560px)').matches;
    } catch {
      return false;
    }
  });

  const [shareBlobUrl, setShareBlobUrl] = useState('');
  const [isShareBusy, setIsShareBusy] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);

  useEffect(() => {
    if (
      !isDifficultyMenuOpen &&
      !isModeMenuOpen &&
      !isTimedMenuOpen &&
      !isCategoryMenuOpen &&
      !isCategoryDesktopMenuOpen &&
      !isShareMenuOpen
    )
      return;
    const onDocPointerDown = () => {
      setIsDifficultyMenuOpen(false);
      setIsModeMenuOpen(false);
      setIsTimedMenuOpen(false);
      setIsCategoryMenuOpen(false);
      setIsCategoryDesktopMenuOpen(false);
      setIsShareMenuOpen(false);
    };
    document.addEventListener('pointerdown', onDocPointerDown);
    return () => document.removeEventListener('pointerdown', onDocPointerDown);
  }, [
    isDifficultyMenuOpen,
    isModeMenuOpen,
    isTimedMenuOpen,
    isCategoryMenuOpen,
    isCategoryDesktopMenuOpen,
    isShareMenuOpen,
  ]);

  useEffect(() => {
    const pb = loadPersonalBest();
    const legacyRaw = localStorage.getItem('typingPersonalBest');
    const legacy = legacyRaw ? Number(legacyRaw) : null;

    if (pb === null && legacy !== null && Number.isFinite(legacy)) {
      updatePersonalBest(legacy);
      localStorage.removeItem('typingPersonalBest');
      setPersonalBest(legacy);
      return;
    }

    setPersonalBest(pb ?? 0);
  }, []);

  useEffect(() => {
    try {
      if (!window.matchMedia) return;
      const mql = window.matchMedia('(max-width: 560px)');
      const onChange = (e) => setIsHeatmapMobile(Boolean(e.matches));
      setIsHeatmapMobile(Boolean(mql.matches));
      if (mql.addEventListener) mql.addEventListener('change', onChange);
      else mql.addListener(onChange);
      return () => {
        if (mql.removeEventListener) mql.removeEventListener('change', onChange);
        else mql.removeListener(onChange);
      };
    } catch {
      return;
    }
  }, []);

  const pickNewPrompt = useCallback(
    (nextDifficulty = difficulty) => {
      const tags = mapTextCategoryToTags(textCategory);
      const difficultyKey = mapDifficultyToDataKey(nextDifficulty);

      const pickOne = () =>
        getRandomPrompt({ difficulty: difficultyKey, tags }) ??
        getRandomPrompt({ difficulty: difficultyKey }) ??
        getRandomPrompt({ tags }) ??
        getRandomPrompt({});

      if (mode !== 'timed' || timedSeconds <= 15) {
        const picked = pickOne();
        setTargetText(picked?.text ?? '');
        return;
      }

      const baseTargetChars = 220;
      const desiredChars = Math.max(260, Math.min(1400, Math.round((baseTargetChars * timedSeconds) / 15)));

      const parts = [];
      let currentLen = 0;
      let guard = 0;
      while (currentLen < desiredChars && guard < 10) {
        guard += 1;
        const picked = pickOne();
        const text = picked?.text ?? '';
        if (!text) break;
        parts.push(text.trim());
        currentLen = parts.join(' ').length;
      }

      setTargetText(parts.length > 0 ? parts.join(' ') : (pickOne()?.text ?? ''));
    },
    [difficulty, mode, textCategory, timedSeconds]
  );

  useEffect(() => {
    pickNewPrompt(difficulty);
    setTypedText('');
    setIsRunning(false);
    setIsStarted(false);
    setIsEnded(false);
    setTimeRemaining(timedSeconds);
    setTimeElapsed(0);
    setResultVariant('complete');
    setKeyStats({});
    setShareStatus('');
    setShareBlobUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return '';
    });
  }, [difficulty, pickNewPrompt, timedSeconds, textCategory]);

  const diff = useMemo(() => diffCharacters(targetText, typedText), [targetText, typedText]);
  const accuracy = useMemo(() => computeAccuracy(diff.correct, totalIncorrect), [diff.correct, totalIncorrect]);

  const elapsedSeconds = mode === 'timed' ? timedSeconds - timeRemaining : timeElapsed;
  const liveWpm = useMemo(() => computeWPM(diff.correct, elapsedSeconds), [diff.correct, elapsedSeconds]);

  const resetRound = useCallback(
    ({ keepPrompt } = { keepPrompt: false }) => {
      if (!keepPrompt) pickNewPrompt(difficulty);
      setTypedText('');
      setTotalIncorrect(0);
      setIsRunning(false);
      setIsStarted(false);
      setIsEnded(false);
      setTimeRemaining(timedSeconds);
      setTimeElapsed(0);
      setResultVariant('complete');
      setKeyStats({});
      setShareStatus('');
      setShareBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return '';
      });
    },
    [difficulty, pickNewPrompt, timedSeconds]
  );

  const start = useCallback(() => {
    if (isRunning) return;
    pbAtStartRef.current = loadPersonalBest();
    setIsStarted(true);
    setIsEnded(false);
    setIsRunning(true);
    setTotalIncorrect(0);
    if (mode === 'timed') {
      setTimeRemaining(timedSeconds);
      setTimeElapsed(0);
    } else {
      setTimeRemaining(timedSeconds);
      setTimeElapsed(0);
    }
    queueMicrotask(() => inputRef.current?.focus());
  }, [isRunning, mode, timedSeconds]);

  const end = useCallback(() => {
    if (!isRunning) return;
    setIsRunning(false);
    setIsStarted(false);
    setIsEnded(true);

    const finalElapsed = mode === 'timed' ? timedSeconds : timeElapsed;
    const finalWpm = computeWPMRaw(diff.correct, finalElapsed);
    const finalWpmRounded = computeWPM(diff.correct, finalElapsed);
    const pbBefore = pbAtStartRef.current;
    const isFirstTest = pbBefore === null;
    const didBeatDisplayedPb =
      pbBefore !== null && finalWpmRounded > Math.round(pbBefore);

    const pbUpdate = updatePersonalBest(finalWpm);
    setPersonalBest(pbUpdate.best);

    if (isFirstTest) setResultVariant('baseline');
    else if (didBeatDisplayedPb) setResultVariant('newBest');
    else setResultVariant('complete');
  }, [diff.correct, isRunning, mode, timeElapsed, timedSeconds]);

  useEffect(() => {
    if (!isRunning) return undefined;
    const tick = setInterval(() => {
      if (mode === 'timed') {
        setTimeRemaining((t) => {
          const next = t - 1;
          if (next <= 0) {
            queueMicrotask(end);
            return 0;
          }
          return next;
        });
      } else {
        setTimeElapsed((t) => t + 1);
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [end, isRunning, mode]);

  useEffect(() => {
    if (!isRunning) return;
    if (mode !== 'passage') return;
    if (targetText.length > 0 && typedText.length >= targetText.length) {
      queueMicrotask(end);
    }
  }, [end, isRunning, mode, targetText.length, typedText.length]);

  const onTypedChange = (e) => {
    const value = e.target.value;
    if (!isRunning && !isEnded) start();

    if (value.length > typedText.length) {
      const added = value.slice(typedText.length);
      for (let i = 0; i < added.length; i++) {
        const idx = typedText.length + i;
        const expected = targetText[idx];
        const actual = added[i];
        if (expected !== actual) setTotalIncorrect((n) => n + 1);
      }
    }

    setTypedText(value);
  };

  const onTypedKeyDown = (e) => {
    if (isEnded) return;

    const code = e.code || e.key;
    if (!code) return;

    setKeyStats((prev) => {
      const existing = prev[code] ?? { count: 0, errors: 0 };
      const next = { ...prev };
      next[code] = { ...existing, count: existing.count + 1 };

      if (isPrintableKeyEvent(e)) {
        const idx = typedText.length;
        const expected = targetText[idx];
        const actual = e.key;
        if (typeof expected === 'string' && expected.length > 0 && actual !== expected) {
          next[code] = { ...next[code], errors: next[code].errors + 1 };
        }
      }

      return next;
    });
  };

  const keyboardRows = useMemo(() => {
    if (isHeatmapMobile) {
      return [
        [
          { code: 'KeyQ' },
          { code: 'KeyW' },
          { code: 'KeyE' },
          { code: 'KeyR' },
          { code: 'KeyT' },
          { code: 'KeyY' },
          { code: 'KeyU' },
          { code: 'KeyI' },
          { code: 'KeyO' },
          { code: 'KeyP' },
        ],
        [
          { code: 'KeyA' },
          { code: 'KeyS' },
          { code: 'KeyD' },
          { code: 'KeyF' },
          { code: 'KeyG' },
          { code: 'KeyH' },
          { code: 'KeyJ' },
          { code: 'KeyK' },
          { code: 'KeyL' },
        ],
        [
          { code: 'ShiftLeft', label: 'Shift', w: 1.5 },
          { code: 'KeyZ' },
          { code: 'KeyX' },
          { code: 'KeyC' },
          { code: 'KeyV' },
          { code: 'KeyB' },
          { code: 'KeyN' },
          { code: 'KeyM' },
          { code: 'Backspace', label: 'Bksp', w: 1.5 },
        ],
        [
          { code: 'Space', label: 'Space', w: 4.2 },
          { code: 'Enter', label: 'Enter', w: 1.8 },
        ],
      ];
    }

    return [
      [
        { code: 'Backquote', label: '`' },
        { code: 'Digit1', label: '1' },
        { code: 'Digit2', label: '2' },
        { code: 'Digit3', label: '3' },
        { code: 'Digit4', label: '4' },
        { code: 'Digit5', label: '5' },
        { code: 'Digit6', label: '6' },
        { code: 'Digit7', label: '7' },
        { code: 'Digit8', label: '8' },
        { code: 'Digit9', label: '9' },
        { code: 'Digit0', label: '0' },
        { code: 'Minus', label: '-' },
        { code: 'Equal', label: '=' },
        { code: 'Backspace', label: 'Bksp', w: 1.8 },
      ],
      [
        { code: 'Tab', label: 'Tab', w: 1.3 },
        { code: 'KeyQ' },
        { code: 'KeyW' },
        { code: 'KeyE' },
        { code: 'KeyR' },
        { code: 'KeyT' },
        { code: 'KeyY' },
        { code: 'KeyU' },
        { code: 'KeyI' },
        { code: 'KeyO' },
        { code: 'KeyP' },
        { code: 'BracketLeft', label: '[' },
        { code: 'BracketRight', label: ']' },
        { code: 'Backslash', label: '\\', w: 1.3 },
      ],
      [
        { code: 'CapsLock', label: 'Caps', w: 1.6 },
        { code: 'KeyA' },
        { code: 'KeyS' },
        { code: 'KeyD' },
        { code: 'KeyF' },
        { code: 'KeyG' },
        { code: 'KeyH' },
        { code: 'KeyJ' },
        { code: 'KeyK' },
        { code: 'KeyL' },
        { code: 'Semicolon', label: ';' },
        { code: 'Quote', label: "'" },
        { code: 'Enter', label: 'Enter', w: 2.0 },
      ],
      [
        { code: 'ShiftLeft', label: 'Shift', w: 2.1 },
        { code: 'KeyZ' },
        { code: 'KeyX' },
        { code: 'KeyC' },
        { code: 'KeyV' },
        { code: 'KeyB' },
        { code: 'KeyN' },
        { code: 'KeyM' },
        { code: 'Comma', label: ',' },
        { code: 'Period', label: '.' },
        { code: 'Slash', label: '/' },
        { code: 'ShiftRight', label: 'Shift', w: 2.1 },
      ],
      [{ code: 'Space', label: 'Space', w: 6.5 }],
    ];
  }, [isHeatmapMobile]);

  const { maxCount, maxErrors } = useMemo(() => {
    let mc = 0;
    let me = 0;
    for (const v of Object.values(keyStats)) {
      mc = Math.max(mc, v?.count ?? 0);
      me = Math.max(me, v?.errors ?? 0);
    }
    return { maxCount: mc, maxErrors: me };
  }, [keyStats]);

  const getKeyIntensityStyle = useCallback(
    (code) => {
      const stat = keyStats[code] ?? { count: 0, errors: 0 };
      const value = heatmapMode === 'errors' ? stat.errors : stat.count;
      const max = heatmapMode === 'errors' ? maxErrors : maxCount;
      const t = max > 0 ? value / max : 0;
      if (t <= 0) return undefined;
      if (heatmapMode === 'errors') {
        return {
          background: `rgba(255, 88, 88, ${0.10 + 0.55 * t})`,
          borderColor: `rgba(255, 88, 88, ${0.25 + 0.55 * t})`,
        };
      }
      return {
        background: `rgba(46, 156, 255, ${0.08 + 0.55 * t})`,
        borderColor: `rgba(46, 156, 255, ${0.20 + 0.60 * t})`,
      };
    },
    [heatmapMode, keyStats, maxCount, maxErrors]
  );

  const timeDisplay = mode === 'timed' ? formatTime(timeRemaining) : formatTime(timeElapsed);

  const resultTitle =
    resultVariant === 'baseline'
      ? 'Baseline Established!'
      : resultVariant === 'newBest'
        ? 'High Score Smashed!'
        : 'Test Complete!';

  const resultSubtitle =
    resultVariant === 'baseline'
      ? "You've set the bar. Now the real challenge begins—time to beat it."
      : resultVariant === 'newBest'
        ? "You're getting faster. That was incredible typing."
        : 'Solid run. Keep pushing to beat your high score.';

  const showMainTyping = !isEnded;

  useEffect(() => {
    return () => {
      if (shareBlobUrl) URL.revokeObjectURL(shareBlobUrl);
    };
  }, [shareBlobUrl]);

  const resultWpm = useMemo(
    () => computeWPM(diff.correct, mode === 'timed' ? timedSeconds : timeElapsed),
    [diff.correct, mode, timedSeconds, timeElapsed]
  );

  const resultAccuracy = useMemo(() => computeAccuracy(diff.correct, totalIncorrect), [diff.correct, totalIncorrect]);
  const resultElapsed = useMemo(() => (mode === 'timed' ? timedSeconds : timeElapsed), [mode, timedSeconds, timeElapsed]);

  const shareText = useMemo(() => {
    const modeLabel = mode === 'timed' ? `Timed (${timedSeconds}s)` : 'Passage';
    const categoryLabel = getCategoryLabel(textCategory);
    return `I scored ${resultWpm} WPM with ${resultAccuracy}% accuracy! (${modeLabel} • ${categoryLabel})`;
  }, [mode, resultAccuracy, resultWpm, textCategory, timedSeconds]);

  const shareUrl = useMemo(() => {
    try {
      return window.location.href;
    } catch {
      return '';
    }
  }, []);

  const openShareWindow = useCallback((url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const buildShareCard = useCallback(async () => {
    setShareStatus('');
    setIsShareBusy(true);
    try {
      const blob = await generateShareCardPngBlob({
        wpm: resultWpm,
        accuracy: resultAccuracy,
        correctChars: diff.correct,
        incorrectChars: totalIncorrect,
        mode,
        timedSeconds,
        elapsedSeconds: resultElapsed,
        category: getCategoryLabel(textCategory),
        personalBest: Math.round(personalBest),
      });

      if (!blob) throw new Error('Could not generate image.');

      const nextUrl = URL.createObjectURL(blob);
      setShareBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return nextUrl;
      });

      return blob;
    } catch (e) {
      setShareStatus(e instanceof Error ? e.message : 'Could not generate image.');
      return null;
    } finally {
      setIsShareBusy(false);
    }
  }, [diff.correct, mode, personalBest, resultAccuracy, resultElapsed, resultWpm, textCategory, timedSeconds, totalIncorrect]);

  const shareToPlatform = useCallback(
    async (platform) => {
      setShareStatus('');

      const encodedText = encodeURIComponent(shareText);
      const encodedUrl = encodeURIComponent(shareUrl);

      if (platform === 'twitter') {
        const u = `https://twitter.com/intent/tweet?text=${encodedText}${shareUrl ? `&url=${encodedUrl}` : ''}`;
        openShareWindow(u);
        setIsShareMenuOpen(false);
        return;
      }

      if (platform === 'linkedin') {
        const u = shareUrl ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` : `https://www.linkedin.com/`;
        openShareWindow(u);
        setIsShareMenuOpen(false);
        return;
      }

      if (platform === 'facebook') {
        const u = shareUrl ? `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` : `https://www.facebook.com/`;
        openShareWindow(u);
        setIsShareMenuOpen(false);
        return;
      }

      if (platform === 'discord') {
        const blob = await buildShareCard();
        if (!blob) return;

        try {
          if (navigator.clipboard && window.ClipboardItem) {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            setShareStatus('Copied image to clipboard. Paste it into Discord.');
          } else if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(shareText + (shareUrl ? `\n${shareUrl}` : ''));
            setShareStatus('Copied text to clipboard. Paste it into Discord.');
          } else {
            setShareStatus('Clipboard not supported in this browser.');
          }
        } catch {
          setShareStatus('Could not copy to clipboard.');
        }

        openShareWindow('https://discord.com/channels/@me');
        setIsShareMenuOpen(false);
      }
    },
    [buildShareCard, openShareWindow, shareText, shareUrl]
  );

  return (
    <div className="page">
      <h1 className="sr-only">Typing Speed Test</h1>
      <header className="topbar">
        <div className="brand">
          <img className="brandLogo" src={logoSmall} alt="" />
          <div className="brandText">
            <div className="brandTitle">Typing Speed Test</div>
            <div className="brandSubtitle">Type as fast as you can in {timedSeconds} seconds</div>
          </div>
        </div>

        <div className="personalBest">
          <img className="personalBestIcon" src={iconPersonalBest} alt="" />
          <div className="personalBestText">
            <span className="pbDesktop">Personal best: </span>
            <span className="pbMobile">Best: </span>
            {Math.round(personalBest)} WPM
          </div>
        </div>
      </header>

      <section className="toolbar">
        <div className="liveStats" role="status" aria-live="polite" aria-label="Live stats">
          <div className="liveStat">
            <span className="liveLabel">WPM:</span>
            <span className="liveValue">{isEnded ? 0 : liveWpm}</span>
          </div>
          <div className="liveDivider" />
          <div className="liveStat">
            <span className="liveLabel">Accuracy:</span>
            <span className={"liveValue " + (accuracy < 100 && isRunning ? 'isWarn' : '')}>{accuracy}%</span>
          </div>
          <div className="liveDivider" />
          <div className="liveStat">
            <span className="liveLabel">Time:</span>
            <span className={"liveValue " + (mode === 'timed' && timeRemaining <= 10 && isRunning ? 'isWarnTime' : '')}>{timeDisplay}</span>
          </div>
        </div>

        <nav className="controls controlsDesktop" aria-label="Test controls">
          <div className="controlGroup" aria-label="Difficulty">
            <div className="controlLabel">Difficulty:</div>
            <div className="segmented" role="radiogroup" aria-label="Select difficulty">
              <button
                type="button"
                className={"segBtn " + (difficulty === 'easy' ? 'isActive' : '')}
                onClick={() => setDifficulty('easy')}
                disabled={isRunning}
                aria-checked={difficulty === 'easy'}
                role="radio"
              >
                Easy
              </button>
              <button
                type="button"
                className={"segBtn " + (difficulty === 'medium' ? 'isActive' : '')}
                onClick={() => setDifficulty('medium')}
                disabled={isRunning}
                aria-checked={difficulty === 'medium'}
                role="radio"
              >
                Medium
              </button>
              <button
                type="button"
                className={"segBtn " + (difficulty === 'hard' ? 'isActive' : '')}
                onClick={() => setDifficulty('hard')}
                disabled={isRunning}
                aria-checked={difficulty === 'hard'}
                role="radio"
              >
                Hard
              </button>
            </div>
          </div>

          <div className="controlGroup" aria-label="Mode">
            <div className="controlLabel">Mode:</div>
            <div className="segmented" role="radiogroup" aria-label="Select mode">
              <div className={'segDropdown ' + (isTimedMenuOpen ? 'isOpen' : '')}>
                <button
                  type="button"
                  className={"segBtn " + (mode === 'timed' ? 'isActive' : '')}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isRunning) return;
                    setIsCategoryDesktopMenuOpen(false);
                    setIsTimedMenuOpen((v) => !v);
                  }}
                  disabled={isRunning}
                  aria-haspopup="menu"
                  aria-expanded={isTimedMenuOpen}
                >
                  Timed ({timedSeconds}s)
                  <span className="segCaret" aria-hidden="true">
                    ▾
                  </span>
                </button>
                {isTimedMenuOpen && (
                  <div className="segMenu" role="menu" aria-label="Select timed duration" onPointerDown={(e) => e.stopPropagation()}>
                    {[15, 30, 60, 120].map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={'segMenuItem ' + (mode === 'timed' && timedSeconds === s ? 'isSelected' : '')}
                        role="menuitemradio"
                        aria-checked={mode === 'timed' && timedSeconds === s}
                        onClick={() => {
                          if (isRunning) return;
                          setTimedSeconds(s);
                          setMode('timed');
                          resetRound({ keepPrompt: true });
                          setIsTimedMenuOpen(false);
                        }}
                        disabled={isRunning}
                      >
                        {s}s
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                className={"segBtn " + (mode === 'passage' ? 'isActive' : '')}
                onClick={() => {
                  if (isRunning) return;
                  setIsTimedMenuOpen(false);
                  setIsCategoryDesktopMenuOpen(false);
                  setMode('passage');
                  resetRound({ keepPrompt: true });
                }}
                disabled={isRunning}
                aria-checked={mode === 'passage'}
                role="radio"
              >
                Passage
              </button>
            </div>
          </div>

          <div className="controlGroup" aria-label="Text category">
            <div className="controlLabel">Category:</div>
            <div className="segmented">
              <div className={'segDropdown ' + (isCategoryDesktopMenuOpen ? 'isOpen' : '')}>
                <button
                  type="button"
                  className={"segBtn " + (textCategory !== 'all' ? 'isActive' : '')}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isRunning) return;
                    setIsTimedMenuOpen(false);
                    setIsCategoryDesktopMenuOpen((v) => !v);
                  }}
                  disabled={isRunning}
                  aria-haspopup="menu"
                  aria-expanded={isCategoryDesktopMenuOpen}
                >
                  {textCategory === 'all'
                    ? 'All'
                    : textCategory === 'quotes'
                      ? 'Quotes'
                      : textCategory === 'lyrics'
                        ? 'Lyrics'
                        : 'Code'}
                  <span className="segCaret" aria-hidden="true">
                    ▾
                  </span>
                </button>
                {isCategoryDesktopMenuOpen && (
                  <div className="segMenu" role="menu" aria-label="Select category" onPointerDown={(e) => e.stopPropagation()}>
                    {[
                      { key: 'all', label: 'All' },
                      { key: 'quotes', label: 'Quotes' },
                      { key: 'lyrics', label: 'Lyrics' },
                      { key: 'code', label: 'Code' },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        className={'segMenuItem ' + (textCategory === opt.key ? 'isSelected' : '')}
                        role="menuitemradio"
                        aria-checked={textCategory === opt.key}
                        onClick={() => {
                          if (isRunning) return;
                          setTextCategory(opt.key);
                          resetRound();
                          setIsCategoryDesktopMenuOpen(false);
                        }}
                        disabled={isRunning}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
        <nav className="controls controlsMobile" aria-label="Mobile controls">
          <div className="mobileSelectRow">
            <div className={'mobileSelect ' + (isDifficultyMenuOpen ? 'isOpen' : '')}>
              <button
                type="button"
                className="mobileSelectBtn"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDifficultyMenuOpen((v) => !v);
                  setIsModeMenuOpen(false);
                  setIsTimedMenuOpen(false);
                  setIsCategoryMenuOpen(false);
                }}
                disabled={isRunning}
                aria-haspopup="menu"
                aria-expanded={isDifficultyMenuOpen}
              >
                {difficulty === 'easy' ? 'Easy' : difficulty === 'medium' ? 'Medium' : 'Hard'}
                <span className="mobileCaret" aria-hidden="true">
                  ▾
                </span>
              </button>
              {isDifficultyMenuOpen && (
                <div
                  className="mobileMenu"
                  role="menu"
                  aria-label="Select difficulty"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {([
                    { key: 'easy', label: 'Easy' },
                    { key: 'medium', label: 'Medium' },
                    { key: 'hard', label: 'Hard' },
                  ]).map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      className={'mobileMenuItem ' + (difficulty === opt.key ? 'isSelected' : '')}
                      role="menuitemradio"
                      aria-checked={difficulty === opt.key}
                      onClick={() => {
                        setDifficulty(opt.key);
                        setIsDifficultyMenuOpen(false);
                      }}
                      disabled={isRunning}
                    >
                      <span className="mobileRadio" aria-hidden="true" />
                      <span className="mobileMenuLabel">{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={'mobileSelect ' + (isModeMenuOpen ? 'isOpen' : '')}>
              <button
                type="button"
                className="mobileSelectBtn"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModeMenuOpen((v) => !v);
                  setIsDifficultyMenuOpen(false);
                  setIsTimedMenuOpen(false);
                  setIsCategoryMenuOpen(false);
                }}
                disabled={isRunning}
                aria-haspopup="menu"
                aria-expanded={isModeMenuOpen}
              >
                {mode === 'timed' ? `Timed (${timedSeconds}s)` : 'Passage'}
                <span className="mobileCaret" aria-hidden="true">
                  ▾
                </span>
              </button>
              {isModeMenuOpen && (
                <div className="mobileMenu" role="menu" aria-label="Select mode" onPointerDown={(e) => e.stopPropagation()}>
                  {([
                    { key: 'timed-15', label: 'Timed (15s)', mode: 'timed', seconds: 15 },
                    { key: 'timed-30', label: 'Timed (30s)', mode: 'timed', seconds: 30 },
                    { key: 'timed-60', label: 'Timed (60s)', mode: 'timed', seconds: 60 },
                    { key: 'timed-120', label: 'Timed (120s)', mode: 'timed', seconds: 120 },
                    { key: 'passage', label: 'Passage', mode: 'passage' },
                  ]).map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      className={
                        'mobileMenuItem ' +
                        (opt.mode === 'passage'
                          ? mode === 'passage'
                            ? 'isSelected'
                            : ''
                          : mode === 'timed' && timedSeconds === opt.seconds
                            ? 'isSelected'
                            : '')
                      }
                      role="menuitemradio"
                      aria-checked={
                        opt.mode === 'passage' ? mode === 'passage' : mode === 'timed' && timedSeconds === opt.seconds
                      }
                      onClick={() => {
                        if (isRunning) return;
                        if (opt.mode === 'timed') {
                          setTimedSeconds(opt.seconds);
                          setMode('timed');
                        } else {
                          setMode('passage');
                        }
                        resetRound({ keepPrompt: true });
                        setIsModeMenuOpen(false);
                      }}
                      disabled={isRunning}
                    >
                      <span className="mobileRadio" aria-hidden="true" />
                      <span className="mobileMenuLabel">{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={'mobileSelect ' + (isCategoryMenuOpen ? 'isOpen' : '')}>
              <button
                type="button"
                className="mobileSelectBtn"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCategoryMenuOpen((v) => !v);
                  setIsDifficultyMenuOpen(false);
                  setIsModeMenuOpen(false);
                  setIsTimedMenuOpen(false);
                }}
                disabled={isRunning}
                aria-haspopup="menu"
                aria-expanded={isCategoryMenuOpen}
              >
                {textCategory === 'all'
                  ? 'All'
                  : textCategory === 'quotes'
                    ? 'Quotes'
                    : textCategory === 'lyrics'
                      ? 'Lyrics'
                      : 'Code'}
                <span className="mobileCaret" aria-hidden="true">
                  ▾
                </span>
              </button>
              {isCategoryMenuOpen && (
                <div className="mobileMenu" role="menu" aria-label="Select category" onPointerDown={(e) => e.stopPropagation()}>
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'quotes', label: 'Quotes' },
                    { key: 'lyrics', label: 'Lyrics' },
                    { key: 'code', label: 'Code' },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      className={'mobileMenuItem ' + (textCategory === opt.key ? 'isSelected' : '')}
                      role="menuitemradio"
                      aria-checked={textCategory === opt.key}
                      onClick={() => {
                        if (isRunning) return;
                        setTextCategory(opt.key);
                        resetRound();
                        setIsCategoryMenuOpen(false);
                      }}
                      disabled={isRunning}
                    >
                      <span className="mobileRadio" aria-hidden="true" />
                      <span className="mobileMenuLabel">{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </nav>
      </section>

      {showMainTyping ? (
        <main className="main">
          <div
            className={"passageCard " + (!isRunning && !isStarted ? 'isIdle' : '')}
          >
            <div className="passage" aria-label="Typing passage">
              {Array.from(targetText).map((ch, idx) => {
                const status = diff.statuses[idx] ?? 'pending';
                const isCursor = isRunning && idx === typedText.length;
                const cls =
                  status === 'correct'
                    ? 'char isCorrect'
                    : status === 'incorrect'
                      ? 'char isIncorrect'
                      : 'char isPending';
                return (
                  <span key={idx} className={cls + (isCursor ? ' isCursor' : '')}>
                    {ch}
                  </span>
                );
              })}
            </div>

            {!isRunning && !isStarted && !isEnded && (
              <div className="startOverlay">
                <button type="button" className="primaryBtn" onClick={start}>
                  Start Typing Test
                </button>
                <div className="startHint">Or click the text and start typing</div>
              </div>
            )}

            <textarea
              ref={inputRef}
              className="hiddenInput"
              value={typedText}
              onChange={onTypedChange}
              onKeyDown={onTypedKeyDown}
              onFocus={() => {
                if (!isEnded && !isRunning) start();
              }}
              onBlur={() => {
                if (isRunning) queueMicrotask(() => inputRef.current?.focus());
              }}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              aria-label="Typing input"
            />
          </div>

          <section className="heatmap" aria-label="Keyboard heatmap">
            <div className="heatmapHeader">
              <div className="heatmapTitle">Keyboard heatmap</div>
              <div className="heatmapControls" role="radiogroup" aria-label="Heatmap mode">
                <button
                  type="button"
                  className={'segBtn ' + (heatmapMode === 'frequency' ? 'isActive' : '')}
                  onClick={() => setHeatmapMode('frequency')}
                >
                  Frequency
                </button>
                <button
                  type="button"
                  className={'segBtn ' + (heatmapMode === 'errors' ? 'isActive' : '')}
                  onClick={() => setHeatmapMode('errors')}
                >
                  Errors
                </button>
              </div>
            </div>

            <div className={"keyboard " + (isHeatmapMobile ? 'isMobile' : '')}>
              {keyboardRows.map((row, rowIdx) => (
                <div
                  key={rowIdx}
                  className={
                    "keyboardRow " +
                    (isHeatmapMobile && rowIdx === 1 ? 'isIndented1' : '') +
                    (isHeatmapMobile && rowIdx === 2 ? ' isIndented2' : '')
                  }
                >
                  {row.map((k) => {
                    const stat = keyStats[k.code] ?? { count: 0, errors: 0 };
                    const value = heatmapMode === 'errors' ? stat.errors : stat.count;
                    return (
                      <div
                        key={k.code}
                        className={'key ' + (value > 0 ? 'hasData' : '')}
                        style={{
                          ...(k.w ? { flex: String(k.w) + ' 0 0' } : undefined),
                          ...getKeyIntensityStyle(k.code),
                        }}
                      >
                        <div className="keyLabel">{formatKeyLabel(k.code, k.label)}</div>
                        <div className="keyValue">{value || ''}</div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>

          <div className="bottomBar">
            <div className="bottomDivider" />
            <button
              type="button"
              className="secondaryBtn"
              onClick={() => {
                resetRound();
                queueMicrotask(() => inputRef.current?.focus());
              }}
            >
              Restart Test
              <img className="btnIcon" src={iconRestart} alt="" />
            </button>
          </div>
        </main>
      ) : (
        <main className={"resultsWrap " + (resultVariant === 'newBest' ? 'hasConfetti' : '')}>
          <img className="decorStarLeft" src={patternStar1} alt="" />
          <img className="decorStarRight" src={patternStar2} alt="" />
          {resultVariant === 'newBest' && <img className="decorConfetti" src={patternConfetti} alt="" />}

          <div className="resultsCard" role="region" aria-label="Results">
            <div className="resultsCardTop">
            <div className="resultIcon">
              <img src={resultVariant === 'newBest' ? iconNewPb : iconCompleted} alt="" />
            </div>
            <div className="shareMenuWrap" ref={shareMenuRef}>
              <button
                type="button"
                className="shareIconBtn"
                aria-label="Share"
                aria-haspopup="menu"
                aria-expanded={isShareMenuOpen}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShareMenuOpen((v) => !v);
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path
                    d="M16 8a3 3 0 1 0-2.82-4H13a3 3 0 0 0 0 6h.18A3 3 0 0 0 16 8ZM8 14a3 3 0 1 0-2.82-4H5a3 3 0 0 0 0 6h.18A3 3 0 0 0 8 14Zm8 10a3 3 0 1 0-2.82-4H13a3 3 0 0 0 0 6h.18A3 3 0 0 0 16 24Z"
                    fill="currentColor"
                    opacity="0"
                  />
                  <path
                    d="M16 6a2 2 0 1 0-1.74-3H14a2 2 0 0 0 0 4h.26C14.6 6.39 15.27 6 16 6ZM8 13a2 2 0 1 0-1.74-3H6a2 2 0 0 0 0 4h.26C6.6 13.39 7.27 13 8 13Zm8 8a2 2 0 1 0-1.74-3H14a2 2 0 0 0 0 4h.26c.34-.61 1.01-1 1.74-1Z"
                    fill="currentColor"
                    opacity="0"
                  />
                  <path
                    d="M16 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM8 10a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm8 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM9.4 14.8l5.2 3m0-11l-5.2 3"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>

              {isShareMenuOpen && (
                <div
                  className="sharePopover"
                  role="menu"
                  aria-label="Share options"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <div className="sharePopoverTitle">Share</div>
                  <div className="shareIcons" role="group" aria-label="Share to social">
                    <button type="button" className="shareSocialBtn" onClick={() => shareToPlatform('discord')}>
                      <span className="shareSocialIcon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19.5 5.3a16.9 16.9 0 0 0-4.1-1.3l-.2.3a11.8 11.8 0 0 1 3.3 1.6 13.6 13.6 0 0 0-5.1-1.6 13.6 13.6 0 0 0-5.1 1.6c1-.6 2.1-1.2 3.3-1.6l-.2-.3A16.9 16.9 0 0 0 4.5 5.3C2.4 8.5 1.8 11.6 2.1 14.7c2.1 1.6 4.2 2.5 6.3 3l.7-1.2c-1.1-.4-2.2-1-3.2-1.7l.7-.5c1.9 1.4 3.9 2.1 5.4 2.1s3.5-.7 5.4-2.1l.7.5c-1 .7-2.1 1.3-3.2 1.7l.7 1.2c2.1-.5 4.2-1.4 6.3-3 .3-3.1-.3-6.2-2.4-9.4ZM9.4 13.7c-.7 0-1.3-.6-1.3-1.4 0-.8.6-1.4 1.3-1.4.8 0 1.4.6 1.4 1.4 0 .8-.6 1.4-1.4 1.4Zm5.2 0c-.8 0-1.4-.6-1.4-1.4 0-.8.6-1.4 1.4-1.4.7 0 1.3.6 1.3 1.4 0 .8-.6 1.4-1.3 1.4Z" />
                        </svg>
                      </span>
                      <span className="shareSocialLabel">Discord</span>
                    </button>
                    <button type="button" className="shareSocialBtn" onClick={() => shareToPlatform('facebook')}>
                      <span className="shareSocialIcon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.6 22v-8h2.7l.4-3h-3.1V9.1c0-.9.2-1.5 1.6-1.5H16.8V5c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5V11H7.2v3h2.6v8h3.8Z" />
                        </svg>
                      </span>
                      <span className="shareSocialLabel">Facebook</span>
                    </button>
                    <button type="button" className="shareSocialBtn" onClick={() => shareToPlatform('linkedin')}>
                      <span className="shareSocialIcon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.9 6.8a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4ZM4.8 21.6V9.2H9v12.4H4.8Zm6.6 0V9.2h4v1.7h.1c.6-1 2-2 4-2 4.3 0 5.1 2.8 5.1 6.5v6.2h-4.2v-5.5c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9v5.6h-4.9Z" />
                        </svg>
                      </span>
                      <span className="shareSocialLabel">LinkedIn</span>
                    </button>
                    <button type="button" className="shareSocialBtn" onClick={() => shareToPlatform('twitter')}>
                      <span className="shareSocialIcon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.9-6.4L6.3 22H3l7.3-8.4L2 2h6.3l4.4 5.8L18.9 2Zm-1.1 18h1.7L7.4 3.9H5.5L17.8 20Z" />
                        </svg>
                      </span>
                      <span className="shareSocialLabel">Twitter</span>
                    </button>
                  </div>

                  <div className="shareActions">
                    <button
                      type="button"
                      className="shareActionBtn"
                      disabled={isShareBusy}
                      onClick={async () => {
                        const blob = await buildShareCard();
                        if (!blob) return;
                        if (!shareBlobUrl) return;
                        const a = document.createElement('a');
                        const stamp = new Date().toISOString().slice(0, 10);
                        a.href = shareBlobUrl;
                        a.download = `typing-result-${stamp}.png`;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        setIsShareMenuOpen(false);
                      }}
                    >
                      {isShareBusy ? 'Generating…' : 'Download card'}
                    </button>
                    <button
                      type="button"
                      className="shareActionBtn"
                      disabled={isShareBusy}
                      onClick={async () => {
                        const blob = await buildShareCard();
                        if (!blob) return;
                        try {
                          if (!navigator.clipboard || !window.ClipboardItem) {
                            setShareStatus('Clipboard not supported in this browser.');
                            return;
                          }
                          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                          setShareStatus('Copied image to clipboard.');
                          setIsShareMenuOpen(false);
                        } catch {
                          setShareStatus('Could not copy to clipboard.');
                        }
                      }}
                    >
                      Copy image
                    </button>
                  </div>
                </div>
              )}
            </div>
            </div>
            <h2 className="resultTitle">{resultTitle}</h2>
            <div className="resultSubtitle">{resultSubtitle}</div>

            <div className="resultGrid">
              <div className="resultBox">
                <div className="resultBoxLabel">WPM:</div>
                <div className="resultBoxValue">{resultWpm}</div>
              </div>
              <div className="resultBox">
                <div className="resultBoxLabel">Accuracy:</div>
                <div className={"resultBoxValue " + (resultAccuracy < 100 ? 'isWarn' : '')}>
                  {resultAccuracy}%
                </div>
              </div>
              <div className="resultBox">
                <div className="resultBoxLabel">Characters</div>
                <div className="resultBoxValue">
                  <span className="isGood">{diff.correct}</span>
                  <span className="slash">/</span>
                  <span className="isBad">{totalIncorrect}</span>
                </div>
              </div>
            </div>

            {shareStatus && <div className="shareStatus">{shareStatus}</div>}

            {shareBlobUrl && (
              <div className="sharePreview" aria-label="Share card preview">
                <img src={shareBlobUrl} alt="Shareable result card" />
              </div>
            )}

            <button
              type="button"
              className="primaryBtn primaryBtnLight"
              onClick={() => {
                resetRound();
                start();
              }}
            >
              {resultVariant === 'complete' ? 'Go Again' : 'Beat This Score'}
              <img className="btnIcon" src={iconRestart} alt="" />
            </button>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
