import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

/* ---------- ROUTES ---------- */
app.get("/", (req, res) => {
  res.send("LexScripta Backend is Running");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "LexScripta API",
    environment: process.env.NODE_ENV || "development",
    time: new Date().toISOString()
  });
});

app.get("/api/categories", (req, res) => {
  res.json([
    "Family Law",
    "Criminal Law",
    "Property Law",
    "Consumer Law",
    "Employment Law"
  ]);
});

/* ---------- START SERVER ---------- */
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║        LexScripta Backend Running          ║
║        http://localhost:${PORT}             ║
║        Mode: ${process.env.NODE_ENV || "dev"}              ║
╚════════════════════════════════════════════╝
`);
});
