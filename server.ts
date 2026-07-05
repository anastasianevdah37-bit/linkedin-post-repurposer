import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini client to prevent crashes if key is initially empty
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing. Please configure it in Settings > Secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Server-side API endpoint for repurposing
app.post('/api/repurpose', async (req, res) => {
  try {
    const { postText } = req.body;
    if (!postText || typeof postText !== 'string' || postText.trim() === '') {
      return res.status(400).json({ error: 'Source post text is required and must be non-empty.' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `
You are an expert LinkedIn growth agent and content strategist.
Your task is to take a long-form LinkedIn post and repurpose it into multiple formats.
You must first reason about the post — identifying the core message, the target audience, the tone, and the single strongest insight — and then produce three outputs: a slider/carousel outline, a short-form version, and 3 comment hooks.

Behavior rules:
1. Write in simple, plain English. Short sentences. No corporate jargon or filler.
2. Preserve the author's original meaning and voice — repurpose, don't invent new claims.
3. Carousel: slide 1 must be a scroll-stopping hook; each slide is one idea; final slide is a clear call to action. Return 5 to 7 slides total.
4. Short-form version: keep it under 60 words, punchy, skimmable.
5. Comment hooks: each should be a question or bold statement that invites replies.

You MUST return a JSON object that matches the following schema:
{
  "analysis": {
    "core_message": "string — the one main point in a sentence",
    "audience": "string — who this is for",
    "tone": "string — e.g. reflective, punchy, contrarian"
  },
  "carousel_outline": [
    { "slide": 1, "headline": "string", "body": "string (1-2 short lines)" }
  ],
  "short_form": "string — a punchy 3-4 line version of the post for reposting",
  "comment_hooks": [
    "string — an engaging opening line to spark discussion",
    "string",
    "string"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `Here is the LinkedIn post to repurpose:\n\n${postText}` }] }
      ],
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.OBJECT,
              properties: {
                core_message: { type: Type.STRING },
                audience: { type: Type.STRING },
                tone: { type: Type.STRING }
              },
              required: ['core_message', 'audience', 'tone']
            },
            carousel_outline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  slide: { type: Type.INTEGER },
                  headline: { type: Type.STRING },
                  body: { type: Type.STRING }
                },
                required: ['slide', 'headline', 'body']
              }
            },
            short_form: { type: Type.STRING },
            comment_hooks: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['analysis', 'carousel_outline', 'short_form', 'comment_hooks']
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('No response text received from Gemini API');
    }

    const data = JSON.parse(text);
    return res.json(data);
  } catch (error: any) {
    console.error('Gemini API call failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to repurpose the post.' });
  }
});

// Serving the frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  // In development, we use Vite dev server as middleware to run on the same port 3000
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  app.use(vite.middlewares);
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
