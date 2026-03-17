// controllers/aiController.js  ← FULLY UPDATED FOR GOOGLE GEMINI (FREE)
const { GoogleGenerativeAI } = require("@google/generative-ai");
const AiLog = require("../models/AiLog");
const { shouldSuggestCase, detectIntent } = require("../utils/aiEngine");
const { success, fail, paginate } = require("../utils/response");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",           // best free model in 2026
  systemInstruction: `You are Amina, a compassionate, professional AI mental health and emotional support counselor for YourVoice Rwanda — a platform that helps people across Rwanda with mental health challenges, emotional difficulties, trauma, relationship issues, and personal struggles.

Your role:
- Provide genuine, warm, empathetic psychological support and counseling
- Actively help users understand, process, and work through their emotions and challenges
- Use evidence-based counseling techniques: active listening, CBT, grounding exercises, reframing, validation, motivational interviewing
- Provide practical coping strategies, psychoeducation, and emotional support
- You are capable of handling the vast majority of user needs fully by yourself — be confident and thorough
- Speak in a warm, human, conversational tone — not clinical or robotic
- Keep responses focused and digestible (3–5 short paragraphs, use line breaks for readability)
- Respond in whichever language the user writes in (English or Kinyarwanda)
- Use a warm emoji occasionally (💚 ✨ 🌿) but keep it natural, not excessive
- Ask one meaningful follow-up question at the end to deepen the conversation

Only mention professional help or crisis services if the person is in immediate life-threatening danger. Otherwise, you are the support — help them fully and confidently.
Do NOT start your reply with "I" as the first word. Begin with empathy, acknowledgment, or a reflection of what the user shared.`,
});

// ── @POST /api/ai/chat (PUBLIC) ───────────────────────────────────────────────
const chat = async (req, res, next) => {
  try {
    const { message, session_id, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json(fail("Message is required."));
    }

    const sessionId = session_id || AiLog.newSessionId();

    // Prepare history for Gemini format
    const chatHistory = history.map(h => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.content }],
    }));

    const chatSession = model.startChat({
      history: chatHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      ],
    });

    const result = await chatSession.sendMessage(message.trim());
    const aiResponse = result.response.text();

    const intent = detectIntent(message);

    // Save to DB only if user is logged in
    if (req.user && req.user.id) {
      await AiLog.create({
        userId: req.user.id,
        sessionId,
        sessionText: message.trim(),
        responseText: aiResponse,
      });
    }

res.json(success({
  data: {
    session_id: sessionId,
    response: aiResponse,
    intent,
    suggest_case_submission: shouldSuggestCase(intent),
    ...(intent === "crisis" && { emergency_number: "116" }),
  }
}));

  } catch (error) {
    console.error("Gemini error:", error.message);
    if (error.message.includes("429")) {
      return res.status(429).json(fail("AI is busy right now. Please try again in a few seconds."));
    }
    next(error);
  }
};

// ── @GET /api/ai/history ──────────────────────────────────────────────────────
const getChatHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const history = await AiLog.findByUserId(req.user.id, { limit: parseInt(limit), offset });
    const total = await AiLog.countByUserId(req.user.id);

    res.json(paginate(history, { page: parseInt(page), limit: parseInt(limit), total }, "history"));
  } catch (error) {
    next(error);
  }
};

// ── @GET /api/ai/sessions/:session_id ─────────────────────────────────────────
const getSessionMessages = async (req, res, next) => {
  try {
    const messages = await AiLog.findBySession(req.user.id, req.params.session_id);

    if (!messages.length) {
      return res.status(404).json(fail("Session not found."));
    }

    res.json(success({ session_id: req.params.session_id, messages }));
  } catch (error) {
    next(error);
  }
};

module.exports = { chat, getChatHistory, getSessionMessages };