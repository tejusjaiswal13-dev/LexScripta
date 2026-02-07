import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ===============================
// In-memory storage
// ===============================
const feedbackStore = [];

// ===============================
// Middleware
// ===============================
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// (KEEP YOUR LEGAL KNOWLEDGE, JURISDICTION,
// TRANSLATIONS & HELPERS AS-IS)
// 👉 DO NOT CHANGE THEIR CONTENT
// ===============================

// ⬇️ PASTE YOUR legalKnowledge, jurisdictionData,
// translations, analyzeLegalIssue(), detectJurisdiction()
// HERE WITHOUT MODIFICATION ⬇️

// ===============================
// API ROUTES
// ===============================

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "India Legal Assistant API",
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/analyze", (req, res) => {
  try {
    const { description, location, profession } = req.body;

    if (!description || description.trim().length < 10) {
      return res.status(400).json({
        error: "Please provide a detailed description (at least 10 characters)",
      });
    }

    const analysis = analyzeLegalIssue(description, location, profession);
    const jurisdiction = detectJurisdiction(location);

    res.json({
      success: true,
      analysis: {
        category: analysis.name || "General Legal Query",
        description: analysis.description,
        domain: analysis.domain || "general",
        urgency: analysis.urgency,
        timeline: analysis.timeline,
      },
      jurisdiction,
      applicableLaws: analysis.laws,
      recommendedSteps: analysis.steps,
      requiredDocuments: analysis.documents,
      professionTip: analysis.professionTip,
      disclaimer:
        "This is general legal information only. Consult a qualified lawyer for specific advice.",
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/feedback", (req, res) => {
  const { rating, comment, wasHelpful } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  feedbackStore.push({
    id: Date.now().toString(),
    rating,
    comment: comment || "",
    wasHelpful: !!wasHelpful,
    timestamp: new Date().toISOString(),
  });

  if (feedbackStore.length > 100) feedbackStore.shift();

  res.json({ success: true, message: "Feedback received" });
});

// ===============================
// Frontend
// ===============================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===============================
// Server
// ===============================
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  LexScripta / India Legal Assistant API   ║
║  Running on http://localhost:${PORT}     ║
║  Environment: ${process.env.NODE_ENV || "development"}  
╚════════════════════════════════════════════╝
`);
});
