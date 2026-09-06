import React, { useState, useEffect } from 'react';

const BG = '#0A0908';
const CREAM = '#F5F1E8';
const CARD = '#151412';
const LINE = 'rgba(245,241,232,0.12)';
const INK = '#F5F1E8';
const INK_SOFT = 'rgba(245,241,232,0.6)';
const GOLD = '#C9A968';
const GOLD_DEEP = '#A6863F';

const PILLAR_COLORS = {
  'Educational': { text: '#F5F1E8', dot: '#7A8B99' },
  'Behind-the-scenes': { text: '#F5F1E8', dot: '#9B8AA8' },
  'Social proof': { text: '#F5F1E8', dot: '#7FA88A' },
  'Promotional': { text: '#0A0908', dot: GOLD },
  'Entertaining': { text: '#F5F1E8', dot: '#B98A6B' },
};
const PILLARS = Object.keys(PILLAR_COLORS);

const BEST_TIMES = {
  instagram: '11am\u20132pm or 7\u20139pm', tiktok: '6\u20139am or 7\u201310pm', linkedin: 'Tue\u2013Thu, 8\u201310am',
  facebook: '1\u20134pm', telegram: '9\u201311am or 6\u20138pm', x: '8\u20139am or 6\u20139pm', reddit: 'weekday mornings',
  youtube: '2\u20134pm or 7\u20139pm',
};

const DAILY_LIMIT = 50;
const DAILY_KEY = 'cs_daily_gens';

function getDailyCount() {
  const today = new Date().toISOString().slice(0, 10);
  let record;
  try { record = JSON.parse(localStorage.getItem(DAILY_KEY) || 'null'); } catch (e) { record = null; }
  if (!record || record.date !== today) return 0;
  return record.count;
}
function checkAndUseDailyLimit() {
  const today = new Date().toISOString().slice(0, 10);
  let record;
  try { record = JSON.parse(localStorage.getItem(DAILY_KEY) || 'null'); } catch (e) { record = null; }
  if (!record || record.date !== today) record = { date: today, count: 0 };
  if (record.count >= DAILY_LIMIT) return false;
  record.count += 1;
  localStorage.setItem(DAILY_KEY, JSON.stringify(record));
  return true;
}

const PLATFORMS = [
  { code: 'instagram', label: 'Instagram' }, { code: 'tiktok', label: 'TikTok' },
  { code: 'linkedin', label: 'LinkedIn' }, { code: 'facebook', label: 'Facebook' },
  { code: 'telegram', label: 'Telegram' }, { code: 'x', label: 'X' }, { code: 'reddit', label: 'Reddit' },
  { code: 'youtube', label: 'YouTube' },
];

const MODES = [
  { value: 'single', label: 'Single platform' },
  { value: 'cross', label: 'Cross-platform' },
  { value: 'competitor', label: 'Competitor gap' },
];

const LANGS = [
  { code: 'en', label: 'English' }, { code: 'ru', label: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439' }, { code: 'es', label: 'Espa\u00f1ol' },
  { code: 'zh', label: '\u4e2d\u6587' }, { code: 'ar', label: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629' }, { code: 'pt', label: 'Portugu\u00eas' },
  { code: 'hi', label: '\u0939\u093f\u0928\u094d\u0926\u0940' }, { code: 'fr', label: 'Fran\u00e7ais' }, { code: 'vi', label: 'Ti\u1ebfng Vi\u1ec7t' },
  { code: 'ko', label: '\ud55c\uad6d\uc5b4' }, { code: 'tr', label: 'T\u00fcrk\u00e7e' }, { code: 'de', label: 'Deutsch' },
  { code: 'ja', label: '\u65e5\u672c\u8a9e' }, { code: 'it', label: 'Italiano' }, { code: 'pl', label: 'Polski' },
  { code: 'fa', label: '\u0641\u0627\u0631\u0633\u06cc' }, { code: 'uk', label: '\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430' }, { code: 'nl', label: 'Nederlands' },
  { code: 'th', label: '\u0e44\u0e17\u0e22' }, { code: 'id', label: 'Bahasa Indonesia' },
];

const STAT_CUBES = [
  { n: '08', label: 'Platforms', desc: 'Instagram, TikTok, LinkedIn, Facebook, Telegram, X, Reddit, and YouTube -- each platform gets ideas tailored to what actually works there.' },
  { n: '05', label: 'Pillars', desc: 'Educational, Behind-the-scenes, Social proof, Promotional, and Entertaining -- automatically balanced across your week.' },
  { n: '20', label: 'Languages', desc: 'Explanations and ideas available in 20 languages, including right-to-left support for Arabic and Persian.' },
  { n: '50', label: 'Daily Limit', desc: 'Fifty generations per day -- enough for real, ongoing use, without opening the door to abuse.' },
  { n: '1', label: 'Free Trial', desc: 'Try one full generation before you buy. No code, no commitment.' },
  { n: 'Once', label: 'Payment', desc: 'A single one-time payment. No subscription, no recurring charge, ever.' },
];

const UI_TEXT = {
  en: {
    subtitle: 'A week of ideas, considered per platform. For teams who plan with intention.',
    about: 'Content Strategist AI builds a week of post ideas at a time -- not captions, but the underlying topic for each day, matched to what actually works on that specific platform. Choose one platform, or plan across several at once. Paste a competitor\u2019s post to find the gap you can fill.',
  },
  ru: {
    subtitle: 'Неделя идей, продуманных под платформу. Для команд, которые планируют осознанно.',
    about: 'Content Strategist AI строит неделю идей для постов за раз — не подписи, а саму тему на каждый день, подобранную под то, что реально работает именно на этой платформе. Выбери одну платформу или планируй сразу по нескольким. Вставь пост конкурента, чтобы найти пробел, который можно занять.',
  },
  es: {
    subtitle: 'Una semana de ideas, pensadas por plataforma. Para equipos que planifican con intenci\u00f3n.',
    about: 'Content Strategist AI construye una semana de ideas de publicaciones a la vez -- no subt\u00edtulos, sino el tema de cada d\u00eda, ajustado a lo que realmente funciona en esa plataforma. Elige una plataforma, o planifica varias a la vez. Pega el post de un competidor para encontrar el hueco que puedes llenar.',
  },
};

// Маленький значок-созвездие (узел в центре + точки вокруг, соединённые
// линиями), используется как декоративный плавающий элемент в пустых
// полях по краям страницы — не на весь экран, чтобы не перекрывать контент.
function ConstellationMark({ className = '', style = {} }) {
  const pts = [
    [50, 10], [25, 30], [50, 30], [75, 30],
    [10, 50], [30, 50], [50, 50], [70, 50], [90, 50],
    [25, 70], [50, 70], [75, 70], [50, 90],
  ];
  const lines = [
    [1, 2], [2, 3], [4, 5], [5, 6], [6, 7], [7, 8],
    [1, 5], [3, 7], [9, 10], [10, 11], [5, 9], [7, 11], [10, 12], [6, 3], [6, 1], [6, 9], [6, 11],
  ];
  return (
    <svg className={`float-constellation ${className}`} style={{ opacity: 0.28, pointerEvents: 'none', ...style }} viewBox="0 0 100 100">
      {lines.map(([a, b], i) => (
        <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} stroke="#C9A968" strokeWidth="0.8" />
      ))}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 6 ? 3 : 2} fill={i === 6 ? '#C9A968' : '#F5F1E8'} />
      ))}
    </svg>
  );
}

export default function App() {
  const [licenseCode, setLicenseCode] = useState(() => localStorage.getItem('cs_licenseCode') || '');
  const [unlocked, setUnlocked] = useState(() => localStorage.getItem('cs_unlocked') === 'true');
  const [freeTrialUsed, setFreeTrialUsed] = useState(() => localStorage.getItem('cs_free_trial_used') === 'true');
  const [dailyCount, setDailyCount] = useState(() => getDailyCount());
  const [showSupportEmail, setShowSupportEmail] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [uiLang, setUiLang] = useState('en');
  const [expandedStat, setExpandedStat] = useState(null);
  const [regeneratingDay, setRegeneratingDay] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const [businessType, setBusinessType] = useState('');
  const [occasion, setOccasion] = useState('');
  const [audience, setAudience] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['instagram', 'tiktok']);
  const [mode, setMode] = useState('single');
  const [competitorText, setCompetitorText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (window.location.search.includes('welcome=1')) {
      setShowWelcome(true);
      window.history.replaceState({}, '', window.location.pathname);
      const timer = setTimeout(() => setShowWelcome(false), 3800);
      return () => clearTimeout(timer);
    }
  }, []);

  function togglePlatform(code) {
    setSelectedPlatforms(prev => prev.includes(code) ? prev.filter(p => p !== code) : [...prev, code]);
  }

  function copyAllIdeas() {
    if (!result?.ideas) return;
    const text = result.ideas.map(it => `${it.day}${it.platform ? ` (${it.platform})` : ''}: ${it.idea}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1800);
  }

  async function regenerateDay(index) {
    if (!unlocked) return;
    if (!checkAndUseDailyLimit()) { setDailyCount(DAILY_LIMIT); return; }
    setDailyCount(getDailyCount());
    setRegeneratingDay(index);
    const oldIdea = result.ideas[index];
    const prompt = `Give ONE new alternative post idea for ${oldIdea.day}, platform "${oldIdea.platform}", different from: "${oldIdea.idea}". Same content pillar: ${oldIdea.pillar}. Business: ${businessType}.
Respond ONLY with valid JSON: {"day": "${oldIdea.day}", "platform": "${oldIdea.platform}", "pillar": "${oldIdea.pillar}", "idea": "...", "hashtags": ["...", "...", "..."]}`;
    try {
      const res = await fetch('/api/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseCode, prompt, trial: false }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || '').join('') || '';
      const newIdea = JSON.parse(text.replace(/```json|```/g, '').trim());
      setResult(r => { const next = { ...r, ideas: [...r.ideas] }; next.ideas[index] = newIdea; return next; });
    } catch (err) {
      setError('Could not regenerate that day.');
    } finally {
      setRegeneratingDay(null);
    }
  }

  async function handleGenerate() {
    if ((mode === 'single' || mode === 'cross') && !businessType.trim()) { setError('Tell us what your business does first.'); return; }
    if (mode === 'cross' && selectedPlatforms.length < 2) { setError('Pick at least 2 platforms.'); return; }
    if (mode === 'competitor' && !competitorText.trim()) { setError('Paste a competitor\u2019s post first.'); return; }
    const isTrial = !unlocked && !freeTrialUsed;
    if (!unlocked && freeTrialUsed) { setError('Free preview used. Enter your access code to continue.'); return; }
    if (!isTrial) {
      if (!checkAndUseDailyLimit()) { setDailyCount(DAILY_LIMIT); return; }
      setDailyCount(getDailyCount());
    }
    setError(''); setLoading(true); setResult(null);

    const platformLabel = PLATFORMS.find(p => p.code === platform)?.label || platform;
    const selectedLabels = selectedPlatforms.map(c => PLATFORMS.find(p => p.code === c)?.label || c);

    let prompt;
    if (mode === 'single') {
      prompt = `You are a social media content strategist. Give a week of post IDEAS (topics, not captions) for ${platformLabel}.
Business: ${businessType}. Occasion: ${occasion || 'none specific'}. Audience: ${audience || 'general'}.
Give exactly 7 ideas, one per day, tailored to ${platformLabel}. Assign a content pillar from: ${PILLARS.join(', ')} to each, don't repeat more than twice, include 2-3 hashtags each.
Respond ONLY with valid JSON: {"ideas": [{"day": "Monday", "platform": "${platformLabel}", "pillar": "...", "idea": "...", "hashtags": ["...","...","..."]}, ...7 total]}`;
    } else if (mode === 'cross') {
      prompt = `You are a social media content strategist building a cross-platform calendar.
Business: ${businessType}. Occasion: ${occasion || 'none specific'}. Audience: ${audience || 'general'}. Platforms: ${selectedLabels.join(', ')}.
Give exactly 7 ideas, one per day, picking the best platform per idea from the list. Assign a content pillar from: ${PILLARS.join(', ')}, don't repeat more than twice, include 2-3 hashtags each.
Respond ONLY with valid JSON: {"ideas": [{"day": "Monday", "platform": "one of: ${selectedLabels.join(', ')}", "pillar": "...", "idea": "...", "hashtags": ["...","...","..."]}, ...7 total]}`;
    } else {
      prompt = `Find what a competitor is missing on ${platformLabel} and suggest a unique angle.
Business: ${businessType || 'small business'}. Competitor content: "${competitorText}".
Respond ONLY with valid JSON: {"gap": "...", "angle": "...", "ideaExample": "..."}`;
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseCode, prompt, trial: isTrial }),
      });
      if (res.status === 403) throw new Error('Invalid or expired access code.');
      const data = await res.json();
      const text = data.content?.map(b => b.text || '').join('') || '';
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
      if (isTrial) { localStorage.setItem('cs_free_trial_used', 'true'); setFreeTrialUsed(true); }
      setResult(parsed);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: BG, color: INK, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600&family=Inter:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .gold-line { background: linear-gradient(90deg, transparent, ${GOLD}, transparent); background-size: 200% 100%; animation: shimmer 4s linear infinite; }
        @keyframes cardIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .idea-row { animation: cardIn 0.5s ease both; }
        @keyframes welcomeFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes welcomeFadeOut { to { opacity: 0; } }
        @keyframes checkDraw { from { stroke-dashoffset: 40; } to { stroke-dashoffset: 0; } }
        @keyframes floatMark {
          0%   { transform: translate(0, 0) rotate(0deg); }
          50%  { transform: translate(10px, -18px) rotate(8deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        .float-constellation { animation: floatMark 8s ease-in-out infinite; }
        .constellation-1 { animation-duration: 9s; }
        .constellation-2 { animation-duration: 7s; animation-delay: -2s; }
        .constellation-3 { animation-duration: 10s; animation-delay: -4s; }
        button { transition: all 0.2s ease; }
        button:hover:not(:disabled) { transform: translateY(-1px); }
        .platform-pill:hover { border-color: ${GOLD} !important; color: ${GOLD} !important; }
        @keyframes allowanceFill { from { width: 0; } }
        .allowance-fill { animation: allowanceFill 0.8s ease both; }
      `}</style>

      {/* Три маленьких значка-созвездия, плавающие в пустых чёрных полях по краям */}
      <ConstellationMark className="constellation-1" style={{ position: 'fixed', top: '15%', left: '3%', width: 90 }} />
      <ConstellationMark className="constellation-2" style={{ position: 'fixed', top: '55%', right: '3%', width: 70 }} />
      <ConstellationMark className="constellation-3" style={{ position: 'fixed', bottom: '8%', left: '5%', width: 60 }} />

      {/* ---------- HERO: тёмный фон, фото в дуотоне, крупная serif-типографика ---------- */}
      <div style={{ position: 'relative', padding: '24px 24px 0', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: 900, margin: '0 auto 40px' }}>
          <select
            value={uiLang}
            onChange={(e) => setUiLang(e.target.value)}
            style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: '0.08em', color: GOLD, background: 'none', border: `1px solid ${LINE}`, borderRadius: 2, padding: '4px 10px' }}
          >
            {LANGS.map(l => <option key={l.code} value={l.code} style={{ background: BG }}>{l.label}</option>)}
          </select>
        </div>
        <div className="fade-in" style={{ maxWidth: 720, margin: '0 auto' }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD }}>Plainwork Studio</span>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 'clamp(38px, 6vw, 58px)', margin: '18px 0 20px', lineHeight: 1.08, letterSpacing: '-0.01em' }}>
            Content Strategist
          </h1>
          <div className="gold-line" style={{ height: 1, width: 70, margin: '0 auto 22px' }} />
          <p style={{ fontSize: 16, color: INK_SOFT, fontWeight: 300, lineHeight: 1.6, maxWidth: 420, margin: '0 auto' }}>
            {(UI_TEXT[uiLang] || UI_TEXT.en).subtitle}
          </p>
        </div>

        <div className="fade-in" style={{ animationDelay: '0.15s', maxWidth: 900, margin: '48px auto 0', position: 'relative' }}>
          <div style={{ borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
            <img
              src="/images/hero-team.jpg" alt="Team planning content strategy together"
              style={{ width: '100%', height: 'auto', display: 'block', filter: 'grayscale(0.45) contrast(1.08) brightness(0.92)' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 40%, ${BG} 100%)` }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(201,169,104,0.06)', mixBlendMode: 'overlay' }} />
          </div>
        </div>

        <div className="fade-in" style={{ animationDelay: '0.3s', maxWidth: 680, margin: '0 auto', padding: '8px 0 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {STAT_CUBES.map((s) => (
              <button
                key={s.label}
                onClick={() => setExpandedStat(expandedStat === s.label ? null : s.label)}
                style={{
                  textAlign: 'center', border: `1px solid ${expandedStat === s.label ? GOLD : LINE}`, borderRadius: 3, padding: '16px 6px',
                  background: expandedStat === s.label ? 'rgba(201,169,104,0.08)' : 'rgba(201,169,104,0.03)',
                  cursor: 'pointer', color: 'inherit', fontFamily: 'inherit',
                }}
              >
                <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 22, color: GOLD }}>{s.n}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: INK_SOFT, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{s.label}</div>
              </button>
            ))}
          </div>
          {expandedStat && (
            <p style={{ fontSize: 13, color: INK_SOFT, lineHeight: 1.6, textAlign: 'center', marginTop: 16, fontWeight: 300 }}>
              {STAT_CUBES.find(s => s.label === expandedStat)?.desc}
            </p>
          )}
        </div>

        <div className="fade-in" style={{ animationDelay: '0.4s', maxWidth: 720, margin: '0 auto', padding: '32px 0 60px', borderTop: `1px solid ${LINE}` }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD }}>About</span>
          <p style={{ fontSize: 14.5, color: INK_SOFT, fontWeight: 300, lineHeight: 1.7, margin: '14px 0 0' }}>
            {(UI_TEXT[uiLang] || UI_TEXT.en).about}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 100px' }}>

        {!unlocked && (
          <div style={{ border: `1px solid ${freeTrialUsed ? 'rgba(201,120,104,0.4)' : LINE}`, borderRadius: 4, padding: 18, marginBottom: 32 }}>
            {freeTrialUsed ? (
              <div>
                <p style={{ fontSize: 13.5, color: INK, margin: '0 0 12px', fontWeight: 400 }}>Your complimentary preview has been used. Enter your code to continue.</p>
                <a href="/unlock.html" style={{ display: 'inline-block', border: `1px solid ${GOLD}`, color: GOLD, padding: '9px 20px', borderRadius: 2, fontSize: 12.5, fontWeight: 500, textDecoration: 'none', letterSpacing: '0.04em' }}>
                  ENTER YOUR CODE
                </a>
                <a href="/buy.html" style={{ display: 'block', fontSize: 12, color: INK_SOFT, marginTop: 10 }}>No code? Get access</a>
              </div>
            ) : (
              <p style={{ fontSize: 13.5, color: INK_SOFT, margin: 0 }}>Your first generation is complimentary. No code required.</p>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: 0, marginBottom: 28, borderBottom: `1px solid ${LINE}` }}>
          {MODES.map(m => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              style={{
                flex: 1, padding: '12px 8px', fontSize: 12, fontWeight: 500, letterSpacing: '0.03em', cursor: 'pointer',
                background: 'none', color: mode === m.value ? GOLD : INK_SOFT,
                border: 'none', borderBottom: mode === m.value ? `1px solid ${GOLD}` : '1px solid transparent',
                marginBottom: -1, transition: 'color 0.2s',
              }}
            >
              {m.label.toUpperCase()}
            </button>
          ))}
        </div>

        {mode !== 'competitor' && (
          <>
            <label style={{ fontSize: 11, color: INK_SOFT, letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>WHAT DOES YOUR BUSINESS DO</label>
            <input type="text" value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder="Neighborhood coffee shop"
              style={{ width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${LINE}`, color: INK, fontSize: 15, padding: '8px 0', marginBottom: 22, boxSizing: 'border-box', outline: 'none' }} />

            <label style={{ fontSize: 11, color: INK_SOFT, letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>SEASON OR OCCASION <span style={{ opacity: 0.5 }}>(OPTIONAL)</span></label>
            <input type="text" value={occasion} onChange={(e) => setOccasion(e.target.value)} placeholder="Holiday season"
              style={{ width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${LINE}`, color: INK, fontSize: 15, padding: '8px 0', marginBottom: 22, boxSizing: 'border-box', outline: 'none' }} />

            <label style={{ fontSize: 11, color: INK_SOFT, letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>YOUR AUDIENCE <span style={{ opacity: 0.5 }}>(OPTIONAL)</span></label>
            <input type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Busy parents, 30s-40s"
              style={{ width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${LINE}`, color: INK, fontSize: 15, padding: '8px 0', marginBottom: 26, boxSizing: 'border-box', outline: 'none' }} />
          </>
        )}

        {mode === 'single' && (
          <>
            <label style={{ fontSize: 11, color: INK_SOFT, letterSpacing: '0.04em', display: 'block', marginBottom: 10 }}>PLATFORM</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 26 }}>
              {PLATFORMS.map(p => (
                <button key={p.code} onClick={() => setPlatform(p.code)} className="platform-pill"
                  style={{
                    padding: '7px 14px', borderRadius: 2, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s ease',
                    background: platform === p.code ? GOLD : 'none',
                    color: platform === p.code ? BG : INK_SOFT,
                    border: `1px solid ${platform === p.code ? GOLD : LINE}`,
                  }}>
                  {p.label}
                </button>
              ))}
            </div>
          </>
        )}

        {mode === 'cross' && (
          <>
            <label style={{ fontSize: 11, color: INK_SOFT, letterSpacing: '0.04em', display: 'block', marginBottom: 10 }}>PLATFORMS <span style={{ opacity: 0.5 }}>(PICK 2 OR MORE)</span></label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 26 }}>
              {PLATFORMS.map(p => (
                <button key={p.code} onClick={() => togglePlatform(p.code)}
                  style={{
                    padding: '7px 14px', borderRadius: 2, fontSize: 12, cursor: 'pointer',
                    background: selectedPlatforms.includes(p.code) ? GOLD : 'none',
                    color: selectedPlatforms.includes(p.code) ? BG : INK_SOFT,
                    border: `1px solid ${selectedPlatforms.includes(p.code) ? GOLD : LINE}`,
                  }}>
                  {p.label}
                </button>
              ))}
            </div>
          </>
        )}

        {mode === 'competitor' && (
          <>
            <label style={{ fontSize: 11, color: INK_SOFT, letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>YOUR BUSINESS <span style={{ opacity: 0.5 }}>(OPTIONAL)</span></label>
            <input type="text" value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder="Neighborhood coffee shop"
              style={{ width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${LINE}`, color: INK, fontSize: 15, padding: '8px 0', marginBottom: 22, boxSizing: 'border-box', outline: 'none' }} />
            <label style={{ fontSize: 11, color: INK_SOFT, letterSpacing: '0.04em', display: 'block', marginBottom: 10 }}>PLATFORM</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
              {PLATFORMS.map(p => (
                <button key={p.code} onClick={() => setPlatform(p.code)}
                  style={{
                    padding: '7px 14px', borderRadius: 2, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s ease',
                    background: platform === p.code ? GOLD : 'none',
                    color: platform === p.code ? BG : INK_SOFT,
                    border: `1px solid ${platform === p.code ? GOLD : LINE}`,
                  }}>
                  {p.label}
                </button>
              ))}
            </div>
            <label style={{ fontSize: 11, color: INK_SOFT, letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>COMPETITOR'S POST OR PROFILE</label>
            <textarea value={competitorText} onChange={(e) => setCompetitorText(e.target.value)} rows={4} placeholder="Paste it here..."
              style={{ width: '100%', background: 'none', border: `1px solid ${LINE}`, color: INK, fontSize: 14, padding: '10px 12px', marginBottom: 26, boxSizing: 'border-box', outline: 'none', resize: 'vertical' }} />
          </>
        )}

        {error && <p style={{ fontSize: 13, color: '#D98E7F', margin: '0 0 16px' }}>{error}</p>}

        {dailyCount >= DAILY_LIMIT ? (
          <div style={{ textAlign: 'center', padding: 16, border: `1px solid ${LINE}` }}>
            <p style={{ fontSize: 13, color: INK, margin: 0 }}>Today's allowance is complete.</p>
            <p style={{ fontSize: 12, color: INK_SOFT, margin: '4px 0 0' }}>Fifty more await tomorrow.</p>
          </div>
        ) : (
          <button onClick={handleGenerate} disabled={loading}
            style={{
              width: '100%', padding: '15px', fontSize: 13, letterSpacing: '0.08em', fontWeight: 500, cursor: 'pointer',
              background: GOLD, color: BG, border: 'none', borderRadius: 2, opacity: loading ? 0.6 : 1,
            }}>
            {loading ? 'CONSIDERING...' : mode === 'competitor' ? 'FIND THE GAP' : 'BUILD THE WEEK'}
          </button>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
          <span style={{ fontSize: 10, color: INK_SOFT, letterSpacing: '0.03em' }}>DAILY ALLOWANCE</span>
          <span style={{ fontSize: 10, color: INK_SOFT }}>{DAILY_LIMIT - dailyCount} / {DAILY_LIMIT}</span>
        </div>
        <div style={{ height: 1, background: LINE, marginTop: 6 }}>
          <div className="allowance-fill" style={{ height: '100%', width: `${(dailyCount / DAILY_LIMIT) * 100}%`, background: GOLD, transition: 'width 0.5s ease' }} />
        </div>

        {result && result.ideas && (
          <div style={{ marginTop: 48 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
              <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 20, color: INK }}>The Week</span>
              <button onClick={copyAllIdeas} style={{ fontSize: 11, color: GOLD, background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.04em' }}>
                {copiedAll ? 'COPIED' : 'COPY ALL'}
              </button>
            </div>

            {result.ideas.map((it, i) => {
              const pc = PILLAR_COLORS[it.pillar] || PILLAR_COLORS['Educational'];
              const plat = PLATFORMS.find(p => p.label === it.platform);
              const bestTime = plat ? BEST_TIMES[plat.code] : null;
              return (
                <div key={i} className="idea-row" style={{ animationDelay: `${i * 0.06}s`, padding: '20px 0', borderTop: `1px solid ${LINE}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: INK_SOFT, letterSpacing: '0.05em' }}>{it.day?.toUpperCase()}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {it.platform && <span style={{ fontSize: 10.5, color: INK_SOFT }}>{it.platform}</span>}
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: pc.dot, display: 'inline-block' }} />
                      <span style={{ fontSize: 10.5, color: INK_SOFT }}>{it.pillar}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 16, color: INK, margin: '0 0 10px', lineHeight: 1.5, fontWeight: 300 }}>{it.idea}</p>
                  {it.hashtags && it.hashtags.length > 0 && (
                    <p style={{ fontSize: 12, color: GOLD, margin: '0 0 6px', opacity: 0.85 }}>{it.hashtags.map(h => `#${h.replace(/^#/, '')}`).join('  ')}</p>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {bestTime && <span style={{ fontSize: 10.5, color: INK_SOFT }}>Best time: {bestTime}</span>}
                    {unlocked && (
                      <button onClick={() => regenerateDay(i)} disabled={regeneratingDay === i}
                        style={{ fontSize: 10.5, color: GOLD, background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.02em' }}>
                        {regeneratingDay === i ? 'REGENERATING...' : 'TRY ANOTHER'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {result && result.gap && (
          <div style={{ marginTop: 48 }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: GOLD, letterSpacing: '0.08em', marginBottom: 10 }}>WHAT THEY'RE MISSING</div>
            <p style={{ fontSize: 16, color: INK, marginBottom: 26, lineHeight: 1.6, fontWeight: 300 }}>{result.gap}</p>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: GOLD, letterSpacing: '0.08em', marginBottom: 10 }}>YOUR ANGLE</div>
            <p style={{ fontSize: 16, color: INK, marginBottom: 26, lineHeight: 1.6, fontWeight: 300 }}>{result.angle}</p>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: GOLD, letterSpacing: '0.08em', marginBottom: 10 }}>TRY THIS</div>
            <p style={{ fontSize: 16, color: INK, margin: 0, lineHeight: 1.6, fontWeight: 300 }}>{result.ideaExample}</p>
          </div>
        )}

        {showWelcome && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', animation: 'welcomeFadeIn 0.5s ease both' }}>
            <div style={{ textAlign: 'center', animation: 'welcomeFadeOut 0.5s ease 3.3s both' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.2" style={{ marginBottom: 20 }}>
                <polyline points="20 6 9 17 4 12" style={{ strokeDasharray: 40, animation: 'checkDraw 0.6s ease 0.4s both' }} />
              </svg>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 28, color: INK, margin: '0 0 8px' }}>Welcome</h2>
              <p style={{ fontSize: 14, color: INK_SOFT, margin: 0, fontWeight: 300 }}>Unlimited generations, from here on.</p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 80, paddingTop: 32, borderTop: `1px solid ${LINE}` }}>
          <span style={{ fontSize: 11, color: INK_SOFT, letterSpacing: '0.03em' }}>POWERED BY CLAUDE &middot; PLAINWORK BY KSENIA</span>
          <div style={{ display: 'flex', gap: 18, marginTop: 4 }}>
            <a href="/terms.html" style={{ fontSize: 10.5, color: INK_SOFT }}>Terms</a>
            <a href="/privacy.html" style={{ fontSize: 10.5, color: INK_SOFT }}>Privacy</a>
          </div>
          {!showSupportEmail ? (
            <button onClick={() => setShowSupportEmail(true)} style={{ fontSize: 10.5, color: GOLD, background: 'none', border: 'none', cursor: 'pointer' }}>Support</button>
          ) : (
            <a href="mailto:kssw117@gmail.com" style={{ fontSize: 10.5, color: GOLD }}>kssw117@gmail.com</a>
          )}
        </div>
      </div>
    </div>
  );
}
