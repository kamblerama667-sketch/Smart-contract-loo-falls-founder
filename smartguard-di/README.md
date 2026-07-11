# SmartGuard-DI

A cyberpunk-themed Solidity smart contract auditor powered by a 2-agent
consensus matrix — **Llama-3.3-70B** and **GPT-OSS-120B**, run in parallel
via the [Groq API](https://console.groq.com/) — for fused decision
intelligence on contract security.

## Project structure

```
smartguard-di/
├── backend/
│   └── server.js      # Express server: serves the frontend + optional API proxy
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## How the API key works

There are two ways to use this app — pick whichever you prefer:

1. **Client-side (default, zero backend storage).** Paste your Groq API
   key directly into the UI. It's held in browser memory only and sent
   straight from your browser to Groq's API. Nothing touches the server.
   This is what makes the project safe to open-source: no key is ever
   committed to the repo.

2. **Server-side proxy (optional).** Add your key to a local `.env` file
   (see `.env.example`) and the backend will proxy requests through
   `POST /api/audit` using `GROQ_API_KEY`. Useful if you're deploying this
   for a team and don't want everyone pasting in their own key. `.env` is
   git-ignored, so your key never gets committed.

## Setup

```bash
git clone <your-repo-url>
cd smartguard-di
npm install
cp .env.example .env   # optional, only if using the server-side proxy
npm start
```

Then open `http://localhost:3000`.

## Usage

1. Paste your Groq API key into the key field (or configure `.env` for
   the server-side proxy — see above).
2. Paste your Solidity contract into the code panel.
3. Click **Initiate Security Scan**. Both agents run in parallel:
   - **Llama-3.3-70B** — architectural / logic verdict
   - **GPT-OSS-120B** — exploit remediation and fixes
4. Review the fused report.

## Notes

- Get a free Groq API key at https://console.groq.com/keys
- This tool provides AI-assisted analysis, not a guarantee of security.
  Always pair it with manual review and, for production contracts, a
  professional audit.

## License

MIT
