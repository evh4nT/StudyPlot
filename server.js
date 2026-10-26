import express from 'express';
import OpenAI from 'openai';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = process.env.PORT || 3000;
console.log("API key loaded:", !!process.env.OPENAI_API_KEY);
console.log("API key prefix:", process.env.OPENAI_API_KEY?.slice(0, 7));
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({ limit: '15mb' }));
app.use(express.static(__dirname));

app.post('/api/ai', async (req, res) => {
  try {
    const { prompt, images = [] } = req.body || {};
    if (typeof prompt !== 'string' || !prompt.trim()) return res.status(400).json({ error: 'A prompt is required.' });
    const content = [{ type: 'input_text', text: prompt }];
    for (const image of images.slice(0, 3)) {
      if (typeof image.data === 'string' && /^data:image\/(png|jpeg|jpg|webp|gif);base64,/i.test(image.data)) {
        content.push({ type: 'input_image', image_url: image.data });
      }
    }
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5-mini',
      input: [{ role: 'user', content }]
    });
    res.json({ text: response.output_text || '' });
  } catch (error) {
    console.error('OpenAI request failed:', error?.message || error);
    const status = error?.status === 429 ? 429 : 502;
    res.status(status).json({ error: status === 429 ? 'Rate limit reached. Try again shortly.' : 'AI request failed. Check server logs and API configuration.' });
  }
});

app.listen(port, () => console.log(`StudyPilot running at http://localhost:${port}`));
