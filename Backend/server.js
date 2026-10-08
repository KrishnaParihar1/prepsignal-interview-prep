require("dotenv").config();

const requiredEnv = ["MONGO_URI", "JWT_SECRET", "GOOGLE_GENAI_API_KEY"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length) {
  console.error(`Missing required env vars: ${missingEnv.join(", ")}`);
  process.exit(1);
}
const app = require("./src/app");
const connectToDB = require("./src/config/database");

async function startServer() {
  await connectToDB();

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Unable to start server:", err.message);
  process.exitCode = 1;
});
