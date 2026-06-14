import express from "express";
import { GoogleGenAI } from "@google/genai";
import { pdrVectorDbInstance } from "./server_rag.js";

export const app = express();

app.use(express.json());

const SYSTEM_PROMPT = `
Ти — висококваліфікований AI-асистент з Правил дорожнього руху (ПДР) України.
Твоє завдання — допомагати користувачам вивчати та розуміти правила дорожнього руху України, відповідати на запитання, роз'яснювати складні ситуації на дорозі, пояснювати вимоги дорожніх знаків, розмітки, правила проїзду перехресть, швидкісні режими тощо.
Завжди відповідай українською мовою. Будь ввічливим, чітким та професійним. По можливості, посилайся на конкретні пункти або розділи Правил дорожнього руху України.
Якщо користувач запитує щось, що взагалі не стосується ПДР або автомобільної тематики, ввічливо нагадай йому, що ти спеціалізуєшся виключно на Правилах дорожнього руху України.
`;

let geminiClient: GoogleGenAI | null = null;

function getGemini(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured.");
    }
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return geminiClient;
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/search", async (req, res) => {
  try {
    const { query } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    const chunks = await pdrVectorDbInstance.search(query || "", apiKey, 3);
    res.json({ chunks });
  } catch (err: any) {
    console.error("Error in /api/search:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing or invalid messages parameter." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        await pdrVectorDbInstance.ensureEmbeddingsInitialized(apiKey);
      } catch (embErr) {
        console.error("Failed to initialize embeddings:", embErr);
      }
    }

    const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
    const query = lastUserMsg ? lastUserMsg.content : "";

    let foundChunks = [];
    if (query.trim()) {
      foundChunks = await pdrVectorDbInstance.search(query, apiKey, 3);
    }

    const contextText = foundChunks.map(c => `[${c.section}]\n${c.content}`).join('\n\n');

    const dynamicSystemPrompt = `${SYSTEM_PROMPT}

ІНФОРМАЦІЙНИЙ КОНТЕКСТ З ОФІЦІЙНОЇ БАЗИ ПДР УКРАЇНИ (Зверення до нього пріоритетне):
${contextText ? contextText : "Не знайдено конкретного пункту в базі для точного цитування. Будь ласка, спирайся на офіційні відомі тобі норми ПДР України."}

УВАГА! КРИТИЧНА ВИМОГА: У своїй відповіді обов'язково цитуй або безпосередньо посилайся на конкретні розділи та пункти (наприклад: "Відповідно до пункту 12.3 ПДР України...", "Згідно з розділом 15 пункт 15.3 (а)..."), які вказані у наведеному блоці інформаційного контексту вище. Роби текст посилань/пунктів виділеним жирним шрифтом для зручності читання користувачем (наприклад: **пункт 12.3**).
`;

    if (!apiKey) {
      console.log("[api] GEMINI_API_KEY is missing. Returning RAG lexical search fallback response.");
      const chunksStr = foundChunks.length > 0
        ? foundChunks.map(c => `📖 **${c.section}**\n${c.content}`).join('\n\n')
        : "На жаль, за вашим запитом не знайдено точних збігів у локальній базі ПДР.";

      const reply = `⚠️ **Режим локального пошуку (GEMINI_API_KEY не налаштовано)**

Я знайшов такі матеріали в офіційних ПДР України за цим запитом:

${chunksStr}

_Для повного доступу до розумного AI-помічника з роз'ясненнями, додайте **GEMINI_API_KEY** у Vercel Environment Variables._`;

      return res.json({ reply });
    }

    const ai = getGemini();

    const geminiContents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: geminiContents,
      config: {
        systemInstruction: dynamicSystemPrompt,
        temperature: 0.7,
      }
    });

    const reply = response.text || "";
    return res.json({ reply });
  } catch (err: any) {
    console.error("Error in /api/chat:", err);
    return res.status(500).json({
      error: "API_ERROR",
      message: `Помилка запиту до Gemini API: ${err.message}`
    });
  }
});

export default app;
