// server.js (CommonJS)
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());                  // allow browser requests
app.use(express.json());          // parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // serve public/

const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
const MODEL_NAME = 'llama3'; // change if you pulled different model

app.post('/chat', async (req, res) => {
  try {
    const message = (req.body && (req.body.message || req.body.prompt)) || '';
    // Ask Ollama for a single final JSON response (no streaming)
    const r = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: message,
        stream: false
      }),
    });

    // Expect a single JSON object because stream:false
    const data = await r.json();
    const reply = (data && data.response) ? data.response : JSON.stringify(data);
    return res.json({ reply });
  } catch (err) {
    console.error('Ollama error:', err);
    return res.status(500).json({ reply: 'Error: Could not connect to Ollama.' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
