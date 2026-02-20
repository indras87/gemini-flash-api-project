# Gemini Flash API Project

A powerful and flexible API built with Node.js and Express that leverages Google's Gemini 2.5 Flash model for multi-modal content generation. This project features a built-in futuristic command-center UI and is fully equipped with CORS support for cross-origin integration.

## 🚀 Features

- **Multi-modal Support**: Process Text, Images, Documents, and Audio.
- **Futuristic UI**: Integrated sleek dark-mode command center for testing.
- **CORS Enabled**: Ready to be consumed by any frontend application.
- **Express-powered**: Robust backend handling with `multer` for file processing.
- **Google Generative AI**: Powered by the latest Gemini Flash models.

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **AI**: @google/genai (Gemini 2.5 Flash)
- **Middleware**: CORS, Multer (for file uploads)
- **Frontend**: Vanilla HTML/CSS/JS (Futuristic Command Center)

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- Google Gemini API Key (Get it from [Google AI Studio](https://aistudio.google.com/))

## ⚙️ Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd gemini-flash-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

## 🏃 Running the Project

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```
The server will run on `http://localhost:3000`.

---

## 📡 API Reference

All endpoints accept `multipart/form-data`.

### 1. Generate Text
**Endpoint**: `POST /generate-text`
- **Body (`form-data`)**:
  - `prompt`: String (e.g., "Tell me a joke")

### 2. Analyze Image
**Endpoint**: `POST /generate-from-image`
- **Body (`form-data`)**:
  - `image`: File (Image)
  - `prompt`: String (Optional, e.g., "Describe this image")

### 3. Analyze Document
**Endpoint**: `POST /generate-from-document`
- **Body (`form-data`)**:
  - `document`: File (PDF, TXT, etc.)
  - `prompt`: String (Optional)

### 4. Process Audio
**Endpoint**: `POST /generate-from-audio`
- **Body (`form-data`)**:
  - `audio`: File (MP3, WAV, etc.)
  - `prompt`: String (Optional)

---

## 🖥️ User Interface

The project includes a built-in UI accessible at `http://localhost:3000`. It features:
- **Mode Switching**: Toggle between Text, Image, Document, and Audio.
- **Drag & Drop**: Easily upload files for analysis.
- **Copy to Clipboard**: Quick access to generated content.
- **Performance Metrics**: Real-time tracking of processing time.

## 📜 License

This project is licensed under the ISC License.
