require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Serve the static frontend
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Optional server-side proxy: lets the app run with a key stored in .env
// instead of pasting a key into the browser every time. Purely opt-in —
// the frontend still works standalone with a client-side key.
app.post("/api/audit", async (req, res) => {
  const serverKey = process.env.GROQ_API_KEY;
  if (!serverKey) {
    return res.status(400).json({
      error: "No GROQ_API_KEY set on the server. Either add one to .env, or use the client-side key field in the UI."
    });
  }

  const { model, messages, temperature } = req.body || {};
  if (!model || !messages) {
    return res.status(400).json({ error: "Request must include 'model' and 'messages'." });
  }

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + serverKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ model, messages, temperature: temperature ?? 0.1 })
    });

    const data = await groqRes.json();
    res.status(groqRes.status).json(data);
  } catch (err) {
    res.status(500).json({ error: "Proxy request failed: " + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`SmartGuard-DI running at http://localhost:${PORT}`);
});
