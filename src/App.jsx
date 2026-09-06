import React, { useState, useEffect } from 'react';

const BG = '#FFFFFF';
const CARD = '#FAFAFA';
const LINE = '#E8EAED';
const INK = '#1F1F1F';
const INK_SOFT = '#5F6368';
const RUST = '#D97757';
const RUST_DEEP = '#BD5D3A';

const PILLAR_COLORS = {
  'Educational': { bg: '#E6F1FB', text: '#0C447C', dot: '#4285F4' },
  'Behind-the-scenes': { bg: '#F1EBFB', text: '#5B2E8C', dot: '#8B5CF6' },
  'Social proof': { bg: '#EAF3DE', text: '#27500A', dot: '#34A853' },
  'Promotional': { bg: '#FBEFEA', text: '#8A3D22', dot: RUST },
  'Entertaining': { bg: '#FCF3DC', text: '#7A5200', dot: '#F5A623' },
};
const PILLARS = Object.keys(PILLAR_COLORS);

const BEST_TIMES = {
  instagram: '11am\u20132pm or 7\u20139pm',
  tiktok: '6\u20139am or 7\u201310pm',
  linkedin: 'Tue\u2013Thu, 8\u201310am',
  facebook: '1\u20134pm',
  telegram: '9\u201311am or 6\u20138pm',
  x: '8\u20139am or 6\u20139pm',
  reddit: 'weekday mornings (varies by subreddit)',
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
  { code: 'instagram', label: 'Instagram', color: '#D62976' },
  { code: 'tiktok', label: 'TikTok', color: '#111111' },
  { code: 'linkedin', label: 'LinkedIn', color: '#0A66C2' },
  { code: 'facebook', label: 'Facebook', color: '#1877F2' },
  { code: 'telegram', label: 'Telegram', color: '#26A5E4' },
  { code: 'x', label: 'X', color: '#111111' },
  { code: 'reddit', label: 'Reddit', color: '#FF4500' },
];

const MODES = [
  { value: 'single', label: 'Single platform' },
  { value: 'cross', label: 'Cross-platform calendar' },
  { value: 'competitor', label: 'Competitor gap' },
];

export default function App() {
  const [licenseCode, setLicenseCode] = useState(() => localStorage.getItem('cs_licenseCode') || '');
  const [unlocked, setUnlocked] = useState(() => localStorage.getItem('cs_unlocked') === 'true');
  const [freeTrialUsed, setFreeTrialUsed] = useState(() => localStorage.getItem('cs_free_trial_used') === 'true');
  const [dailyCount, setDailyCount] = useState(() => getDailyCount());
  const [showSupportEmail, setShowSupportEmail] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [history, setHistory] = useState([]);
  const [copiedAll, setCopiedAll] = useState(false);

  const [businessType, setBusinessType] = useState('');
  const [occasion, setOccasion] = useState('');
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
    setSelectedPlatforms(prev =>
      prev.includes(code) ? prev.filter(p => p !== code) : [...prev, code]
    );
  }

  function copyAllIdeas() {
    if (!result?.ideas) return;
    const text = result.ideas.map(it => `${it.day}${it.platform ? ` (${it.platform})` : ''}: ${it.idea}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1800);
  }

  // Сводка баланса content pillars за неделю — сколько раз встретилась
  // каждая категория, в виде мини-полосок
  function pillarSummary(ideas) {
    const counts = {};
    PILLARS.forEach(p => counts[p] = 0);
    ideas.forEach(it => { if (counts[it.pillar] !== undefined) counts[it.pillar]++; });
    return counts;
  }

  async function handleGenerate() {
    if ((mode === 'single' || mode === 'cross') && !businessType.trim()) {
      setError('Tell us what your business does first.');
      return;
    }
    if (mode === 'cross' && selectedPlatforms.length < 2) {
      setError('Pick at least 2 platforms for a cross-platform calendar.');
      return;
    }
    if (mode === 'competitor' && !competitorText.trim()) {
      setError('Paste a competitor\u2019s post or description first.');
      return;
    }
    const isTrial = !unlocked && !freeTrialUsed;
    if (!unlocked && freeTrialUsed) {
      setError('Free preview used. Enter your access code to continue.');
      return;
    }
    if (!isTrial) {
      if (!checkAndUseDailyLimit()) {
        setDailyCount(DAILY_LIMIT);
        return;
      }
      setDailyCount(getDailyCount());
    }
    setError('');
    setLoading(true);
    setResult(null);

    const platformLabel = PLATFORMS.find(p => p.code === platform)?.label || platform;
    const selectedLabels = selectedPlatforms.map(c => PLATFORMS.find(p => p.code === c)?.label || c);

    let prompt;
    if (mode === 'single') {
      prompt = `You are a social media content strategist. A small business owner needs a week of post IDEAS (topics, not captions) for ${platformLabel}, plus 2-3 relevant hashtags for each.

Business type: ${businessType}
Occasion/season: ${occasion || 'no specific occasion, just a normal week'}

Give exactly 7 post ideas, one per day, tailored to what actually performs well on ${platformLabel} specifically.
For each idea, assign one content pillar from this exact list: ${PILLARS.join(', ')}. Spread the 7 ideas across different pillars -- don't repeat the same pillar more than twice.

Respond ONLY with valid JSON, no markdown, no code fences:
{"ideas": [{"day": "Monday", "platform": "${platformLabel}", "pillar": "...", "idea": "...", "hashtags": ["...", "...", "..."]}, ...7 total]}`;
    } else if (mode === 'cross') {
      prompt = `You are a social media content strategist building a cross-platform content calendar for a small business.

Business type: ${businessType}
Occasion/season: ${occasion || 'no specific occasion, just a normal week'}
Platforms in use: ${selectedLabels.join(', ')}

Build exactly 7 post ideas, one per day, and for EACH day pick the single best platform from the list for that specific idea. For each idea, assign one content pillar from this exact list: ${PILLARS.join(', ')}, don't repeat the same pillar more than twice, and give 2-3 relevant hashtags.

Respond ONLY with valid JSON, no markdown, no code fences:
{"ideas": [{"day": "Monday", "platform": "one of: ${selectedLabels.join(', ')}", "pillar": "...", "idea": "...", "hashtags": ["...", "...", "..."]}, ...7 total]}`;
    } else {
      prompt = `You are a competitive social media strategist. A small business owner pasted a competitor's post or profile description for ${platformLabel}. Find what the competitor is missing and suggest a unique angle.

Business type: ${businessType || 'a small business (type not specified)'}
Competitor's content: "${competitorText}"

Respond ONLY with valid JSON, no markdown, no code fences:
{"gap": "what the competitor is missing, 1-2 sentences", "angle": "the specific unique angle to use instead, 1-2 sentences", "ideaExample": "one concrete post idea example using this angle"}`;
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseCode, prompt, trial: isTrial }),
      });
      if (res.status === 403) throw new Error('Invalid or expired access code.');
      const data = await res.json();
      const text = data.content?.map(b => b.text || '').join('') || '';
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      if (isTrial) {
        localStorage.setItem('cs_free_trial_used', 'true');
        setFreeTrialUsed(true);
      }
      setResult(parsed);
      if (parsed.ideas) {
        setHistory(h => [{ mode, time: Date.now(), count: parsed.ideas.length }, ...h].slice(0, 5));
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: BG, color: INK, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
        @keyframes heroReveal { from { opacity: 0; transform: scale(1.04); } to { opacity: 1; transform: scale(1); } }
        .hero-photo { animation: heroReveal 0.9s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes titleSlide { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .hero-title { animation: titleSlide 0.6s ease both; }
        @keyframes barGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .pillar-bar-fill { transform-origin: left; animation: barGrow 0.7s ease both; }
        @keyframes cardIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .idea-card { animation: cardIn 0.4s ease both; }
        @keyframes welcomeFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes welcomeFadeOut { to { opacity: 0; } }
        @keyframes checkDraw { from { stroke-dashoffset: 40; } to { stroke-dashoffset: 0; } }
        @keyframes ringPop { 0% { transform: scale(0.4); opacity: 0; } 60% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes floatIcon {
          0%   { transform: translate(0, 0) rotate(-6deg); }
          50%  { transform: translate(6px, -12px) rotate(4deg); }
          100% { transform: translate(0, 0) rotate(-6deg); }
        }
        .float-icon { animation: floatIcon 4.5s ease-in-out infinite; }
        .icon-blue { animation-duration: 4.2s; }
        .icon-red { animation-duration: 3.8s; animation-delay: -1s; }
        .icon-yellow { animation-duration: 5s; animation-delay: -2s; }
        .icon-green { animation-duration: 4s; animation-delay: -0.5s; }
        @keyframes floatDot { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .float-dot { animation: floatDot 3.6s ease-in-out infinite; }
        .dot-1 { animation-delay: -0.3s; } .dot-2 { animation-delay: -1.2s; } .dot-3 { animation-delay: -2s; }
      `}</style>

      {/* ---------- HERO: название + фото целиком + простые цветные значки вокруг ---------- */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px 0' }}>
        <div className="hero-title" style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 32, margin: '0 0 8px' }}>Content Strategist AI</h1>
          <p style={{ fontSize: 14, color: INK_SOFT, margin: 0 }}>A week of ideas, tailored per platform -- built for teams who actually plan together.</p>
        </div>

        <div className="hero-photo" style={{ position: 'relative', maxWidth: 560, margin: '0 auto 8px', padding: '30px 40px' }}>
          <svg className="float-icon icon-blue" style={{ position: 'absolute', top: -6, left: 4 }} width="44" height="44" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="20" fill="#4285F4" />
            <polygon points="17,14 32,22 17,30" fill="#FFFFFF" />
          </svg>
          <svg className="float-icon icon-red" style={{ position: 'absolute', top: -14, left: '38%' }} width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="#EA4335" />
            <rect x="10" y="16" width="20" height="8" rx="4" fill="#FFFFFF" />
          </svg>
          <svg className="float-icon icon-yellow" style={{ position: 'absolute', top: -8, right: '20%' }} width="42" height="42" viewBox="0 0 42 42">
            <circle cx="21" cy="21" r="19" fill="#FBBC05" />
            <polygon points="21,10 24,18 33,18 26,23 28,32 21,27 14,32 16,23 9,18 18,18" fill="#FFFFFF" />
          </svg>
          <svg className="float-icon icon-green" style={{ position: 'absolute', top: -10, right: -4 }} width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="#34A853" />
            <path d="M12 20l5 5 11-11" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="float-dot dot-1" style={{ position: 'absolute', bottom: 30, left: -10, width: 14, height: 14, borderRadius: '50%', background: '#EA4335' }} />
          <span className="float-dot dot-2" style={{ position: 'absolute', bottom: -8, left: '30%', width: 12, height: 12, borderRadius: '50%', background: '#34A853' }} />
          <span className="float-dot dot-3" style={{ position: 'absolute', bottom: -6, right: '22%', width: 13, height: 13, borderRadius: '50%', background: '#FBBC05' }} />

          <div style={{
            borderRadius: 18, overflow: 'hidden', border: '1px solid ' + LINE,
            boxShadow: '0 16px 40px rgba(0,0,0,0.1)', background: '#FFFFFF',
          }}>
            <img src="/images/hero-team.jpg" alt="Team planning content strategy together" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 24px 80px' }}>

        {!unlocked && (
          <div style={{ background: freeTrialUsed ? '#FDECEC' : '#F5F9FF', border: `1px solid ${freeTrialUsed ? '#F3C4C4' : '#D5E5FC'}`, borderRadius: 10, padding: 14, marginBottom: 20 }}>
            {freeTrialUsed ? (
              <div>
                <p style={{ fontSize: 13.5, color: '#8A4A38', margin: '0 0 10px', fontWeight: 600 }}>Your free preview is over. Enter your code whenever you're ready to keep going.</p>
                <a href="/unlock.html" style={{ display: 'inline-block', background: RUST, color: '#FFFFFF', padding: '8px 16px', borderRadius: 8, fontSize: 13.5, fontWeight: 600, textDecoration: 'none' }}>
                  Enter your code &rarr;
                </a>
                <a href="/buy.html" style={{ display: 'block', fontSize: 12, color: RUST_DEEP, marginTop: 8 }}>No code? Get access</a>
              </div>
            ) : (
              <p style={{ fontSize: 13.5, color: '#1B5FC4', margin: 0 }}>Try it free -- your first generation is on us. No code needed.</p>
            )}
          </div>
        )}

        <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 14, padding: 20 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {MODES.map(m => (
              <button
                key={m.value}
                onClick={() => setMode(m.value)}
                style={{
                  flex: 1, padding: '9px 8px', borderRadius: 8, fontSize: 11.5, fontWeight: 500, cursor: 'pointer',
                  background: mode === m.value ? RUST : '#FFFFFF', color: mode === m.value ? '#FFFFFF' : INK_SOFT,
                  border: `1px solid ${mode === m.value ? RUST : LINE}`,
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {mode !== 'competitor' && (
            <>
              <label style={{ fontSize: 12, color: INK_SOFT, fontWeight: 500, display: 'block', marginBottom: 4 }}>What does your business do?</label>
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                placeholder="e.g. neighborhood coffee shop"
                style={{ width: '100%', borderRadius: 8, padding: '10px 12px', fontSize: 14, background: '#FFFFFF', border: `1px solid ${LINE}`, color: INK, marginBottom: 14, boxSizing: 'border-box' }}
              />
              <label style={{ fontSize: 12, color: INK_SOFT, fontWeight: 500, display: 'block', marginBottom: 4 }}>Season or occasion (optional)</label>
              <input
                type="text"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="e.g. back to school, holiday season"
                style={{ width: '100%', borderRadius: 8, padding: '10px 12px', fontSize: 14, background: '#FFFFFF', border: `1px solid ${LINE}`, color: INK, marginBottom: 14, boxSizing: 'border-box' }}
              />
            </>
          )}

          {mode === 'single' && (
            <>
              <label style={{ fontSize: 12, color: INK_SOFT, fontWeight: 500, display: 'block', marginBottom: 4 }}>Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                style={{ width: '100%', borderRadius: 8, padding: '10px 12px', fontSize: 14, background: '#FFFFFF', border: `1px solid ${LINE}`, color: INK, marginBottom: 14 }}
              >
                {PLATFORMS.map(p => <option key={p.code} value={p.code}>{p.label}</option>)}
              </select>
            </>
          )}

          {mode === 'cross' && (
            <>
              <label style={{ fontSize: 12, color: INK_SOFT, fontWeight: 500, display: 'block', marginBottom: 6 }}>Which platforms do you post to? (pick 2 or more)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {PLATFORMS.map(p => (
                  <button
                    key={p.code}
                    onClick={() => togglePlatform(p.code)}
                    style={{
                      padding: '6px 12px', borderRadius: 999, fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
                      background: selectedPlatforms.includes(p.code) ? p.color : '#FFFFFF',
                      color: selectedPlatforms.includes(p.code) ? '#FFFFFF' : INK_SOFT,
                      border: `1px solid ${selectedPlatforms.includes(p.code) ? p.color : LINE}`,
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {mode === 'competitor' && (
            <>
              <label style={{ fontSize: 12, color: INK_SOFT, fontWeight: 500, display: 'block', marginBottom: 4 }}>What does your business do? (optional)</label>
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                placeholder="e.g. neighborhood coffee shop"
                style={{ width: '100%', borderRadius: 8, padding: '10px 12px', fontSize: 14, background: '#FFFFFF', border: `1px solid ${LINE}`, color: INK, marginBottom: 14, boxSizing: 'border-box' }}
              />
              <label style={{ fontSize: 12, color: INK_SOFT, fontWeight: 500, display: 'block', marginBottom: 4 }}>Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                style={{ width: '100%', borderRadius: 8, padding: '10px 12px', fontSize: 14, background: '#FFFFFF', border: `1px solid ${LINE}`, color: INK, marginBottom: 14 }}
              >
                {PLATFORMS.map(p => <option key={p.code} value={p.code}>{p.label}</option>)}
              </select>
              <label style={{ fontSize: 12, color: INK_SOFT, fontWeight: 500, display: 'block', marginBottom: 4 }}>Paste competitor's post or profile description</label>
              <textarea
                value={competitorText}
                onChange={(e) => setCompetitorText(e.target.value)}
                rows={4}
                placeholder="Paste it here..."
                style={{ width: '100%', borderRadius: 8, padding: '10px 12px', fontSize: 14, background: '#FFFFFF', border: `1px solid ${LINE}`, color: INK, marginBottom: 14, boxSizing: 'border-box', resize: 'vertical' }}
              />
            </>
          )}

          {error && <p style={{ fontSize: 13, color: '#C0392B', margin: '0 0 12px' }}>{error}</p>}

          {dailyCount >= DAILY_LIMIT ? (
            <div style={{ textAlign: 'center', padding: 12, background: '#FDECEC', borderRadius: 8 }}>
              <p style={{ fontSize: 13, color: '#8A4A38', margin: 0, fontWeight: 600 }}>Today's limit reached</p>
              <p style={{ fontSize: 12, color: INK_SOFT, margin: '4px 0 0' }}>Come back tomorrow for 50 more free generations.</p>
            </div>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={loading}
              style={{
                width: '100%', padding: '12px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                background: RUST, color: '#FFFFFF', border: 'none', opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Thinking...' : mode === 'competitor' ? 'Find the gap' : 'Build this week\u2019s calendar'}
            </button>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            <span style={{ fontSize: 10.5, color: INK_SOFT }}>Today's free generations</span>
            <span style={{ fontSize: 10.5, color: INK_SOFT, fontWeight: 600 }}>{DAILY_LIMIT - dailyCount}/{DAILY_LIMIT} left</span>
          </div>
          <div style={{ height: 4, borderRadius: 999, background: LINE, overflow: 'hidden', marginTop: 4 }}>
            <div style={{ height: '100%', width: `${(dailyCount / DAILY_LIMIT) * 100}%`, background: dailyCount >= DAILY_LIMIT ? '#C0392B' : RUST, borderRadius: 999 }} />
          </div>
        </div>

        {result && result.ideas && (
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: INK_SOFT, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>This week's calendar</span>
              <button onClick={copyAllIdeas} style={{ fontSize: 11.5, color: RUST_DEEP, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                {copiedAll ? '\u2713 Copied all' : 'Copy all'}
              </button>
            </div>

            {/* Баланс content pillars за неделю */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 14, height: 8, borderRadius: 999, overflow: 'hidden' }}>
              {Object.entries(pillarSummary(result.ideas)).filter(([, c]) => c > 0).map(([p, c]) => (
                <div key={p} className="pillar-bar-fill" style={{ flex: c, background: PILLAR_COLORS[p].dot, borderRadius: 999 }} title={`${p}: ${c}`} />
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
              {result.ideas.map((it, i) => {
                const pc = PILLAR_COLORS[it.pillar] || PILLAR_COLORS['Educational'];
                const plat = PLATFORMS.find(p => p.label === it.platform);
                const bestTime = plat ? BEST_TIMES[plat.code] : null;
                return (
                  <div key={i} className="idea-card" style={{ animationDelay: `${i * 0.05}s`, background: CARD, border: `1px solid ${LINE}`, borderRadius: 12, padding: 12, borderTop: `3px solid ${pc.dot}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: INK_SOFT }}>{it.day}</span>
                      {it.platform && (
                        <span style={{ fontSize: 9.5, fontWeight: 600, color: '#FFFFFF', background: plat?.color || INK_SOFT, padding: '2px 6px', borderRadius: 999 }}>{it.platform}</span>
                      )}
                    </div>
                    <span style={{ fontSize: 9.5, color: pc.text, background: pc.bg, padding: '2px 7px', borderRadius: 999, display: 'inline-block', marginBottom: 6 }}>{it.pillar}</span>
                    <p style={{ fontSize: 13, color: INK, margin: '0 0 8px', lineHeight: 1.45 }}>{it.idea}</p>
                    {it.hashtags && it.hashtags.length > 0 && (
                      <p style={{ fontSize: 11, color: '#4285F4', margin: '0 0 6px' }}>{it.hashtags.map(h => `#${h.replace(/^#/, '')}`).join(' ')}</p>
                    )}
                    {bestTime && (
                      <p style={{ fontSize: 10, color: INK_SOFT, margin: 0 }}>Best time: {bestTime}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {result && result.gap && (
          <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 14, padding: 20, marginTop: 20 }}>
            <div style={{ fontSize: 12, color: RUST_DEEP, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>What they're missing</div>
            <p style={{ fontSize: 14, color: INK, marginBottom: 16, lineHeight: 1.5 }}>{result.gap}</p>
            <div style={{ fontSize: 12, color: RUST_DEEP, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Your angle</div>
            <p style={{ fontSize: 14, color: INK, marginBottom: 16, lineHeight: 1.5 }}>{result.angle}</p>
            <div style={{ fontSize: 12, color: RUST_DEEP, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Try this</div>
            <p style={{ fontSize: 14, color: INK, margin: 0, lineHeight: 1.5 }}>{result.ideaExample}</p>
          </div>
        )}

        {history.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 12, color: INK_SOFT, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Recent</div>
            {history.map((h) => (
              <div key={h.time} style={{ fontSize: 12.5, color: INK_SOFT, padding: '6px 0', borderTop: `1px solid ${LINE}` }}>
                {new Date(h.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &middot; {h.mode === 'competitor' ? 'Competitor gap analysis' : `${h.count}-day calendar`}
              </div>
            ))}
          </div>
        )}

        {showWelcome && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(31,31,31,0.5)', backdropFilter: 'blur(4px)', animation: 'welcomeFadeIn 0.4s ease both',
          }}>
            <div style={{ position: 'relative', textAlign: 'center', animation: 'welcomeFadeOut 0.4s ease 3.4s both' }}>
              <div style={{
                width: 76, height: 76, borderRadius: '50%', margin: '0 auto 18px',
                background: `linear-gradient(135deg, ${RUST}, ${RUST_DEEP})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 12px 32px rgba(217,119,87,0.4)', animation: 'ringPop 0.55s cubic-bezier(0.34,1.56,0.64,1) both',
              }}>
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" style={{ strokeDasharray: 40, animation: 'checkDraw 0.5s ease 0.35s both' }} />
                </svg>
              </div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 600, color: '#FFFFFF', margin: '0 0 6px' }}>Welcome</h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', margin: 0 }}>You're all set -- unlimited generations, let's go.</p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginTop: 48, paddingTop: 20, borderTop: `1px solid ${LINE}` }}>
          <span style={{ fontSize: 12, color: INK_SOFT }}>Powered by Claude &middot; Plainwork by Ksenia</span>
          <div style={{ display: 'flex', gap: 14, marginTop: 4 }}>
            <a href="/terms.html" style={{ fontSize: 11, color: INK_SOFT }}>Terms of Service</a>
            <a href="/privacy.html" style={{ fontSize: 11, color: INK_SOFT }}>Privacy Policy</a>
          </div>
          {!showSupportEmail ? (
            <button onClick={() => setShowSupportEmail(true)} style={{ fontSize: 11, color: RUST_DEEP, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Support</button>
          ) : (
            <a href="mailto:kssw117@gmail.com" style={{ fontSize: 11, color: RUST_DEEP }}>kssw117@gmail.com</a>
          )}
        </div>
      </div>
    </div>
  );
}
