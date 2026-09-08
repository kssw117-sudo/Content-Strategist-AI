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

function getModes(t) {
  return [
    { value: 'single', label: t.tabSingle },
    { value: 'cross', label: t.tabCross },
    { value: 'competitor', label: t.tabCompetitor },
    { value: 'photos', label: t.tabPhotos || 'Photo planner' },
  ];
}

const LANGS = [
  { code: 'en', label: 'English' }, { code: 'ru', label: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439' }, { code: 'es', label: 'Espa\u00f1ol' },
  { code: 'zh', label: '\u4e2d\u6587' }, { code: 'ar', label: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629' }, { code: 'pt', label: 'Portugu\u00eas' },
  { code: 'hi', label: '\u0939\u093f\u0928\u094d\u0926\u0940' }, { code: 'fr', label: 'Fran\u00e7ais' }, { code: 'vi', label: 'Ti\u1ebfng Vi\u1ec7t' },
  { code: 'ko', label: '\ud55c\uad6d\uc5b4' }, { code: 'tr', label: 'T\u00fcrk\u00e7e' }, { code: 'de', label: 'Deutsch' },
  { code: 'ja', label: '\u65e5\u672c\u8a9e' }, { code: 'it', label: 'Italiano' }, { code: 'pl', label: 'Polski' },
  { code: 'fa', label: '\u0641\u0627\u0631\u0633\u06cc' }, { code: 'uk', label: '\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430' }, { code: 'nl', label: 'Nederlands' },
  { code: 'th', label: '\u0e44\u0e17\u0e22' }, { code: 'id', label: 'Bahasa Indonesia' },
  { code: 'el', label: '\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac' }, { code: 'sv', label: 'Svenska' }, { code: 'da', label: 'Dansk' },
  { code: 'no', label: 'Norsk' }, { code: 'fi', label: 'Suomi' },
];

// Английские названия языков — для промпта к Claude (модель точнее
// понимает "Russian", чем кириллическое "Русский" в системной инструкции)
const LANG_ENGLISH_NAMES = {
  en: 'English', ru: 'Russian', es: 'Spanish', zh: 'Chinese', ar: 'Arabic',
  pt: 'Portuguese', hi: 'Hindi', fr: 'French', vi: 'Vietnamese', ko: 'Korean',
  tr: 'Turkish', de: 'German', ja: 'Japanese', it: 'Italian', pl: 'Polish',
  fa: 'Persian', uk: 'Ukrainian', nl: 'Dutch', th: 'Thai', id: 'Indonesian',
  el: 'Greek', sv: 'Swedish', da: 'Danish', no: 'Norwegian', fi: 'Finnish',
};

function getStatCubes(t) {
  return [
    { n: '08', label: t.statPlatforms, desc: t.descPlatforms },
    { n: '05', label: t.statPillars, desc: t.descPillars },
    { n: '25', label: t.statLanguages, desc: t.descLanguages },
    { n: '50', label: t.statDailyLimit, desc: t.descDailyLimit },
    { n: '1', label: t.statFreeTrial, desc: t.descFreeTrial },
    { n: 'Once', label: t.statPayment, desc: t.descPayment },
  ];
}

const UI_TEXT = {
  en: {
    customPlatformPlaceholder: "Or type your own platform...",
    addPlatform: "Add",
    subtitle: "A week of ideas, considered per platform. For teams who plan with intention.",
    about: "Content Strategist AI builds a week of post ideas at a time -- not captions, but the underlying topic for each day, matched to what actually works on that specific platform. Choose one platform, or plan across several at once. Paste a competitor’s post to find the gap you can fill.",
    tabSingle: "Single platform",
    tabCross: "Cross-platform",
    tabCompetitor: "Competitor gap",
    labelBusiness: "WHAT DOES YOUR BUSINESS DO",
    placeholderBusiness: "Neighborhood coffee shop",
    labelOccasion: "SEASON OR OCCASION",
    optional: "(OPTIONAL)",
    placeholderOccasion: "Holiday season",
    labelAudience: "YOUR AUDIENCE",
    placeholderAudience: "Busy parents, 30s-40s",
    labelPlatform: "PLATFORM",
    labelPlatformsMulti: "PLATFORMS",
    pickTwo: "(PICK 2 OR MORE)",
    labelCompetitorPost: "COMPETITOR’S POST OR PROFILE",
    placeholderCompetitorPost: "Paste it here...",
    errBusiness: "Tell us what your business does first.",
    errPlatforms: "Pick at least 2 platforms.",
    errCompetitor: "Paste a competitor’s post first.",
    errTrialUsed: "Free preview used. Enter your access code to continue.",
    errInvalidCode: "Invalid or expired access code.",
    errGeneric: "Something went wrong.",
    errRegenerate: "Could not regenerate that day.",
    limitReached: "Today’s allowance is complete.",
    limitTomorrow: "Fifty more await tomorrow.",
    btnThinking: "CONSIDERING...",
    btnBuildWeek: "BUILD THE WEEK",
    btnFindGap: "FIND THE GAP",
    dailyAllowance: "DAILY ALLOWANCE",
    theWeek: "The Week",
    copied: "COPIED",
    copyAll: "COPY ALL",
    whatMissing: "WHAT THEY’RE MISSING",
    yourAngle: "YOUR ANGLE",
    tryThis: "TRY THIS",
    bestTime: "Best time",
    regenerating: "REGENERATING...",
    tryAnother: "TRY ANOTHER",
    trialUsedMsg: "Your complimentary preview has been used. Enter your code to continue.",
    enterCode: "ENTER YOUR CODE",
    noCode: "No code? Get access",
    trialFreeMsg: "Your first generation is complimentary. No code required.",
    statPlatforms: "Platforms",
    statPillars: "Pillars",
    statLanguages: "Languages",
    statDailyLimit: "Daily Limit",
    statFreeTrial: "Free Trial",
    statPayment: "Payment",
    descPlatforms: "Instagram, TikTok, LinkedIn, Facebook, Telegram, X, Reddit, and YouTube -- each platform gets ideas tailored to what actually works there.",
    descPillars: "Educational, Behind-the-scenes, Social proof, Promotional, and Entertaining -- automatically balanced across your week.",
    descLanguages: "Explanations and ideas available in 25 languages, including right-to-left support for Arabic and Persian.",
    descDailyLimit: "Fifty generations per day -- enough for real, ongoing use, without opening the door to abuse.",
    descFreeTrial: "Try one full generation before you buy. No code, no commitment.",
    descPayment: "A single one-time payment. No subscription, no recurring charge, ever.",
    welcomeTitle: "Welcome",
    welcomeSub: "Unlimited generations, from here on.",
    support: "Support",
    terms: "Terms",
    privacy: "Privacy",
  },
  ru: {
    customPlatformPlaceholder: "Или впиши свою платформу...",
    addPlatform: "Добавить",
    subtitle: "Неделя идей, продуманных под платформу. Для команд, которые планируют осознанно.",
    about: "Content Strategist AI строит неделю идей для постов за раз — не подписи, а саму тему на каждый день, подобранную под то, что реально работает именно на этой платформе. Выбери одну платформу или планируй сразу по нескольким. Вставь пост конкурента, чтобы найти пробел, который можно занять.",
    tabSingle: "Одна платформа",
    tabCross: "Кросс-платформа",
    tabCompetitor: "Анализ конкурента",
    labelBusiness: "ЧЕМ ЗАНИМАЕТСЯ ТВОЙ БИЗНЕС",
    placeholderBusiness: "Кофейня по соседству",
    labelOccasion: "СЕЗОН ИЛИ ПОВОД",
    optional: "(НЕОБЯЗАТЕЛЬНО)",
    placeholderOccasion: "Праздничный сезон",
    labelAudience: "ТВОЯ АУДИТОРИЯ",
    placeholderAudience: "Занятые родители, 30-40 лет",
    labelPlatform: "ПЛАТФОРМА",
    labelPlatformsMulti: "ПЛАТФОРМЫ",
    pickTwo: "(ВЫБЕРИ 2 ИЛИ БОЛЬШЕ)",
    labelCompetitorPost: "ПОСТ ИЛИ ПРОФИЛЬ КОНКУРЕНТА",
    placeholderCompetitorPost: "Вставь сюда...",
    errBusiness: "Сначала расскажи, чем занимается бизнес.",
    errPlatforms: "Выбери минимум 2 платформы.",
    errCompetitor: "Сначала вставь пост конкурента.",
    errTrialUsed: "Бесплатный просмотр использован. Введи код доступа, чтобы продолжить.",
    errInvalidCode: "Неверный или истёкший код доступа.",
    errGeneric: "Что-то пошло не так.",
    errRegenerate: "Не удалось перегенерировать этот день.",
    limitReached: "Лимит на сегодня исчерпан.",
    limitTomorrow: "Ещё пятьдесят будут ждать завтра.",
    btnThinking: "ДУМАЮ...",
    btnBuildWeek: "СОБРАТЬ НЕДЕЛЮ",
    btnFindGap: "НАЙТИ ПРОБЕЛ",
    dailyAllowance: "ДНЕВНОЙ ЛИМИТ",
    theWeek: "Неделя",
    copied: "СКОПИРОВАНО",
    copyAll: "СКОПИРОВАТЬ ВСЁ",
    whatMissing: "ЧЕГО ЕМУ НЕ ХВАТАЕТ",
    yourAngle: "ТВОЙ УГОЛ",
    tryThis: "ПОПРОБУЙ ЭТО",
    bestTime: "Лучшее время",
    regenerating: "ПЕРЕГЕНЕРАЦИЯ...",
    tryAnother: "ДРУГОЙ ВАРИАНТ",
    trialUsedMsg: "Бесплатный просмотр уже использован. Введи код, когда будешь готова продолжить.",
    enterCode: "ВВЕСТИ КОД",
    noCode: "Нет кода? Получить доступ",
    trialFreeMsg: "Первая генерация бесплатна. Код не нужен.",
    statPlatforms: "Платформ",
    statPillars: "Категорий",
    statLanguages: "Языков",
    statDailyLimit: "Лимит в день",
    statFreeTrial: "Бесплатно",
    statPayment: "Оплата",
    descPlatforms: "Instagram, TikTok, LinkedIn, Facebook, Telegram, X, Reddit и YouTube — под каждую платформу идеи подбираются с учётом того, что там реально работает.",
    descPillars: "Обучающий, закулисье, отзывы, продающий и развлекательный — автоматически сбалансированы по неделе.",
    descLanguages: "Объяснения и идеи доступны на 25 языках, включая поддержку письма справа налево для арабского и персидского.",
    descDailyLimit: "Пятьдесят генераций в день — достаточно для настоящего постоянного использования, но не открывает дверь для злоупотреблений.",
    descFreeTrial: "Попробуй одну полную генерацию перед покупкой. Без кода, без обязательств.",
    descPayment: "Разовый платёж. Без подписки, без повторных списаний — никогда.",
    welcomeTitle: "Добро пожаловать",
    welcomeSub: "Отныне — безлимитные генерации.",
    support: "Поддержка",
    terms: "Условия",
    privacy: "Конфиденциальность",
  },
  es: {
    subtitle: "Una semana de ideas, pensadas por plataforma. Para equipos que planifican con intención.",
    about: "Content Strategist AI construye una semana de ideas de publicaciones a la vez -- no subtítulos, sino el tema de cada día, ajustado a lo que realmente funciona en esa plataforma. Elige una plataforma, o planifica varias a la vez.",
    tabSingle: "Una plataforma",
    tabCross: "Multiplataforma",
    tabCompetitor: "Análisis de competencia",
    labelBusiness: "QUÉ HACE TU NEGOCIO",
    placeholderBusiness: "Cafetería de barrio",
    labelOccasion: "TEMPORADA U OCASIÓN",
    optional: "(OPCIONAL)",
    placeholderOccasion: "Temporada festiva",
    labelAudience: "TU AUDIENCIA",
    placeholderAudience: "Padres ocupados, 30-40 años",
    labelPlatform: "PLATAFORMA",
    labelPlatformsMulti: "PLATAFORMAS",
    pickTwo: "(ELIGE 2 O MÁS)",
    labelCompetitorPost: "PUBLICACIÓN O PERFIL DEL COMPETIDOR",
    placeholderCompetitorPost: "Pégalo aquí...",
    errBusiness: "Primero cuéntanos a qué se dedica tu negocio.",
    errPlatforms: "Elige al menos 2 plataformas.",
    errCompetitor: "Pega primero la publicación del competidor.",
    errTrialUsed: "Vista previa gratuita usada. Introduce tu código para continuar.",
    errInvalidCode: "Código de acceso inválido o caducado.",
    errGeneric: "Algo salió mal.",
    errRegenerate: "No se pudo regenerar ese día.",
    limitReached: "Tu cuota de hoy se ha completado.",
    limitTomorrow: "Cincuenta más te esperan mañana.",
    btnThinking: "PENSANDO...",
    btnBuildWeek: "CONSTRUIR LA SEMANA",
    btnFindGap: "ENCONTRAR EL HUECO",
    dailyAllowance: "CUOTA DIARIA",
    theWeek: "La Semana",
    copied: "COPIADO",
    copyAll: "COPIAR TODO",
    whatMissing: "LO QUE LES FALTA",
    yourAngle: "TU ENFOQUE",
    tryThis: "PRUEBA ESTO",
    bestTime: "Mejor hora",
    regenerating: "REGENERANDO...",
    tryAnother: "PROBAR OTRA",
    trialUsedMsg: "Tu vista previa gratuita ya se ha usado. Introduce tu código cuando quieras continuar.",
    enterCode: "INTRODUCE TU CÓDIGO",
    noCode: "¿Sin código? Obtén acceso",
    trialFreeMsg: "Tu primera generación es gratuita. No se necesita código.",
    statPlatforms: "Plataformas",
    statPillars: "Pilares",
    statLanguages: "Idiomas",
    statDailyLimit: "Límite Diario",
    statFreeTrial: "Prueba Gratis",
    statPayment: "Pago",
    descPlatforms: "Instagram, TikTok, LinkedIn, Facebook, Telegram, X, Reddit y YouTube -- cada plataforma recibe ideas ajustadas a lo que realmente funciona allí.",
    descPillars: "Educativo, entre bastidores, prueba social, promocional y entretenido -- equilibrados automáticamente durante tu semana.",
    descLanguages: "Explicaciones e ideas disponibles en 25 idiomas, incluido soporte de derecha a izquierda para árabe y persa.",
    descDailyLimit: "Cincuenta generaciones al día -- suficiente para un uso real y continuo, sin abrir la puerta al abuso.",
    descFreeTrial: "Prueba una generación completa antes de comprar. Sin código, sin compromiso.",
    descPayment: "Un único pago. Sin suscripción, sin cargos recurrentes, nunca.",
    welcomeTitle: "Bienvenido",
    welcomeSub: "Generaciones ilimitadas, de ahora en adelante.",
    support: "Soporte",
    terms: "Términos",
    privacy: "Privacidad",
  },
  fr: {
    subtitle: "Une semaine d’idées, pensées par plateforme. Pour les équipes qui planifient avec intention.",
    about: "Content Strategist AI construit une semaine d’idées de publication à la fois -- pas des légendes, mais le sujet central de chaque jour, adapté à ce qui fonctionne vraiment sur cette plateforme.",
    tabSingle: "Une plateforme",
    tabCross: "Multiplateforme",
    tabCompetitor: "Analyse concurrent",
    labelBusiness: "QUE FAIT VOTRE ENTREPRISE",
    placeholderBusiness: "Café de quartier",
    labelOccasion: "SAISON OU OCCASION",
    optional: "(OPTIONNEL)",
    placeholderOccasion: "Période des fêtes",
    labelAudience: "VOTRE AUDIENCE",
    placeholderAudience: "Parents occupés, 30-40 ans",
    labelPlatform: "PLATEFORME",
    labelPlatformsMulti: "PLATEFORMES",
    pickTwo: "(CHOISISSEZ-EN 2 OU PLUS)",
    labelCompetitorPost: "PUBLICATION OU PROFIL DU CONCURRENT",
    placeholderCompetitorPost: "Collez ici...",
    errBusiness: "Dites-nous d’abord ce que fait votre entreprise.",
    errPlatforms: "Choisissez au moins 2 plateformes.",
    errCompetitor: "Collez d’abord la publication du concurrent.",
    errTrialUsed: "Aperçu gratuit utilisé. Entrez votre code pour continuer.",
    errInvalidCode: "Code d’accès invalide ou expiré.",
    errGeneric: "Une erreur est survenue.",
    errRegenerate: "Impossible de régénérer ce jour.",
    limitReached: "Votre quota du jour est atteint.",
    limitTomorrow: "Cinquante autres vous attendent demain.",
    btnThinking: "RÉFLEXION...",
    btnBuildWeek: "CONSTRUIRE LA SEMAINE",
    btnFindGap: "TROUVER LE VIDE",
    dailyAllowance: "QUOTA QUOTIDIEN",
    theWeek: "La Semaine",
    copied: "COPIÉ",
    copyAll: "TOUT COPIER",
    whatMissing: "CE QUI LEUR MANQUE",
    yourAngle: "VOTRE ANGLE",
    tryThis: "ESSAYEZ CECI",
    bestTime: "Meilleur moment",
    regenerating: "RÉGÉNÉRATION...",
    tryAnother: "EN ESSAYER UNE AUTRE",
    trialUsedMsg: "Votre aperçu gratuit a déjà été utilisé. Entrez votre code quand vous êtes prêt.",
    enterCode: "ENTREZ VOTRE CODE",
    noCode: "Pas de code ? Obtenir l’accès",
    trialFreeMsg: "Votre première génération est gratuite. Aucun code requis.",
    statPlatforms: "Plateformes",
    statPillars: "Piliers",
    statLanguages: "Langues",
    statDailyLimit: "Limite Quotidienne",
    statFreeTrial: "Essai Gratuit",
    statPayment: "Paiement",
    descPlatforms: "Instagram, TikTok, LinkedIn, Facebook, Telegram, X, Reddit et YouTube -- chaque plateforme reçoit des idées adaptées à ce qui y fonctionne vraiment.",
    descPillars: "Éducatif, coulisses, preuve sociale, promotionnel et divertissant -- automatiquement équilibrés sur votre semaine.",
    descLanguages: "Explications et idées disponibles en 25 langues, avec support droite-à-gauche pour l’arabe et le persan.",
    descDailyLimit: "Cinquante générations par jour -- suffisant pour un usage réel et continu, sans ouvrir la porte aux abus.",
    descFreeTrial: "Essayez une génération complète avant d’acheter. Aucun code, aucun engagement.",
    descPayment: "Un paiement unique. Aucun abonnement, aucun frais récurrent, jamais.",
    welcomeTitle: "Bienvenue",
    welcomeSub: "Désormais, générations illimitées.",
    support: "Support",
    terms: "Conditions",
    privacy: "Confidentialité",
  },
  de: {
    subtitle: "Eine Woche voller Ideen, durchdacht pro Plattform. Für Teams, die mit Absicht planen.",
    about: "Content Strategist AI erstellt eine Woche Post-Ideen auf einmal -- keine Bildunterschriften, sondern das zentrale Thema jedes Tages, abgestimmt darauf, was auf dieser Plattform wirklich funktioniert.",
    tabSingle: "Eine Plattform",
    tabCross: "Plattformübergreifend",
    tabCompetitor: "Konkurrenzanalyse",
    labelBusiness: "WAS MACHT DEIN UNTERNEHMEN",
    placeholderBusiness: "Café in der Nachbarschaft",
    labelOccasion: "SAISON ODER ANLASS",
    optional: "(OPTIONAL)",
    placeholderOccasion: "Feiertagssaison",
    labelAudience: "DEINE ZIELGRUPPE",
    placeholderAudience: "Beschäftigte Eltern, 30-40",
    labelPlatform: "PLATTFORM",
    labelPlatformsMulti: "PLATTFORMEN",
    pickTwo: "(WÄHLE 2 ODER MEHR)",
    labelCompetitorPost: "BEITRAG ODER PROFIL DES WETTBEWERBERS",
    placeholderCompetitorPost: "Hier einfügen...",
    errBusiness: "Sag uns zuerst, was dein Unternehmen macht.",
    errPlatforms: "Wähle mindestens 2 Plattformen.",
    errCompetitor: "Füge zuerst den Beitrag des Wettbewerbers ein.",
    errTrialUsed: "Kostenlose Vorschau verwendet. Gib deinen Code ein, um fortzufahren.",
    errInvalidCode: "Ungültiger oder abgelaufener Zugangscode.",
    errGeneric: "Etwas ist schiefgelaufen.",
    errRegenerate: "Dieser Tag konnte nicht neu generiert werden.",
    limitReached: "Dein heutiges Kontingent ist aufgebraucht.",
    limitTomorrow: "Fünfzig weitere warten morgen.",
    btnThinking: "ÜBERLEGE...",
    btnBuildWeek: "WOCHE ERSTELLEN",
    btnFindGap: "LÜCKE FINDEN",
    dailyAllowance: "TAGESKONTINGENT",
    theWeek: "Die Woche",
    copied: "KOPIERT",
    copyAll: "ALLES KOPIEREN",
    whatMissing: "WAS IHNEN FEHLT",
    yourAngle: "DEIN ANSATZ",
    tryThis: "PROBIER DAS",
    bestTime: "Beste Zeit",
    regenerating: "NEU GENERIEREN...",
    tryAnother: "ANDERE PROBIEREN",
    trialUsedMsg: "Deine kostenlose Vorschau wurde bereits verwendet. Gib deinen Code ein, wenn du bereit bist.",
    enterCode: "CODE EINGEBEN",
    noCode: "Kein Code? Zugang erhalten",
    trialFreeMsg: "Deine erste Generierung ist kostenlos. Kein Code erforderlich.",
    statPlatforms: "Plattformen",
    statPillars: "Säulen",
    statLanguages: "Sprachen",
    statDailyLimit: "Tageslimit",
    statFreeTrial: "Kostenlos Testen",
    statPayment: "Zahlung",
    descPlatforms: "Instagram, TikTok, LinkedIn, Facebook, Telegram, X, Reddit und YouTube -- jede Plattform erhält Ideen, die dort wirklich funktionieren.",
    descPillars: "Lehrreich, Hinter-den-Kulissen, Sozialer Beweis, Werblich und Unterhaltsam -- automatisch über deine Woche ausbalanciert.",
    descLanguages: "Erklärungen und Ideen in 25 Sprachen verfügbar, inklusive Rechts-nach-links-Unterstützung für Arabisch und Persisch.",
    descDailyLimit: "Fünfzig Generierungen pro Tag -- genug für echte, fortlaufende Nutzung, ohne Missbrauch Tür und Tor zu öffnen.",
    descFreeTrial: "Probiere eine vollständige Generierung vor dem Kauf. Kein Code, keine Verpflichtung.",
    descPayment: "Eine einmalige Zahlung. Kein Abo, keine wiederkehrenden Kosten, niemals.",
    welcomeTitle: "Willkommen",
    welcomeSub: "Ab jetzt unbegrenzte Generierungen.",
    support: "Support",
    terms: "AGB",
    privacy: "Datenschutz",
  },
  pt: {
    subtitle: "Uma semana de ideias, pensadas por plataforma. Para equipes que planejam com intenção.",
    about: "Content Strategist AI constrói uma semana de ideias de posts de cada vez -- não legendas, mas o tema central de cada dia, ajustado ao que realmente funciona naquela plataforma.",
    tabSingle: "Uma plataforma",
    tabCross: "Multiplataforma",
    tabCompetitor: "Análise de concorrente",
    labelBusiness: "O QUE SEU NEGÓCIO FAZ",
    placeholderBusiness: "Cafeteria de bairro",
    labelOccasion: "TEMPORADA OU OCASIÃO",
    optional: "(OPCIONAL)",
    placeholderOccasion: "Temporada de festas",
    labelAudience: "SEU PÚBLICO",
    placeholderAudience: "Pais ocupados, 30-40 anos",
    labelPlatform: "PLATAFORMA",
    labelPlatformsMulti: "PLATAFORMAS",
    pickTwo: "(ESCOLHA 2 OU MAIS)",
    labelCompetitorPost: "POST OU PERFIL DO CONCORRENTE",
    placeholderCompetitorPost: "Cole aqui...",
    errBusiness: "Primeiro nos diga o que seu negócio faz.",
    errPlatforms: "Escolha pelo menos 2 plataformas.",
    errCompetitor: "Cole primeiro o post do concorrente.",
    errTrialUsed: "Prévia gratuita usada. Digite seu código para continuar.",
    errInvalidCode: "Código de acesso inválido ou expirado.",
    errGeneric: "Algo deu errado.",
    errRegenerate: "Não foi possível regenerar esse dia.",
    limitReached: "Sua cota de hoje foi concluida.",
    limitTomorrow: "Mais cinquenta esperam amanhã.",
    btnThinking: "PENSANDO...",
    btnBuildWeek: "CONSTRUIR A SEMANA",
    btnFindGap: "ENCONTRAR A LACUNA",
    dailyAllowance: "COTA DIÁRIA",
    theWeek: "A Semana",
    copied: "COPIADO",
    copyAll: "COPIAR TUDO",
    whatMissing: "O QUE ESTÁ FALTANDO",
    yourAngle: "SEU ÂNGULO",
    tryThis: "TENTE ISSO",
    bestTime: "Melhor horário",
    regenerating: "REGENERANDO...",
    tryAnother: "TENTAR OUTRA",
    trialUsedMsg: "Sua prévia gratuita já foi usada. Digite seu código quando estiver pronto.",
    enterCode: "DIGITE SEU CÓDIGO",
    noCode: "Sem código? Obtenha acesso",
    trialFreeMsg: "Sua primeira geração é gratuita. Nenhum código necessário.",
    statPlatforms: "Plataformas",
    statPillars: "Pilares",
    statLanguages: "Idiomas",
    statDailyLimit: "Limite Diário",
    statFreeTrial: "Teste Grátis",
    statPayment: "Pagamento",
    descPlatforms: "Instagram, TikTok, LinkedIn, Facebook, Telegram, X, Reddit e YouTube -- cada plataforma recebe ideias ajustadas ao que realmente funciona lá.",
    descPillars: "Educativo, bastidores, prova social, promocional e divertido -- automaticamente equilibrados ao longo da semana.",
    descLanguages: "Explicações e ideias disponíveis em 25 idiomas, incluindo suporte direita-para-esquerda para árabe e persa.",
    descDailyLimit: "Cinquenta gerações por dia -- suficiente para uso real e contínuo, sem abrir a porta para abusos.",
    descFreeTrial: "Experimente uma geração completa antes de comprar. Sem código, sem compromisso.",
    descPayment: "Um único pagamento. Sem assinatura, sem cobrança recorrente, nunca.",
    welcomeTitle: "Bem-vindo",
    welcomeSub: "Gerações ilimitadas, a partir de agora.",
    support: "Suporte",
    terms: "Termos",
    privacy: "Privacidade",
  },
  it: {
    subtitle: "Una settimana di idee, pensate per piattaforma. Per team che pianificano con intenzione.",
    about: "Content Strategist AI costruisce una settimana di idee per post alla volta -- non didascalie, ma l’argomento centrale di ogni giorno, adattato a ciò che funziona davvero su quella piattaforma.",
    tabSingle: "Una piattaforma",
    tabCross: "Multipiattaforma",
    tabCompetitor: "Analisi concorrente",
    labelBusiness: "COSA FA LA TUA ATTIVITÀ",
    placeholderBusiness: "Caffè di quartiere",
    labelOccasion: "STAGIONE O OCCASIONE",
    optional: "(OPZIONALE)",
    placeholderOccasion: "Periodo festivo",
    labelAudience: "IL TUO PUBBLICO",
    placeholderAudience: "Genitori impegnati, 30-40 anni",
    labelPlatform: "PIATTAFORMA",
    labelPlatformsMulti: "PIATTAFORME",
    pickTwo: "(SCEGLINE 2 O PIÙ)",
    labelCompetitorPost: "POST O PROFILO DEL CONCORRENTE",
    placeholderCompetitorPost: "Incolla qui...",
    errBusiness: "Dicci prima cosa fa la tua attività.",
    errPlatforms: "Scegli almeno 2 piattaforme.",
    errCompetitor: "Incolla prima il post del concorrente.",
    errTrialUsed: "Anteprima gratuita utilizzata. Inserisci il tuo codice per continuare.",
    errInvalidCode: "Codice di accesso non valido o scaduto.",
    errGeneric: "Qualcosa è andato storto.",
    errRegenerate: "Impossibile rigenerare quel giorno.",
    limitReached: "La tua quota di oggi è completa.",
    limitTomorrow: "Altre cinquanta ti aspettano domani.",
    btnThinking: "STO PENSANDO...",
    btnBuildWeek: "COSTRUISCI LA SETTIMANA",
    btnFindGap: "TROVA IL VUOTO",
    dailyAllowance: "QUOTA GIORNALIERA",
    theWeek: "La Settimana",
    copied: "COPIATO",
    copyAll: "COPIA TUTTO",
    whatMissing: "COSA GLI MANCA",
    yourAngle: "IL TUO ANGOLO",
    tryThis: "PROVA QUESTO",
    bestTime: "Momento migliore",
    regenerating: "RIGENERAZIONE...",
    tryAnother: "PROVANE UN’ALTRA",
    trialUsedMsg: "La tua anteprima gratuita è già stata usata. Inserisci il codice quando sei pronto.",
    enterCode: "INSERISCI IL CODICE",
    noCode: "Nessun codice? Ottieni accesso",
    trialFreeMsg: "La tua prima generazione è gratuita. Nessun codice richiesto.",
    statPlatforms: "Piattaforme",
    statPillars: "Pilastri",
    statLanguages: "Lingue",
    statDailyLimit: "Limite Giornaliero",
    statFreeTrial: "Prova Gratis",
    statPayment: "Pagamento",
    descPlatforms: "Instagram, TikTok, LinkedIn, Facebook, Telegram, X, Reddit e YouTube -- ogni piattaforma riceve idee adattate a ciò che funziona davvero lì.",
    descPillars: "Educativo, dietro le quinte, riprova sociale, promozionale e divertente -- bilanciati automaticamente durante la settimana.",
    descLanguages: "Spiegazioni e idee disponibili in 25 lingue, incluso il supporto destra-sinistra per arabo e persiano.",
    descDailyLimit: "Cinquanta generazioni al giorno -- sufficienti per un uso reale e continuo, senza aprire la porta agli abusi.",
    descFreeTrial: "Prova una generazione completa prima di acquistare. Nessun codice, nessun impegno.",
    descPayment: "Un unico pagamento. Nessun abbonamento, nessun addebito ricorrente, mai.",
    welcomeTitle: "Benvenuto",
    welcomeSub: "Generazioni illimitate, da ora in poi.",
    support: "Supporto",
    terms: "Termini",
    privacy: "Privacy",
  },
  nl: {
    subtitle: "Een week aan ideeën, per platform doordacht. Voor teams die met intentie plannen.",
    about: "Content Strategist AI bouwt een week aan post-ideeën tegelijk -- geen bijschriften, maar het kernonderwerp van elke dag, afgestemd op wat echt werkt op dat platform.",
    tabSingle: "Eén platform",
    tabCross: "Platformoverstijgend",
    tabCompetitor: "Concurrentieanalyse",
    labelBusiness: "WAT DOET JE BEDRIJF",
    placeholderBusiness: "Buurtcafé",
    labelOccasion: "SEIZOEN OF GELEGENHEID",
    optional: "(OPTIONEEL)",
    placeholderOccasion: "Feestdagenseizoen",
    labelAudience: "JE DOELGROEP",
    placeholderAudience: "Drukke ouders, 30-40",
    labelPlatform: "PLATFORM",
    labelPlatformsMulti: "PLATFORMS",
    pickTwo: "(KIES ER 2 OF MEER)",
    labelCompetitorPost: "POST OF PROFIEL VAN CONCURRENT",
    placeholderCompetitorPost: "Plak hier...",
    errBusiness: "Vertel ons eerst wat je bedrijf doet.",
    errPlatforms: "Kies minstens 2 platforms.",
    errCompetitor: "Plak eerst de post van de concurrent.",
    errTrialUsed: "Gratis voorbeeld gebruikt. Voer je code in om door te gaan.",
    errInvalidCode: "Ongeldige of verlopen toegangscode.",
    errGeneric: "Er is iets misgegaan.",
    errRegenerate: "Kon die dag niet opnieuw genereren.",
    limitReached: "Je dagelijkse limiet is bereikt.",
    limitTomorrow: "Morgen wachten er nog vijftig.",
    btnThinking: "BEZIG...",
    btnBuildWeek: "BOUW DE WEEK",
    btnFindGap: "VIND HET GAT",
    dailyAllowance: "DAGELIJKSE LIMIET",
    theWeek: "De Week",
    copied: "GEKOPIEERD",
    copyAll: "ALLES KOPIËREN",
    whatMissing: "WAT ZE MISSEN",
    yourAngle: "JOUW INVALSHOEK",
    tryThis: "PROBEER DIT",
    bestTime: "Beste tijd",
    regenerating: "OPNIEUW GENEREREN...",
    tryAnother: "PROBEER EEN ANDERE",
    trialUsedMsg: "Je gratis voorbeeld is al gebruikt. Voer je code in wanneer je klaar bent.",
    enterCode: "VOER JE CODE IN",
    noCode: "Geen code? Krijg toegang",
    trialFreeMsg: "Je eerste generatie is gratis. Geen code nodig.",
    statPlatforms: "Platforms",
    statPillars: "Pijlers",
    statLanguages: "Talen",
    statDailyLimit: "Dageli​jkse Limiet",
    statFreeTrial: "Gratis Proberen",
    statPayment: "Betaling",
    descPlatforms: "Instagram, TikTok, LinkedIn, Facebook, Telegram, X, Reddit en YouTube -- elk platform krijgt ideeën die daar echt werken.",
    descPillars: "Educatief, achter de schermen, sociaal bewijs, promotioneel en vermakelijk -- automatisch in balans over je week.",
    descLanguages: "Uitleg en ideeën beschikbaar in 25 talen, inclusief rechts-naar-links ondersteuning voor Arabisch en Perzisch.",
    descDailyLimit: "Vijftig generaties per dag -- genoeg voor echt, doorlopend gebruik, zonder de deur open te zetten voor misbruik.",
    descFreeTrial: "Probeer een volledige generatie voordat je koopt. Geen code, geen verplichting.",
    descPayment: "Eén eenmalige betaling. Geen abonnement, nooit terugkerende kosten.",
    welcomeTitle: "Welkom",
    welcomeSub: "Vanaf nu onbeperkte generaties.",
    support: "Ondersteuning",
    terms: "Voorwaarden",
    privacy: "Privacy",
  },
  pl: {
    subtitle: "Tydzień pomysłów, dopasowanych do platformy. Dla zespołów, które planują świadomie.",
    about: "Content Strategist AI buduje tydzień pomysłów na posty naraz -- nie podpisy, ale główny temat każdego dnia, dopasowany do tego, co naprawdę działa na danej platformie.",
    tabSingle: "Jedna platforma",
    tabCross: "Wieloplatformowo",
    tabCompetitor: "Analiza konkurencji",
    labelBusiness: "CZYM ZAJMUJE SIĘ TWOJA FIRMA",
    placeholderBusiness: "Kawiarnia os³ku owa",
    labelOccasion: "SEZON LUB OKAZJA",
    optional: "(OPCJONALNIE)",
    placeholderOccasion: "Sezon świąteczny",
    labelAudience: "TWOJA GRUPA ODBIORCÓW",
    placeholderAudience: "Zajęci rodzice, 30-40 lat",
    labelPlatform: "PLATFORMA",
    labelPlatformsMulti: "PLATFORMY",
    pickTwo: "(WYBIERZ 2 LUB WIĘCEJ)",
    labelCompetitorPost: "POST LUB PROFIL KONKURENCJI",
    placeholderCompetitorPost: "Wklej tutaj...",
    errBusiness: "Najpierw powiedz nam, czym zajmuje się Twoja firma.",
    errPlatforms: "Wybierz co najmniej 2 platformy.",
    errCompetitor: "Najpierw wklej post konkurencji.",
    errTrialUsed: "Bezpłatny podgląd wykorzystany. Wprowadź kod, aby kontynuować.",
    errInvalidCode: "Nieprawidłowy lub wygasły kod dostępu.",
    errGeneric: "Coś poszło nie tak.",
    errRegenerate: "Nie udało się wygenerować tego dnia ponownie.",
    limitReached: "Twój dzisiejszy limit został wykorzystany.",
    limitTomorrow: "Kolejne pięćdziesiąt czeka jutro.",
    btnThinking: "MYŚlE...",
    btnBuildWeek: "ZBUDUJ TYDZIEŃ",
    btnFindGap: "ZNAJDŹ LUKĘ",
    dailyAllowance: "DZIENNY LIMIT",
    theWeek: "Tydzień",
    copied: "SKOPIOWANO",
    copyAll: "KOPIUJ WSZYSTKO",
    whatMissing: "CZEGO IM BRAKUJE",
    yourAngle: "TWOJE PODEJŚCIE",
    tryThis: "WYPRÓBUJ TO",
    bestTime: "Najlepsza pora",
    regenerating: "REGENERACJA...",
    tryAnother: "WYPRÓBUJ INNY",
    trialUsedMsg: "Twój bezpłatny podgląd został już wykorzystany. Wprowadź kod, gdy będziesz gotowa.",
    enterCode: "WPROWADŹ KOD",
    noCode: "Brak kodu? Uzyskaj dostęp",
    trialFreeMsg: "Twoja pierwsza generacja jest bezpłatna. Kod nie jest wymagany.",
    statPlatforms: "Platformy",
    statPillars: "Filary",
    statLanguages: "Języki",
    statDailyLimit: "Dzienny Limit",
    statFreeTrial: "Darmowa Próba",
    statPayment: "Płatność",
    descPlatforms: "Instagram, TikTok, LinkedIn, Facebook, Telegram, X, Reddit i YouTube -- każda platforma otrzymuje pomysły dopasowane do tego, co tam naprawdę działa.",
    descPillars: "Edukacyjny, zza kulis, dowód społeczny, promocyjny i rozrywkowy -- automatycznie zbalansowane w ciągu tygodnia.",
    descLanguages: "Wyjaśnienia i pomysły dostępne w 25 językach, w tym wsparcie od prawej do lewej dla arabskiego i perskiego.",
    descDailyLimit: "Pięćdziesiąt generacji dziennie -- wystarczająco dużo na realne, ciągłe użytkowanie, bez otwierania drzwi na nadużycia.",
    descFreeTrial: "Wypróbuj jedną pełną generację przed zakupem. Bez kodu, bez zobowiązań.",
    descPayment: "Jedna jednorazowa płatność. Bez subskrypcji, bez cyklicznych opłat, nigdy.",
    welcomeTitle: "Witamy",
    welcomeSub: "Od teraz nieograniczone generacje.",
    support: "Wsparcie",
    terms: "Warunki",
    privacy: "Prywatność",
  },
  zh: {
    subtitle: "每周的内容想法，根据平台量身定制。为真正有计划地规划的团队而建。",
    about: "Content Strategist AI 一次性构建一周的帖文想法——不是文案，而是每天的核心主题，匹配该平台真正有效的内容。",
    tabSingle: "单一平台",
    tabCross: "跨平台",
    tabCompetitor: "竞争对手分析",
    labelBusiness: "你的业务是什么",
    placeholderBusiness: "社区咖啡馆",
    labelOccasion: "季节或场合",
    optional: "（可选）",
    placeholderOccasion: "节日季",
    labelAudience: "你的受众",
    placeholderAudience: "忙碌的家长，30-40岁",
    labelPlatform: "平台",
    labelPlatformsMulti: "平台",
    pickTwo: "（选择2个或以上）",
    labelCompetitorPost: "竞争对手的帖子或主页",
    placeholderCompetitorPost: "粘贴到这里...",
    errBusiness: "请先告诉我们你的业务是什么。",
    errPlatforms: "请至少选择2个平台。",
    errCompetitor: "请先粘贴竞争对手的帖子。",
    errTrialUsed: "免费预览已使用。请输入访问代码以继续。",
    errInvalidCode: "访问代码无效或已过期。",
    errGeneric: "出了点问题。",
    errRegenerate: "无法重新生成该天。",
    limitReached: "今天的额度已用完。",
    limitTomorrow: "明天还有五十次等着你。",
    btnThinking: "思考中...",
    btnBuildWeek: "构建本周计划",
    btnFindGap: "找到空白",
    dailyAllowance: "每日额度",
    theWeek: "本周",
    copied: "已复制",
    copyAll: "全部复制",
    whatMissing: "他们缺少什么",
    yourAngle: "你的角度",
    tryThis: "试试这个",
    bestTime: "最佳时间",
    regenerating: "重新生成中...",
    tryAnother: "换一个",
    trialUsedMsg: "你的免费预览已使用。准备好后请输入代码。",
    enterCode: "输入代码",
    noCode: "没有代码？获取访问权限",
    trialFreeMsg: "你的第一次生成是免费的。无需代码。",
    statPlatforms: "平台",
    statPillars: "支柱",
    statLanguages: "语言",
    statDailyLimit: "每日限制",
    statFreeTrial: "免费试用",
    statPayment: "付款",
    descPlatforms: "Instagram、TikTok、LinkedIn、Facebook、Telegram、X、Reddit和YouTube——每个平台都会获得适合该平台的想法。",
    descPillars: "教育、幕后花绝、社会证据、促销和娱乐——自动在一周内平衡分布。",
    descLanguages: "支持25种语言的解释和想法，包括阿拉伯语和波斯语的从右到左支持。",
    descDailyLimit: "每天五十次生成——足以满足真实、持续的使用需求，同时不会开启滥用的大门。",
    descFreeTrial: "购买前先试用一次完整生成。无需代码，无需承诺。",
    descPayment: "一次性付款。无订阅，永远无循环收费。",
    welcomeTitle: "欢迎",
    welcomeSub: "从现在起，无限生成。",
    support: "支持",
    terms: "条款",
    privacy: "隐私",
  },
  ja: {
    subtitle: "プラットフォームごとに考えられた一週間分のアイデア。意図を持って計画するチームのために。",
    about: "Content Strategist AIは一度に一週間分の投稿アイデアを作成します——キャプションではなく、そのプラットフォームで実際に機能する内容に合わせた、毎日の中心テーマです。",
    tabSingle: "単一プラットフォーム",
    tabCross: "クロスプラットフォーム",
    tabCompetitor: "竞合分析",
    labelBusiness: "あなたのビジネスは何ですか",
    placeholderBusiness: "地元のカフェ",
    labelOccasion: "季節または機会",
    optional: "（任意）",
    placeholderOccasion: "ホリデーシーズン",
    labelAudience: "ターゲット層",
    placeholderAudience: "忙しい親、30～40代",
    labelPlatform: "プラットフォーム",
    labelPlatformsMulti: "プラットフォーム",
    pickTwo: "（2つ以上選択）",
    labelCompetitorPost: "竞合他社の投稿またはプロフィール",
    placeholderCompetitorPost: "ここに貼り付け...",
    errBusiness: "まずあなたのビジネス内容を教えてください。",
    errPlatforms: "2つ以上のプラットフォームを選択してください。",
    errCompetitor: "まず竞合他社の投稿を貼り付けてください。",
    errTrialUsed: "無料プレビューは使用済みです。続けるにはアクセスコードを入力してください。",
    errInvalidCode: "アクセスコードが無効か期限切れです。",
    errGeneric: "何か問題が発生しました。",
    errRegenerate: "その日を再生成できませんでした。",
    limitReached: "今日の利用上限に達しました。",
    limitTomorrow: "明日さらに50回ご利用いただけます。",
    btnThinking: "考中...",
    btnBuildWeek: "1週間分を作成",
    btnFindGap: "ギャップを見つける",
    dailyAllowance: "1日の利用上限",
    theWeek: "今週",
    copied: "コピーしました",
    copyAll: "すべてコピー",
    whatMissing: "不足している点",
    yourAngle: "あなたの切り口",
    tryThis: "これを試す",
    bestTime: "最適な時間",
    regenerating: "再生成中...",
    tryAnother: "別の案を試す",
    trialUsedMsg: "無料プレビューはすでに使用されています。準備ができたらコードを入力してください。",
    enterCode: "コードを入力",
    noCode: "コードがない場合は",
    trialFreeMsg: "初回の生成は無料です。コードは不要です。",
    statPlatforms: "プラットフォーム",
    statPillars: "ピラー",
    statLanguages: "言語",
    statDailyLimit: "1日の上限",
    statFreeTrial: "無料体験",
    statPayment: "支払い",
    descPlatforms: "Instagram、TikTok、LinkedIn、Facebook、Telegram、X、Reddit、YouTube——各プラットフォームで実際に機能するアイデアを提供。",
    descPillars: "教育、裏側、社会的証拠、宣伝、エンタメ——週間を通じて自動でバランスを取ります。",
    descLanguages: "25言語での説明とアイデアを提供、アラビア語・ペルシア語の右から左表記も対応。",
    descDailyLimit: "1日50回の生成——実際の継続利用に十分で、乱用を防ぐ適切な上限です。",
    descFreeTrial: "購入前に1回分を完全無料でお試しいただけます。コードも約束も不要。",
    descPayment: "一回きりの支払い。サブスクなし、定期課金なし。",
    welcomeTitle: "ようこそ",
    welcomeSub: "今後は無制限で生成できます。",
    support: "サポート",
    terms: "利用規約",
    privacy: "プライバシー",
  },
  ar: {
    subtitle: "أسبوع من الأفكار، مدروسة لكل منصة. للفرق التي تخطط بوعي.",
    about: "Content Strategist AI يبني أسبوعًا من أفكار المنشورات في كل مرة -- ليس التسميات، بل الموضوع الأساسي لكل يوم.",
    tabSingle: "منصة واحدة",
    tabCross: "متعدد المنصات",
    tabCompetitor: "تحليل المنافس",
    labelBusiness: "ماذا يفعل عملك",
    placeholderBusiness: "مقهى في الحي",
    labelOccasion: "الموسم أو المناسبة",
    optional: "(اختياري)",
    placeholderOccasion: "موسم الأعياد",
    labelAudience: "جمهورك",
    placeholderAudience: "آباء مشغولون، 30-40",
    labelPlatform: "المنصة",
    labelPlatformsMulti: "المنصات",
    pickTwo: "(اختر 2 أو أكثر)",
    labelCompetitorPost: "منشور أو ملف المنافس",
    placeholderCompetitorPost: "الصق هنا...",
    errBusiness: "أخبرنا أولاً بماذا يقوم عملك.",
    errPlatforms: "اختر منصتين على الأقل.",
    errCompetitor: "الصق منشور المنافس أولاً.",
    errTrialUsed: "تم استخدام المعاينة المجانية. أدخل رمز الوصول للمتابعة.",
    errInvalidCode: "رمز الوصول غير صالح أو منتهي الصلاحية.",
    errGeneric: "حدث خطأ ما.",
    errRegenerate: "تعذر إعادة إنشاء ذلك اليوم.",
    limitReached: "اكتملت حصتك اليومية.",
    limitTomorrow: "خمسون أخرى في انتظارك غدًا.",
    btnThinking: "جارٍ التفكير...",
    btnBuildWeek: "بناء الأسبوع",
    btnFindGap: "ابحث عن الفجوة",
    dailyAllowance: "الحصة اليومية",
    theWeek: "الأسبوع",
    copied: "تم النسخ",
    copyAll: "نسخ الكل",
    whatMissing: "ما يفتقدونه",
    yourAngle: "زاويتك",
    tryThis: "جرب هذا",
    bestTime: "أفضل وقت",
    regenerating: "إعادة الإنشاء...",
    tryAnother: "جرب فكرة أخرى",
    trialUsedMsg: "تم بالفعل استخدام معاينتك المجانية. أدخل رمزك عندما تكون جاهزًا.",
    enterCode: "أدخل رمزك",
    noCode: "لا تملك رمزًا؟ احصل على الوصول",
    trialFreeMsg: "أول إنشاء مجاني. لا حاجة لرمز.",
    statPlatforms: "منصات",
    statPillars: "ركائز",
    statLanguages: "لغات",
    statDailyLimit: "الحد اليومي",
    statFreeTrial: "تجربة مجانية",
    statPayment: "الدفع",
    descPlatforms: "Instagram، TikTok، LinkedIn، Facebook، Telegram، X، Reddit، وYouTube -- كل منصة تحصل على أفكار مصممة خصيصًا لما ينجح فيها فعلًا.",
    descPillars: "تعليمي، خلف الكواليس، إثبات اجتماعي، ترويجي، وترفيهي -- متوازنة تلقائيًا على مدار أسبوعك.",
    descLanguages: "الشروحات والأفكار متاحة بـ 25 لغة، بما في ذلك دعم الكتابة من اليمين إلى اليسار للعربية والفارسية.",
    descDailyLimit: "خمسون إنشاءًا يوميًا -- يكفي للاستخدام الحقيقي المستمر، دون فتح الباب للإساءة.",
    descFreeTrial: "جرب إنشاءًا كاملًا قبل الشراء. بدون رمز، بدون التزام.",
    descPayment: "دفعة واحدة فقط. لا اشتراك، لا رسوم متكررة، أبدًا.",
    welcomeTitle: "أهلاً بك",
    welcomeSub: "إنشاءات غير محدودة من الآن.",
    support: "الدعم",
    terms: "الشروط",
    privacy: "الخصوصية",
  },
  hi: {
    subtitle: "प्लेटफॉर्म के अनुसार एक सप्ताह के आइडिया। उन टीमों के लिए जो वाकई योजना बनाते हैं।",
    about: "Content Strategist AI एक समय में एक सप्ताह के पोस्ट आइडिया बनाता है।",
    tabSingle: "एक प्लेटफॉर्म",
    tabCross: "क्रॉस-प्लेटफॉर्म",
    tabCompetitor: "प्रतिस्पर्धी विश्लेषण",
    labelBusiness: "आपका बिज़नेस क्या करता है",
    placeholderBusiness: "पड़ोस की कॉफी शॉप",
    labelOccasion: "मौसम या अवसर",
    optional: "(ऐच्छिक)",
    placeholderOccasion: "त्यौहार का मौसम",
    labelAudience: "आपकी ऑडिएंस",
    placeholderAudience: "व्यस्त माता-पिता, 30-40",
    labelPlatform: "प्लेटफॉर्म",
    labelPlatformsMulti: "प्लेटफॉर्म",
    pickTwo: "(2 या अधिक चुनें)",
    labelCompetitorPost: "प्रतिस्पर्धी की पोस्ट या प्रोफ़ाइल",
    placeholderCompetitorPost: "यहां पेस्ट करें...",
    errBusiness: "पहले बताएं आपका बिज़नेस क्या करता है।",
    errPlatforms: "कम से कम 2 प्लेटफॉर्म चुनें।",
    errCompetitor: "पहले प्रतिस्पर्धी की पोस्ट पेस्ट करें।",
    errTrialUsed: "मुफ्त प्रीव्यू इस्तेमाल हो चुका है। जारी रखने के लिए अपना कोड डालें।",
    errInvalidCode: "अमान्य या समाप्त एक्सेस कोड।",
    errGeneric: "कुछ गलत हो गया।",
    errRegenerate: "उस दिन को फिर से नहीं बनाया जा सका।",
    limitReached: "आज की सीमा पूरी हो गई है।",
    limitTomorrow: "कल पचास और इंतजार कर रहे हैं।",
    btnThinking: "सोच रहे हैं...",
    btnBuildWeek: "सप्ताह बनाएं",
    btnFindGap: "खाली जगह खोजें",
    dailyAllowance: "दैनिक सीमा",
    theWeek: "सप्ताह",
    copied: "कॉपी हो गया",
    copyAll: "सब कॉपी करें",
    whatMissing: "उनमें क्या कमी है",
    yourAngle: "आपका एंगल",
    tryThis: "यह आजबाएं",
    bestTime: "सर्वश्रेष्ठ समय",
    regenerating: "पुनः निर्माण...",
    tryAnother: "कोई और आजबाएं",
    trialUsedMsg: "आपका मुफ्त प्रीव्यू पहले ही इस्तेमाल हो चुका है। तैयार होने पर कोड डालें।",
    enterCode: "कोड डालें",
    noCode: "कोड नहीं है? एक्सेस प्राप्त करें",
    trialFreeMsg: "आपका पहला जनरेशन मुफ्त है। कोड की जरूरत नहीं।",
    statPlatforms: "प्लेटफॉर्म",
    statPillars: "स्तंभ",
    statLanguages: "भाषाएं",
    statDailyLimit: "दैनिक सीमा",
    statFreeTrial: "मुफ्त ट्रायल",
    statPayment: "भुगतान",
    descPlatforms: "Instagram, TikTok, LinkedIn, Facebook, Telegram, X, Reddit और YouTube -- हर प्लेटफॉर्म के लिए वहां वास्तव में काम करने वाले आइडिया।",
    descPillars: "शैक्षिक, परदे के पीछे, सामाजिक प्रमाण, प्रचारात्मक और मनोरंजक — सप्ताह भर स्वचालित रूप से संतुलित।",
    descLanguages: "25 भाषाओं में स्पष्टीकरण और आइडियाओं सहित।",
    descDailyLimit: "प्रतिदिन 50 जनरेशन — वास्तविक, जारी उपयोग के लिए पर्याप्त।",
    descFreeTrial: "खरीदने से पहले एक पूर्ण जनरेशन आजबाएं। कोई कोड नहीं।",
    descPayment: "एक बार का भुगतान। कोई सब्सक्रिप्शन नहीं।",
    welcomeTitle: "स्वागत है",
    welcomeSub: "अब से असीमित जनरेशन।",
    support: "सपोर्ट",
    terms: "नियम",
    privacy: "गोपनीयता",
  },
  ko: {
    subtitle: "플랫폼별로 고려된 일주일 아이디어. 진지하게 계획하는 팀을 위해.",
    about: "Content Strategist AI는 한 번에 일주일치 게시물 아이디어를 만듭니다.",
    tabSingle: "단일 플랫폼",
    tabCross: "크로스플랫폼",
    tabCompetitor: "경쟁사 분석",
    labelBusiness: "비즈니스가 무엇인가요",
    placeholderBusiness: "동네 카페",
    labelOccasion: "시즘 또는 계기",
    optional: "(선택)",
    placeholderOccasion: "연말연시 시즘",
    labelAudience: "대상 고객",
    placeholderAudience: "바빠한 부모, 30-40대",
    labelPlatform: "플랫폼",
    labelPlatformsMulti: "플랫폼",
    pickTwo: "(2개 이상 선택)",
    labelCompetitorPost: "경쟁사 게시물 또는 프로필",
    placeholderCompetitorPost: "여기에 붙여넣기...",
    errBusiness: "먼저 비즈니스 내용을 알려주세요.",
    errPlatforms: "최소 2개 플랫폼을 선택하세요.",
    errCompetitor: "먼저 경쟁사 게시물을 붙여넣으세요.",
    errTrialUsed: "무료 미리보기를 이미 사용했습니다. 계속하려면 액세스 코드를 입력하세요.",
    errInvalidCode: "유효하지 않거나 만료된 액세스 코드입니다.",
    errGeneric: "문제가 발생했습니다.",
    errRegenerate: "해당 일을 재생성할 수 없었습니다.",
    limitReached: "오늘의 한도를 모두 사용했습니다.",
    limitTomorrow: "내일 50회가 다시 제공됩니다.",
    btnThinking: "생각 중...",
    btnBuildWeek: "일주일 생성하기",
    btnFindGap: "공백 찾기",
    dailyAllowance: "일일 한도",
    theWeek: "이번 주",
    copied: "복사됨",
    copyAll: "모두 복사",
    whatMissing: "부족한 점",
    yourAngle: "당신의 각도",
    tryThis: "이것을 시도해보세요",
    bestTime: "최적 시간",
    regenerating: "재생성 중...",
    tryAnother: "다른 것 시도",
    trialUsedMsg: "무료 미리보기를 이미 사용했습니다. 준비가 되면 코드를 입력하세요.",
    enterCode: "코드 입력",
    noCode: "코드가 없나요? 액세스 얻기",
    trialFreeMsg: "첫 생성은 무료입니다. 코드가 필요 없습니다.",
    statPlatforms: "플랫폼",
    statPillars: "컨텐츠 카테고리",
    statLanguages: "언어",
    statDailyLimit: "일일 한도",
    statFreeTrial: "무료 체험",
    statPayment: "결제",
    descPlatforms: "Instagram, TikTok, LinkedIn, Facebook, Telegram, X, Reddit, YouTube -- 각 플랫폼에서 실제로 효과적인 아이디어를 제공합니다.",
    descPillars: "교육, 비하인드, 사회적 증거, 홍보, 엔터테인먼트 -- 일주일 동안 자동으로 균형을 맞춥니다.",
    descLanguages: "25개 언어로 설명과 아이디어 제공, 아랍어와 페르시아어의 오른쪽에서 왼쪽 지원 포함.",
    descDailyLimit: "하루 50회 생성 -- 실제적이고 지속적인 사용에 충분하면서 남용은 막습니다.",
    descFreeTrial: "구매 전에 완전한 생성 1회를 무료로 체험해보세요. 코드나 약정 없이.",
    descPayment: "단 한 번의 결제. 구독 없음, 반복 청구 없음, 영구히.",
    welcomeTitle: "환영합니다",
    welcomeSub: "이제부터 무제한 생성이 가능합니다.",
    support: "지원",
    terms: "약관",
    privacy: "개인정보",
  },
  vi: {
    subtitle: "Một tuần ý tưởng, được cân nhắc theo từng nền tảng. Dành cho các nhóm lập kế hoạch có chủ đích.",
    about: "Content Strategist AI xây dựng một tuần ý tưởng bài đăng mỗi lần.",
    tabSingle: "Một nền tảng",
    tabCross: "Đa nền tảng",
    tabCompetitor: "Phân tích đối thủ",
    labelBusiness: "DOANH NGHIỆP CủA BạN LÀM GÌ",
    placeholderBusiness: "Quán cà phê khu phố",
    labelOccasion: "MÙA HOẶC DỊP",
    optional: "(TÙY CHỌN)",
    placeholderOccasion: "Mùa lễ hội",
    labelAudience: "ĐốI TƯỢNG CỦA BạN",
    placeholderAudience: "Phụ huynh bận rộn, 30-40 tuổi",
    labelPlatform: "NỀN TẢNG",
    labelPlatformsMulti: "NỀN TẢNG",
    pickTwo: "(CHỌN 2 HOẶC NHIỀU HƠN)",
    labelCompetitorPost: "BÀI ĐĂNG HOẶC Hồ SƠ ĐỖI THỦ",
    placeholderCompetitorPost: "Dán vào đây...",
    errBusiness: "Hãy cho chúng tôi biết doanh nghiệp của bạn làm gì trước.",
    errPlatforms: "Chọn ít nhất 2 nền tảng.",
    errCompetitor: "Dán bài đăng của đối thủ trước.",
    errTrialUsed: "Đã dùng bản xem trước miễn phí. Nhập mã truy cập để tiếp tục.",
    errInvalidCode: "Mã truy cập không hợp lệ hoặc đã hết hạn.",
    errGeneric: "Đã có lỗi xảy ra.",
    errRegenerate: "Không thể tạo lại ngày đó.",
    limitReached: "Hạn mức hôm nay đã hết.",
    limitTomorrow: "Năm mươi lượt nữa đang chờ vào ngày mai.",
    btnThinking: "ĐANG SUY NGHĨ...",
    btnBuildWeek: "XÂY DỰNG TUẦN",
    btnFindGap: "TÌM KHOẢNG TRốNG",
    dailyAllowance: "HẠN MỨC HÀNG NGÀY",
    theWeek: "Tuần Này",
    copied: "Đã SAO CHÉP",
    copyAll: "SAO CHÉP TẤT CẢ",
    whatMissing: "HỌ ĐANG THIẾU Gì",
    yourAngle: "GÓC ĐỘ CỦA BẠN",
    tryThis: "THử CÁI NÀY",
    bestTime: "Thời điểm tốt nhất",
    regenerating: "ĐANG TẠO LẠI...",
    tryAnother: "THử Ý TƯỞNG KHÁC",
    trialUsedMsg: "Bản xem trước miễn phí đã được dùng. Nhập mã khi bạn sẵn sàng.",
    enterCode: "NHẬP MÃ",
    noCode: "Không có mã? Nhận quyền truy cập",
    trialFreeMsg: "Lượt tạo đầu tiên miễn phí. Không cần mã.",
    statPlatforms: "Nền tảng",
    statPillars: "Trụ cột",
    statLanguages: "Ngôn ngữ",
    statDailyLimit: "Hạn Mức Ngày",
    statFreeTrial: "Dùng Thử",
    statPayment: "Thanh Toán",
    descPlatforms: "Instagram, TikTok, LinkedIn, Facebook, Telegram, X, Reddit và YouTube -- mỗi nền tảng nhận được ý tưởng phù hợp.",
    descPillars: "Giáo dục, hậu trường, bằng chứng xã hội, quảng bá và giải trí -- tự động cân bằng trong tuần.",
    descLanguages: "Giải thích và ý tưởng có sẵn bằng 25 ngôn ngữ.",
    descDailyLimit: "Năm mươi lượt tạo mỗi ngày -- đủ cho việc sử dụng thực tế.",
    descFreeTrial: "Dùng thử một lượt đầy đủ trước khi mua. Không cần mã.",
    descPayment: "Một lần thanh toán duy nhất. Không đăng ký, không phí định kỳ.",
    welcomeTitle: "Chào mừng",
    welcomeSub: "Từ giờ, tạo không giới hạn.",
    support: "Hỗ trợ",
    terms: "Điều khoản",
    privacy: "Quyền riêng tư",
  },
  tr: {
    subtitle: "Platforma göre düşünülmüş bir haftalık fikirler. Kasıtlı planlayan ekipler için.",
    about: "Content Strategist AI, bir seferde bir haftalık gönderi fikri oluşturur.",
    tabSingle: "Tek platform",
    tabCross: "Çapraz platform",
    tabCompetitor: "Rakip analizi",
    labelBusiness: "İşLETMENİZ NE YAPIYOR",
    placeholderBusiness: "Mahalle kahve dükkanı",
    labelOccasion: "SEZON VEYA VESİLE",
    optional: "(İSTEĞE BAĞLI)",
    placeholderOccasion: "Tatil sezonu",
    labelAudience: "HEDEF KİTLENİZ",
    placeholderAudience: "Meşgul ebeveynler, 30-40 yaş",
    labelPlatform: "PLATFORM",
    labelPlatformsMulti: "PLATFORMLAR",
    pickTwo: "(2 VEYA DAHA FAZLA SEÇİN)",
    labelCompetitorPost: "RAKİBİN GÖNDERİSİ VEYA PROFİLİ",
    placeholderCompetitorPost: "Buraya yapıştırın...",
    errBusiness: "Önce işletmenizin ne yaptığını söyleyin.",
    errPlatforms: "En az 2 platform seçin.",
    errCompetitor: "Önce rakibin gönderisini yapıştırın.",
    errTrialUsed: "Ücretsiz önizleme kullanıldı. Devam etmek için kodunuzu girin.",
    errInvalidCode: "Geçersiz veya süresi dolmuş erişim kodu.",
    errGeneric: "Bir şeyler ters gitti.",
    errRegenerate: "O gün yeniden oluşturulamadı.",
    limitReached: "Bugünkü hakkınız tamamlandı.",
    limitTomorrow: "Yarın elli tane daha sizi bekliyor.",
    btnThinking: "DÜŞÜNÜYOR...",
    btnBuildWeek: "HAFTAYI OLUŞTUR",
    btnFindGap: "BOŞLUĞU BUL",
    dailyAllowance: "GÜNLÜK HAK",
    theWeek: "Bu Hafta",
    copied: "KOPYALANDI",
    copyAll: "HEPSİNİ KOPYALA",
    whatMissing: "NEYİ EKSİK",
    yourAngle: "SENİN AÇIN",
    tryThis: "BUNU DENE",
    bestTime: "En iyi zaman",
    regenerating: "YENİDEN OLUŞTURULUYOR...",
    tryAnother: "BAŞKASINI DENE",
    trialUsedMsg: "Ücretsiz önizlemeniz zaten kullanıldı. Hazır olduğunuzda kodunuzu girin.",
    enterCode: "KODUNUZU GİRİN",
    noCode: "Kodunuz yok mu? Erişim alın",
    trialFreeMsg: "İlk oluşturmanız ücretsiz. Kod gerekmez.",
    statPlatforms: "Platform",
    statPillars: "Sütun",
    statLanguages: "Dil",
    statDailyLimit: "Günlük Limit",
    statFreeTrial: "Ücretsiz Deneme",
    statPayment: "Ödeme",
    descPlatforms: "Instagram, TikTok, LinkedIn, Facebook, Telegram, X, Reddit ve YouTube -- her platform orada gerçekten işe yarayan fikirler alır.",
    descPillars: "Eğitici, perde arkası, sosyal kanıt, tanıtıcı ve eğlenceli -- haftanız boyunca otomatik dengelenir.",
    descLanguages: "Açıklamalar ve fikirler 25 dilde mevcut.",
    descDailyLimit: "Günde elli oluşturma -- gerçek, sürekli kullanım için yeterli.",
    descFreeTrial: "Satın almadan önce tam bir oluşturma deneyin. Kod yok, taahhüt yok.",
    descPayment: "Tek seferlik ödeme. Abonelik yok, tekrarlayan ücret yok, asla.",
    welcomeTitle: "Hoş geldiniz",
    welcomeSub: "Bundan sonra sınırsız oluşturma.",
    support: "Destek",
    terms: "Şartlar",
    privacy: "Gizlilik",
  },
  fa: {
    subtitle: "یک هفته ایده، متناسب با هر پلتفرم. برای تیم‌هایی که با قصد برنامه‌ریزی می‌کنند.",
    about: "Content Strategist AI یک هفته ایده پست در یک زمان می‌سازد.",
    tabSingle: "یک پلتفرم",
    tabCross: "چندپلتفرمی",
    tabCompetitor: "تحلیل رقیب",
    labelBusiness: "کسب‌وکار شما چیست",
    placeholderBusiness: "کافی شاپ محله",
    labelOccasion: "فصل یا مناسبت",
    optional: "(اختیاری)",
    placeholderOccasion: "فصل تعطیلات",
    labelAudience: "مخاطبان شما",
    placeholderAudience: "والدین شاغل، 30-40 ساله",
    labelPlatform: "پلتفرم",
    labelPlatformsMulti: "پلتفرم‌ها",
    pickTwo: "(2 یا بیشتر انتخاب کنید)",
    labelCompetitorPost: "پست یا پروفایل رقیب",
    placeholderCompetitorPost: "اینجا بچسبانید...",
    errBusiness: "ابتدا بگویید کسب‌وکارتان چیست.",
    errPlatforms: "حداقل 2 پلتفرم انتخاب کنید.",
    errCompetitor: "ابتدا پست رقیب را بچسبانید.",
    errTrialUsed: "پیش‌نمایش رایگان استفاده شد. کد دسترسی خود را وارد کنید.",
    errInvalidCode: "کد دسترسی نامعتبر یا منقضی شده.",
    errGeneric: "مشکلی پیش آمد.",
    errRegenerate: "نتوانستیم آن روز را دوباره بسازیم.",
    limitReached: "سهمیه امروز شما تکمیل شد.",
    limitTomorrow: "فردا تا دیگر فردا منتظر شماست.",
    btnThinking: "در حال فکر...",
    btnBuildWeek: "ساخت هفته",
    btnFindGap: "یافتن خلاء",
    dailyAllowance: "سهمیه روزانه",
    theWeek: "این هفته",
    copied: "کپی شد",
    copyAll: "کپی همه",
    whatMissing: "چه چیزی کم دارند",
    yourAngle: "زاویه شما",
    tryThis: "این را امتحان کنید",
    bestTime: "بهترین زمان",
    regenerating: "در حال بازسازی...",
    tryAnother: "یکی دیگر را امتحان کنید",
    trialUsedMsg: "پیش‌نمایش رایگان شما قبلاً استفاده شده. وقتی آماده بودید کد را وارد کنید.",
    enterCode: "کد را وارد کنید",
    noCode: "کد ندارید؟ دسترسی بگیرید",
    trialFreeMsg: "اولین تولید شما رایگان است. نیازی به کد نیست.",
    statPlatforms: "پلتفرم‌ها",
    statPillars: "ارکان",
    statLanguages: "زبان‌ها",
    statDailyLimit: "سقف روزانه",
    statFreeTrial: "آزمایش رایگان",
    statPayment: "پرداخت",
    descPlatforms: "Instagram، TikTok، LinkedIn، Facebook، Telegram، X، Reddit و YouTube.",
    descPillars: "آموزشی، پشت صحنه، اثبات اجتماعی، تبلیغاتی و سرگرمی‌کننده.",
    descLanguages: "توضیحات و ایده‌ها به 25 زبان موجود است.",
    descDailyLimit: "پنجاه تولید در روز.",
    descFreeTrial: "قبل از خرید یک تولید کامل را امتحان کنید.",
    descPayment: "یک پرداخت یکجا. بدون اشتراک.",
    welcomeTitle: "خوش آمدید",
    welcomeSub: "از این پس، تولید نامحدود.",
    support: "پشتیبانی",
    terms: "شرایط",
    privacy: "حریم خصوصی",
  },
  uk: {
    subtitle: "Тиждень ідей, продуманих під платформу. Для команд, які планують за задумом.",
    about: "Content Strategist AI будує тиждень ідей для постів за раз.",
    tabSingle: "Одна платформа",
    tabCross: "Крос-платформа",
    tabCompetitor: "Аналіз конкурента",
    labelBusiness: "ЧИМ ЗАЙМАЄТЬСЯ ТВІЙ БІЗНЕС",
    placeholderBusiness: "Кав’ярня поруч",
    labelOccasion: "СЕЗОН АБО ПРИВІД",
    optional: "(НЕОБОВ’ЯЗКОВО)",
    placeholderOccasion: "Святковий сезон",
    labelAudience: "ВАША АУДИТОРІЯ",
    placeholderAudience: "Зайняті батьки, 30-40 років",
    labelPlatform: "ПЛАТФОРМА",
    labelPlatformsMulti: "ПЛАТФОРМИ",
    pickTwo: "(ОБЕРІТЬ 2 АБО БІЛЬШЕ)",
    labelCompetitorPost: "ПОСТ АБО ПРОФІЛЬ КОНКУРЕНТА",
    placeholderCompetitorPost: "Вставте сюди...",
    errBusiness: "Спочатку розкажіть, чим займається ваш бізнес.",
    errPlatforms: "Оберіть мінімум 2 платформи.",
    errCompetitor: "Спочатку вставте пост конкурента.",
    errTrialUsed: "Безкоштовний перегляд використано. Введіть код доступу, щоб продовжити.",
    errInvalidCode: "Невірний або прострочений код доступу.",
    errGeneric: "Щось пішло не так.",
    errRegenerate: "Не вдалося перегенерувати цей день.",
    limitReached: "Сьогоднішній ліміт вичерпано.",
    limitTomorrow: "Ще п’ятдесят чекають завтра.",
    btnThinking: "МІРКУЮ...",
    btnBuildWeek: "СФОРМУВАТИ ТИЖДЕНЬ",
    btnFindGap: "ЗНАЙТИ ПРОГАЛИНУ",
    dailyAllowance: "ЩОДЕННИЙ ЛІМІТ",
    theWeek: "Цього Тижня",
    copied: "СКОПІЙОВАНО",
    copyAll: "КОПІЮВАТИ ВСЕ",
    whatMissing: "ЧОГО ЙОМУ БРАКУЄ",
    yourAngle: "ВАШ КУТ",
    tryThis: "СПРОБУЙ ЦЕ",
    bestTime: "Найкращий час",
    regenerating: "ПЕРЕГЕНЕРАЦІЯ...",
    tryAnother: "СПРОБУЙ ІНШИЙ",
    trialUsedMsg: "Ваш безкоштовний перегляд вже використано. Введіть код, коли будете готові.",
    enterCode: "ВВЕСТИ КОД",
    noCode: "Немає коду? Отримати доступ",
    trialFreeMsg: "Ваша перша генерація безкоштовна. Код не потрібен.",
    statPlatforms: "Платформ",
    statPillars: "Категорій",
    statLanguages: "Мов",
    statDailyLimit: "Ліміт на день",
    statFreeTrial: "Безкоштовно",
    statPayment: "Оплата",
    descPlatforms: "Instagram, TikTok, LinkedIn, Facebook, Telegram, X, Reddit та YouTube.",
    descPillars: "Освітній, закулісся, відгуки, продаючий та розважальний -- автоматично збалансовані протягом тижня.",
    descLanguages: "Пояснення та ідеї доступні 25 мовами.",
    descDailyLimit: "П’ятдесят генерацій на день.",
    descFreeTrial: "Спробуйте одну повну генерацію перед покупкою.",
    descPayment: "Одинаразова оплата. Без підписки.",
    welcomeTitle: "Ласкаво просимо",
    welcomeSub: "Відтепер — безлімітні генерації.",
    support: "Підтримка",
    terms: "Умови",
    privacy: "Конфіденційність",
  },
  th: {
    subtitle: "ไอเดียหนึ่งสัปดาห์ ที่คิดมาตามแต่ละแพลตฟอร์ม สำหรับทีมที่วางแผนอย่างตั้งใจ",
    about: "Content Strategist AI สร้างไอเดียโพสต์หนึ่งสัปดาห์ในคราวเดียว.",
    tabSingle: "แพลตฟอร์มเดียว",
    tabCross: "ข้ามแพลตฟอร์ม",
    tabCompetitor: "วิเคราะห์คู่แข่ง",
    labelBusiness: "ธุรกิจของคุณคืออะไร",
    placeholderBusiness: "ร้านกาแฟในชุมชน",
    labelOccasion: "ฤดูกาลหรือโอกาส",
    optional: "(ไม่บังคับ)",
    placeholderOccasion: "เทศกาลวันหยุด",
    labelAudience: "กลุ่มเป้าหมายของคุณ",
    placeholderAudience: "พ่อแม่ที่ยุ่ง อายุ 30-40 ปี",
    labelPlatform: "แพลตฟอร์ม",
    labelPlatformsMulti: "แพลตฟอร์ม",
    pickTwo: "(เลือก 2 อันขึ้นไป)",
    labelCompetitorPost: "โพสต์หรือโปรไฟล์ของคู่แข่ง",
    placeholderCompetitorPost: "วางที่นี่...",
    errBusiness: "กรุณาบอกก่อนว่าธุรกิจของคุณคืออะไร",
    errPlatforms: "เลือกอย่างน้อย 2 แพลตฟอร์ม",
    errCompetitor: "วางโพสต์ของคู่แข่งก่อน",
    errTrialUsed: "ใช้ตัวอย่างฟรีแล้ว กรอกรหัสเข้าใช้เพื่อดำเนินการต่อ",
    errInvalidCode: "รหัสเข้าใช้ไม่ถูกต้องหรือหมดอายุ",
    errGeneric: "เกิดข้อผิดพลาด",
    errRegenerate: "ไม่สามารถสร้างวันนั้นใหม่ได้",
    limitReached: "โควตาของวันนี้เต็มแล้ว",
    limitTomorrow: "อีก 50 ครั้งรอคุณพรุ่งนี้",
    btnThinking: "กำลังคิด...",
    btnBuildWeek: "สร้างสัปดาห์",
    btnFindGap: "ค้นหาช่องว่าง",
    dailyAllowance: "โควตารายวัน",
    theWeek: "สัปดาห์นี้",
    copied: "คัดลอกแล้ว",
    copyAll: "คัดลอกทั้งหมด",
    whatMissing: "สิ่งที่ขาดหายไป",
    yourAngle: "มุมมองของคุณ",
    tryThis: "ลองนี้ดู",
    bestTime: "เวลาที่ดีที่สุด",
    regenerating: "กำลังสร้างใหม่...",
    tryAnother: "ลองอันอื่น",
    trialUsedMsg: "ใช้ตัวอย่างฟรีไปแล้ว กรอกรหัสเมื่อพร้อม",
    enterCode: "กรอกรหัส",
    noCode: "ไม่มีรหัส? รับการเข้าถึง",
    trialFreeMsg: "การสร้างครั้งแรกฟรี ไม่ต้องใช้รหัส",
    statPlatforms: "แพลตฟอร์ม",
    statPillars: "เสาหลัก",
    statLanguages: "ภาษา",
    statDailyLimit: "โควตารายวัน",
    statFreeTrial: "ทดลองฟรี",
    statPayment: "การชำระเงิน",
    descPlatforms: "Instagram, TikTok, LinkedIn, Facebook, Telegram, X, Reddit และ YouTube",
    descPillars: "เชิงการศึกษา เบื้องหลัง ข้อมูลสังคม โปรโมท และความบันเทิง",
    descLanguages: "คำอธิบายและไอเดียมีให้ใน 25 ภาษา",
    descDailyLimit: "สร้างได้ 50 ครั้งต่อวัน",
    descFreeTrial: "ทดลองสร้างเต็มรูปแบบก่อนซื้อ",
    descPayment: "จ่ายครั้งเดียว ไม่มีการสมัครสมาชิก",
    welcomeTitle: "ยินดีต้อนรับ",
    welcomeSub: "สร้างได้ไม่จำกัดตั้งแต่นี้ไป",
    support: "การสนับสนุน",
    terms: "ข้อกำหนด",
    privacy: "ความเป็นส่วนตัว",
  },
  id: {
    subtitle: "Seminggu ide, dipikirkan per platform. Untuk tim yang merencanakan dengan sengaja.",
    about: "Content Strategist AI membangun seminggu ide postingan sekaligus.",
    tabSingle: "Satu platform",
    tabCross: "Lintas platform",
    tabCompetitor: "Analisis pesaing",
    labelBusiness: "BISNIS ANDA BERGERAK DI BIDANG APA",
    placeholderBusiness: "Kedai kopi lokal",
    labelOccasion: "MUSIM ATAU ACARA",
    optional: "(OPSIONAL)",
    placeholderOccasion: "Musim liburan",
    labelAudience: "AUDIENS ANDA",
    placeholderAudience: "Orang tua sibuk, usia 30-40",
    labelPlatform: "PLATFORM",
    labelPlatformsMulti: "PLATFORM",
    pickTwo: "(PILIH 2 ATAU LEBIH)",
    labelCompetitorPost: "POSTINGAN ATAU PROFIL PESAING",
    placeholderCompetitorPost: "Tempel di sini...",
    errBusiness: "Beri tahu kami dulu bisnis Anda bergerak di bidang apa.",
    errPlatforms: "Pilih minimal 2 platform.",
    errCompetitor: "Tempel dulu postingan pesaing.",
    errTrialUsed: "Pratinjau gratis telah digunakan. Masukkan kode akses untuk melanjutkan.",
    errInvalidCode: "Kode akses tidak valid atau kedaluwarsa.",
    errGeneric: "Terjadi kesalahan.",
    errRegenerate: "Tidak dapat membuat ulang hari itu.",
    limitReached: "Jatah hari ini sudah habis.",
    limitTomorrow: "Lima puluh lagi menunggu besok.",
    btnThinking: "MEMIKIRKAN...",
    btnBuildWeek: "BANGUN MINGGU INI",
    btnFindGap: "TEMUKAN CELAH",
    dailyAllowance: "JATAH HARIAN",
    theWeek: "Minggu Ini",
    copied: "TERSALIN",
    copyAll: "SALIN SEMUA",
    whatMissing: "APA YANG KURANG",
    yourAngle: "SUDUT PANDANG ANDA",
    tryThis: "COBA INI",
    bestTime: "Waktu terbaik",
    regenerating: "MEMBUAT ULANG...",
    tryAnother: "COBA YANG LAIN",
    trialUsedMsg: "Pratinjau gratis Anda sudah digunakan. Masukkan kode saat Anda siap.",
    enterCode: "MASUKKAN KODE",
    noCode: "Tidak punya kode? Dapatkan akses",
    trialFreeMsg: "Generasi pertama Anda gratis. Tidak perlu kode.",
    statPlatforms: "Platform",
    statPillars: "Pilar",
    statLanguages: "Bahasa",
    statDailyLimit: "Batas Harian",
    statFreeTrial: "Uji Coba Gratis",
    statPayment: "Pembayaran",
    descPlatforms: "Instagram, TikTok, LinkedIn, Facebook, Telegram, X, Reddit, dan YouTube.",
    descPillars: "Edukatif, di balik layar, bukti sosial, promosi, dan hiburan -- seimbang otomatis sepanjang minggu.",
    descLanguages: "Penjelasan dan ide tersedia dalam 25 bahasa.",
    descDailyLimit: "Lima puluh generasi per hari -- cukup untuk penggunaan nyata dan berkelanjutan.",
    descFreeTrial: "Coba satu generasi lengkap sebelum membeli. Tanpa kode, tanpa komitmen.",
    descPayment: "Satu kali pembayaran. Tanpa langganan, tanpa biaya berulang, selamanya.",
    welcomeTitle: "Selamat datang",
    welcomeSub: "Mulai sekarang, generasi tanpa batas.",
    support: "Dukungan",
    terms: "Ketentuan",
    privacy: "Privasi",
  },
  el: {
    subtitle: "Μία εβδομάδα ιδεών, προσαρμοσμένη ανά πλατφόρμα. Για ομάδες που σχεδιάζουν με πρόθεση.",
    about: "Το Content Strategist AI δημιουργεί μία εβδομάδα ιδεών δημοσιεύσεων κάθε φορά.",
    tabSingle: "Μία πλατφόρμα",
    tabCross: "Πολυπλατφορμικά",
    tabCompetitor: "Ανάλυση ανταγωνιστή",
    labelBusiness: "ΤΙ ΚΑΝΕΙ Η ΕΠΙΧΕΙΡΗΣΗ ΣΑΣ",
    placeholderBusiness: "Γειτονιά της γειτονιάς",
    labelOccasion: "ΕΠΟΧΗ Η ΑΦΟΡΜΗ",
    optional: "(ΠΡΟΑΙΡΕΤΙΚΟ)",
    placeholderOccasion: "Εορταστική περίοδος",
    labelAudience: "ΤΟ ΚΟΙΝΟ ΣΑΣ",
    placeholderAudience: "Απασχολημένοι γονείς, 30-40",
    labelPlatform: "ΠΛΑΤΦΟΡΜΑ",
    labelPlatformsMulti: "ΠΛΑΤΦΟΡΜΕΣ",
    pickTwo: "(ΕΠΙΛΕΞΤΕ 2 Η ΠΕΡΙΣΣΟΤΕΡΕΣ)",
    labelCompetitorPost: "ΔΗΜΟΣΙΕΥΣΗ Η ΠΡΟΦΙΛ ΑΝΤΑΓΩΝΙΣΤΗ",
    placeholderCompetitorPost: "Επικολλήστε εδώ...",
    errBusiness: "Πείτε μας πρώτα τι κάνει η επιχείρησή σας.",
    errPlatforms: "Επιλέξτε τουλάχιστον 2 πλατφόρμες.",
    errCompetitor: "Επικολλήστε πρώτα τη δημοσίευση του ανταγωνιστή.",
    errTrialUsed: "Η δωρεάν επισκόπηση χρησιμοποιήθηκε. Εισάγετε τον κωδικό πρόσβασης.",
    errInvalidCode: "Μη έγκυρος ή ληγμένος κωδικός πρόσβασης.",
    errGeneric: "Κάτι πήγε στραβά.",
    errRegenerate: "Δεν ήταν δυνατή η αναδημιουργία αυτής της ημέρας.",
    limitReached: "Το όριό σας για σήμερα συμπληρώθηκε.",
    limitTomorrow: "Ακόμα πενήντα σας περιμένουν αύριο.",
    btnThinking: "ΣΚΕΦΤΟΜΑΙ...",
    btnBuildWeek: "ΔΗΜΙΟΥΡΓΙΑ ΕΒΔΟΜΑΔΑΣ",
    btnFindGap: "ΒΡΕΣΕ ΤΟ ΚΕΝΟ",
    dailyAllowance: "ΗΜΕΡΗΣΙΟ ΟΡΙΟ",
    theWeek: "Η Εβδομάδα",
    copied: "ΑΝΤΙΓΡΑΦΗΚΕ",
    copyAll: "ΑΝΤΙΓΡΑΨΕ ΟΛΑ",
    whatMissing: "ΤΙ ΤΟΥΣ ΛΕΙΠΕΙ",
    yourAngle: "Η ΓΩΝΙΑ ΣΑΣ",
    tryThis: "ΔΟΚΙΜΑΣΕ ΑΥΤΟ",
    bestTime: "Καλύτερη ώρα",
    regenerating: "ΑΝΑΔΗΜΙΟΥΡΓΙΑ...",
    tryAnother: "ΔΟΚΙΜΑΣΕ ΑΛΛΟ",
    trialUsedMsg: "Η δωρεάν δοκιμή σας έχει ήδη χρησιμοποιηθεί. Εισάγετε τον κωδικό όταν είστε έτοιμοι.",
    enterCode: "ΕΙΣΑΓΕΤΕ ΚΩΔΙΚΟ",
    noCode: "Δεν έχετε κώδικο; Αποκτήστε πρόσβαση",
    trialFreeMsg: "Η πρώτη σας δημιουργία είναι δωρεάν. Δεν απαιτείται κώδικος.",
    statPlatforms: "Πλατφόρμες",
    statPillars: "Πυλώνες",
    statLanguages: "Γλώσσες",
    statDailyLimit: "Ημερήσιο Όριο",
    statFreeTrial: "Δωρεάν Δοκιμή",
    statPayment: "Πληρωμή",
    descPlatforms: "Instagram, TikTok, LinkedIn, Facebook, Telegram, X, Reddit και YouTube -- κάθε πλατφόρμα λαμβάνει ιδέες που λειτουργούν πραγματικά εκεί.",
    descPillars: "Εκπαιδευτικό, πίσω από τις σκηνές, κοινωνική απόδειξη, προωθητικό και ψυχαγωγό -- αυτόματα ισορροπημένα στην εβδομάδα σας.",
    descLanguages: "Εξηγήσεις και ιδέες διαθέσιμες σε 25 γλώσσες.",
    descDailyLimit: "Πενήντα δημιουργίες την ημέρα -- αρκετό για πραγματική, συνεχόμενη χρήση.",
    descFreeTrial: "Δοκιμάστε μία πλήρη δημιουργία πριν αγοράσετε. Χωρίς κωδικό, χωρίς δέσμευση.",
    descPayment: "Μία εφάπαξ πληρωμή. Χωρίς συνδρομή, χωρίς επαναλαμβανόμενες χρεώσεις.",
    welcomeTitle: "Καλώς ήρθατε",
    welcomeSub: "Από εδώ και πέρα, απεριόριστες δημιουργίες.",
    support: "Υποστήριξη",
    terms: "Όροι",
    privacy: "Απόρρητο",
  },
  sv: {
    subtitle: "En vecka av idéer, genomtänkta per plattform. För team som planerar med avsikt.",
    about: "Content Strategist AI bygger en veckas inläggsidéer i taget.",
    tabSingle: "En plattform",
    tabCross: "Flera plattformar",
    tabCompetitor: "Konkurrentanalys",
    labelBusiness: "VAD GÖR DITT FÖRETAG",
    placeholderBusiness: "Lokalt kafé",
    labelOccasion: "SÄSONG ELLER TILLFÄLLE",
    optional: "(VALFRITT)",
    placeholderOccasion: "Högtidssäsong",
    labelAudience: "DIN MÅLGRUPP",
    placeholderAudience: "Upptagna föräldrar, 30-40 år",
    labelPlatform: "PLATTFORM",
    labelPlatformsMulti: "PLATTFORMAR",
    pickTwo: "(VÄLJ 2 ELLER FLER)",
    labelCompetitorPost: "KONKURRENTENS INLÄGG ELLER PROFIL",
    placeholderCompetitorPost: "Klistra in här...",
    errBusiness: "Berätta först vad ditt företag gör.",
    errPlatforms: "Välj minst 2 plattformar.",
    errCompetitor: "Klistra in konkurrentens inlägg först.",
    errTrialUsed: "Gratis förhandsvisning använd. Ange din åtkomstkod för att fortsätta.",
    errInvalidCode: "Ogiltig eller utgången åtkomstkod.",
    errGeneric: "Något gick fel.",
    errRegenerate: "Kunde inte återskapa den dagen.",
    limitReached: "Dagens tilldelning är slut.",
    limitTomorrow: "Femtio till väntar imorgon.",
    btnThinking: "FUNDERAR...",
    btnBuildWeek: "BYGG VECKAN",
    btnFindGap: "HITTA LUCKAN",
    dailyAllowance: "DAGLIG TILLDELNING",
    theWeek: "Veckan",
    copied: "KOPIERAT",
    copyAll: "KOPIERA ALLT",
    whatMissing: "VAD DE SAKNAR",
    yourAngle: "DIN VINKEL",
    tryThis: "PROVA DETTA",
    bestTime: "Bästa tid",
    regenerating: "ÅTERSKAPAR...",
    tryAnother: "PROVA EN ANNAN",
    trialUsedMsg: "Din gratis förhandsvisning har redan använts. Ange koden när du är redo.",
    enterCode: "ANGE DIN KOD",
    noCode: "Ingen kod? Få åtkomst",
    trialFreeMsg: "Din första generering är gratis. Ingen kod krävs.",
    statPlatforms: "Plattformar",
    statPillars: "Pelare",
    statLanguages: "Språk",
    statDailyLimit: "Daglig Gräns",
    statFreeTrial: "Gratis Provning",
    statPayment: "Betalning",
    descPlatforms: "Instagram, TikTok, LinkedIn, Facebook, Telegram, X, Reddit och YouTube -- varje plattform får idéer anpassade dit.",
    descPillars: "Pädagogiskt, bakom kulisserna, socialt bevis, marknadsföring och underhållning -- automatiskt balanserat.",
    descLanguages: "Förklaringar och idéer tillgängliga på 25 språk.",
    descDailyLimit: "Femtio genereringar per dag -- tillräckligt för verklig, löpande användning.",
    descFreeTrial: "Prova en full generering innan du köper. Ingen kod, inget åtagande.",
    descPayment: "En engångsbetalning. Ingen prenumeration, aldrig återkommande avgifter.",
    welcomeTitle: "Välkommen",
    welcomeSub: "Från och med nu, obegränsade genereringar.",
    support: "Support",
    terms: "Villkor",
    privacy: "Integritet",
  },
  da: {
    subtitle: "En uge med idéer, overvejet pr. platform. Til teams, der planlægger med hensigt.",
    about: "Content Strategist AI bygger en uges opslagsidéer ad gangen.",
    tabSingle: "Én platform",
    tabCross: "Tværplatform",
    tabCompetitor: "Konkurrentanalyse",
    labelBusiness: "HVAD LAVER DIN VIRKSOMHED",
    placeholderBusiness: "Lokal cafe",
    labelOccasion: "SÆSON ELLER LEJLIGHED",
    optional: "(VALGFRIT)",
    placeholderOccasion: "Højtidssæson",
    labelAudience: "DIN MÅLGRUPPE",
    placeholderAudience: "Travle forældre, 30-40 år",
    labelPlatform: "PLATFORM",
    labelPlatformsMulti: "PLATFORME",
    pickTwo: "(VÆLG 2 ELLER FLERE)",
    labelCompetitorPost: "KONKURRENTENS OPSLAG ELLER PROFIL",
    placeholderCompetitorPost: "Indsæt her...",
    errBusiness: "Fortæl os først, hvad din virksomhed laver.",
    errPlatforms: "Vælg mindst 2 platforme.",
    errCompetitor: "Indsæt konkurrentens opslag først.",
    errTrialUsed: "Gratis prøvevisning brugt. Indtast din adgangskode for at fortsætte.",
    errInvalidCode: "Ugyldig eller udløbet adgangskode.",
    errGeneric: "Noget gik galt.",
    errRegenerate: "Kunne ikke genskabe den dag.",
    limitReached: "Dagens tildeling er brugt op.",
    limitTomorrow: "Halvtreds mere venter i morgen.",
    btnThinking: "TÆNKER...",
    btnBuildWeek: "BYG UGEN",
    btnFindGap: "FIND HULLET",
    dailyAllowance: "DAGLIG TILDELING",
    theWeek: "Ugen",
    copied: "KOPIERET",
    copyAll: "KOPIÉR ALT",
    whatMissing: "HVAD DE MANGLER",
    yourAngle: "DIN VINKEL",
    tryThis: "PRØV DETTE",
    bestTime: "Bedste tidspunkt",
    regenerating: "GENSKABER...",
    tryAnother: "PRØV EN ANDEN",
    trialUsedMsg: "Din gratis prøvevisning er allerede brugt. Indtast koden, når du er klar.",
    enterCode: "INDTAST DIN KODE",
    noCode: "Ingen kode? Få adgang",
    trialFreeMsg: "Din første generering er gratis. Ingen kode krævet.",
    statPlatforms: "Platforme",
    statPillars: "Søjler",
    statLanguages: "Sprog",
    statDailyLimit: "Dagligt Loft",
    statFreeTrial: "Gratis Prøve",
    statPayment: "Betaling",
    descPlatforms: "Instagram, TikTok, LinkedIn, Facebook, Telegram, X, Reddit og YouTube -- hver platform får idéer tilpasset dertil.",
    descPillars: "Lærerigt, bag kulisserne, socialt bevis, promoverende og underholdende -- automatisk afbalanceret.",
    descLanguages: "Forklaringer og idéer tilgængelige på 25 sprog.",
    descDailyLimit: "Halvtreds genereringer om dagen -- nok til reel, løbende brug.",
    descFreeTrial: "Prøv en fuld generering, før du køber. Ingen kode, ingen forpligtelse.",
    descPayment: "Én engangsbetaling. Intet abonnement, aldrig tilbagevendende gebür.",
    welcomeTitle: "Velkommen",
    welcomeSub: "Fra nu af, ubegrænsede genereringer.",
    support: "Support",
    terms: "Vilkår",
    privacy: "Privatliv",
  },
  no: {
    subtitle: "En uke med ideer, gjennomtænkt per plattform. For team som planlegger med hensikt.",
    about: "Content Strategist AI bygger en ukes innleggsideer om gangen.",
    tabSingle: "Én plattform",
    tabCross: "Kryssplattform",
    tabCompetitor: "Konkurrentanalyse",
    labelBusiness: "HVA GJØR BEDRIFTEN DIN",
    placeholderBusiness: "Lokal kafé",
    labelOccasion: "SESONG ELLER ANLEDNING",
    optional: "(VALGFRITT)",
    placeholderOccasion: "Høytidssesong",
    labelAudience: "MÅLGRUPPEN DIN",
    placeholderAudience: "Travle foreldre, 30-40 år",
    labelPlatform: "PLATTFORM",
    labelPlatformsMulti: "PLATTFORMER",
    pickTwo: "(VELG 2 ELLER FLERE)",
    labelCompetitorPost: "KONKURRENTENS INNLEGG ELLER PROFIL",
    placeholderCompetitorPost: "Lim inn her...",
    errBusiness: "Fortell oss først hva bedriften din gjør.",
    errPlatforms: "Velg minst 2 plattformer.",
    errCompetitor: "Lim inn konkurrentens innlegg først.",
    errTrialUsed: "Gratis forhåndsvisning brukt. Skriv inn tilgangskoden din for å fortsette.",
    errInvalidCode: "Ugyldig eller utløpt tilgangskode.",
    errGeneric: "Noe gikk galt.",
    errRegenerate: "Kunne ikke gjenskape den dagen.",
    limitReached: "Dagens tildeling er brukt opp.",
    limitTomorrow: "Femti til venter i morgen.",
    btnThinking: "TENKER...",
    btnBuildWeek: "BYGG UKEN",
    btnFindGap: "FINN HULLET",
    dailyAllowance: "DAGLIG TILDELING",
    theWeek: "Uken",
    copied: "KOPIERT",
    copyAll: "KOPIÉR ALT",
    whatMissing: "HVA DE MANGLER",
    yourAngle: "DIN VINKEL",
    tryThis: "PRØV DETTE",
    bestTime: "Beste tidspunkt",
    regenerating: "GJENSKAPER...",
    tryAnother: "PRØV EN ANNEN",
    trialUsedMsg: "Din gratis forhåndsvisning er allerede brukt. Skriv inn koden når du er klar.",
    enterCode: "SKRIV INN KODEN",
    noCode: "Ingen kode? Få tilgang",
    trialFreeMsg: "Din første generering er gratis. Ingen kode kreves.",
    statPlatforms: "Plattformer",
    statPillars: "Søyler",
    statLanguages: "Språk",
    statDailyLimit: "Daglig Grense",
    statFreeTrial: "Gratis Prøve",
    statPayment: "Betaling",
    descPlatforms: "Instagram, TikTok, LinkedIn, Facebook, Telegram, X, Reddit og YouTube -- hver plattform får ideer tilpasset der.",
    descPillars: "Lærerikt, bak kulissene, sosialt bevis, promoterende og underholdende -- automatisk balansert.",
    descLanguages: "Forklaringer og ideer tilgjengelig på 25 språk.",
    descDailyLimit: "Femti genereringer per dag -- nok til reell, løpende bruk.",
    descFreeTrial: "Prøv en full generering før du kjøper. Ingen kode, ingen forpliktelse.",
    descPayment: "Én engangsbetaling. Ingen abonnement, aldri tilbakevendende avgift.",
    welcomeTitle: "Velkommen",
    welcomeSub: "Fra nå av, ubegrensede genereringer.",
    support: "Støtte",
    terms: "Vilkår",
    privacy: "Personvern",
  },
  fi: {
    subtitle: "Viikko ideoita, harkittu alustakohtaisesti. Tiimeille, jotka suunnittelevat tarkoituksella.",
    about: "Content Strategist AI rakentaa viikon julkaisuideoita kerrallaan.",
    tabSingle: "Yksi alusta",
    tabCross: "Monialustainen",
    tabCompetitor: "Kilpailija-analyysi",
    labelBusiness: "MITÄ YRITYKSESI TEKEE",
    placeholderBusiness: "Naapuruston kahvila",
    labelOccasion: "VUODENAIKA TAI TILAISUUS",
    optional: "(VALINNAINEN)",
    placeholderOccasion: "Juhlakausi",
    labelAudience: "YLEISÖSI",
    placeholderAudience: "Kiireiset vanhemmat, 30-40v",
    labelPlatform: "ALUSTA",
    labelPlatformsMulti: "ALUSTAT",
    pickTwo: "(VALITSE 2 TAI ENEMMÄN)",
    labelCompetitorPost: "KILPAILIJAN JULKAISU TAI PROFIILI",
    placeholderCompetitorPost: "Liitä tähän...",
    errBusiness: "Kerro ensin, mitä yrityksesi tekee.",
    errPlatforms: "Valitse vähintään 2 alustaa.",
    errCompetitor: "Liitä ensin kilpailijan julkaisu.",
    errTrialUsed: "Ilmainen esikatselu käytetty. Syötä käyttöoikeuskoodisi jatkaaksesi.",
    errInvalidCode: "Virheellinen tai vanhentunut käyttöoikeuskoodi.",
    errGeneric: "Jokin meni pieleen.",
    errRegenerate: "Tätä päivää ei voitu luoda uudelleen.",
    limitReached: "Tämän päivän kiintiö on täynnä.",
    limitTomorrow: "Viisikymmentä lisää odottaa huomenna.",
    btnThinking: "MIETITÄÄN...",
    btnBuildWeek: "RAKENNA VIIKKO",
    btnFindGap: "LÖYDÄ AUKKO",
    dailyAllowance: "PÄIVITTÄINEN KIINTIÖ",
    theWeek: "Tämä Viikko",
    copied: "KOPIOITU",
    copyAll: "KOPIOI KAIKKI",
    whatMissing: "MITÄ HEILTÄ PUUTTUU",
    yourAngle: "SINUN NÄKÖKULMASI",
    tryThis: "KOKEILE TÄTÄ",
    bestTime: "Paras aika",
    regenerating: "LUODAAN UUDELLEEN...",
    tryAnother: "KOKEILE TOISTA",
    trialUsedMsg: "Ilmainen esikatselusi on jo käytetty. Syötä koodi, kun olet valmis.",
    enterCode: "SYÖTÄ KOODISI",
    noCode: "Ei koodia? Hanki käyttöoikeus",
    trialFreeMsg: "Ensimmäinen luontisi on ilmainen. Koodia ei tarvita.",
    statPlatforms: "Alustat",
    statPillars: "Pilarit",
    statLanguages: "Kielet",
    statDailyLimit: "Päiväraja",
    statFreeTrial: "Ilmainen Kokeilu",
    statPayment: "Maksu",
    descPlatforms: "Instagram, TikTok, LinkedIn, Facebook, Telegram, X, Reddit ja YouTube -- jokainen alusta saa sille sopivia ideoita.",
    descPillars: "Opettava, kulissien takana, sosiaalinen todiste, mainostava ja viihdyttävä -- automaattisesti tasapainossa.",
    descLanguages: "Selitykset ja ideat saatavilla 25 kielellä.",
    descDailyLimit: "Viisikymmentä luontia päivässä -- riittävästi todelliseen, jatkuvaan käyttöön.",
    descFreeTrial: "Kokeile täyttä luontia ennen ostoa. Ei koodia, ei sitoumusta.",
    descPayment: "Yksi kertamaksu. Ei tilausta, ei koskaan toistuvia maksuja.",
    welcomeTitle: "Tervetuloa",
    welcomeSub: "Tästä eteenpäin rajattomat luonnit.",
    support: "Tuki",
    terms: "Ehdot",
    privacy: "Tietosuoja",
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

// Собственный выпадающий список вместо нативного <datalist> — тот плохо
// или совсем не поддерживается в мобильных браузерах (особенно iOS Safari).
function AutocompleteInput({ value, onChange, options, placeholder, style, onKeyDown }) {
  const [open, setOpen] = useState(false);
  // Показываем весь список при пустом поле или фокусе на точном совпадении
  // (раньше точное совпадение исключалось из списка — при клике на уже
  // заполненное поле подсказки казались "не работающими")
  const v = (value || '').toLowerCase().trim();
  const filtered = v === '' ? options : options.filter(o => o.toLowerCase().includes(v));

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        style={style}
      />
      {open && filtered.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20,
          background: '#151412', border: '1px solid rgba(245,241,232,0.15)', borderRadius: 3,
          marginTop: 2, maxHeight: 180, overflowY: 'auto',
        }}>
          {filtered.map(o => (
            <div
              key={o}
              onMouseDown={() => { onChange(o); setOpen(false); }}
              style={{ padding: '9px 12px', fontSize: 13.5, color: '#F5F1E8', cursor: 'pointer' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(201,169,104,0.12)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
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
  const [platform, setPlatform] = useState('Instagram');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['Instagram', 'TikTok']);
  const [customPlatformInput, setCustomPlatformInput] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [photoError, setPhotoError] = useState('');
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

  function addCustomPlatform() {
    const name = customPlatformInput.trim();
    if (!name) return;
    if (!selectedPlatforms.includes(name)) {
      setSelectedPlatforms(prev => [...prev, name]);
    }
    setCustomPlatformInput('');
  }

  function handlePhotoUpload(e) {
    const files = Array.from(e.target.files || []);
    setPhotoError('');
    if (uploadedPhotos.length + files.length > 7) {
      setPhotoError('Up to 7 photos at a time.');
      return;
    }
    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        const base64 = dataUrl.split(',')[1];
        setUploadedPhotos(prev => [...prev, {
          id: Date.now() + Math.random(),
          name: file.name,
          previewUrl: dataUrl,
          base64,
          mediaType: file.type,
        }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  }

  function removePhoto(id) {
    setUploadedPhotos(prev => prev.filter(p => p.id !== id));
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
      setError(t.errRegenerate);
    } finally {
      setRegeneratingDay(null);
    }
  }

  async function handleGenerate() {
    if ((mode === 'single' || mode === 'cross') && !businessType.trim()) { setError(t.errBusiness); return; }
    if (mode === 'cross' && selectedPlatforms.length < 2) { setError(t.errPlatforms); return; }
    if (mode === 'competitor' && !competitorText.trim()) { setError(t.errCompetitor); return; }
    if (mode === 'photos' && uploadedPhotos.length === 0) { setError(t.errPhotos || 'Upload at least one photo first.'); return; }
    const isTrial = !unlocked && !freeTrialUsed;
    if (!unlocked && freeTrialUsed) { setError(t.errTrialUsed); return; }
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

    // Для режима с фото — отдельная логика: без caption, только
    // стратегическое распределение (день/платформа/pillar на фото)
    const isPhotoMode = mode === 'photos';
    if (isPhotoMode) {
      prompt = `You are a social media content strategist. You are given ${uploadedPhotos.length} photos, in order (Photo 1, Photo 2, etc). Business: ${businessType || 'small business'}. Occasion: ${occasion || 'none specific'}.

For EACH photo, decide: which day of the week it should be posted, which platform fits it best (from: ${PLATFORMS.map(p => p.label).join(', ')}, or suggest another if none fit), and which content pillar it represents (from: ${PILLARS.join(', ')}). Do NOT write a caption -- only the strategic placement. Briefly describe what you see in 3-6 words per photo (for reference, not a caption).${langInstruction}

Respond ONLY with valid JSON: {"photoIdeas": [{"photoIndex": 1, "day": "Monday", "platform": "...", "pillar": "...", "whatItShows": "..."}, ... one per photo]}`;
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          licenseCode, prompt, trial: isTrial,
          images: isPhotoMode ? uploadedPhotos.map(p => ({ base64: p.base64, mediaType: p.mediaType })) : undefined,
        }),
      });
      if (res.status === 403) throw new Error(t.errInvalidCode);
      const data = await res.json();
      const text = data.content?.map(b => b.text || '').join('') || '';
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
      if (isTrial) { localStorage.setItem('cs_free_trial_used', 'true'); setFreeTrialUsed(true); }
      setResult(parsed);
    } catch (err) {
      setError(err.message || t.errGeneric);
    } finally {
      setLoading(false);
    }
  }

  const t = UI_TEXT[uiLang] || UI_TEXT.en;

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
            {t.subtitle}
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
            {getStatCubes(t).map((s) => (
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
              {getStatCubes(t).find(s => s.label === expandedStat)?.desc}
            </p>
          )}
        </div>

        <div className="fade-in" style={{ animationDelay: '0.4s', maxWidth: 720, margin: '0 auto', padding: '32px 0 60px', borderTop: `1px solid ${LINE}` }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD }}>About</span>
          <p style={{ fontSize: 14.5, color: INK_SOFT, fontWeight: 300, lineHeight: 1.7, margin: '14px 0 0' }}>
            {t.about}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 100px' }}>

        {!unlocked && (
          <div style={{ border: `1px solid ${freeTrialUsed ? 'rgba(201,120,104,0.4)' : LINE}`, borderRadius: 4, padding: 18, marginBottom: 32 }}>
            {freeTrialUsed ? (
              <div>
                <p style={{ fontSize: 13.5, color: INK, margin: '0 0 12px', fontWeight: 400 }}>{t.trialUsedMsg}</p>
                <a href="/unlock.html" style={{ display: 'inline-block', border: `1px solid ${GOLD}`, color: GOLD, padding: '9px 20px', borderRadius: 2, fontSize: 12.5, fontWeight: 500, textDecoration: 'none', letterSpacing: '0.04em' }}>
                  {t.enterCode}
                </a>
                <a href="/buy.html" style={{ display: 'block', fontSize: 12, color: INK_SOFT, marginTop: 10 }}>{t.noCode}</a>
              </div>
            ) : (
              <p style={{ fontSize: 13.5, color: INK_SOFT, margin: 0 }}>{t.trialFreeMsg}</p>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: 0, marginBottom: 28, borderBottom: `1px solid ${LINE}` }}>
          {getModes(t).map(m => (
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
            <label style={{ fontSize: 11, color: INK_SOFT, letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>{t.labelBusiness}</label>
            <input type="text" value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder={t.placeholderBusiness}
              style={{ width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${LINE}`, color: INK, fontSize: 15, padding: '8px 0', marginBottom: 22, boxSizing: 'border-box', outline: 'none' }} />

            <label style={{ fontSize: 11, color: INK_SOFT, letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>{t.labelOccasion} <span style={{ opacity: 0.5 }}>{t.optional}</span></label>
            <input type="text" value={occasion} onChange={(e) => setOccasion(e.target.value)} placeholder={t.placeholderOccasion}
              style={{ width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${LINE}`, color: INK, fontSize: 15, padding: '8px 0', marginBottom: 22, boxSizing: 'border-box', outline: 'none' }} />

            <label style={{ fontSize: 11, color: INK_SOFT, letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>{t.labelAudience} <span style={{ opacity: 0.5 }}>{t.optional}</span></label>
            <input type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder={t.placeholderAudience}
              style={{ width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${LINE}`, color: INK, fontSize: 15, padding: '8px 0', marginBottom: 26, boxSizing: 'border-box', outline: 'none' }} />
          </>
        )}

        {mode === 'single' && (
          <>
            <label style={{ fontSize: 11, color: INK_SOFT, letterSpacing: '0.04em', display: 'block', marginBottom: 10 }}>{t.labelPlatform}</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
              {PLATFORMS.map(p => (
                <button key={p.code} onClick={() => setPlatform(p.label)} className="platform-pill"
                  style={{
                    padding: '7px 14px', borderRadius: 2, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s ease',
                    background: platform === p.label ? GOLD : 'none',
                    color: platform === p.label ? BG : INK_SOFT,
                    border: `1px solid ${platform === p.label ? GOLD : LINE}`,
                  }}>
                  {p.label}
                </button>
              ))}
            </div>
            <div style={{ marginBottom: 26 }}>
              <AutocompleteInput
                value={platform}
                onChange={setPlatform}
                options={PLATFORMS.map(p => p.label)}
                placeholder={t.customPlatformPlaceholder || 'Or type your own platform...'}
                style={{ width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${LINE}`, color: INK, fontSize: 14, padding: '8px 0', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
          </>
        )}

        {mode === 'cross' && (
          <>
            <label style={{ fontSize: 11, color: INK_SOFT, letterSpacing: '0.04em', display: 'block', marginBottom: 10 }}>{t.labelPlatformsMulti} <span style={{ opacity: 0.5 }}>{t.pickTwo}</span></label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
              {PLATFORMS.map(p => (
                <button key={p.code} onClick={() => togglePlatform(p.label)}
                  style={{
                    padding: '7px 14px', borderRadius: 2, fontSize: 12, cursor: 'pointer',
                    background: selectedPlatforms.includes(p.label) ? GOLD : 'none',
                    color: selectedPlatforms.includes(p.label) ? BG : INK_SOFT,
                    border: `1px solid ${selectedPlatforms.includes(p.label) ? GOLD : LINE}`,
                  }}>
                  {p.label}
                </button>
              ))}
              {selectedPlatforms.filter(p => !PLATFORMS.some(std => std.label === p)).map(custom => (
                <button key={custom} onClick={() => togglePlatform(custom)}
                  style={{
                    padding: '7px 14px', borderRadius: 2, fontSize: 12, cursor: 'pointer',
                    background: GOLD, color: BG, border: `1px solid ${GOLD}`,
                  }}>
                  {custom} &times;
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 26 }}>
              <div style={{ flex: 1 }}>
                <AutocompleteInput
                  value={customPlatformInput}
                  onChange={setCustomPlatformInput}
                  options={PLATFORMS.map(p => p.label)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomPlatform(); } }}
                  placeholder={t.customPlatformPlaceholder || 'Or type your own platform...'}
                  style={{ width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${LINE}`, color: INK, fontSize: 14, padding: '8px 0', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>
              <button onClick={addCustomPlatform} style={{ fontSize: 11, color: GOLD, background: 'none', border: `1px solid ${GOLD}`, borderRadius: 2, padding: '0 14px', cursor: 'pointer', flexShrink: 0, height: 34 }}>
                {t.addPlatform || 'Add'}
              </button>
            </div>
          </>
        )}

        {mode === 'competitor' && (
          <>
            <label style={{ fontSize: 11, color: INK_SOFT, letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>{t.labelBusiness} <span style={{ opacity: 0.5 }}>{t.optional}</span></label>
            <input type="text" value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder={t.placeholderBusiness}
              style={{ width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${LINE}`, color: INK, fontSize: 15, padding: '8px 0', marginBottom: 22, boxSizing: 'border-box', outline: 'none' }} />
            <label style={{ fontSize: 11, color: INK_SOFT, letterSpacing: '0.04em', display: 'block', marginBottom: 10 }}>{t.labelPlatform}</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
              {PLATFORMS.map(p => (
                <button key={p.code} onClick={() => setPlatform(p.label)}
                  style={{
                    padding: '7px 14px', borderRadius: 2, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s ease',
                    background: platform === p.label ? GOLD : 'none',
                    color: platform === p.label ? BG : INK_SOFT,
                    border: `1px solid ${platform === p.label ? GOLD : LINE}`,
                  }}>
                  {p.label}
                </button>
              ))}
            </div>
            <div style={{ marginBottom: 22 }}>
              <AutocompleteInput
                value={platform}
                onChange={setPlatform}
                options={PLATFORMS.map(p => p.label)}
                placeholder={t.customPlatformPlaceholder || 'Or type your own platform...'}
                style={{ width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${LINE}`, color: INK, fontSize: 14, padding: '8px 0', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
            <label style={{ fontSize: 11, color: INK_SOFT, letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>{t.labelCompetitorPost}</label>
            <textarea value={competitorText} onChange={(e) => setCompetitorText(e.target.value)} rows={4} placeholder={t.placeholderCompetitorPost}
              style={{ width: '100%', background: 'none', border: `1px solid ${LINE}`, color: INK, fontSize: 14, padding: '10px 12px', marginBottom: 26, boxSizing: 'border-box', outline: 'none', resize: 'vertical' }} />
          </>
        )}

        {mode === 'photos' && (
          <>
            <label style={{ fontSize: 11, color: INK_SOFT, letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>{t.labelBusiness} <span style={{ opacity: 0.5 }}>{t.optional}</span></label>
            <input type="text" value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder={t.placeholderBusiness}
              style={{ width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${LINE}`, color: INK, fontSize: 15, padding: '8px 0', marginBottom: 22, boxSizing: 'border-box', outline: 'none' }} />
            <label style={{ fontSize: 11, color: INK_SOFT, letterSpacing: '0.04em', display: 'block', marginBottom: 10 }}>{t.labelPhotos || 'Upload your photos'} <span style={{ opacity: 0.5 }}>({uploadedPhotos.length}/7)</span></label>

            {uploadedPhotos.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                {uploadedPhotos.map((p, i) => (
                  <div key={p.id} style={{ position: 'relative', width: 64, height: 64 }}>
                    <img src={p.previewUrl} alt={p.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 3, border: `1px solid ${LINE}` }} />
                    <span style={{ position: 'absolute', top: -6, left: -6, background: GOLD, color: BG, borderRadius: '50%', width: 16, height: 16, fontSize: 9.5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>{i + 1}</span>
                    <button onClick={() => removePhoto(p.id)} style={{ position: 'absolute', top: -6, right: -6, background: '#0A0908', border: `1px solid ${LINE}`, color: INK_SOFT, borderRadius: '50%', width: 16, height: 16, fontSize: 10, cursor: 'pointer', lineHeight: 1, padding: 0 }}>&times;</button>
                  </div>
                ))}
              </div>
            )}

            {uploadedPhotos.length < 7 && (
              <label style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', height: 56, border: `1px dashed ${LINE}`,
                borderRadius: 3, cursor: 'pointer', marginBottom: 8, fontSize: 12.5, color: INK_SOFT,
              }}>
                {t.uploadPhotosHint || 'Click to upload photos (up to 7)'}
                <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} style={{ display: 'none' }} />
              </label>
            )}
            {photoError && <p style={{ fontSize: 12, color: '#D98E7F', margin: '0 0 8px' }}>{photoError}</p>}
            <div style={{ marginBottom: 22 }} />
          </>
        )}

        {dailyCount >= DAILY_LIMIT ? (
          <div style={{ textAlign: 'center', padding: 16, border: `1px solid ${LINE}` }}>
            <p style={{ fontSize: 13, color: INK, margin: 0 }}>{t.limitReached}</p>
            <p style={{ fontSize: 12, color: INK_SOFT, margin: '4px 0 0' }}>{t.limitTomorrow}</p>
          </div>
        ) : (
          <button onClick={handleGenerate} disabled={loading}
            style={{
              width: '100%', padding: '15px', fontSize: 13, letterSpacing: '0.08em', fontWeight: 500, cursor: 'pointer',
              background: GOLD, color: BG, border: 'none', borderRadius: 2, opacity: loading ? 0.6 : 1,
            }}>
            {loading ? t.btnThinking : mode === 'competitor' ? t.btnFindGap : mode === 'photos' ? (t.btnPlanPhotos || 'Plan the week') : t.btnBuildWeek}
          </button>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
          <span style={{ fontSize: 10, color: INK_SOFT, letterSpacing: '0.03em' }}>{t.dailyAllowance}</span>
          <span style={{ fontSize: 10, color: INK_SOFT }}>{DAILY_LIMIT - dailyCount} / {DAILY_LIMIT}</span>
        </div>
        <div style={{ height: 1, background: LINE, marginTop: 6 }}>
          <div className="allowance-fill" style={{ height: '100%', width: `${(dailyCount / DAILY_LIMIT) * 100}%`, background: GOLD, transition: 'width 0.5s ease' }} />
        </div>

        {result && result.ideas && (
          <div style={{ marginTop: 48 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
              <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 20, color: INK }}>{t.theWeek}</span>
              <button onClick={copyAllIdeas} style={{ fontSize: 11, color: GOLD, background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.04em' }}>
                {copiedAll ? t.copied : t.copyAll}
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
                    {bestTime && <span style={{ fontSize: 10.5, color: INK_SOFT }}>{t.bestTime}: {bestTime}</span>}
                    {unlocked && (
                      <button onClick={() => regenerateDay(i)} disabled={regeneratingDay === i}
                        style={{ fontSize: 10.5, color: GOLD, background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.02em' }}>
                        {regeneratingDay === i ? t.regenerating : t.tryAnother}
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
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: GOLD, letterSpacing: '0.08em', marginBottom: 10 }}>{t.whatMissing}</div>
            <p style={{ fontSize: 16, color: INK, marginBottom: 26, lineHeight: 1.6, fontWeight: 300 }}>{result.gap}</p>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: GOLD, letterSpacing: '0.08em', marginBottom: 10 }}>{t.yourAngle}</div>
            <p style={{ fontSize: 16, color: INK, marginBottom: 26, lineHeight: 1.6, fontWeight: 300 }}>{result.angle}</p>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: GOLD, letterSpacing: '0.08em', marginBottom: 10 }}>{t.tryThis}</div>
            <p style={{ fontSize: 16, color: INK, margin: 0, lineHeight: 1.6, fontWeight: 300 }}>{result.ideaExample}</p>
          </div>
        )}

        {result && result.photoIdeas && (
          <div style={{ marginTop: 48 }}>
            <div style={{ fontSize: 12, color: INK_SOFT, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 24 }}>{t.theWeek}</div>
            {result.photoIdeas.map((it, i) => {
              const photo = uploadedPhotos[it.photoIndex - 1] || uploadedPhotos[i];
              const pc = PILLAR_COLORS[it.pillar] || PILLAR_COLORS['Educational'];
              return (
                <div key={i} className="idea-row" style={{ animationDelay: `${i * 0.06}s`, display: 'flex', gap: 14, padding: '20px 0', borderTop: `1px solid ${LINE}` }}>
                  {photo && <img src={photo.previewUrl} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 3, flexShrink: 0 }} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: INK_SOFT, letterSpacing: '0.05em' }}>{it.day?.toUpperCase()}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 10.5, color: INK_SOFT }}>{it.platform}</span>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: pc.dot, display: 'inline-block' }} />
                        <span style={{ fontSize: 10.5, color: INK_SOFT }}>{it.pillar}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 14, color: INK, margin: 0, lineHeight: 1.5, fontWeight: 300, fontStyle: 'italic', opacity: 0.8 }}>{it.whatItShows}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showWelcome && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', animation: 'welcomeFadeIn 0.5s ease both' }}>
            <div style={{ textAlign: 'center', animation: 'welcomeFadeOut 0.5s ease 3.3s both' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.2" style={{ marginBottom: 20 }}>
                <polyline points="20 6 9 17 4 12" style={{ strokeDasharray: 40, animation: 'checkDraw 0.6s ease 0.4s both' }} />
              </svg>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 28, color: INK, margin: '0 0 8px' }}>{t.welcomeTitle}</h2>
              <p style={{ fontSize: 14, color: INK_SOFT, margin: 0, fontWeight: 300 }}>{t.welcomeSub}</p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 80, paddingTop: 32, borderTop: `1px solid ${LINE}` }}>
          <span style={{ fontSize: 11, color: INK_SOFT, letterSpacing: '0.03em' }}>POWERED BY CLAUDE &middot; PLAINWORK BY KSENIA</span>
          <div style={{ display: 'flex', gap: 18, marginTop: 4 }}>
            <a href="/terms.html" style={{ fontSize: 10.5, color: INK_SOFT }}>{t.terms}</a>
            <a href="/privacy.html" style={{ fontSize: 10.5, color: INK_SOFT }}>{t.privacy}</a>
          </div>
          {!showSupportEmail ? (
            <button onClick={() => setShowSupportEmail(true)} style={{ fontSize: 10.5, color: GOLD, background: 'none', border: 'none', cursor: 'pointer' }}>{t.support}</button>
          ) : (
            <a href="mailto:kssw117@gmail.com" style={{ fontSize: 10.5, color: GOLD }}>kssw117@gmail.com</a>
          )}
        </div>
      </div>
    </div>
  );
}
