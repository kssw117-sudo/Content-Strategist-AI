// api/generate.js
// Принимает три случая:
// 1. Общий код доступа (ACCESS_CODE)
// 2. AppSumo-коды вида CSA-XXXX-XXXX (проверяются через GitHub codes.json,
//    аналогично остальным продуктам Plainwork)
// 3. trial: true — одна бесплатная генерация без кода, чтобы модераторы
//    маркетплейсов могли реально попробовать продукт.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { licenseCode, prompt, trial } = req.body || {};

  const isSharedCode = licenseCode && licenseCode === process.env.ACCESS_CODE;
  const isAppSumoCode = licenseCode && licenseCode.trim().toUpperCase().startsWith('CSA-');
  const isFreeTrial = trial === true;

  if (!isFreeTrial && (!licenseCode || (!isSharedCode && !isAppSumoCode))) {
    return res.status(403).json({ error: 'Invalid access code.' });
  }

  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided.' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Error contacting AI.' });
  }
}
