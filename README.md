# 🇮🇳 LexScripta - AI-Powered Indian Legal Assistant

> **Simplifying Indian law, one question at a time.**

LexScripta is an intelligent legal assistant that helps users understand Indian laws through natural language queries. Upload legal documents and get simplified explanations powered by AI.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18+-blue.svg)](https://expressjs.com/)

---

## 🌟 Features

- **Natural Language Queries**: Ask legal questions in plain English/Hindi
- **Document Analysis**: Upload PDFs, DOCX, or images for legal review
- **Indian Law Focus**: Specialized knowledge of Indian legal frameworks
- **Instant Responses**: Get simplified explanations in seconds
- **Smart AI Integration**: Uses OpenAI or Anthropic Claude (with mock fallback)
- **Clean UI**: Modern, responsive design for all devices
- **File Upload Support**: PDF, DOCX, JPG, PNG (up to 10MB)
- **Example Questions**: Pre-loaded examples to get started quickly

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16 or higher
- **npm** or **yarn**
- (Optional) OpenAI or Anthropic API key for real AI responses

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lexscripta.git
   cd lexscripta
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API key (optional):
   ```env
   PORT=3000
   OPENAI_API_KEY=your_key_here
   # OR
   ANTHROPIC_API_KEY=your_key_here
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Access the application**
   
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 📁 Project Structure

```
lexscripta/
├── backend/
│   ├── controllers/
│   │   └── legalController.js      # Business logic for legal queries
│   ├── routes/
│   │   └── legalRoutes.js          # API route definitions
│   ├── middlewares/
│   │   ├── errorHandler.js         # Centralized error handling
│   │   ├── rateLimiter.js          # API rate limiting
│   │   └── uploadHandler.js        # File upload validation
│   ├── utils/
│   │   ├── aiService.js            # AI integration (OpenAI/Anthropic)
│   │   └── fileProcessor.js        # Document text extraction
│   ├── server.js                   # Express server entry point
│   └── package.json
├── frontend/
│   ├── index.html                  # Main HTML page
│   ├── style.css                   # Responsive CSS styling
│   └── script.js                   # Client-side JavaScript
├── .env.example                    # Environment variables template
├── .gitignore
└── README.md
```

---

## 🔧 API Documentation

### Base URL
```
http://localhost:3000/api/v1/legal
```

### Endpoints

#### 1. Analyze Legal Query

**POST** `/analyze`

Analyze a legal question with optional document upload.

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/legal/analyze \
  -F "question=What are property registration requirements in India?" \
  -F "file=@document.pdf"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "question": "What are property registration requirements in India?",
    "answer": "Detailed legal analysis...",
    "relatedLaws": [
      "Registration Act 1908",
      "Transfer of Property Act 1882"
    ],
    "disclaimer": "This is AI-generated legal information...",
    "fileProcessed": true,
    "aiMode": "OpenAI GPT",
    "timestamp": "2024-02-07T10:30:00.000Z"
  }
}
```

#### 2. Get Example Questions

**GET** `/examples`

Retrieve pre-configured example legal questions.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "category": "Property Law",
      "question": "What are the legal requirements for property registration?"
    }
  ]
}
```

---

## 🤖 AI Integration

LexScripta supports multiple AI backends:

### OpenAI (GPT-3.5/4)
```env
OPENAI_API_KEY=sk-...
```

### Anthropic Claude
```env
ANTHROPIC_API_KEY=sk-ant-...
```

### Mock Mode (No API Key)
If no API key is provided, the system automatically uses intelligent mock responses for testing and demos.

---

## 📦 Dependencies

### Backend
| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.2 | Web framework |
| cors | ^2.8.5 | CORS middleware |
| helmet | ^7.1.0 | Security headers |
| express-rate-limit | ^7.1.5 | Rate limiting |
| multer | ^1.4.5 | File uploads |
| pdf-parse | ^1.1.1 | PDF text extraction |
| mammoth | ^1.6.0 | DOCX processing |
| tesseract.js | ^5.0.4 | OCR for images |
| axios | ^1.6.2 | HTTP client |
| dotenv | ^16.3.1 | Environment variables |

### Frontend
- Pure vanilla JavaScript (no framework dependencies)
- Modern CSS with responsive design
- Google Fonts (Inter)

---

## 🎯 Usage Examples

### Example 1: Simple Question
```javascript
// Ask a question without file upload
Question: "What is the legal age for marriage in India?"
```

### Example 2: With Document Upload
```javascript
// Upload a rental agreement and ask
Question: "Is this rental agreement legally valid?"
File: rental_agreement.pdf
```

### Example 3: Property Law
```javascript
Question: "What documents are needed for property registration in Maharashtra?"
```

---

## 🛡️ Security Features

- **Helmet.js**: Security headers protection
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: 50 requests per 15 minutes per IP
- **File Validation**: Strict file type and size checks
- **Input Sanitization**: Protection against injection attacks
- **Error Handling**: No sensitive data in error messages

---

## 🌐 Deployment

### Option 1: Railway

1. Push code to GitHub
2. Connect Railway to your repository
3. Add environment variables
4. Deploy automatically

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app)

### Option 2: Render

1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables

### Option 3: Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel):**
```bash
cd frontend
vercel
```

**Backend (Railway):**
Deploy backend separately and update `API_BASE_URL` in `script.js`

---

## 🧪 Testing

### Test the API
```bash
# Health check
curl http://localhost:3000/health

# Analyze question
curl -X POST http://localhost:3000/api/v1/legal/analyze \
  -H "Content-Type: application/json" \
  -d '{"question":"What is IPC Section 420?"}'
```

### Test file upload
```bash
curl -X POST http://localhost:3000/api/v1/legal/analyze \
  -F "question=Review this contract" \
  -F "file=@test.pdf"
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to backend"
**Solution:** Ensure the backend server is running on the correct port.

### Issue: "File upload fails"
**Solution:** Check file size (<10MB) and format (PDF, DOCX, JPG, PNG only).

### Issue: "AI responses not working"
**Solution:** 
1. Verify API key in `.env`
2. Check API quota/credits
3. System will fallback to mock mode if API fails

---

## 🎨 Customization

### Change AI Model
Edit `backend/utils/aiService.js`:
```javascript
model: 'gpt-4'  // or 'claude-3-opus-20240229'
```

### Modify UI Theme
Edit CSS variables in `frontend/style.css`:
```css
:root {
  --primary: #6366f1;  /* Change primary color */
}
```

### Add New Example Categories
Edit `backend/controllers/legalController.js`:
```javascript
{
  category: "Your Category",
  question: "Your example question"
}
```

---

## 📸 Screenshots

> Add screenshots here:
- Homepage
- Question submission form
- Results page with analysis
- File upload interface

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See `LICENSE` file for details.

---

## ⚠️ Disclaimer

**LexScripta is an educational tool and should not be considered professional legal advice.**

- Always consult a qualified lawyer for specific legal matters
- AI-generated responses may contain errors or outdated information
- This tool is for informational purposes only
- Not affiliated with any government or legal institution

---

## 👥 Team

Built with ❤️ by the LexScripta Team

---

## 🙏 Acknowledgments

- OpenAI for GPT API
- Anthropic for Claude API
- Indian legal community for inspiration
- Open-source libraries and contributors

---

## 📞 Support

For issues and questions:
- 🐛 [Report a bug](https://github.com/yourusername/lexscripta/issues)
- 💡 [Request a feature](https://github.com/yourusername/lexscripta/issues)
- 📧 Email: support@lexscripta.com

---

**Made in India 🇮🇳 | For India | By developers who care**