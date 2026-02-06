# 🇮🇳 India Legal Information Assistant

**Empowering Indian Citizens with Legal Awareness**

A full-stack web application that helps common citizens in India understand their legal situations, assess urgency, and know what to do next - all in simple language.

## 🎯 Hackathon MVP Features

### ✅ Implemented Features

1. **Multi-Language Support** 🗣️
   - English, Hindi, and 8+ regional languages
   - User selects preferred language

2. **Simplified Legal Explanations** 📋
   - No legal jargon
   - 10th-grade level language
   - Plain, simple explanations

3. **Action Recommendation Engine** ⚡
   - 2-3 practical next steps
   - Realistic for common citizens
   - Step-by-step guidance

4. **Jurisdiction Detection** 🗺️
   - State and city-specific information
   - Central vs State law clarification
   - Relevant court/authority information

5. **Document Checklist** ✅
   - Lists helpful documents
   - Check-style presentation
   - Non-mandatory suggestions

6. **Risk + Urgency Assessment** ⚠️
   - LOW / MEDIUM / HIGH urgency levels
   - Clear explanations
   - Non-exaggerated

7. **Profession-Based Personalization** 👤
   - Tailored advice for students, workers, employees, business owners
   - Practical tips based on profession

8. **Privacy-First Design** 🔒
   - No login required
   - Temporary sessions
   - No personal data storage

9. **Feedback System** 📊
   - User feedback collection
   - Helps improve accuracy

## 🏗️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients and animations
- **Vanilla JavaScript** - No framework dependencies

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **In-memory storage** - For MVP (easily upgradeable to MongoDB/PostgreSQL)

## 📁 Project Structure

```
india-legal-assistant/
├── index.html          # Frontend UI
├── server.js           # Backend API server
├── package.json        # Dependencies
└── README.md          # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
```bash
# If you have the files locally
cd india-legal-assistant
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the server**
```bash
npm start
```

4. **Open in browser**
```
http://localhost:3000
```

### Development Mode

For auto-restart on file changes:
```bash
npm run dev
```

## 🎨 Features Walkthrough

### 1. Home Page
- Clear introduction
- Feature highlights
- Privacy assurance badge

### 2. User Input Form
- Problem description (textarea)
- State selection (dropdown)
- City input
- Language preference
- Profession selection

### 3. AI Analysis
- Loading indicator
- Backend processing
- Category detection

### 4. Results Display
- **Title**: Simple summary
- **What This Means**: Plain language explanation
- **Why It Matters**: Importance and context
- **What You Can Do Next**: Numbered action steps
- **Documents You May Need**: Checklist format
- **Urgency Level**: Color-coded badge with explanation
- **Jurisdiction Info**: Relevant courts and laws
- **Disclaimer**: Clear legal disclaimer
- **Feedback**: Helpful/Not helpful buttons

## 🧠 Legal Knowledge Base

The system covers these major categories:

1. **Landlord-Tenant Disputes** 🏠
   - Security deposit issues
   - Rent disputes
   - Eviction matters

2. **Consumer Rights** 🛒
   - Defective products
   - Service complaints
   - Refund issues

3. **Employment Issues** 💼
   - Salary disputes
   - Wrongful termination
   - Workplace rights

4. **Property Matters** 🏘️
   - Sale/purchase issues
   - Title disputes
   - Registration

5. **Family Law** 👨‍👩‍👧
   - Divorce
   - Custody
   - Maintenance

6. **Cyber Crimes** 💻
   - Online fraud
   - Hacking
   - Digital harassment

7. **Cheque Bounce** 📃
   - Section 138 NI Act
   - Recovery procedures

## 🔧 API Endpoints

### POST `/api/analyze`
Analyzes user's legal issue

**Request Body:**
```json
{
  "problem": "Description of legal issue",
  "state": "Maharashtra",
  "city": "Mumbai",
  "language": "English",
  "profession": "Employee"
}
```

**Response:**
```json
{
  "title": "Issue summary",
  "what_this_means": "Explanation...",
  "why_it_matters": "Importance...",
  "action_steps": ["Step 1", "Step 2", "Step 3"],
  "documents": ["Doc 1", "Doc 2"],
  "urgency_level": "MEDIUM Urgency",
  "urgency_explanation": "Reason...",
  "jurisdiction": "Court/authority info..."
}
```

### POST `/api/feedback`
Collects user feedback

**Request Body:**
```json
{
  "feedback": "helpful" // or "not-helpful"
}
```

### GET `/api/stats`
Gets feedback statistics (admin)

**Response:**
```json
{
  "total_feedback": 100,
  "helpful": 75,
  "not_helpful": 25
}
```

## 📱 Responsive Design

- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (320px - 767px)

## 🔐 Privacy & Security

### Privacy Features
- No user authentication required
- No data persistence (in MVP)
- Session-based only
- No tracking cookies
- Clear privacy notices

### Security Considerations
- Input validation
- XSS prevention
- CORS configuration
- Rate limiting (ready to implement)

## 🚀 Deployment Options

### 1. Heroku
```bash
# Install Heroku CLI
heroku create india-legal-assistant
git push heroku main
```

### 2. Vercel
```bash
# Install Vercel CLI
vercel --prod
```

### 3. DigitalOcean App Platform
- Connect GitHub repository
- Select Node.js environment
- Auto-deploys on push

### 4. AWS EC2
```bash
# SSH into EC2 instance
sudo apt update
sudo apt install nodejs npm
git clone your-repo
cd india-legal-assistant
npm install
npm start
```

### 5. Railway
- Connect GitHub
- One-click deploy
- Automatic HTTPS

## 🔄 Future Enhancements

### Phase 2 (Post-MVP)
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User accounts (optional)
- [ ] Chat history
- [ ] PDF generation of analysis
- [ ] Lawyer directory integration
- [ ] Real-time chat support
- [ ] Voice input support
- [ ] More languages (20+ Indian languages)

### Phase 3 (Advanced)
- [ ] AI-powered chatbot
- [ ] Legal document templates
- [ ] Court case status tracking
- [ ] Integration with e-courts
- [ ] Mobile app (React Native)
- [ ] SMS/WhatsApp bot
- [ ] Video consultations

## 📊 Testing

### Manual Testing Checklist
- [ ] Form validation works
- [ ] All states load correctly
- [ ] All languages display
- [ ] All professions work
- [ ] API responds correctly
- [ ] Results display properly
- [ ] Urgency levels show correctly
- [ ] Feedback buttons work
- [ ] New query button works
- [ ] Mobile responsive
- [ ] Loading animation shows

### Sample Test Cases

**Test 1: Landlord Dispute**
```
Problem: "My landlord is not returning my security deposit"
State: Maharashtra
City: Mumbai
Language: English
Profession: Employee
Expected: Landlord-tenant category, MEDIUM urgency
```

**Test 2: Cyber Crime**
```
Problem: "I lost money in an online fraud"
State: Karnataka
City: Bangalore
Language: Hindi
Profession: Student
Expected: Cyber crime category, HIGH urgency
```

## 🤝 Contributing

This is a hackathon MVP. To improve:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## ⚖️ Legal Disclaimer

**IMPORTANT:** This application provides general legal information only, NOT legal advice. The creators are NOT lawyers. Users should consult qualified legal professionals for specific legal advice.

## 📞 Support

For hackathon queries or issues:
- Email: your-email@example.com
- GitHub Issues: [Link to your repo]

## 📄 License

MIT License - feel free to use for educational purposes.

## 🏆 Hackathon Submission

### Problem Statement
Common citizens in India lack access to basic legal information in simple language.

### Solution
A web app that provides instant legal information, urgency assessment, and actionable next steps.

### Impact
- Empowers 1.4 billion Indians
- Reduces legal illiteracy
- Helps people take informed decisions
- Accessible in multiple languages
- Completely free and private

### Tech Highlights
- Full-stack JavaScript
- Responsive design
- Privacy-first architecture
- Scalable backend
- Production-ready code

## 🎯 MVP Completion Checklist

- [x] Frontend UI - Complete
- [x] Backend API - Complete
- [x] Multi-language support - Complete
- [x] Legal knowledge base - Complete
- [x] Urgency assessment - Complete
- [x] Action recommendations - Complete
- [x] Document checklist - Complete
- [x] Jurisdiction detection - Complete
- [x] Privacy features - Complete
- [x] Feedback system - Complete
- [x] Responsive design - Complete
- [x] Documentation - Complete

## 🙏 Acknowledgments

Built for [Hackathon Name] 2024
Inspired by the need to democratize legal information in India

---

**Made with ❤️ for the people of India**
