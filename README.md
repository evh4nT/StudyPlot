# StudyPilot with ChatGPT / OpenAI

This version replaces the page's Claude-specific AI integration with OpenAI's API. The existing StudyPilot layout, assignment planner, timer, and progress views are preserved. AI requests are sent to a small server endpoint so the API key is **not exposed in browser code**.

## Run locally

1. Install Node.js 20 or newer.
2. In this folder, run `npm install`.
3. Set your OpenAI API key in your terminal environment (do not put it in `index.html`):
   - macOS/Linux: `export OPENAI_API_KEY="your-api-key"`
   - Windows PowerShell: `$env:OPENAI_API_KEY="your-api-key"`
4. Optional: set `OPENAI_MODEL` to a model available to your API account. The default is `gpt-5-mini`.
5. Run `npm start` and open `http://localhost:3000`.

## Deploy

Deploy the entire folder to a Node-capable host. Configure `OPENAI_API_KEY` as a server-side environment variable and serve the app and `/api/ai` from the same origin. A static-only host such as GitHub Pages cannot run `server.js`; it needs a separate backend endpoint and the HTML's `/api/ai` URL must point to that backend.

## Notes

- AI usage is billed by OpenAI API usage and is separate from a ChatGPT subscription.
- The app's sign-in is a local-device demo, not production-grade authentication. Assignment data stays in that browser's local storage in this version.
- Do not publish your API key or commit it to source control.
