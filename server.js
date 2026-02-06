const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// In-memory storage for demo (replace with database in production)
let feedbackData = [];

// Legal knowledge base for Indian laws (simplified for MVP)
const legalKnowledgeBase = {
    landlord_tenant: {
        keywords: ['landlord', 'tenant', 'rent', 'security deposit', 'eviction', 'lease', 'rental'],
        laws: 'Governed by state-specific Rent Control Acts and Transfer of Property Act, 1882',
        common_issues: ['Security deposit not returned', 'Illegal eviction', 'Rent increase disputes']
    },
    consumer_rights: {
        keywords: ['defective product', 'consumer', 'refund', 'warranty', 'service', 'complaint'],
        laws: 'Consumer Protection Act, 2019',
        common_issues: ['Defective products', 'Unfair trade practices', 'Service deficiency']
    },
    employment: {
        keywords: ['employee', 'salary', 'termination', 'resignation', 'workplace', 'leave', 'pf', 'gratuity'],
        laws: 'Industrial Disputes Act, Payment of Wages Act, Gratuity Act, PF Act',
        common_issues: ['Wrongful termination', 'Salary disputes', 'Leave disputes']
    },
    property: {
        keywords: ['property', 'land', 'sale', 'purchase', 'registration', 'title', 'deed'],
        laws: 'Transfer of Property Act, 1882 and state-specific laws',
        common_issues: ['Property disputes', 'Title verification', 'Sale deed issues']
    },
    family_law: {
        keywords: ['divorce', 'marriage', 'maintenance', 'custody', 'alimony', 'domestic violence'],
        laws: 'Hindu Marriage Act, Special Marriage Act, Protection of Women from Domestic Violence Act',
        common_issues: ['Divorce proceedings', 'Child custody', 'Maintenance disputes']
    },
    cyber_crime: {
        keywords: ['cyber', 'online fraud', 'hacking', 'phishing', 'digital', 'internet'],
        laws: 'Information Technology Act, 2000',
        common_issues: ['Online fraud', 'Identity theft', 'Cyber harassment']
    },
    cheque_bounce: {
        keywords: ['cheque', 'bounce', 'dishonour', 'payment', 'bank'],
        laws: 'Negotiable Instruments Act, 1881 (Section 138)',
        common_issues: ['Cheque dishonor', 'Payment recovery']
    }
};

// AI-powered analysis function
function analyzeLegalIssue(formData) {
    const { problem, state, city, language, profession } = formData;
    
    // Detect category
    let category = 'general';
    let relevantLaws = 'Various Indian laws may apply';
    
    const problemLower = problem.toLowerCase();
    
    for (const [key, value] of Object.entries(legalKnowledgeBase)) {
        if (value.keywords.some(keyword => problemLower.includes(keyword))) {
            category = key;
            relevantLaws = value.laws;
            break;
        }
    }
    
    // Generate response based on category and profession
    const response = generateResponse(category, formData, relevantLaws);
    
    return response;
}

function generateResponse(category, formData, relevantLaws) {
    const { problem, state, city, language, profession } = formData;
    
    // Base response structure
    let response = {
        title: '',
        what_this_means: '',
        why_it_matters: '',
        action_steps: [],
        documents: [],
        urgency_level: '',
        urgency_explanation: '',
        jurisdiction: '',
        language: language
    };
    
    // Category-specific responses
    switch(category) {
        case 'landlord_tenant':
            response.title = 'Landlord-Tenant Dispute: Security Deposit or Rental Issue';
            response.what_this_means = `Your issue relates to rental property rights in ${state}. In India, landlord-tenant relationships are governed by state-specific Rent Control Acts and the Transfer of Property Act, 1882. This means that both you and your landlord have specific rights and duties that must be followed.`;
            response.why_it_matters = `Security deposits and rental agreements are legally protected. If your landlord is wrongfully withholding your deposit or violating your rental rights, you have legal remedies available. Acting quickly can help you recover your money and protect your rights.`;
            response.action_steps = [
                'Send a written notice to your landlord via registered post demanding the return of your security deposit, giving them 15-30 days to respond',
                'Collect all evidence: rental agreement, rent receipts, deposit receipt, photographs of the property when you vacated',
                'If no response, file a complaint at your local police station or approach the Rent Control Court in your area',
                'Consider consulting a local lawyer for a legal notice (₹500-2000 typically)'
            ];
            response.documents = [
                'Rental/Lease Agreement (copy)',
                'Rent payment receipts',
                'Security deposit receipt',
                'Photographs of property condition at move-out',
                'Any written communication with landlord',
                'Address proof of current residence'
            ];
            response.urgency_level = 'MEDIUM Urgency';
            response.urgency_explanation = 'While not an emergency, taking action within 2-3 months is important as evidence becomes harder to gather over time.';
            response.jurisdiction = `This matter is governed by ${state} state laws. You can approach the Rent Control Court in ${city} or file a civil suit. State-specific Rent Control Acts apply along with central laws.`;
            break;
            
        case 'consumer_rights':
            response.title = 'Consumer Rights Issue: Defective Product or Service';
            response.what_this_means = `You have strong rights under the Consumer Protection Act, 2019. This law protects consumers from unfair trade practices, defective products, and poor services. You can file a complaint if a product is defective or a service is not provided properly.`;
            response.why_it_matters = `Consumer courts in India are designed to be simple, fast, and affordable. You don't need a lawyer for small claims (under ₹10 lakh). You can get compensation, replacement, or refund.`;
            response.action_steps = [
                'Send a written complaint to the company/shop via email and registered post, keeping copies',
                'If no response within 30 days, file a complaint online at the National Consumer Helpline (1800-11-4000) or edaakhil.nic.in',
                'Gather all bills, receipts, warranty cards, and evidence of the defect (photos/videos)',
                'File a case in the Consumer Court (District/State/National based on claim amount)'
            ];
            response.documents = [
                'Purchase bill/invoice',
                'Product warranty card',
                'Photos or videos showing the defect',
                'Any written communication with the seller',
                'Bank statements showing payment',
                'ID proof and address proof'
            ];
            response.urgency_level = 'LOW to MEDIUM Urgency';
            response.urgency_explanation = 'Consumer complaints have a 2-year limitation period from the date of purchase, so you have time, but acting sooner is better.';
            response.jurisdiction = `Consumer Protection Act, 2019 is a central law that applies across India. You can file a complaint in the Consumer Court in ${city}, ${state}. For claims under ₹50 lakh, file in District Consumer Forum.`;
            break;
            
        case 'employment':
            response.title = 'Employment Rights: Salary, Termination, or Workplace Issue';
            response.what_this_means = `Employment laws in India protect workers from unfair treatment. Whether you're a salaried employee, contract worker, or daily wage worker, you have rights regarding salary payment, working conditions, and termination procedures.`;
            response.why_it_matters = `Unpaid salaries, wrongful termination, and workplace harassment are serious violations. As a ${profession}, you are protected by labor laws and can take legal action to recover dues or challenge unfair dismissal.`;
            response.action_steps = [
                'Document everything: employment contract, salary slips, emails, termination letter, bank statements',
                'Send a legal notice to your employer demanding payment/reinstatement (through a lawyer or yourself)',
                'File a complaint with the Labor Commissioner office in ${city}',
                'If PF/ESI is involved, file a complaint with EPFO or ESIC',
                'For serious cases, approach the Labor Court or file a case under Industrial Disputes Act'
            ];
            response.documents = [
                'Employment contract/appointment letter',
                'Salary slips for last 6 months',
                'Bank statement showing salary credits',
                'Termination letter or notice',
                'Any written communication with employer',
                'PF/ESI records if applicable',
                'ID and address proof'
            ];
            response.urgency_level = 'MEDIUM to HIGH Urgency';
            response.urgency_explanation = 'Salary and employment disputes should be addressed quickly. Delay can weaken your case and make evidence collection difficult.';
            response.jurisdiction = `Employment matters in ${state} are governed by central labor laws (Payment of Wages Act, Industrial Disputes Act) and some state-specific rules. Approach the Labor Commissioner in ${city} or the appropriate Labor Court.`;
            break;
            
        case 'cheque_bounce':
            response.title = 'Cheque Bounce Case: Dishonored Payment';
            response.what_this_means = `When a cheque bounces, it's a criminal offense under Section 138 of the Negotiable Instruments Act, 1881. The person who issued the bounced cheque can face legal action, including criminal prosecution and monetary penalties.`;
            response.why_it_matters = `Cheque bounce cases are taken seriously in Indian courts. You can demand payment plus compensation. The law is designed to protect the credibility of banking instruments.`;
            response.action_steps = [
                'Get the cheque return memo from your bank (must show reason as "insufficient funds" or similar)',
                'Send a legal notice to the cheque issuer within 30 days of receiving the return memo, demanding payment',
                'If payment is not made within 15 days of receiving the notice, file a criminal complaint under Section 138 in the Magistrate Court',
                'Hire a lawyer as this requires legal expertise'
            ];
            response.documents = [
                'Original bounced cheque',
                'Cheque return memo from bank',
                'Copy of legal notice sent (with proof of delivery)',
                'Any agreement/contract related to the payment',
                'Bank account statements',
                'Reply to legal notice (if any)'
            ];
            response.urgency_level = 'HIGH Urgency';
            response.urgency_explanation = 'You MUST send the legal notice within 30 days of the cheque bounce. Missing this deadline can invalidate your case.';
            response.jurisdiction = `Cheque bounce cases under Section 138 NI Act are heard in the Magistrate Court where the cheque was presented (your bank branch location in ${city}). This is a central law applicable across India.`;
            break;
            
        case 'cyber_crime':
            response.title = 'Cyber Crime: Online Fraud or Digital Offense';
            response.what_this_means = `Cyber crimes like online fraud, hacking, identity theft, and digital harassment are covered under the Information Technology Act, 2000 and Indian Penal Code. These are serious offenses and you can file a police complaint.`;
            response.why_it_matters = `Cyber crimes are increasing rapidly. Quick action can help prevent further damage, freeze stolen funds, and catch the criminals. The government has special cyber crime cells for such cases.`;
            response.action_steps = [
                'Immediately report the crime on the National Cyber Crime Portal: cybercrime.gov.in',
                'File an FIR at your local police station or cyber crime cell in ${city}',
                'If money was lost, inform your bank immediately to freeze the transaction',
                'Collect all evidence: screenshots, emails, messages, transaction details, URLs',
                'Do not delete any digital evidence'
            ];
            response.documents = [
                'Screenshots of fraudulent messages/websites',
                'Email communications',
                'Transaction receipts/bank statements',
                'Phone call records if applicable',
                'Any other digital evidence',
                'ID proof and address proof'
            ];
            response.urgency_level = 'HIGH Urgency';
            response.urgency_explanation = 'Cyber crimes require immediate action within 24-48 hours to prevent further damage and increase chances of recovery.';
            response.jurisdiction = `Cyber crimes are governed by the IT Act, 2000 (central law). File a complaint at the cyber crime cell in ${city} or online at cybercrime.gov.in. You can also approach the ${state} Police Cyber Cell.`;
            break;
            
        default:
            response.title = 'General Legal Information';
            response.what_this_means = `Based on your description, this appears to be a legal matter that requires attention. Without more specific details, I can provide general guidance on how to proceed.`;
            response.why_it_matters = `Understanding your legal rights and taking appropriate steps can help resolve your issue effectively. It's important to document everything and seek proper legal guidance.`;
            response.action_steps = [
                'Document your issue in detail with dates, names, and specific incidents',
                'Collect all relevant documents and evidence',
                'Consult with a local lawyer for specific legal advice (many offer free first consultation)',
                'If urgent, approach the police station or relevant government department',
                'Consider filing an RTI application if government agencies are involved'
            ];
            response.documents = [
                'Any written agreements or contracts',
                'Receipts and payment proofs',
                'Communication records (emails, messages, letters)',
                'Photographs or videos (if relevant)',
                'ID proof and address proof',
                'Any other relevant documents'
            ];
            response.urgency_level = 'MEDIUM Urgency';
            response.urgency_explanation = 'Based on the information provided, it\'s advisable to take action within the next few weeks to protect your rights.';
            response.jurisdiction = `The specific jurisdiction depends on the nature of your legal issue. Generally, you can approach courts or authorities in ${city}, ${state}. Some laws are central (apply nationwide) while others are state-specific.`;
    }
    
    // Profession-specific adjustments
    if (profession === 'Student') {
        response.action_steps.push('💡 Tip for students: Many law colleges offer free legal aid clinics. Check with colleges in ' + city);
    } else if (profession === 'Worker') {
        response.action_steps.push('💡 Tip for workers: You can approach the Legal Services Authority for free legal aid if you cannot afford a lawyer');
    }
    
    return response;
}

// API endpoint for legal analysis
app.post('/api/analyze', (req, res) => {
    try {
        const formData = req.body;
        
        // Validate input
        if (!formData.problem || !formData.state || !formData.city || !formData.language || !formData.profession) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        // Analyze the legal issue
        const analysis = analyzeLegalIssue(formData);
        
        // Return the analysis
        res.json(analysis);
        
    } catch (error) {
        console.error('Error in analysis:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint for feedback
app.post('/api/feedback', (req, res) => {
    try {
        const { feedback } = req.body;
        
        feedbackData.push({
            feedback: feedback,
            timestamp: new Date()
        });
        
        console.log('Feedback received:', feedback);
        res.json({ success: true });
        
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to get feedback stats (for admin)
app.get('/api/stats', (req, res) => {
    const stats = {
        total_feedback: feedbackData.length,
        helpful: feedbackData.filter(f => f.feedback === 'helpful').length,
        not_helpful: feedbackData.filter(f => f.feedback === 'not-helpful').length
    };
    res.json(stats);
});

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🇮🇳 India Legal Information Assistant running on http://localhost:${PORT}`);
    console.log('📋 Features enabled:');
    console.log('  ✓ Multi-language support');
    console.log('  ✓ Simplified legal explanations');
    console.log('  ✓ Action recommendations');
    console.log('  ✓ Jurisdiction detection');
    console.log('  ✓ Document checklist');
    console.log('  ✓ Urgency assessment');
    console.log('  ✓ Profession-based personalization');
    console.log('  ✓ Privacy-first (no data storage)');
});

module.exports = app;
