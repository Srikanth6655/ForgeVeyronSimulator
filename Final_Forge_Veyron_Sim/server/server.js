// server/server.js
// Local-only demo chat server with curated Forge & Veyron Q/A and file-type guidance.
// Returns OpenAI-like reply shapes so the client works unchanged.

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

console.log("Starting local-only Forge & Veyron demo chat server...");

// ---------- Domain-specific canned knowledge ----------
const knowledge = [
  {
    keys: ["hello", "hi", "hey"],
    text: "Hello — I'm your SemPilot Forge & Veyron assistant. Ask about uploading files, file formats."
  },
  {
    keys: ["install", "setup", "run", "start", "how to run"],
    text: "To run locally: 1) `npm install` 2) `npm run start-server` (starts local chat server) 3) `npm run dev` (starts frontend / Vite). Forge accepts JSON files; Veyron accepts CSV or XLSX."
  },
  {
    keys: ["requirements", "hardware", "system", "specs"],
    text: "Suggested minimum: Node.js 18+, 4 GB RAM. Recommended: Node.js 20+, 8+ GB RAM, SSD. For production, use a server with stable internet and appropriate resources."
  },
  {
    keys: ["forge file", "forge json", "forge file type", "forge json example", "forge json format"],
    text:
'Forge accepts JSON files only. The JSON must include the standard bet values (min, default, max)' 
  },
  {
    keys: ["Veyron s", "accepted file types", "allowed file types"],
    text: "Accepted file types: **Veyron** → CSV (.csv) or Excel (.xls/.xlsx)."
  },
  {
    keys: ["multipliers list", "multipliers", "currency list", "supported currencies", "currencies"],
    text:
`Common multipliers (examples):

Forge - Standard:
USD (1), MYR (5), ZAR (10), ZMW (20), PHP (50), ISK (200)

Forge - LVC:
CLP (500), KHR (1000), GNF (2000), PYG (5000), IDR (10000)

Veyron - Bet:
MYR (5), ARS (200), IDR (200), VND (200), THB (50), KRW (200), CLP (200), NGN (100), COP (200), TZS (200), UGX (200), PYG (200)

Hybrid examples:
CNY -> min:5 default:5 max:10
ARS -> min:250 default:250 max:50 (depending on group; ARS moved to Bet multipliers group on request)
`
  },
  {
    keys: ["export", "download", "download csv", "export csv"],
    text: "After calculation use the Download/Export button to save the results as CSV."
  },
  {
    keys: ["errors", "not working", "0 values", "nan"],
    text: "If you get 0 or NaN values, check the uploaded file: ensure numeric fields (min, default, max or Value) are plain numbers (no commas, no currency symbols)."
  },
  {
    keys: ["help", "support", "contact"],
    text: "This is a SemPilot. For more help, ask about a specific page (Forge or Veyron), or request an example file and I'll provide one."
  },
  // default fallback
  {
    keys: ["default"],
    text: "SempPilot: I can help with file formats, running the project, and explaining calculation formulas. Try asking: 'How do I format a Forge JSON?', 'What file types does Veyron accept?', or 'How is the default bet calculated?'."
  }
];

// ---------- Helper: pick canned reply ----------
function findReplyText(userText) {
  if (!userText || !userText.trim()) return knowledge.find(k => k.keys.includes("default")).text;
  const ut = userText.toLowerCase();

  for (const k of knowledge) {
    for (const key of k.keys) {
      if (ut.includes(key)) return k.text;
    }
  }
  // fallback: try to provide guidance or echo short sample answer
  if (ut.length < 80) {
    return `SemPilot: I received "${userText}". Try asking about 'Forge JSON format' or 'Veyron CSV example'.`;
  }
  return `SemPilot: I received your message. For file format guidance, ask 'Forge JSON example' or 'Veyron CSV example'.`;
}

// ---------- Endpoint: chat (local-only) ----------
app.post("/api/chat", (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: { message: "Bad request - 'messages' array required" } });
    }

    // find last user message (support different shapes)
    const rev = [...messages].reverse();
    const last = rev.find(m => m.role && m.role.toString().toLowerCase() === "user") || {};
    // value could be text, content, or message
    const rawText = (last.text ?? last.content ?? last.message ?? "");
    // content can be array/object in some shapes (e.g., OpenAI-like); flatten it
    let userText = "";
    if (Array.isArray(rawText)) {
      userText = rawText.map(p => (p?.text ?? p)).join(" ");
    } else if (typeof rawText === "object" && rawText !== null) {
      // attempt to find text in object
      userText = rawText.text ?? rawText.parts?.join(" ") ?? JSON.stringify(rawText);
    } else {
      userText = String(rawText);
    }

    // find a canned reply
    const replyText = findReplyText(userText);

    // server returns the same shape your frontend expects
    const reply = {
      role: "SemPilot",
      content: [{ type: "text", text: replyText }]
    };

    return res.json({ reply });
  } catch (err) {
    console.error("Internal /api/chat error:", err);
    return res.status(500).json({ error: { message: "Internal server error", detail: err.message } });
  }
});

// health
app.get("/api/health", (req, res) => res.json({ status: "ok", mode: "local-only" }));

app.listen(PORT, () => {
  console.log(`Local chat server running on http://localhost:${PORT}`);
});
