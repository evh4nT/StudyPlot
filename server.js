import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({ limit: '15mb' }));
app.use(express.static(__dirname));

app.post('/api/ai', async (req, res) => {
  try {
    const { prompt, images = [] } = req.body || {};
    if (typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'A prompt is required.' });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY environment variable is missing.');
      return res.status(500).json({ error: 'Gemini API key is not configured on the server.' });
    }

    const parts = [{ text: prompt }];
    for (const image of Array.isArray(images) ? images.slice(0, 3) : []) {
      if (typeof image?.data !== 'string') continue;
      const match = image.data.match(/^data:image\/(png|jpeg|jpg|webp);base64,([A-Za-z0-9+/=]+)$/i);
      if (match) {
        const mimeType = match[1].toLowerCase() === 'jpg' ? 'image/jpeg' : `image/${match[1].toLowerCase()}`;
        parts.push({ inline_data: { mime_type: mimeType, data: match[2] } });
      }
    }

    const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({ contents: [{ role: 'user', parts }] })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const apiMessage = data?.error?.message || `Gemini API returned HTTP ${response.status}`;
      console.error(`Gemini API request failed (${response.status}):`, apiMessage);
      const status = response.status === 429 ? 429 : (response.status === 400 ? 400 : 502);
      const message = response.status === 429
        ? 'Gemini rate limit or quota reached. Wait and check your free-tier usage limits.'
        : response.status === 400
          ? 'Gemini could not process this request. Check the prompt, image, or model settings.'
          : 'Gemini request failed. Check the server logs and API key configuration.';
      return res.status(status).json({ error: message });
    }

    const text = (data?.candidates?.[0]?.content?.parts || [])
      .map(part => typeof part.text === 'string' ? part.text : '')
      .join('');
    if (!text) {
      console.error('Gemini returned no text:', JSON.stringify(data?.promptFeedback || data?.candidates?.[0]?.finishReason || {}));
      return res.status(502).json({ error: 'Gemini returned no text. Try a different prompt or image.' });
    }
    return res.json({ text });
  } catch (error) {
    console.error('Gemini request failed:', error?.message || error);
    return res.status(502).json({ error: 'Gemini request failed. Check server logs and API configuration.' });
  }
});

app.listen(port, () => console.log(`StudyPilot running at http://localhost:${port}`));
