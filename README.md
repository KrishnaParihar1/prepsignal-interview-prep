# PrepSignal

PrepSignal is an AI-powered interview prep platform. Paste a target job description and your resume (or a quick self-description), and it generates a personalized interview strategy — tailored questions, a focus roadmap, and a skill-gap report — powered by AI.

## Features

- 🔐 Secure authentication (JWT-based)
- 📄 Resume upload (PDF/DOCX) and parsing
- 🎯 AI-generated interview questions based on a specific job description
- 📊 Skill-gap analysis and match scoring
- 📥 Downloadable PDF interview report
- 📱 Fully responsive UI

## Tech Stack

**Frontend:** React (Vite), React Router, SCSS, Axios
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Multer, pdf-parse, Puppeteer
**AI:** Groq API

## Project Structure

```
prepsignal-interview-prep/
├── Backend/
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
- A [MongoDB Atlas](https://cloud.mongodb.com) cluster
- A [Groq API key](https://console.groq.com)

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

Create a `.env` file inside `Backend/` with:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret
GROQ_API_KEY=your_groq_api_key
PORT=3000
```

### 4. Run the app

In one terminal:
```bash
cd Backend
npm run dev
```

In a second terminal:
```bash
cd Frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## License

This project is for personal/educational use.
