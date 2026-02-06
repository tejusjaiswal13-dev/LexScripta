const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for feedback (privacy-first, temporary)
const feedbackStore = [];

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.static('public'));

// Legal knowledge base
const legalKnowledge = {
  'employment': {
    keywords: ['job', 'salary', 'termination', 'workplace', 'employee', 'employer', 'resignation', 'firing', 'unpaid', 'overtime'],
    categories: {
      'wrongful_termination': {
        name: 'Wrongful Termination',
        description: 'Being fired or removed from your job without proper notice or valid reason',
        laws: ['Industrial Disputes Act, 1947', 'Shops and Establishments Act (State-specific)'],
        steps: [
          'Collect your appointment letter, termination notice, and salary slips',
          'Check if you received proper notice period (usually 30-90 days)',
          'Document all communication with your employer',
          'File a complaint with the Labour Commissioner within 45 days',
          'Consider approaching Labour Court if settlement fails'
        ],
        documents: ['Employment contract', 'Termination letter', 'Salary slips (last 6 months)', 'Appointment letter', 'Any written warnings'],
        urgency: 'HIGH',
        timeline: 'File complaint within 45 days of termination'
      },
      'salary_dispute': {
        name: 'Salary Not Paid',
        description: 'Your employer has not paid your salary on time or has deducted money unfairly',
        laws: ['Payment of Wages Act, 1936', 'Minimum Wages Act, 1948'],
        steps: [
          'Keep records of your work hours and agreed salary',
          'Send a formal email/letter to HR demanding payment',
          'File complaint with Labour Commissioner online or in person',
          'Labour office will call employer for conciliation meeting',
          'If unresolved, case moves to court for legal action'
        ],
        documents: ['Appointment letter showing salary', 'Bank statements', 'Email/WhatsApp communication', 'Attendance records', 'Pay slips if available'],
        urgency: 'HIGH',
        timeline: 'Complaint can be filed immediately, preferably within 1 month'
      }
    }
  },
  'property': {
    keywords: ['house', 'flat', 'land', 'rent', 'landlord', 'tenant', 'eviction', 'lease', 'property', 'real estate', 'possession'],
    categories: {
      'tenant_eviction': {
        name: 'Forced Eviction by Landlord',
        description: 'Your landlord is trying to remove you from the rented property without following legal process',
        laws: ['Rent Control Act (State-specific)', 'Transfer of Property Act, 1882'],
        steps: [
          'Check your rent agreement for notice period and terms',
          'Landlord must give written notice (usually 1-3 months)',
          'Do not vacate without proper legal notice',
          'File complaint with Rent Control Authority in your city',
          'Landlord cannot forcibly evict you without court order'
        ],
        documents: ['Rent agreement', 'Rent payment receipts', 'Notice from landlord', 'Any written communication', 'Police complaint (if threatened)'],
        urgency: 'HIGH',
        timeline: 'File complaint immediately upon receiving illegal eviction notice'
      },
      'property_dispute': {
        name: 'Property Ownership Dispute',
        description: 'Someone is claiming ownership or right over your property',
        laws: ['Transfer of Property Act, 1882', 'Indian Evidence Act, 1872', 'Limitation Act, 1963'],
        steps: [
          'Gather all property documents (sale deed, title deed, tax receipts)',
          'Get encumbrance certificate from Sub-Registrar office',
          'Consult a property lawyer for document verification',
          'Send legal notice to the other party',
          'File civil suit for declaration of ownership if needed'
        ],
        documents: ['Sale deed', 'Title deed', 'Property tax receipts', 'Encumbrance certificate', 'Survey documents', 'Will or inheritance papers'],
        urgency: 'MEDIUM',
        timeline: 'Civil suits have 12-year limitation period for property claims'
      }
    }
  },
  'consumer': {
    keywords: ['product', 'service', 'defective', 'refund', 'consumer', 'shop', 'online', 'purchase', 'warranty', 'fraud'],
    categories: {
      'defective_product': {
        name: 'Defective Product or Poor Service',
        description: 'You bought something that is faulty or received bad service',
        laws: ['Consumer Protection Act, 2019'],
        steps: [
          'Contact the seller/service provider with your complaint',
          'Send written complaint via email or registered post',
          'Wait 30 days for response from company',
          'File complaint on National Consumer Helpline (1915) or online portal',
          'Approach Consumer Court if amount is less than ₹1 crore'
        ],
        documents: ['Purchase bill/invoice', 'Product photos/videos', 'Warranty card', 'Email communication', 'Bank/card payment proof'],
        urgency: 'MEDIUM',
        timeline: 'File complaint within 2 years of purchase/service'
      },
      'online_fraud': {
        name: 'Online Shopping Fraud',
        description: 'You paid for something online but did not receive it or received fake product',
        laws: ['Consumer Protection Act, 2019', 'Information Technology Act, 2000', 'Indian Penal Code Section 420'],
        steps: [
          'Take screenshots of product listing, payment, and communication',
          'Report transaction to your bank/card company immediately',
          'File cyber complaint on cybercrime.gov.in portal',
          'Lodge FIR at local police station if amount is significant',
          'File consumer complaint if seller is identifiable'
        ],
        documents: ['Order confirmation email', 'Payment screenshot', 'Chat/email with seller', 'Bank statement', 'Product listing screenshot'],
        urgency: 'HIGH',
        timeline: 'Report to bank within 24-48 hours; file cyber complaint within 7 days'
      }
    }
  },
  'family': {
    keywords: ['divorce', 'marriage', 'custody', 'maintenance', 'child', 'domestic violence', 'dowry', 'alimony', 'abuse'],
    categories: {
      'domestic_violence': {
        name: 'Domestic Violence',
        description: 'Physical, mental, or emotional abuse by family member or spouse',
        laws: ['Protection of Women from Domestic Violence Act, 2005', 'Indian Penal Code Section 498A'],
        steps: [
          'Call Women Helpline 181 for immediate assistance',
          'Visit nearest police station to file FIR',
          'Get medical examination done if physically hurt',
          'Approach Protection Officer or file petition in Magistrate Court',
          'You can claim right to residence and monetary relief'
        ],
        documents: ['Medical reports if injured', 'Photos of injuries', 'Witness statements', 'Any threatening messages', 'Marriage certificate'],
        urgency: 'HIGH',
        timeline: 'File complaint immediately; FIR has no time limit for domestic violence'
      },
      'child_custody': {
        name: 'Child Custody Dispute',
        description: 'Disagreement about who should take care of children after separation',
        laws: ['Hindu Minority and Guardianship Act, 1956', 'Guardians and Wards Act, 1890'],
        steps: [
          'Try to reach mutual agreement through family counseling',
          'Document your relationship and care for the child',
          'File custody petition in Family Court',
          'Court will prioritize child welfare and best interest',
          'Mother usually gets custody of children below 7 years'
        ],
        documents: ['Birth certificate of child', 'School records', 'Medical records', 'Income proof', 'Character witnesses', 'Marriage certificate'],
        urgency: 'MEDIUM',
        timeline: 'Can be filed anytime; court process takes 6-12 months'
      },
      'maintenance': {
        name: 'Maintenance/Alimony Not Paid',
        description: 'Spouse or parent not providing financial support as ordered by court',
        laws: ['Hindu Marriage Act Section 125 CrPC', 'Muslim Women Act, 1986'],
        steps: [
          'Collect proof of non-payment (bank statements)',
          'Send legal notice demanding payment',
          'File execution petition in the same court that passed order',
          'Court can attach salary or property for recovery',
          'Can also file criminal complaint for willful non-payment'
        ],
        documents: ['Court order for maintenance', 'Bank statements', 'Income proof of spouse', 'Expense bills', 'Any communication'],
        urgency: 'MEDIUM',
        timeline: 'File execution petition anytime after non-payment'
      }
    }
  },
  'traffic': {
    keywords: ['challan', 'traffic', 'fine', 'driving', 'license', 'accident', 'vehicle', 'rto', 'pollution'],
    categories: {
      'traffic_challan': {
        name: 'Traffic Challan/Fine',
        description: 'You received a traffic violation ticket or fine',
        laws: ['Motor Vehicles Act, 1988'],
        steps: [
          'Check challan details on Parivahan website or local traffic police site',
          'Verify if challan is correct (check date, time, location)',
          'Pay fine online or at traffic office if accepting violation',
          'If disputing, visit traffic court on date mentioned',
          'Submit evidence (documents, photos) to prove your case'
        ],
        documents: ['Driving license', 'Vehicle registration', 'Insurance papers', 'Photos/dashcam footage (if disputing)', 'Challan notice'],
        urgency: 'LOW',
        timeline: 'Pay within 60 days to avoid increased penalty; court hearing within 90 days'
      },
      'accident_claim': {
        name: 'Road Accident Compensation',
        description: 'You were injured in a road accident and need compensation',
        laws: ['Motor Vehicles Act, 1988', 'Fatal Accidents Act, 1855'],
        steps: [
          'File FIR immediately after accident at nearest police station',
          'Get medical treatment and keep all bills and reports',
          'Note down vehicle number and collect witness details',
          'Apply to Motor Accident Claims Tribunal within 6 months',
          'Insurance company will be directed to pay compensation'
        ],
        documents: ['FIR copy', 'Medical reports and bills', 'Disability certificate if applicable', 'Income proof', 'Photos of accident', 'Witness statements'],
        urgency: 'HIGH',
        timeline: 'File claim within 6 months of accident'
      }
    }
  },
  'criminal': {
    keywords: ['fir', 'police', 'arrest', 'bail', 'theft', 'assault', 'fraud', 'cheating', 'complaint'],
    categories: {
      'false_fir': {
        name: 'False FIR Against You',
        description: 'Someone has filed a fake police complaint against you',
        laws: ['Code of Criminal Procedure, 1973', 'Indian Penal Code'],
        steps: [
          'Do not panic; collect evidence proving your innocence',
          'Hire a criminal lawyer immediately',
          'Apply for anticipatory bail in Sessions Court',
          'Cooperate with police investigation',
          'File counter-complaint for false case if you have proof'
        ],
        documents: ['Any alibi proof (CCTV, travel tickets)', 'Witness statements', 'Phone records', 'Communication with complainant', 'Character certificates'],
        urgency: 'HIGH',
        timeline: 'Apply for anticipatory bail before arrest; quash petition within reasonable time'
      },
      'police_harassment': {
        name: 'Police Harassment',
        description: 'Police are threatening you or demanding bribe',
        laws: ['Code of Criminal Procedure Section 154', 'Prevention of Corruption Act'],
        steps: [
          'Record conversation if possible (legal as you are party)',
          'File complaint with Senior Police Officer or Commissioner',
          'Complain to State Human Rights Commission',
          'Can approach Lokayukta or Anti-Corruption Bureau',
          'As last resort, file writ petition in High Court'
        ],
        documents: ['Audio/video recording', 'Witness statements', 'Written threats if any', 'Previous complaint copies'],
        urgency: 'HIGH',
        timeline: 'File complaint immediately; corruption complaints have no limitation'
      }
    }
  }
};

// Jurisdiction data (major cities and states)
const jurisdictionData = {
  states: {
    'maharashtra': { capital: 'Mumbai', highCourt: 'Bombay High Court', districts: 36 },
    'delhi': { capital: 'New Delhi', highCourt: 'Delhi High Court', districts: 11 },
    'karnataka': { capital: 'Bengaluru', highCourt: 'Karnataka High Court', districts: 31 },
    'tamil nadu': { capital: 'Chennai', highCourt: 'Madras High Court', districts: 38 },
    'west bengal': { capital: 'Kolkata', highCourt: 'Calcutta High Court', districts: 23 },
    'uttar pradesh': { capital: 'Lucknow', highCourt: 'Allahabad High Court', districts: 75 },
    'gujarat': { capital: 'Gandhinagar', highCourt: 'Gujarat High Court', districts: 33 },
    'rajasthan': { capital: 'Jaipur', highCourt: 'Rajasthan High Court', districts: 50 },
    'telangana': { capital: 'Hyderabad', highCourt: 'Telangana High Court', districts: 33 },
    'punjab': { capital: 'Chandigarh', highCourt: 'Punjab and Haryana High Court', districts: 23 }
  },
  cities: {
    'mumbai': { state: 'Maharashtra', consumerForum: 'Mumbai Consumer Disputes Redressal Commission' },
    'delhi': { state: 'Delhi', consumerForum: 'Delhi State Consumer Disputes Redressal Commission' },
    'bengaluru': { state: 'Karnataka', consumerForum: 'Karnataka State Consumer Disputes Redressal Commission' },
    'hyderabad': { state: 'Telangana', consumerForum: 'Telangana State Consumer Disputes Redressal Commission' },
    'chennai': { state: 'Tamil Nadu', consumerForum: 'Tamil Nadu State Consumer Disputes Redressal Commission' },
    'kolkata': { state: 'West Bengal', consumerForum: 'West Bengal State Consumer Disputes Redressal Commission' },
    'pune': { state: 'Maharashtra', consumerForum: 'Pune Consumer Disputes Redressal Commission' },
    'ahmedabad': { state: 'Gujarat', consumerForum: 'Gujarat State Consumer Disputes Redressal Commission' }
  }
};

// Translation support (basic implementation)
const translations = {
  'hi': {
    'employment': 'रोजगार',
    'property': 'संपत्ति',
    'consumer': 'उपभोक्ता',
    'family': 'परिवार',
    'traffic': 'यातायात',
    'criminal': 'आपराधिक'
  },
  'ta': {
    'employment': 'வேலைவாய்ப்பு',
    'property': 'சொத்து',
    'consumer': 'நுகர்வோர்',
    'family': 'குடும்பம்',
    'traffic': 'போக்குவரத்து',
    'criminal': 'குற்றவியல்'
  }
};

// Helper function to analyze legal issue
function analyzeLegalIssue(description, location, profession) {
  const descLower = description.toLowerCase();
  let matchedCategory = null;
  let matchedDomain = null;
  let maxMatches = 0;

  // Find best matching category
  for (const [domain, data] of Object.entries(legalKnowledge)) {
    for (const keyword of data.keywords) {
      if (descLower.includes(keyword)) {
        for (const [catKey, category] of Object.entries(data.categories)) {
          const matches = data.keywords.filter(kw => descLower.includes(kw)).length;
          if (matches > maxMatches) {
            maxMatches = matches;
            matchedCategory = category;
            matchedDomain = domain;
          }
        }
        break;
      }
    }
  }

  // Default fallback
  if (!matchedCategory) {
    return {
      category: 'General Legal Query',
      description: 'Your issue requires specific legal consultation',
      laws: ['Indian Constitution', 'Relevant State Laws'],
      steps: [
        'Document all facts and collect relevant papers',
        'Consult a lawyer for personalized advice',
        'Visit your nearest Legal Aid office for free consultation',
        'You can also call National Legal Services Authority helpline'
      ],
      documents: ['Any relevant papers or evidence you have'],
      urgency: 'MEDIUM',
      timeline: 'Consult a lawyer within 7 days',
      professionTip: 'Legal matters are time-sensitive, seek expert help early'
    };
  }

  // Add profession-specific tip
  let professionTip = '';
  if (profession) {
    const profLower = profession.toLowerCase();
    if (profLower.includes('student')) {
      professionTip = 'As a student, you may be eligible for free legal aid. Check with your college legal cell.';
    } else if (profLower.includes('business') || profLower.includes('entrepreneur')) {
      professionTip = 'Consider consulting a corporate lawyer who specializes in business matters.';
    } else if (profLower.includes('govt') || profLower.includes('government')) {
      professionTip = 'Government employees have specific legal protections. Consult your departmental legal advisor.';
    } else {
      professionTip = 'Legal aid services are available if you cannot afford a lawyer.';
    }
  }

  return {
    ...matchedCategory,
    domain: matchedDomain,
    professionTip
  };
}

// Helper function to detect jurisdiction
function detectJurisdiction(location) {
  if (!location) {
    return {
      detected: false,
      message: 'Please provide your location for jurisdiction-specific information'
    };
  }

  const locLower = location.toLowerCase();
  
  // Check cities first
  for (const [city, data] of Object.entries(jurisdictionData.cities)) {
    if (locLower.includes(city)) {
      const state = data.state;
      const stateData = jurisdictionData.states[state.toLowerCase()];
      return {
        detected: true,
        city: city.charAt(0).toUpperCase() + city.slice(1),
        state: state,
        highCourt: stateData.highCourt,
        consumerForum: data.consumerForum,
        capital: stateData.capital
      };
    }
  }

  // Check states
  for (const [state, data] of Object.entries(jurisdictionData.states)) {
    if (locLower.includes(state)) {
      return {
        detected: true,
        state: state.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        highCourt: data.highCourt,
        capital: data.capital,
        districts: data.districts
      };
    }
  }

  return {
    detected: false,
    message: 'Could not detect specific jurisdiction. General Indian law information provided.'
  };
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'India Legal Assistant API'
  });
});

// Main analysis endpoint
app.post('/api/analyze', (req, res) => {
  try {
    const { description, location, profession, language } = req.body;

    if (!description || description.trim().length < 10) {
      return res.status(400).json({
        error: 'Please provide a detailed description (at least 10 characters)'
      });
    }

    // Analyze the legal issue
    const analysis = analyzeLegalIssue(description, location, profession);
    
    // Detect jurisdiction
    const jurisdiction = detectJurisdiction(location);

    // Format response
    const response = {
      success: true,
      analysis: {
        category: analysis.category,
        description: analysis.description,
        domain: analysis.domain || 'general',
        urgency: analysis.urgency,
        timeline: analysis.timeline
      },
      jurisdiction: jurisdiction,
      applicableLaws: analysis.laws,
      recommendedSteps: analysis.steps,
      requiredDocuments: analysis.documents,
      professionTip: analysis.professionTip,
      disclaimer: 'This is general legal information only. For specific advice, please consult a qualified lawyer.',
      generatedAt: new Date().toISOString()
    };

    res.json(response);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'An error occurred while analyzing your issue',
      message: error.message
    });
  }
});

// Get legal categories
app.get('/api/categories', (req, res) => {
  const categories = Object.keys(legalKnowledge).map(key => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    nameHindi: translations.hi[key] || key,
    nameTamil: translations.ta[key] || key
  }));

  res.json({
    success: true,
    categories
  });
});

// Submit feedback
app.post('/api/feedback', (req, res) => {
  try {
    const { rating, comment, wasHelpful } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: 'Rating must be between 1 and 5'
      });
    }

    // Store feedback temporarily (in-memory, privacy-first)
    const feedback = {
      id: Date.now().toString(),
      rating,
      comment: comment || '',
      wasHelpful: wasHelpful || false,
      timestamp: new Date().toISOString()
    };

    feedbackStore.push(feedback);

    // Keep only last 100 feedback entries
    if (feedbackStore.length > 100) {
      feedbackStore.shift();
    }

    res.json({
      success: true,
      message: 'Thank you for your feedback!',
      feedbackId: feedback.id
    });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({
      error: 'An error occurred while submitting feedback'
    });
  }
});

// Get statistics (anonymized)
app.get('/api/stats', (req, res) => {
  const avgRating = feedbackStore.length > 0
    ? (feedbackStore.reduce((sum, f) => sum + f.rating, 0) / feedbackStore.length).toFixed(1)
    : 0;

  const helpfulCount = feedbackStore.filter(f => f.wasHelpful).length;

  res.json({
    success: true,
    stats: {
      totalFeedback: feedbackStore.length,
      averageRating: parseFloat(avgRating),
      helpfulResponses: helpfulCount,
      lastUpdated: new Date().toISOString()
    }
  });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'POST /api/analyze',
      'GET /api/categories',
      'POST /api/feedback',
      'GET /api/stats'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║   India Legal Assistant API Server Running    ║
║   Port: ${PORT}                                    ║
║   Environment: ${process.env.NODE_ENV || 'development'}                    ║
║   Privacy-First: No database, no auth          ║
╚════════════════════════════════════════════════╝
  `);
  console.log(`\n🌐 Open http://localhost:${PORT} in your browser`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/health\n`);
});

module.exports = app;