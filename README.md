# gemini-flash-api-project

## Overview

This project is a simple API server built with Node.js and Express that uses the Google Gemini Flash API to generate text, analyze images, process documents, and transcribe audio.

## Features

- **Text Generation**: Generate text based on a given prompt.
- **Image Analysis**: Analyze images and generate text based on the image content and a prompt.
- **Document Processing**: Analyze documents and generate text based on the document content and a prompt.
- **Audio Processing**: Transcribe audio and generate text based on the audio content and a prompt.

## Prerequisites

- Node.js (v14 or higher)
- A Google Gemini API key

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd gemini-flash-api-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

## Usage

Start the server:

```bash
npm start
```

The server will start on `http://localhost:3000`.

## API Endpoints

### Generate Text

**Endpoint**: `POST /generate-text`

**Request Body**:
```json
{
  "prompt": "What is the capital of France?"
}
```

**Response**:
```json
{
  "success": true,
  "text": "The capital of France is Paris."
}
```

### Generate from Image

**Endpoint**: `POST /generate-from-image`

**Request Body**:
```json
{
  "prompt": "What is in this image?",
  "image": "<base64_encoded_image>"
}
```

**Response**:
```json
{
  "success": true,
  "text": "This image contains a cat."
}
```

### Generate from Document

**Endpoint**: `POST /generate-from-document`

**Request Body**:
```json
{
  "prompt": "Please summarize this document.",
  "document": "<base64_encoded_document>"
}
```

**Response**:
```json
{
  "success": true,
  "text": "This document is about..."
}
```

### Generate from Audio

**Endpoint**: `POST /generate-from-audio`

**Request Body**:
```json
{
  "prompt": "Please transcribe this audio.",
  "audio": "<base64_encoded_audio>"
}
```

**Response**:
```json
{
  "success": true,
  "text": "This is a transcription of the audio."
}
```

## Development

To run the project in development mode with hot-reload, use `nodemon`:

```bash
npm run dev
```

## License

This project is licensed under the MIT License.
