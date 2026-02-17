const AiLog = require("../models/AiLog");
const { detectIntent, pickResponse, shouldSuggestCase } = require("../utils/aiEngine");
const { success, fail, paginate } = require("../utils/response");

// ── @POST /api/ai/chat ────────────────────────────────────────────────────────
const chat = async (req, res, next) => {
  try {
    const { message, session_id } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json(fail("Message is required."));
    }

    const sessionId = session_id || AiLog.newSessionId();
    const intent = detectIntent(message);
    const aiResponse = pickResponse(intent);

    await AiLog.create({
      userId: req.user.id,
      sessionId,
      sessionText: message.trim(),
      responseText: aiResponse,
    });

    res.json(success({
      session_id: sessionId,
      response: aiResponse,
      intent,
      suggest_case_submission: shouldSuggestCase(intent),
      ...(intent === "crisis" && { emergency_number: "112" }),
    }));
  } catch (error) {
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