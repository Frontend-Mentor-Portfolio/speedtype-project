export const PROMPTS = [
  // Beginner
  { id: 'beg-1', category: 'Beginner', difficulty: 'beginner', tags: ['common'], text: 'On Saturday morning, Mina walked to the small market near her home. She bought fresh fruit and bread, then stopped to greet the baker who always remembered her name.' },
  { id: 'beg-2', category: 'Beginner', difficulty: 'beginner', tags: ['common'], text: 'A new habit is easier to build when it fits your day. Choose one small action, repeat it at the same time, and notice how quickly it becomes familiar.' },
  { id: 'beg-3', category: 'Beginner', difficulty: 'beginner', tags: ['common'], text: 'When you learn a skill, improvement can feel slow at first. With steady practice, your hands move with more confidence and mistakes become easier to fix.' },
  { id: 'beg-4', category: 'Beginner', difficulty: 'beginner', tags: ['common'], text: 'The morning sun warmed the garden as Maya watered the plants. She noticed how the tomatoes had grown overnight and smiled at the small, green fruits starting to form.' },
  { id: 'beg-5', category: 'Beginner', difficulty: 'beginner', tags: ['common'], text: 'Reading before bed helps the mind settle. Choose a book that interests you, read a few pages, and let the stories carry you away from the day\'s worries.' },
  { id: 'beg-6', category: 'Beginner', difficulty: 'beginner', tags: ['common'], text: 'The library was quiet except for the soft sound of pages turning. Alex found a corner by the window and opened the book to where the bookmark waited.' },

  // Intermediate
  { id: 'int-1', category: 'Intermediate', difficulty: 'intermediate', tags: ['flow'], text: 'In the middle of a busy week, it helps to pause and set one clear priority. When you decide what matters most, the rest of your tasks become easier to sort and less stressful to begin.' },
  { id: 'int-2', category: 'Intermediate', difficulty: 'intermediate', tags: ['flow'], text: 'A good explanation connects ideas instead of listing facts. It introduces a topic, gives a reason, and then shows an example so the reader can follow the logic without guessing.' },
  { id: 'int-3', category: 'Intermediate', difficulty: 'intermediate', tags: ['flow'], text: 'Progress is easier to see when you track it over time. A short note after each session can reveal patterns, like which words slow you down and which habits keep you accurate.' },
  { id: 'int-4', category: 'Intermediate', difficulty: 'intermediate', tags: ['flow'], text: 'The workshop filled with the scent of fresh paint as participants arranged their canvases. Each artist had brought their own vision, but they shared the same quiet excitement before beginning.' },
  { id: 'int-5', category: 'Intermediate', difficulty: 'intermediate', tags: ['flow'], text: 'When the rain stopped, the neighborhood came alive again. Children ran through puddles, neighbors emerged from their homes, and the air smelled clean and renewed.' },
  { id: 'int-6', category: 'Intermediate', difficulty: 'intermediate', tags: ['flow'], text: 'The old bookstore had narrow aisles and towering shelves that seemed to lean inward. Every step produced a soft creak from the wooden floor, adding to the building\'s character.' },

  // Advanced
  { id: 'adv-1', category: 'Advanced', difficulty: 'advanced', tags: ['complex'], text: 'The strongest arguments anticipate questions before they are asked. They define the problem, acknowledge trade-offs, and justify a decision with evidence rather than confidence alone.' },
  { id: 'adv-2', category: 'Advanced', difficulty: 'advanced', tags: ['complex'], text: 'When a system grows, small inefficiencies become expensive. A thoughtful redesign starts by measuring real usage, removing assumptions, and simplifying the path that most people take.' },
  { id: 'adv-3', category: 'Advanced', difficulty: 'advanced', tags: ['complex'], text: 'Focus is not only the ability to concentrate, but the ability to return after distraction. You build it by noticing the drift, choosing a single next step, and repeating that choice until it becomes natural.' },
  { id: 'adv-4', category: 'Advanced', difficulty: 'advanced', tags: ['complex'], text: 'The research team analyzed patterns across three continents, discovering correlations that previous studies had missed due to limited sample sizes and outdated methodologies.' },
  { id: 'adv-5', category: 'Advanced', difficulty: 'advanced', tags: ['complex'], text: 'Architectural design balances aesthetics with engineering constraints. The most elegant solutions emerge when form and function reinforce each other rather than competing for priority.' },
  { id: 'adv-6', category: 'Advanced', difficulty: 'advanced', tags: ['complex'], text: 'Quantum computing challenges our classical understanding of information processing. By harnessing superposition and entanglement, these machines promise exponential speedups for specific problem classes.' },

  // Punctuation
  { id: 'pun-1', category: 'Punctuation', difficulty: 'intermediate', tags: ['punctuation'], text: 'When you write instructions, punctuation guides the reader through each step. Parentheses (like this) add helpful detail, quotes "mark exact words", and commas separate ideas so the meaning stays clear.' },
  { id: 'pun-2', category: 'Punctuation', difficulty: 'advanced', tags: ['punctuation'], text: 'A careful editor listens to the rhythm of a paragraph: commas slow the pace, semicolons connect related thoughts; and colons introduce what comes next. Used well, punctuation makes complex writing easier to follow.' },
  { id: 'pun-3', category: 'Punctuation', difficulty: 'advanced', tags: ['punctuation'], text: 'Before you publish, ask: "What might a reader misunderstand?" If a sentence feels crowded—split it. If a claim sounds vague, revise it with a stronger verb and a specific detail.' },
  { id: 'pun-4', category: 'Punctuation', difficulty: 'intermediate', tags: ['punctuation'], text: 'The package arrived—damaged, unfortunately—so we called customer service. They apologized (sincerely, it seemed) and promised a replacement within 3–5 business days.' },
  { id: 'pun-5', category: 'Punctuation', difficulty: 'advanced', tags: ['punctuation'], text: 'Three options emerged: (1) delay the launch, (2) release with known issues, or (3) invest in additional testing. Each choice carried risks; none was perfect.' },
  { id: 'pun-6', category: 'Punctuation', difficulty: 'advanced', tags: ['punctuation'], text: 'The professor\'s advice was clear: "Read actively—underline, question, summarize. Don\'t just highlight; engage with the text as if you\'re having a conversation with the author."' },

  // Numbers & Symbols
  { id: 'num-1', category: 'Numbers', difficulty: 'intermediate', tags: ['numbers', 'symbols'], text: 'At 7:30 a.m., the team reviewed 42 requests: 17 were still pending, and 5 needed urgent attention. They agreed to finish the critical items first, then return to the rest after lunch.' },
  { id: 'num-2', category: 'Numbers', difficulty: 'advanced', tags: ['numbers', 'symbols'], text: 'The sensor recorded x=12.75 and y=-3.90, then flagged a drift of +0.08. To reduce noise, the filter used a threshold of 1e-3 and ignored any spike that lasted less than 2 seconds.' },
  { id: 'num-3', category: 'Numbers', difficulty: 'advanced', tags: ['numbers', 'symbols'], text: 'In Q4 the budget reached $1,245.60, which was +8.2% higher than the forecast. The manager proposed a 2–3% adjustment for next quarter, but only after confirming which costs were temporary.' },
  { id: 'num-4', category: 'Numbers', difficulty: 'intermediate', tags: ['numbers', 'symbols'], text: 'Room 203 held 28 students; 12 brought laptops, 8 used tablets, and the rest preferred notebooks. The Wi-Fi speed averaged 45 Mbps with latency under 20ms.' },
  { id: 'num-5', category: 'Numbers', difficulty: 'advanced', tags: ['numbers', 'symbols'], text: 'The formula f(x) = 2x² + 3x - 5 yields f(4) = 39. For x ∈ [0,10], the maximum occurs at x=10 where f(10) = 225. The derivative f\'(x) = 4x + 3.' },
  { id: 'num-6', category: 'Numbers', difficulty: 'advanced', tags: ['numbers', 'symbols'], text: 'Order #2024-0897 contained 3×item-A, 2×item-B, and 1×item-C. Total: $156.78 (tax $12.54). Shipping: Zone 3, weight 2.4kg, ETA 2025-01-15.' },

  // Programming-like
  { id: 'code-0', category: 'Programming', difficulty: 'beginner', tags: ['code'], text: 'let total = 0; total = total + 1; if (total >= 3) { total = 0; } // count and reset' },
  { id: 'code-0b', category: 'Programming', difficulty: 'intermediate', tags: ['code'], text: 'function average(nums) { let sum = 0; for (let i = 0; i < nums.length; i++) sum += nums[i]; return nums.length ? sum / nums.length : 0; }' },
  { id: 'code-1', category: 'Programming', difficulty: 'advanced', tags: ['code'], text: 'function formatUser(user) { const name = user?.name ?? "Unknown"; const role = user?.role ?? "guest"; return `${name} (${role})`; } // safe defaults' },
  { id: 'code-2', category: 'Programming', difficulty: 'advanced', tags: ['code'], text: 'const opts = { retries: 3, timeout: 5000 }; async function boot() { for (let i = 0; i < opts.retries; i++) { try { return await init(opts); } catch (e) {} } throw new Error("init failed"); }' },
  { id: 'code-3', category: 'Programming', difficulty: 'advanced', tags: ['code'], text: 'let queue = ["a", "b", "c"]; const seen = new Set(); while (queue.length) { const item = queue.shift(); if (seen.has(item)) continue; seen.add(item); process(item); }' },
  { id: 'code-4', category: 'Programming', difficulty: 'intermediate', tags: ['code'], text: 'const data = { users: [], posts: [] }; function addItem(type, item) { if (data[type]) data[type].push(item); return data[type].length; }' },
  { id: 'code-5', category: 'Programming', difficulty: 'advanced', tags: ['code'], text: 'class Cache { constructor(maxSize = 100) { this.maxSize = maxSize; this.store = new Map(); } set(key, value) { if (this.store.size >= this.maxSize) this.store.delete(this.store.keys().next().value); this.store.set(key, value); } }' },

  // Quotes
  { id: 'quo-0', category: 'Quotes', difficulty: 'beginner', tags: ['quote'], text: '"A good start is quiet and consistent." The work that looks small today becomes the foundation for what you can do tomorrow.' },
  { id: 'quo-1', category: 'Quotes', difficulty: 'intermediate', tags: ['quote'], text: '"The goal is not to rush, but to understand." When you slow down enough to notice patterns, you speed up naturally because you stop repeating the same mistakes.' },
  { id: 'quo-2', category: 'Quotes', difficulty: 'intermediate', tags: ['quote'], text: '"Accuracy builds confidence, and confidence builds speed." A calm rhythm makes space for good decisions, even when the timer is running.' },
  { id: 'quo-3', category: 'Quotes', difficulty: 'advanced', tags: ['quote'], text: '"Discipline is what you choose when motivation is absent." It turns intention into action, and action into momentum that lasts beyond a single good day.' },
  { id: 'quo-4', category: 'Quotes', difficulty: 'intermediate', tags: ['quote'], text: '"Mastery is the sum of small efforts repeated daily." Each practice session adds a layer to your skills, even when progress feels invisible in the moment.' },
  { id: 'quo-5', category: 'Quotes', difficulty: 'advanced', tags: ['quote'], text: '"The expert in anything was once a beginner." What separates them isn\'t talent, but the willingness to be awkward long enough to become graceful.' },
  { id: 'quo-6', category: 'Quotes', difficulty: 'beginner', tags: ['quote'], text: '"Progress happens in the details." The big breakthroughs are just many small improvements that finally become visible to others.' },

  // Lyrics (original, lyric-style)
  { id: 'lyr-1', category: 'Lyrics', difficulty: 'beginner', tags: ['lyrics'], text: 'Breathe in, hold steady, and listen for the beat. The day is moving softly, and your hands can learn the rhythm.' },
  { id: 'lyr-2', category: 'Lyrics', difficulty: 'intermediate', tags: ['lyrics'], text: 'City lights are humming as the night begins to sing. Footsteps on the sidewalk keep time, and every window tells a different story.' },
  { id: 'lyr-3', category: 'Lyrics', difficulty: 'advanced', tags: ['lyrics'], text: 'We trace our names in rainfall, then run before the thunder knows. The street turns silver under lamps, and the air feels sharp with possibility.' },
  { id: 'lyr-4', category: 'Lyrics', difficulty: 'intermediate', tags: ['lyrics'], text: 'The subway car sways gently while headphones play a melody. Strangers share this moment, each lost in their own world but connected by the motion.' },
  { id: 'lyr-5', category: 'Lyrics', difficulty: 'advanced', tags: ['lyrics'], text: 'Neon signs reflect in puddles as the bar door swings open. Laughter spills onto the pavement, mixing with the sound of distant traffic and the promise of dawn.' },
  { id: 'lyr-6', category: 'Lyrics', difficulty: 'beginner', tags: ['lyrics'], text: 'Morning coffee steams in the quiet kitchen. Sunlight streams through the window, illuminating dust motes dancing in the air like tiny stars.' },

  // Longer practice
  { id: 'long-1', category: 'Advanced', difficulty: 'advanced', tags: ['long'], text: 'When fatigue sets in, your attention narrows and your hands begin to press harder than necessary. Instead of forcing speed, slow down for a few seconds and rebuild a clean rhythm. Good posture, a light touch, and steady breathing help you keep control during longer sessions. Once you feel calm again, increase your pace gradually so accuracy stays stable.' },
  { id: 'long-2', category: 'Intermediate', difficulty: 'intermediate', tags: ['long'], text: 'A complex passage is easier when you treat it like a path with markers. First, read the line and notice where punctuation appears, then type it slowly with consistent spacing. After that, repeat the same section and aim for smooth movement rather than speed. When it feels predictable, connect the segments together without pausing, and you will gain speed without losing clarity.' },
  { id: 'long-3', category: 'Advanced', difficulty: 'advanced', tags: ['long'], text: 'Mastery grows from repetition guided by reflection. After each run, ask which mistakes happened more than once and what caused them: unfamiliar words, rushed punctuation, or tense fingers. Then isolate that pattern and practice it on purpose, even if it feels uncomfortable. Over time those corrections compound, and your best results start to look normal instead of rare.' },
  { id: 'long-4', category: 'Advanced', difficulty: 'advanced', tags: ['long'], text: 'The architecture of a well-designed application balances flexibility with simplicity. Each module should have a single responsibility, clear interfaces, and minimal dependencies. When changes are needed, they should affect only the relevant components without cascading through unrelated parts of the system. This approach makes maintenance predictable and reduces the risk of introducing new bugs while fixing existing ones.' },
  { id: 'long-5', category: 'Intermediate', difficulty: 'intermediate', tags: ['long'], text: 'Effective communication requires both clarity and empathy. Before speaking, consider your audience\'s background and what they already know. Structure your message with a clear opening, supporting details, and a concise conclusion. Listen actively to responses, and adjust your explanations based on their questions and reactions. This dialogue creates understanding rather than just transmitting information.' },
  { id: 'long-6', category: 'Advanced', difficulty: 'advanced', tags: ['long'], text: 'Climate change affects ecosystems through interconnected mechanisms. Rising temperatures alter precipitation patterns, shift growing seasons, and disrupt food webs. Species respond differently: some migrate to cooler regions, others adapt in place, and many face extinction. Conservation efforts must address both local impacts and global drivers, requiring cooperation across political boundaries and scientific disciplines to develop effective solutions.' },
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