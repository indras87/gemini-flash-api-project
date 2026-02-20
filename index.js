import 'dotenv/config';
import express from "express";
import cors from "cors";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMINI_MODEL = "gemini-2.5-flash";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post("/generate-text", upload.none(), async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt
    });
    const text = response.text;

    res.json({
      success: true,
      text: text
    });
  } catch (error) {
    console.error("Error generating text:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate text"
    });
  }
});

app.post("/generate-from-image", upload.single('image'), async (req, res) => {
  const { prompt } = req.body;
  const file = req.file;

  if (!prompt || !file) {
    return res.status(400).json({ error: "Prompt and image are required" });
  }

  try {
    const imagePart = {
      inlineData: {
        data: file.buffer.toString("base64"),
        mimeType: file.mimetype
      }
    };

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [prompt, imagePart]
    });

    const text = response.text;

    res.json({
      success: true,
      text: text
    });
  } catch (error) {
    console.error("Error generating from image:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate text from image"
    });
  }
});

app.post("/generate-from-document", upload.single('document'), async (req, res) => {
  const { prompt } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "Document file is required" });
  }

  const activePrompt = prompt || "Please analyze and summarize this document.";

  try {
    const docPart = {
      inlineData: {
        data: file.buffer.toString("base64"),
        mimeType: file.mimetype
      }
    };

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [activePrompt, docPart]
    });

    const text = response.text;

    res.json({
      success: true,
      text: text
    });
  } catch (error) {
    console.error("Error generating from document:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to analyze document"
    });
  }
});

app.post("/generate-from-audio", upload.single('audio'), async (req, res) => {
  const { prompt } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "Audio file is required" });
  }

  const activePrompt = prompt || "Please transcribe and provide a summary of this audio.";

  try {
    const audioPart = {
      inlineData: {
        data: file.buffer.toString("base64"),
        mimeType: file.mimetype
      }
    };

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [activePrompt, audioPart]
    });

    const text = response.text;

    res.json({
      success: true,
      text: text
    });
  } catch (error) {
    console.error("Error generating from audio:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process audio"
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});