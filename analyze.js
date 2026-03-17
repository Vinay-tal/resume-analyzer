export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not set' });

  const { resumeText, jobDescription } = req.body || {};
  if (!resumeText || !jobDescription) {
    return res.status(400).json({ error: 'Missing resumeText or jobDescription' });
  }

  const prompt = `Analyze this resume vs job description. Reply with ONLY a JSON object, no markdown, no backticks.

RESUME: ${resumeText.slice(0, 4000)}

JOB: ${jobDescription.slice(0, 2000)}

Return this exact JSON:
{"score":0,"headline":"","summary":"","matched_skills":[],"missing_skills":[],"extra_skills":[],"suggestions":[]}`;

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 1000 }
        })
      }
    );

    const d = await r.json();
    if (!r.ok) return res.status(500).json({ error: d?.error?.message || 'Gemini error' });

    let raw = d?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    raw = raw.replace(/```json|```/gi, '').trim();
    const s = raw.indexOf('{');
    const e = raw.lastIndexOf('}');
    if (s === -1 || e === -1) return res.status(500).json({ error: 'No JSON in response', raw: raw.slice(0,300) });

    const result = JSON.parse(raw.slice(s, e + 1));
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
