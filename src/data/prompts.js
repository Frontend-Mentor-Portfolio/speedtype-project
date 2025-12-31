export const PROMPTS = [
  // Beginner
  { id: 'beg-1', category: 'Beginner', difficulty: 'beginner', tags: ['common'], text: 'On Saturday morning, Mina walked to the small market near her home. She bought fresh fruit and bread, then stopped to greet the baker who always remembered her name.' },
  { id: 'beg-2', category: 'Beginner', difficulty: 'beginner', tags: ['common'], text: 'A new habit is easier to build when it fits your day. Choose one small action, repeat it at the same time, and notice how quickly it becomes familiar.' },
  { id: 'beg-3', category: 'Beginner', difficulty: 'beginner', tags: ['common'], text: 'When you learn a skill, improvement can feel slow at first. With steady practice, your hands move with more confidence and mistakes become easier to fix.' },

  // Intermediate
  { id: 'int-1', category: 'Intermediate', difficulty: 'intermediate', tags: ['flow'], text: 'In the middle of a busy week, it helps to pause and set one clear priority. When you decide what matters most, the rest of your tasks become easier to sort and less stressful to begin.' },
  { id: 'int-2', category: 'Intermediate', difficulty: 'intermediate', tags: ['flow'], text: 'A good explanation connects ideas instead of listing facts. It introduces a topic, gives a reason, and then shows an example so the reader can follow the logic without guessing.' },
  { id: 'int-3', category: 'Intermediate', difficulty: 'intermediate', tags: ['flow'], text: 'Progress is easier to see when you track it over time. A short note after each session can reveal patterns, like which words slow you down and which habits keep you accurate.' },

  // Advanced
  { id: 'adv-1', category: 'Advanced', difficulty: 'advanced', tags: ['complex'], text: 'The strongest arguments anticipate questions before they are asked. They define the problem, acknowledge trade-offs, and justify a decision with evidence rather than confidence alone.' },
  { id: 'adv-2', category: 'Advanced', difficulty: 'advanced', tags: ['complex'], text: 'When a system grows, small inefficiencies become expensive. A thoughtful redesign starts by measuring real usage, removing assumptions, and simplifying the path that most people take.' },
  { id: 'adv-3', category: 'Advanced', difficulty: 'advanced', tags: ['complex'], text: 'Focus is not only the ability to concentrate, but the ability to return after distraction. You build it by noticing the drift, choosing a single next step, and repeating that choice until it becomes natural.' },

  // Punctuation
  { id: 'pun-1', category: 'Punctuation', difficulty: 'intermediate', tags: ['punctuation'], text: 'When you write instructions, punctuation guides the reader through each step. Parentheses (like this) add helpful detail, quotes "mark exact words", and commas separate ideas so the meaning stays clear.' },
  { id: 'pun-2', category: 'Punctuation', difficulty: 'advanced', tags: ['punctuation'], text: 'A careful editor listens to the rhythm of a paragraph: commas slow the pace, semicolons connect related thoughts; and colons introduce what comes next. Used well, punctuation makes complex writing easier to follow.' },
  { id: 'pun-3', category: 'Punctuation', difficulty: 'advanced', tags: ['punctuation'], text: 'Before you publish, ask: "What might a reader misunderstand?" If a sentence feels crowded—split it. If a claim sounds vague, revise it with a stronger verb and a specific detail.' },

  // Numbers & Symbols
  { id: 'num-1', category: 'Numbers', difficulty: 'intermediate', tags: ['numbers', 'symbols'], text: 'At 7:30 a.m., the team reviewed 42 requests: 17 were still pending, and 5 needed urgent attention. They agreed to finish the critical items first, then return to the rest after lunch.' },
  { id: 'num-2', category: 'Numbers', difficulty: 'advanced', tags: ['numbers', 'symbols'], text: 'The sensor recorded x=12.75 and y=-3.90, then flagged a drift of +0.08. To reduce noise, the filter used a threshold of 1e-3 and ignored any spike that lasted less than 2 seconds.' },
  { id: 'num-3', category: 'Numbers', difficulty: 'advanced', tags: ['numbers', 'symbols'], text: 'In Q4 the budget reached $1,245.60, which was +8.2% higher than the forecast. The manager proposed a 2–3% adjustment for next quarter, but only after confirming which costs were temporary.' },

  // Programming-like
  { id: 'code-0', category: 'Programming', difficulty: 'beginner', tags: ['code'], text: 'let total = 0; total = total + 1; if (total >= 3) { total = 0; } // count and reset' },
  { id: 'code-0b', category: 'Programming', difficulty: 'intermediate', tags: ['code'], text: 'function average(nums) { let sum = 0; for (let i = 0; i < nums.length; i++) sum += nums[i]; return nums.length ? sum / nums.length : 0; }' },
  { id: 'code-1', category: 'Programming', difficulty: 'advanced', tags: ['code'], text: 'function formatUser(user) { const name = user?.name ?? "Unknown"; const role = user?.role ?? "guest"; return `${name} (${role})`; } // safe defaults' },
  { id: 'code-2', category: 'Programming', difficulty: 'advanced', tags: ['code'], text: 'const opts = { retries: 3, timeout: 5000 }; async function boot() { for (let i = 0; i < opts.retries; i++) { try { return await init(opts); } catch (e) {} } throw new Error("init failed"); }' },
  { id: 'code-3', category: 'Programming', difficulty: 'advanced', tags: ['code'], text: 'let queue = ["a", "b", "c"]; const seen = new Set(); while (queue.length) { const item = queue.shift(); if (seen.has(item)) continue; seen.add(item); process(item); }' },

  // Quotes
  { id: 'quo-0', category: 'Quotes', difficulty: 'beginner', tags: ['quote'], text: '“A good start is quiet and consistent.” The work that looks small today becomes the foundation for what you can do tomorrow.' },
  { id: 'quo-1', category: 'Quotes', difficulty: 'intermediate', tags: ['quote'], text: '“The goal is not to rush, but to understand.” When you slow down enough to notice patterns, you speed up naturally because you stop repeating the same mistakes.' },
  { id: 'quo-2', category: 'Quotes', difficulty: 'intermediate', tags: ['quote'], text: '“Accuracy builds confidence, and confidence builds speed.” A calm rhythm makes space for good decisions, even when the timer is running.' },
  { id: 'quo-3', category: 'Quotes', difficulty: 'advanced', tags: ['quote'], text: '“Discipline is what you choose when motivation is absent.” It turns intention into action, and action into momentum that lasts beyond a single good day.' },

  // Lyrics (original, lyric-style)
  { id: 'lyr-1', category: 'Lyrics', difficulty: 'beginner', tags: ['lyrics'], text: 'Breathe in, hold steady, and listen for the beat. The day is moving softly, and your hands can learn the rhythm.' },
  { id: 'lyr-2', category: 'Lyrics', difficulty: 'intermediate', tags: ['lyrics'], text: 'City lights are humming as the night begins to sing. Footsteps on the sidewalk keep time, and every window tells a different story.' },
  { id: 'lyr-3', category: 'Lyrics', difficulty: 'advanced', tags: ['lyrics'], text: 'We trace our names in rainfall, then run before the thunder knows. The street turns silver under lamps, and the air feels sharp with possibility.' },

  // Longer practice
  { id: 'long-1', category: 'Advanced', difficulty: 'advanced', tags: ['long'], text: 'When fatigue sets in, your attention narrows and your hands begin to press harder than necessary. Instead of forcing speed, slow down for a few seconds and rebuild a clean rhythm. Good posture, a light touch, and steady breathing help you keep control during longer sessions. Once you feel calm again, increase your pace gradually so accuracy stays stable.' },
  { id: 'long-2', category: 'Intermediate', difficulty: 'intermediate', tags: ['long'], text: 'A complex passage is easier when you treat it like a path with markers. First, read the line and notice where punctuation appears, then type it slowly with consistent spacing. After that, repeat the same section and aim for smooth movement rather than speed. When it feels predictable, connect the segments together without pausing, and you will gain speed without losing clarity.' },
  { id: 'long-3', category: 'Advanced', difficulty: 'advanced', tags: ['long'], text: 'Mastery grows from repetition guided by reflection. After each run, ask which mistakes happened more than once and what caused them: unfamiliar words, rushed punctuation, or tense fingers. Then isolate that pattern and practice it on purpose, even if it feels uncomfortable. Over time those corrections compound, and your best results start to look normal instead of rare.' },
];

function wordCount(text) {
  return text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
}

export function getPrompts(filter = {}) {
  const { category, difficulty, minWords, maxWords, tags } = filter;
  return PROMPTS.filter((p) => {
    const words = wordCount(p.text);
    if (category && p.category.toLowerCase() !== String(category).toLowerCase()) return false;
    if (difficulty && p.difficulty.toLowerCase() !== String(difficulty).toLowerCase()) return false;
    if (typeof minWords === 'number' && words < minWords) return false;
    if (typeof maxWords === 'number' && words > maxWords) return false;
    if (Array.isArray(tags) && tags.length > 0) {
      const wanted = new Set(tags.map((t) => String(t).toLowerCase()));
      const hasTag = p.tags.some((t) => wanted.has(t.toLowerCase()));
      if (!hasTag) return false;
    }
    return true;
  });
}

export function getRandomPrompt(filter = {}) {
  const pool = getPrompts(filter);
  const pick = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : null;
  if (!pick) return null;
  return {
    ...pick,
    words: wordCount(pick.text),
    chars: pick.text.length,
  };
}