import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import multer from "multer";
import fs from "fs";
import pdf from "pdf-parse";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";

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

/* ---------- MULTER CONFIG ---------- */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* ---------- ROUTES ---------- */
app.get("/", (req, res) => {
  res.send("LexScripta Backend is Running");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "LexScripta API"
  });
});

/* ---------- FILE UPLOAD API ---------- */
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileType = req.file.mimetype;

    let extractedText = "";

    // PDF
    if (fileType === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdf(dataBuffer);
      extractedText = pdfData.text;
    }

    // DOCX
    else if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result.value;
    }

    // IMAGE (OCR)
    else if (fileType.startsWith("image/")) {
      const result = await Tesseract.recognize(filePath, "eng");
      extractedText = result.data.text;
    }

    else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    res.json({
      success: true,
      text: extractedText.substring(0, 3000) // limit output
    });

  } catch (error) {
    res.status(500).json({ error: "File processing failed" });
  }
});

/* ---------- START SERVER ---------- */
app.listen(PORT, () => {
  console.log(`LexScripta Backend running on http://localhost:${PORT}`);
});
