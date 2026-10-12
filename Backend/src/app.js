const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()
if (process.env.NODE_ENV === "production") app.set("trust proxy", 1)

app.use(express.json())
app.use(cookieParser())
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173")
    .split(",")
    .map((o) => o.trim())

app.use(cors({ origin: allowedOrigins, credentials: true }))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

app.get("/api/health", (req, res) => res.json({ ok: true }))

if (process.env.NODE_ENV === "production") {
    const path = require("path")
    const distPath = path.join(__dirname, "../../Frontend/dist")
    app.use(express.static(distPath))
    app.get(/^\/(?!api\/).*/, (req, res) => res.sendFile(path.join(distPath, "index.html")))
}

app.use((err, req, res, next) => {
    console.error(err)
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ message: "File too large (max 3MB)" })
    }
    if (err.status && err.status < 500) {
        return res.status(err.status).json({ message: err.message })
    }
    res.status(500).json({ message: "Something went wrong. Please try again." })
})

module.exports = app