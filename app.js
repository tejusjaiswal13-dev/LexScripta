// ===== India Legal Assistant - Frontend Application =====

// API Configuration
const API_BASE_URL = window.location.origin;

// State Management
let currentAnalysis = null;

// Category Icons
const categoryIcons = {
    'employment': '💼',
    'property': '🏠',
    'consumer': '🛒',
    'family': '👨‍👩‍👧‍👦',
    'traffic': '🚗',
    'criminal': '⚖️'
};

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    loadCategories();
});

// Initialize Application
function initializeApp() {
    console.log('🚀 India Legal Assistant initialized');
    
    // Check if privacy banner was dismissed
    const bannerDismissed = localStorage.getItem('privacyBannerDismissed');
    if (bannerDismissed) {
        closeBanner();
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Form submission
    const legalForm = document.getElementById('legalForm');
    legalForm.addEventListener('submit', handleFormSubmit);

    // Character counter
    const descriptionField = document.getElementById('description');
    descriptionField.addEventListener('input', updateCharCounter);

    // Feedback form
    const feedbackForm = document.getElementById('feedbackForm');
    feedbackForm.addEventListener('submit', handleFeedbackSubmit);
}

// ===== Category Loading =====
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/categories`);
        const data = await response.json();

        if (data.success) {
            renderCategories(data.categories);
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

function renderCategories(categories) {
    const grid = document.getElementById('categoryGrid');
    grid.innerHTML = '';

    categories.forEach(category => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <div class="category-icon">${categoryIcons[category.id] || '📋'}</div>
            <div class="category-name">${category.name}</div>
            <div class="category-name-local">${category.nameHindi}</div>
        `;
        card.addEventListener('click', () => fillCategoryExample(category.id));
        grid.appendChild(card);
    });
}

// Fill example text for category
function fillCategoryExample(categoryId) {
    const examples = {
        'employment': 'My employer terminated me without notice and has not paid my last two months salary. I have been working there for 3 years. What are my legal options?',
        'property': 'My landlord is threatening to evict me from my rented apartment without proper notice. I have been a tenant for 5 years and always paid rent on time.',
        'consumer': 'I purchased a refrigerator online 6 months ago and it stopped working. The company is not responding to my complaints and refusing refund.',
        'family': 'I am facing domestic violence from my spouse. I need to know my legal rights and what steps I can take to protect myself.',
        'traffic': 'I received a traffic challan but I was not driving at that location and time. How can I dispute this fine?',
        'criminal': 'Someone has filed a false complaint against me at the police station. What should I do to protect myself?'
    };

    const descField = document.getElementById('description');
    descField.value = examples[categoryId] || '';
    descField.focus();
    updateCharCounter();
    
    // Smooth scroll to form
    descField.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ===== Form Handling =====
function updateCharCounter() {
    const descField = document.getElementById('description');
    const counter = document.getElementById('charCount');
    counter.textContent = descField.value.length;
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    // Get form data
    const formData = {
        description: document.getElementById('description').value.trim(),
        location: document.getElementById('location').value.trim(),
        profession: document.getElementById('profession').value,
        language: document.getElementById('language').value
    };

    // Validation
    if (formData.description.length < 10) {
        alert('Please provide a more detailed description (at least 10 characters)');
        return;
    }

    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';

    try {
        const response = await fetch(`${API_BASE_URL}/api/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok && data.success) {
            currentAnalysis = data;
            displayResults(data);
            scrollToResults();
        } else {
            alert(data.error || 'An error occurred. Please try again.');
        }
    } catch (error) {
        console.error('Error analyzing issue:', error);
        alert('Network error. Please check your connection and try again.');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

// ===== Results Display =====
function displayResults(data) {
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.style.display = 'block';

    // Display urgency meter
    displayUrgencyMeter(data.analysis.urgency);

    // Display issue summary
    document.getElementById('issueCategory').textContent = data.analysis.category;
    document.getElementById('issueDescription').textContent = data.analysis.description;
    document.getElementById('issueTimeline').innerHTML = `
        <strong>⏰ Timeline:</strong> ${data.analysis.timeline}
    `;

    // Display jurisdiction
    displayJurisdiction(data.jurisdiction);

    // Display applicable laws
    displayLaws(data.applicableLaws);

    // Display recommended steps
    displaySteps(data.recommendedSteps);

    // Display required documents
    displayDocuments(data.requiredDocuments);

    // Display profession tip
    if (data.professionTip) {
        const professionCard = document.getElementById('professionCard');
        const professionTip = document.getElementById('professionTip');
        professionCard.style.display = 'block';
        professionTip.textContent = data.professionTip;
    } else {
        document.getElementById('professionCard').style.display = 'none';
    }

    // Reset feedback form
    document.getElementById('feedbackForm').reset();
    document.getElementById('feedbackSuccess').style.display = 'none';
}

function displayUrgencyMeter(urgency) {
    const indicator = document.getElementById('urgencyIndicator');
    const urgencyText = document.getElementById('urgencyText');

    indicator.className = 'urgency-indicator ' + urgency.toLowerCase();
    indicator.textContent = urgency;

    const descriptions = {
        'LOW': 'You have time to prepare. Consult a lawyer within the next few weeks.',
        'MEDIUM': 'Take action soon. File required complaints or applications within the specified timeline.',
        'HIGH': 'Urgent action needed! File complaint or seek legal help immediately to protect your rights.'
    };

    urgencyText.textContent = descriptions[urgency] || '';
}

function displayJurisdiction(jurisdiction) {
    const jurisdictionCard = document.getElementById('jurisdictionCard');
    const jurisdictionContent = document.getElementById('jurisdictionContent');

    if (jurisdiction.detected) {
        let html = '';
        
        if (jurisdiction.city) {
            html += `<p><strong>📍 City:</strong> ${jurisdiction.city}</p>`;
        }
        
        if (jurisdiction.state) {
            html += `<p><strong>🗺️ State:</strong> ${jurisdiction.state}</p>`;
        }
        
        if (jurisdiction.highCourt) {
            html += `<p><strong>⚖️ High Court:</strong> ${jurisdiction.highCourt}</p>`;
        }
        
        if (jurisdiction.consumerForum) {
            html += `<p><strong>🛡️ Consumer Forum:</strong> ${jurisdiction.consumerForum}</p>`;
        }

        jurisdictionContent.innerHTML = html;
        jurisdictionCard.style.display = 'block';
    } else {
        jurisdictionCard.style.display = 'none';
    }
}

function displayLaws(laws) {
    const lawList = document.getElementById('lawList');
    lawList.innerHTML = '';

    laws.forEach(law => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>📜</strong> ${law}`;
        lawList.appendChild(li);
    });
}

function displaySteps(steps) {
    const stepList = document.getElementById('stepList');
    stepList.innerHTML = '';

    steps.forEach((step, index) => {
        const li = document.createElement('li');
        li.textContent = step;
        stepList.appendChild(li);
    });
}

function displayDocuments(documents) {
    const documentList = document.getElementById('documentList');
    documentList.innerHTML = '';

    documents.forEach(doc => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>📄</strong> ${doc}`;
        documentList.appendChild(li);
    });
}

function scrollToResults() {
    const resultsSection = document.getElementById('resultsSection');
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// ===== Feedback Handling =====
async function handleFeedbackSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const feedbackData = {
        rating: parseInt(formData.get('rating')),
        comment: formData.get('comment'),
        wasHelpful: formData.get('wasHelpful') === 'on'
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(feedbackData)
        });

        const data = await response.json();

        if (response.ok && data.success) {
            document.getElementById('feedbackForm').style.display = 'none';
            document.getElementById('feedbackSuccess').style.display = 'block';
        } else {
            alert(data.error || 'Failed to submit feedback');
        }
    } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('Network error. Please try again.');
    }
}

// ===== Utility Functions =====
function resetForm() {
    document.getElementById('legalForm').reset();
    document.getElementById('resultsSection').style.display = 'none';
    updateCharCounter();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeBanner() {
    const banner = document.getElementById('privacyBanner');
    banner.style.display = 'none';
    localStorage.setItem('privacyBannerDismissed', 'true');
}

// ===== Error Handling =====
window.addEventListener('error', (event) => {
    console.error('Application error:', event.error);
});

// ===== Service Worker (Optional - for offline support) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        analyzeLegalIssue: handleFormSubmit,
        displayResults,
        resetForm
    };
}