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

// Английские названия языков — для промпта к Claude (модель точнее
// понимает "Russian", чем кириллическое "Русский" в системной инструкции)
const LANG_ENGLISH_NAMES = {
  en: 'English', ru: 'Russian', es: 'Spanish', zh: 'Chinese', ar: 'Arabic',
  pt: 'Portuguese', hi: 'Hindi', fr: 'French', vi: 'Vietnamese', ko: 'Korean',
  tr: 'Turkish', de: 'German', ja: 'Japanese', it: 'Italian', pl: 'Polish',
  fa: 'Persian', uk: 'Ukrainian', nl: 'Dutch', th: 'Thai', id: 'Indonesian',
};

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
  zh: {
    subtitle: '\u6bcf\u5468\u7684\u5185\u5bb9\u60f3\u6cd5\uff0c\u6839\u636e\u5e73\u53f0\u91cf\u8eab\u5b9a\u5236\u3002\u4e3a\u771f\u6b63\u6709\u8ba1\u5212\u5730\u89c4\u5212\u7684\u56e2\u961f\u800c\u5efa\u3002',
    about: 'Content Strategist AI \u4e00\u6b21\u6027\u6784\u5efa\u4e00\u5468\u7684\u5e16\u6587\u60f3\u6cd5\u2014\u2014\u4e0d\u662f\u6587\u6848\uff0c\u800c\u662f\u6bcf\u5929\u7684\u6838\u5fc3\u4e3b\u9898\uff0c\u5339\u914d\u8be5\u5e73\u53f0\u771f\u6b63\u6709\u6548\u7684\u5185\u5bb9\u3002\u9009\u62e9\u4e00\u4e2a\u5e73\u53f0\uff0c\u6216\u540c\u65f6\u89c4\u5212\u591a\u4e2a\u3002\u7c98\u8d34\u7ade\u4e89\u5bf9\u624b\u7684\u5e16\u5b50\uff0c\u627e\u5230\u4f60\u53ef\u4ee5\u586b\u8865\u7684\u7a7a\u767d\u3002',
  },
  ar: {
    subtitle: '\u0623\u0633\u0628\u0648\u0639 \u0645\u0646 \u0627\u0644\u0623\u0641\u0643\u0627\u0631\u060c \u0645\u062f\u0631\u0648\u0633\u0629 \u0644\u0643\u0644 \u0645\u0646\u0635\u0629. \u0644\u0644\u0641\u0631\u0642 \u0627\u0644\u062a\u064a \u062a\u062e\u0637\u0637 \u0628\u0648\u0639\u064a.',
    about: 'Content Strategist AI \u064a\u0628\u0646\u064a \u0623\u0633\u0628\u0648\u0639\u064b\u0627 \u0645\u0646 \u0623\u0641\u0643\u0627\u0631 \u0627\u0644\u0645\u0646\u0634\u0648\u0631\u0627\u062a \u0641\u064a \u0643\u0644 \u0645\u0631\u0629 -- \u0644\u064a\u0633 \u0627\u0644\u062a\u0633\u0645\u064a\u0627\u062a\u060c \u0628\u0644 \u0627\u0644\u0645\u0648\u0636\u0648\u0639 \u0627\u0644\u0623\u0633\u0627\u0633\u064a \u0644\u0643\u0644 \u064a\u0648\u0645\u060c \u0645\u0637\u0627\u0628\u0642\u064b\u0627 \u0644\u0645\u0627 \u064a\u0646\u062c\u062d \u0641\u0639\u0644\u064b\u0627 \u0639\u0644\u0649 \u062a\u0644\u0643 \u0627\u0644\u0645\u0646\u0635\u0629.',
  },
  pt: {
    subtitle: 'Uma semana de ideias, pensadas por plataforma. Para equipes que planejam com inten\u00e7\u00e3o.',
    about: 'Content Strategist AI constr\u00f3i uma semana de ideias de posts de cada vez -- n\u00e3o legendas, mas o tema central de cada dia, ajustado ao que realmente funciona naquela plataforma. Escolha uma plataforma, ou planeje v\u00e1rias de uma vez.',
  },
  hi: {
    subtitle: '\u092a\u094d\u0932\u0947\u091f\u092b\u0949\u0930\u094d\u092e \u0915\u0947 \u0905\u0928\u0941\u0938\u093e\u0930 \u090f\u0915 \u0938\u092a\u094d\u0924\u093e\u0939 \u0915\u0947 \u0906\u0907\u0921\u093f\u092f\u093e\u0964 \u0909\u0928 \u091f\u0940\u092e\u094b\u0902 \u0915\u0947 \u0932\u093f\u090f \u091c\u094b \u0935\u093e\u0915\u0908 \u092f\u094b\u091c\u0928\u093e \u092c\u0928\u093e\u0924\u0947 \u0939\u0948\u0902\u0964',
    about: 'Content Strategist AI \u090f\u0915 \u0938\u092e\u092f \u092e\u0947\u0902 \u090f\u0915 \u0938\u092a\u094d\u0924\u093e\u0939 \u0915\u0947 \u092a\u094b\u0938\u094d\u091f \u0906\u0907\u0921\u093f\u092f\u093e \u092c\u0928\u093e\u0924\u093e \u0939\u0948 -- \u0915\u0948\u092a\u094d\u0936\u0928 \u0928\u0939\u0940\u0902, \u092c\u0932\u094d\u0915\u093f \u0939\u0930 \u0926\u093f\u0928 \u0915\u093e \u092e\u0942\u0932 \u0935\u093f\u0937\u092f, \u091c\u094b \u0909\u0938 \u092a\u094d\u0932\u0947\u091f\u092b\u0949\u0930\u094d\u092e \u092a\u0930 \u0938\u091a\u092e\u0941\u091a \u0915\u093e\u092e \u0915\u0930\u0924\u093e \u0939\u0948\u0964',
  },
  fr: {
    subtitle: 'Une semaine d\u2019id\u00e9es, pens\u00e9es par plateforme. Pour les \u00e9quipes qui planifient avec intention.',
    about: 'Content Strategist AI construit une semaine d\u2019id\u00e9es de publication \u00e0 la fois -- pas des l\u00e9gendes, mais le sujet central de chaque jour, adapt\u00e9 \u00e0 ce qui fonctionne vraiment sur cette plateforme.',
  },
  vi: {
    subtitle: 'M\u1ed9t tu\u1ea7n \u00fd t\u01b0\u1edfng, \u0111\u01b0\u1ee3c c\u00e2n nh\u1eafc theo t\u1eebng n\u1ec1n t\u1ea3ng. D\u00e0nh cho c\u00e1c nh\u00f3m l\u1eadp k\u1ebf ho\u1ea1ch c\u00f3 ch\u1ee7 \u0111\u00edch.',
    about: 'Content Strategist AI x\u00e2y d\u1ef1ng m\u1ed9t tu\u1ea7n \u00fd t\u01b0\u1edfng b\u00e0i \u0111\u0103ng m\u1ed7i l\u1ea7n -- kh\u00f4ng ph\u1ea3i ch\u00fa th\u00edch, m\u00e0 l\u00e0 ch\u1ee7 \u0111\u1ec1 ch\u00ednh c\u1ee7a m\u1ed7i ng\u00e0y, ph\u00f9 h\u1ee3p v\u1edbi nh\u1eefng g\u00ec th\u1ef1c s\u1ef1 hi\u1ec7u qu\u1ea3 tr\u00ean n\u1ec1n t\u1ea3ng \u0111\u00f3.',
  },
  ko: {
    subtitle: '\ud50c\ub7ab\ud3fc\ubcc4\ub85c \uace0\ub824\ub41c \uc77c\uc8fc\uc77c \uc544\uc774\ub514\uc5b4. \uc9c4\uc9c0\ud558\uac8c \uacc4\ud68d\ud558\ub294 \ud300\uc744 \uc704\ud574.',
    about: 'Content Strategist AI\ub294 \ud55c \ubc88\uc5d0 \uc77c\uc8fc\uc77c\uce58 \uac8c\uc2dc\ubb3c \uc544\uc774\ub514\uc5b4\ub97c \ub9cc\ub4ed\ub2c8\ub2e4 -- \uce90\ud504\uc158\uc774 \uc544\ub2c8\ub77c \ud574\ub2f9 \ud50c\ub7ab\ud3fc\uc5d0\uc11c \uc2e4\uc81c\ub85c \ud6a8\uacfc\uc801\uc778 \ub0b4\uc6a9\uc5d0 \ub9de\ucd98 \ub9e4\uc77c\uc758 \ud575\uc2ec \uc8fc\uc81c\uc785\ub2c8\ub2e4.',
  },
  tr: {
    subtitle: 'Platforma g\u00f6re d\u00fc\u015fun\u00fclm\u00fc\u015f bir haftal\u0131k fikirler. Kas\u0131tl\u0131 planlayan ekipler i\u00e7in.',
    about: 'Content Strategist AI, bir seferde bir haftal\u0131k g\u00f6nderi fikri olu\u015fturur -- ba\u015fl\u0131k de\u011fil, o platformda ger\u00e7ekten i\u015fe yarayan her g\u00fcn\u00fcn ana konusu.',
  },
  de: {
    subtitle: 'Eine Woche voller Ideen, durchdacht pro Plattform. F\u00fcr Teams, die mit Absicht planen.',
    about: 'Content Strategist AI erstellt eine Woche Post-Ideen auf einmal -- keine Bildunterschriften, sondern das zentrale Thema jedes Tages, abgestimmt darauf, was auf dieser Plattform wirklich funktioniert.',
  },
  ja: {
    subtitle: '\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u3054\u3068\u306b\u8003\u3048\u3089\u308c\u305f\u4e00\u9031\u9593\u5206\u306e\u30a2\u30a4\u30c7\u30a2\u3002\u610f\u56f3\u3092\u6301\u3063\u3066\u8a08\u753b\u3059\u308b\u30c1\u30fc\u30e0\u306e\u305f\u3081\u306b\u3002',
    about: 'Content Strategist AI\u306f\u4e00\u5ea6\u306b\u4e00\u9031\u9593\u5206\u306e\u6295\u7a3f\u30a2\u30a4\u30c7\u30a2\u3092\u4f5c\u6210\u3057\u307e\u3059\u2014\u2014\u30ad\u30e3\u30d7\u30b7\u30e7\u30f3\u3067\u306f\u306a\u304f\u3001\u305d\u306e\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u3067\u5b9f\u969b\u306b\u6a5f\u80fd\u3059\u308b\u5185\u5bb9\u306b\u5408\u308f\u305b\u305f\u3001\u6bce\u65e5\u306e\u4e2d\u5fc3\u30c6\u30fc\u30de\u3067\u3059\u3002',
  },
  it: {
    subtitle: 'Una settimana di idee, pensate per piattaforma. Per team che pianificano con intenzione.',
    about: 'Content Strategist AI costruisce una settimana di idee per post alla volta -- non didascalie, ma l\u2019argomento centrale di ogni giorno, adattato a ci\u00f2 che funziona davvero su quella piattaforma.',
  },
  pl: {
    subtitle: 'Tydzie\u0144 pomys\u0142\u00f3w, dopasowanych do platformy. Dla zespo\u0142\u00f3w, kt\u00f3re planuj\u0105 \u015bwiadomie.',
    about: 'Content Strategist AI buduje tydzie\u0144 pomys\u0142\u00f3w na posty naraz -- nie podpisy, ale g\u0142\u00f3wny temat ka\u017cdego dnia, dopasowany do tego, co naprawd\u0119 dzia\u0142a na danej platformie.',
  },
  fa: {
    subtitle: '\u06cc\u06a9 \u0647\u0641\u062a\u0647 \u0627\u06cc\u062f\u0647\u060c \u0645\u062a\u0646\u0627\u0633\u0628 \u0628\u0627 \u0647\u0631 \u067e\u0644\u062a\u0641\u0631\u0645. \u0628\u0631\u0627\u06cc \u062a\u06cc\u0645\u200c\u0647\u0627\u06cc\u06cc \u06a9\u0647 \u0628\u0627 \u0642\u0635\u062f \u0628\u0631\u0646\u0627\u0645\u0647\u200c\u0631\u06cc\u0632\u06cc \u0645\u06cc\u200c\u06a9\u0646\u0646\u062f.',
    about: 'Content Strategist AI \u06cc\u06a9 \u0647\u0641\u062a\u0647 \u0627\u06cc\u062f\u0647 \u067e\u0633\u062a \u062f\u0631 \u06cc\u06a9 \u0632\u0645\u0627\u0646 \u0645\u06cc\u200c\u0633\u0627\u0632\u062f -- \u0646\u0647 \u0632\u06cc\u0631\u0646\u0648\u06cc\u0633\u060c \u0628\u0644\u06a9\u0647 \u0645\u0648\u0636\u0648\u0639 \u0627\u0635\u0644\u06cc \u0647\u0631 \u0631\u0648\u0632\u060c \u0645\u062a\u0646\u0627\u0633\u0628 \u0628\u0627 \u0622\u0646\u091b\u0647 \u0648\u0627\u0642\u0639\u0627\u064b \u062f\u0631 \u0622\u0646 \u067e\u0644\u062a\u0641\u0631\u0645 \u062c\u0648\u0627\u0628 \u0645\u06cc\u200c\u062f\u0647\u062f.',
  },
  uk: {
    subtitle: '\u0422\u0438\u0436\u0434\u0435\u043d\u044c \u0456\u0434\u0435\u0439, \u043f\u0440\u043e\u0434\u0443\u043c\u0430\u043d\u0438\u0445 \u043f\u0456\u0434 \u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0443. \u0414\u043b\u044f \u043a\u043e\u043c\u0430\u043d\u0434, \u044f\u043a\u0456 \u043f\u043b\u0430\u043d\u0443\u044e\u0442\u044c \u0437\u0430 \u0437\u0430\u0434\u0443\u043c\u043e\u043c.',
    about: 'Content Strategist AI \u0431\u0443\u0434\u0443\u0454 \u0442\u0438\u0436\u0434\u0435\u043d\u044c \u0456\u0434\u0435\u0439 \u0434\u043b\u044f \u043f\u043e\u0441\u0442\u0456\u0432 \u0437\u0430 \u0440\u0430\u0437 \u2014 \u043d\u0435 \u043f\u0456\u0434\u043f\u0438\u0441\u0438, \u0430 \u0441\u0430\u043c\u0443 \u0442\u0435\u043c\u0443 \u043a\u043e\u0436\u043d\u043e\u0433\u043e \u0434\u043d\u044f, \u043f\u0456\u0434\u0456\u0431\u0440\u0430\u043d\u0443 \u043f\u0456\u0434 \u0442\u0435, \u0449\u043e \u0440\u0435\u0430\u043b\u044c\u043d\u043e \u043f\u0440\u0430\u0446\u044e\u0454 \u043d\u0430 \u0446\u0456\u0439 \u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0456.',
  },
  nl: {
    subtitle: 'Een week aan idee\u00ebn, per platform doordacht. Voor teams die met intentie plannen.',
    about: 'Content Strategist AI bouwt een week aan post-idee\u00ebn tegelijk -- geen bijschriften, maar het kernonderwerp van elke dag, afgestemd op wat echt werkt op dat platform.',
  },
  th: {
    subtitle: '\u0e44\u0e2d\u0e40\u0e14\u0e35\u0e22\u0e2b\u0e19\u0e36\u0e48\u0e07\u0e2a\u0e31\u0e1b\u0e14\u0e32\u0e2b\u0e4c \u0e17\u0e35\u0e48\u0e04\u0e34\u0e14\u0e21\u0e32\u0e15\u0e32\u0e21\u0e41\u0e15\u0e48\u0e25\u0e30\u0e41\u0e1e\u0e25\u0e15\u0e1f\u0e2d\u0e23\u0e4c\u0e21 \u0e2a\u0e33\u0e2b\u0e23\u0e31\u0e1a\u0e17\u0e35\u0e21\u0e17\u0e35\u0e48\u0e27\u0e32\u0e07\u0e41\u0e1c\u0e19\u0e2d\u0e22\u0e48\u0e32\u0e07\u0e15\u0e31\u0e49\u0e07\u0e43\u0e08',
    about: 'Content Strategist AI \u0e2a\u0e23\u0e49\u0e32\u0e07\u0e44\u0e2d\u0e40\u0e14\u0e35\u0e22\u0e42\u0e1e\u0e2a\u0e15\u0e4c\u0e2b\u0e19\u0e36\u0e48\u0e07\u0e2a\u0e31\u0e1b\u0e14\u0e32\u0e2b\u0e4c\u0e43\u0e19\u0e04\u0e23\u0e32\u0e27\u0e40\u0e14\u0e35\u0e22\u0e27 -- \u0e44\u0e21\u0e48\u0e43\u0e0a\u0e48\u0e41\u0e04\u0e1b\u0e0a\u0e31\u0e48\u0e19 \u0e41\u0e15\u0e48\u0e40\u0e1b\u0e47\u0e19\u0e2b\u0e31\u0e27\u0e02\u0e49\u0e2d\u0e2b\u0e25\u0e31\u0e01\u0e02\u0e2d\u0e07\u0e41\u0e15\u0e48\u0e25\u0e30\u0e27\u0e31\u0e19',
  },
  id: {
    subtitle: 'Seminggu ide, dipikirkan per platform. Untuk tim yang merencanakan dengan sengaja.',
    about: 'Content Strategist AI membangun seminggu ide postingan sekaligus -- bukan keterangan, tetapi topik inti setiap hari, disesuaikan dengan apa yang benar-benar berhasil di platform tersebut.',
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
    const outputLangName = LANG_ENGLISH_NAMES[uiLang] || 'English';
    const langInstruction = uiLang === 'en' ? '' : ` Write the "idea" and hashtags in ${outputLangName}.`;
    const prompt = `Give ONE new alternative post idea for ${oldIdea.day}, platform "${oldIdea.platform}", different from: "${oldIdea.idea}". Same content pillar: ${oldIdea.pillar}. Business: ${businessType}.${langInstruction}
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
    const outputLangName = LANG_ENGLISH_NAMES[uiLang] || 'English';
    const langInstruction = uiLang === 'en'
      ? ''
      : ` Write in ${outputLangName}: the "idea" text, hashtags, and any other free text. IMPORTANT: keep the "pillar" field exactly as one of these English words (do not translate it): ${PILLARS.join(', ')}. Keep the "platform" field as given (do not translate platform names). Day names may be in ${outputLangName} or English, whichever reads more naturally.`;

    let prompt;
    if (mode === 'single') {
      prompt = `You are a social media content strategist. Give a week of post IDEAS (topics, not captions) for ${platformLabel}.
Business: ${businessType}. Occasion: ${occasion || 'none specific'}. Audience: ${audience || 'general'}.
Give exactly 7 ideas, one per day, tailored to ${platformLabel}. Assign a content pillar from: ${PILLARS.join(', ')} to each, don't repeat more than twice, include 2-3 hashtags each.${langInstruction}
Respond ONLY with valid JSON: {"ideas": [{"day": "Monday", "platform": "${platformLabel}", "pillar": "...", "idea": "...", "hashtags": ["...","...","..."]}, ...7 total]}`;
    } else if (mode === 'cross') {
      prompt = `You are a social media content strategist building a cross-platform calendar.
Business: ${businessType}. Occasion: ${occasion || 'none specific'}. Audience: ${audience || 'general'}. Platforms: ${selectedLabels.join(', ')}.
Give exactly 7 ideas, one per day, picking the best platform per idea from the list. Assign a content pillar from: ${PILLARS.join(', ')}, don't repeat more than twice, include 2-3 hashtags each.${langInstruction}
Respond ONLY with valid JSON: {"ideas": [{"day": "Monday", "platform": "one of: ${selectedLabels.join(', ')}", "pillar": "...", "idea": "...", "hashtags": ["...","...","..."]}, ...7 total]}`;
    } else {
      prompt = `Find what a competitor is missing on ${platformLabel} and suggest a unique angle.
Business: ${businessType || 'small business'}. Competitor content: "${competitorText}".${langInstruction}
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
