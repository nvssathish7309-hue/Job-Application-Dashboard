const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const router = express.Router();
let aiClient = null;

function getAIClient() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

function buildSystemPrompt(candidates) {
  return `You are the AI assistant inside "Hirely", a recruiter dashboard.
You help a recruiter understand and act on their candidate pipeline.

Current candidates (JSON):
${JSON.stringify(candidates, null, 2)}

Rules:
- Answer using only the candidate data above plus general recruiting knowledge.
- Be concise — a few sentences or a short list, not long essays.
- When you reference a candidate, use their name.
- If asked something the data can't answer, say so plainly instead of guessing.
- Never invent candidates, statuses, or numbers not present in the data.`;
}

router.post('/chat', async (req, res) => {
  try {
    const { message, candidates = [], history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "Missing 'message' string in request body." });
    }
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Server is missing GEMINI_API_KEY." });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.status(500).json({ error: "Failed to initialize Gemini AI client." });
    }

    // Map prior turns into Gemini's expected content format
    const contents = history
      .filter((m) => m.role === 'user' || m.role === 'ai')
      .map((m) => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: buildSystemPrompt(candidates),
        temperature: 0.4,
        maxOutputTokens: 500,
      },
    });

    const reply = response.text?.trim() || "I couldn't generate a response for that.";
    res.json({ reply });
  } catch (err) {
    console.error('AI Mode /chat error:', err);
    res.status(500).json({ error: 'AI Mode failed to respond. Please try again.' });
  }
});

module.exports = router;
