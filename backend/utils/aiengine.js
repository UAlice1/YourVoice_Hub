/**
 * Lightweight keyword-based AI intent engine.
 * In production, replace `detectIntent` with a call to a Python NLP service.
 */

const RESPONSES = {
  greet: [
    "Hello! I'm here to support you. Feel free to share what you're going through — this is a safe, confidential space.",
    "Welcome to YourVoice. How can I support you today?",
  ],
  mental_health: [
    "It sounds like you're going through a difficult time. You're not alone, and it's okay to reach out. Talking to a mental health professional can make a big difference. Would you like me to refer you to one of our professional partners?",
    "Thank you for sharing that with me. Your feelings are valid. Mental health challenges are common and treatable. I recommend speaking with a counselor — would you like a referral?",
  ],
  abuse: [
    "I hear you, and I want you to know that what you're experiencing is not your fault. Your safety is the top priority. Please consider submitting a case so our team can connect you with immediate help.",
    "You are brave for reaching out. Abuse of any kind is never acceptable. I can connect you with the Isange One Stop Center or our NGO partners for immediate support.",
  ],
  gbv: [
    "Gender-based violence is a serious issue, and you deserve safety and support. I strongly encourage you to submit a case immediately — our team will respond urgently. You are not alone.",
    "Thank you for trusting us. GBV cases are treated with the highest priority. Please submit your case using the secure form, and our specialists will be in touch very soon.",
  ],
  trauma: [
    "Trauma can feel overwhelming, but healing is possible. Our network of professionals specialises in trauma-informed care. Would you like to be connected with a counselor?",
    "You've shown incredible strength by reaching out. Processing trauma takes time, and professional support can help. I'm here to guide you to the right resources.",
  ],
  loneliness: [
    "Feeling lonely or isolated is very difficult. Community and connection are powerful healers. Our platform can connect you with support groups and counselors who understand.",
    "You don't have to face this alone. Reaching out is the first step — let me help connect you with someone who can offer real support.",
  ],
  crisis: [
    "⚠️ Your safety is my top concern right now. If you are in immediate danger, please call emergency services (112 in Rwanda). You can also submit an urgent case on our platform and our team will respond immediately.",
  ],
  default: [
    "I'm here to listen and guide you. Can you tell me a bit more about what you're experiencing? I want to make sure I connect you with the right support.",
    "Thank you for reaching out to YourVoice. I'm here to help. Could you share a little more about what you're going through?",
  ],
};

/**
 * Detect the intent of a user message using keyword matching.
 * @param {string} message
 * @returns {string} intent key
 */
const detectIntent = (message) => {
  const m = message.toLowerCase();
  if (/^(hi|hello|hey|bonjour|muraho)/i.test(m))                              return "greet";
  if (/\b(kill|hurt myself|suicide|die|end my life|emergency)\b/i.test(m))    return "crisis";
  if (/\b(rape|sexual assault|harass|gbv|gender.?based)\b/i.test(m))          return "gbv";
  if (/\b(abuse|beat|hit|hurt|violence|attack|beaten)\b/i.test(m))            return "abuse";
  if (/\b(trauma|ptsd|flashback|nightmare|shock)\b/i.test(m))                 return "trauma";
  if (/\b(depress|anxious|anxiety|stress|mental|sad|hopeless|crying|panic)\b/i.test(m)) return "mental_health";
  if (/\b(lonely|alone|isolated|no one|abandoned)\b/i.test(m))                return "loneliness";
  return "default";
};

/**
 * Pick a random response for a given intent.
 * @param {string} intent
 * @returns {string}
 */
const pickResponse = (intent) => {
  const pool = RESPONSES[intent] || RESPONSES.default;
  return pool[Math.floor(Math.random() * pool.length)];
};

/**
 * Intents that suggest the user should submit a formal case.
 */
const CASE_SUGGESTION_INTENTS = new Set(["gbv", "abuse", "trauma", "crisis"]);

const shouldSuggestCase = (intent) => CASE_SUGGESTION_INTENTS.has(intent);

module.exports = { detectIntent, pickResponse, shouldSuggestCase };