# PrepSignal

PrepSignal is an AI-powered interview prep platform. Paste a target job description and your resume (or a quick self-description), and it generates a personalized interview strategy: tailored questions, a preparation plan, and a skill-gap report.

## Features

- 🔐 Secure authentication (JWT in httpOnly cookies, token blacklist on logout)
- 📄 Resume upload (PDF, max 3MB) and parsing, or a self-description instead
- 🎯 AI-generated technical and behavioral questions based on a specific job description
- 📊 Skill-gap analysis and match scoring
- 📥 Download an AI-tailored resume as PDF for the target job
- 📱 Responsive UI

## Tech Stack

**Frontend:** React (Vite), React Router, SCSS, Axios
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Multer, pdf-parse, Puppeteer
**AI:** Google Gemini API (`@google/genai`)

## Project Structure

```
prepsignal-interview-prep/
├── Backend/
│   ├── server.js
│   └── src/
│       ├── config/        # Database connection
│       ├── controllers/   # Auth & interview logic
│       ├── middlewares/   # Auth guard, file upload handling
│       ├── models/        # Mongoose schemas
│       ├── routes/        # API route definitions
│       └── services/      # AI service integration
└── Frontend/
    └── src/
        ├── features/
        │   ├── auth/       # Login, register, auth context
        │   └── interview/  # Interview flow, reports
        ├── services/       # Axios API client
        └── style/          # Global styles & design tokens
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A [MongoDB Atlas](https://cloud.mongodb.com) cluster (or a local MongoDB)
- A [Gemini API key](https://aistudio.google.com/apikey)

### 1. Clone the repo

```bash
git clone https://github.com/KrishnaParihar1/prepsignal-interview-prep.git
cd prepsignal-interview-prep
```

### 2. Install dependencies

```bash
cd Backend
npm install

cd ../Frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside `Backend/`:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret
GOOGLE_GENAI_API_KEY=your_gemini_api_key
PORT=3000
```

### 4. Run the app

Terminal 1:
```bash
cd Backend
npm run dev
```

Terminal 2:
```bash
cd Frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Notes

- PDF generation uses Puppeteer, which downloads Chromium on install. On Linux servers you may need extra system libraries for Chromium to launch.
- The frontend expects the backend at `http://<current-host>:3000`, and the backend only allows CORS from `localhost:5173` / `127.0.0.1:5173`. Update both before deploying.

## License

This project is for personal/educational use.
