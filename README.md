# 🇮🇳 India Legal Assistant

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/yourusername/india-legal-assistant/pulls)

> **Making legal knowledge accessible to every Indian citizen** - A free, privacy-first legal information assistant that provides simplified legal guidance in plain language.

## 🎯 Problem Statement

Millions of Indian citizens face legal issues but cannot access legal help due to:
- **Complex legal language** that's difficult to understand
- **High legal consultation costs** (₹500-5000+ per session)
- **Lack of awareness** about applicable laws and procedures
- **Language barriers** preventing access to legal information
- **Long wait times** for legal aid appointments

## 💡 Solution

India Legal Assistant bridges this gap by providing:
- ✅ **Instant legal analysis** of common issues
- ✅ **Simplified explanations** in non-legal language
- ✅ **Step-by-step action plans** anyone can follow
- ✅ **Document checklists** for different legal situations
- ✅ **Multi-language support** (English, Hindi, Tamil, and more)
- ✅ **Privacy-first approach** - No login, no data storage
- ✅ **Completely free** - No hidden costs

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/india-legal-assistant.git
cd india-legal-assistant

# Install dependencies
npm install

# Start the server
npm start
```

The application will be available at `http://localhost:3000`

## 📋 Features

### Core Functionality

1. **Legal Issue Analysis**
   - Rule-based analysis of 20+ common legal scenarios
   - Categories: Employment, Property, Consumer Rights, Family Law, Traffic, Criminal

2. **Multi-Language Support**
   - UI available in 6+ Indian languages
   - Backend translation ready for future expansion

3. **Simplified Explanations**
   - Complex legal terms explained in simple language
   - Plain English/Hindi descriptions

4. **Action Recommendations**
   - Step-by-step guidance on what to do next
   - Timeline for filing complaints
   - Court/authority information

5. **Jurisdiction Detection**
   - Automatic detection of applicable laws by state/city
   - Local court and authority information

6. **Document Checklist**
   - List of required documents for each case type
   - Tips on document preparation

7. **Urgency Meter**
   - Risk assessment (LOW/MEDIUM/HIGH)
   - Timeline for action

8. **Profession-Based Personalization**
   - Tailored advice based on user profession
   - Specific guidance for students, employees, business owners

9. **Feedback System**
   - In-memory feedback storage (privacy-first)
   - Rating and comments

10. **Privacy Notice**
    - Clear communication about data handling
    - No persistent storage

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend      │
│  (Vanilla JS)   │
│                 │
│  - index.html   │
│  - styles.css   │
│  - app.js       │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐
│   Backend       │
│  (Express.js)   │
│                 │
│  - server.js    │
│  - API Routes   │
│  - Legal KB     │
└─────────────────┘
```

### Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Storage**: In-memory (no database)
- **Security**: Helmet.js, CORS
- **Performance**: Compression middleware

## 📊 Supported Legal Categories

| Category | Coverage | Common Issues |
|----------|----------|---------------|
| Employment | Wrongful termination, salary disputes | Unpaid wages, notice period violations |
| Property | Tenant eviction, ownership disputes | Illegal eviction, property claims |
| Consumer Rights | Defective products, online fraud | Refunds, fake products |
| Family Law | Domestic violence, custody, maintenance | Protection orders, child support |
| Traffic | Challans, accident claims | Fine disputes, compensation |
| Criminal | False FIR, police harassment | Bail, complaints |

## 🔒 Privacy & Security

- **No User Authentication**: No login required
- **No Data Storage**: All analysis is temporary
- **No Tracking**: No cookies, no analytics
- **In-Memory Only**: Feedback stored temporarily (max 100 entries)
- **HTTPS Ready**: Production deployment with SSL
- **Helmet.js**: Security headers enabled
- **CORS Protected**: Controlled cross-origin access

## 🌐 API Documentation

### Endpoints

#### `GET /api/health`
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "India Legal Assistant API"
}
```

#### `POST /api/analyze`
Analyze a legal issue

**Request:**
```json
{
  "description": "My employer fired me without notice",
  "location": "Mumbai, Maharashtra",
  "profession": "private_employee",
  "language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "category": "Wrongful Termination",
    "description": "Being fired without proper notice or valid reason",
    "urgency": "HIGH",
    "timeline": "File complaint within 45 days"
  },
  "jurisdiction": {
    "detected": true,
    "city": "Mumbai",
    "state": "Maharashtra",
    "highCourt": "Bombay High Court"
  },
  "applicableLaws": [...],
  "recommendedSteps": [...],
  "requiredDocuments": [...]
}
```

#### `GET /api/categories`
Get all legal categories

#### `POST /api/feedback`
Submit user feedback

#### `GET /api/stats`
Get anonymized statistics

## 🧪 Testing

```bash
# Run API tests
npm test
```

Test file includes:
- Health check test
- Legal analysis test
- Category retrieval test
- Feedback submission test

## 📦 Deployment

### Local Development
```bash
npm run dev
```

### Production

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions on:
- Heroku
- Railway
- Render
- DigitalOcean
- AWS EC2

### Environment Variables

Create a `.env` file:
```
PORT=3000
NODE_ENV=production
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Areas

- Adding more legal categories
- Improving legal knowledge base
- Adding more Indian languages
- Enhancing UI/UX
- Writing documentation
- Bug fixes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Legal Disclaimer

**IMPORTANT**: This tool provides general legal information only and should not be considered as legal advice. Every legal situation is unique and requires professional assessment. 

- This is NOT a substitute for consulting a qualified lawyer
- Information provided may not be current or complete
- No attorney-client relationship is created
- Not liable for any decisions made based on this information

For specific legal advice, please consult:
- A qualified lawyer
- Legal Aid Services: **15100** (National Legal Services Authority)
- Visit: [nalsa.gov.in](https://nalsa.gov.in)

## 📞 Support & Resources

### Free Legal Resources
- **NALSA Helpline**: 15100
- **Women Helpline**: 181
- **Cyber Crime**: [cybercrime.gov.in](https://cybercrime.gov.in)
- **eCourts**: [ecourts.gov.in](https://ecourts.gov.in)
- **Consumer Helpline**: 1915

### Project Links
- **Issues**: [GitHub Issues](https://github.com/yourusername/india-legal-assistant/issues)
- **Documentation**: [Wiki](https://github.com/yourusername/india-legal-assistant/wiki)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/india-legal-assistant/discussions)

## 🌟 Acknowledgments

- National Legal Services Authority (NALSA)
- Indian judiciary for making legal information publicly available
- Open source community
- All contributors and users

## 📈 Roadmap

- [ ] Add 10+ more Indian languages
- [ ] Expand legal knowledge base to 50+ scenarios
- [ ] Add voice input support
- [ ] Integrate with legal aid network
- [ ] Mobile app (Android/iOS)
- [ ] PDF report generation
- [ ] Legal form templates
- [ ] Lawyer directory integration

## 👥 Team

Built with ❤️ for India by [Your Team Name]

---

**Made in India 🇮🇳 | For India 🇮🇳**

*Empowering citizens through accessible legal knowledge*