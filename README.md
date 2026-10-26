# StudyPilot with Google Gemini

This version uses Google's Gemini API instead of the OpenAI API. The existing StudyPilot interface and `/api/ai` endpoint are preserved, so study guides, quiz/import requests, and image inputs continue using the same frontend calls. The Gemini key stays on the server and is not placed in the HTML.

## Deploy to Render

1. Upload these project files to the root of your GitHub repository, replacing the old `index.html`, `server.js`, `package.json`, and `README.md`.
2. In Render, open the StudyPlot web service and go to **Environment**.
3. Add `GEMINI_API_KEY` with the secret created at [Google AI Studio](https://aistudio.google.com/).
4. Optional: add `GEMINI_MODEL` with a model available to your Gemini API project. The default is `gemini-3.6-flash`.
5. Remove the old `OPENAI_API_KEY` variable after confirming Gemini works.
6. Save changes and wait for Render to deploy. The start command should be `npm start` or `yarn start`.
7. Test importing and generating a study guide.

## Local development

Install Node.js 20+, run `npm install`, set `GEMINI_API_KEY` in your terminal environment, and run `npm start`. Open `http://localhost:3000`.

- Windows PowerShell: `$env:GEMINI_API_KEY="paste-your-key-here"`
- macOS/Linux: `export GEMINI_API_KEY="paste-your-key-here"`

## Notes

- Gemini API free-tier availability and rate limits depend on the model, project, and current Google AI Studio terms. Check [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing).
- Never commit or share your API key. Keep it in Render's Environment settings.
- This server uses the Gemini `generateContent` REST endpoint and Node's built-in `fetch` (Node 20+ recommended).
- The app's sign-in is a local-device demo, not production-grade authentication. Assignment data stays in that browser's local storage in this version.
