from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch
import re

app = Flask(__name__)

# ================= CONFIG =================
MODEL_NAME = "Tanneru/Mistral-7B-Instruct-v0.3-Mental-Health-chatbot"  # Best current option; fallback: "microsoft/DialoGPT-medium"
# If VRAM low, try quantized: "TheBloke/Mistral-7B-Instruct-v0.3-GPTQ" or similar

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

# Load model & tokenizer (this may take time first run)
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype=torch.float16 if device == "cuda" else torch.float32,
    device_map="auto",  # auto = split across GPU/CPU if possible
    low_cpu_mem_usage=True
)

# Optional: sentiment pipeline for extra urgency detection
sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

# Urgency detection (expand this!)
URGENCY_PATTERNS = [
    r"\b(suicide|kill myself|die|end my life|self-harm)\b",
    r"\b(abuse|rape|assault|violence|beating)\b.*(now|today|currently)",
    r"\b(hurting.*self|cutting)\b",
    # Add Kinyarwanda if needed: r"\b(kwiyahura|kwica|gusambanya)\b" etc.
]

DISCLAIMER = (
    "\n\n**Important:** I am an AI assistant providing preliminary support only. "
    "I am NOT a licensed therapist or medical professional. "
    "If you are in crisis or danger, contact Isange One Stop Center immediately (116) or emergency services. "
    "For ongoing help, speak to a qualified counselor."
)

def is_urgent(text: str) -> bool:
    text_lower = text.lower()
    if any(re.search(pattern, text_lower) for pattern in URGENCY_PATTERNS):
        return True
    
    # Optional: sentiment boost
    sentiment = sentiment_analyzer(text)[0]
    if sentiment['label'] == 'NEGATIVE' and sentiment['score'] > 0.95:
        return True  # Very negative → flag
    
    return False

def generate_response(user_input: str, history: list = None):
    # Build prompt (Mistral-Instruct style; adjust for your model)
    prompt = (
        "You are a kind, empathetic mental health support assistant in Rwanda. "
        "Listen carefully, show understanding, offer safe coping suggestions, "
        "but never diagnose or give medical advice. Always encourage professional help.\n\n"
        f"User: {user_input}\n"
        "Assistant:"
    )
    
    # If you want conversation history (multi-turn)
    if history:
        prompt = "\n".join(history[-6:]) + f"\nUser: {user_input}\nAssistant:"  # Last 3 exchanges

    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=250,
            temperature=0.7,          # Balanced creativity
            top_p=0.9,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id
        )
    
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    # Extract just the assistant's new reply (remove prompt)
    response = response.split("Assistant:")[-1].strip()
    
    # Clean up & add disclaimer
    response = re.sub(r'\s+', ' ', response).strip()
    response += DISCLAIMER
    
    return response

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('user_input', '').strip()
    history = data.get('history', [])  # Optional: list of prev messages ["User: ...", "Assistant: ..."]

    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    response_text = generate_response(user_input, history)
    urgent = is_urgent(user_input + " " + response_text)  # Check both

    # Update history for next turn (client can send back)
    new_history = history + [f"User: {user_input}", f"Assistant: {response_text}"]

    return jsonify({
        "response": response_text,
        "urgent": urgent,
        "history": new_history[-10:]  # Keep last 5 turns
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "AI service healthy"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)  # Change port if needed