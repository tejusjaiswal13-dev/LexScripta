// API Configuration
const API_BASE_URL = window.location.origin;
const API_ENDPOINT = `${API_BASE_URL}/api/v1/legal/analyze`;
const EXAMPLES_ENDPOINT = `${API_BASE_URL}/api/v1/legal/examples`;

// DOM Elements
const legalForm = document.getElementById('legalForm');
const questionInput = document.getElementById('question');
const fileInput = document.getElementById('fileInput');
const fileName = document.getElementById('fileName');
const charCount = document.getElementById('charCount');
const submitBtn = document.getElementById('submitBtn');

const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const errorMessage = document.getElementById('errorMessage');
const resultsSection = document.getElementById('resultsSection');

const resultQuestion = document.getElementById('resultQuestion');
const resultAnswer = document.getElementById('resultAnswer');
const relatedLawsSection = document.getElementById('relatedLawsSection');
const relatedLaws = document.getElementById('relatedLaws');
const resultDisclaimer = document.getElementById('resultDisclaimer');
const aiMode = document.getElementById('aiMode');

const examplesList = document.getElementById('examplesList');

// State
let currentResponse = null;

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
  loadExamples();
});

// ===== Event Listeners =====
function initializeEventListeners() {
  // Form submission
  legalForm.addEventListener('submit', handleFormSubmit);

  // Character counter
  questionInput.addEventListener('input', updateCharCounter);

  // File input handler
  fileInput.addEventListener('change', handleFileSelect);

  // Drag and drop for file upload
  const fileLabel = document.querySelector('.file-label');
  
  fileLabel.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileLabel.style.borderColor = 'var(--primary)';
    fileLabel.style.background = 'var(--bg-secondary)';
  });

  fileLabel.addEventListener('dragleave', () => {
    fileLabel.style.borderColor = '';
    fileLabel.style.background = '';
  });

  fileLabel.addEventListener('drop', (e) => {
    e.preventDefault();
    fileLabel.style.borderColor = '';
    fileLabel.style.background = '';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      fileInput.files = files;
      handleFileSelect();
    }
  });
}

// ===== Form Handlers =====
function updateCharCounter() {
  const length = questionInput.value.length;
  charCount.textContent = length;
  
  if (length > 2000) {
    charCount.style.color = 'var(--error)';
  } else if (length > 1800) {
    charCount.style.color = 'var(--warning)';
  } else {
    charCount.style.color = '';
  }
}

function handleFileSelect() {
  const file = fileInput.files[0];
  
  if (file) {
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showError('File size exceeds 10MB limit. Please choose a smaller file.');
      fileInput.value = '';
      return;
    }

    // Display file name
    fileName.textContent = `📎 ${file.name} (${formatFileSize(file.size)})`;
    fileName.classList.add('show');
  } else {
    fileName.textContent = '';
    fileName.classList.remove('show');
  }
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const question = questionInput.value.trim();
  
  if (!question) {
    showError('Please enter a legal question.');
    return;
  }

  if (question.length > 2000) {
    showError('Question is too long. Please limit to 2000 characters.');
    return;
  }

  // Prepare form data
  const formData = new FormData();
  formData.append('question', question);
  
  if (fileInput.files.length > 0) {
    formData.append('file', fileInput.files[0]);
  }

  // Show loading state
  showLoading();

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to analyze question');
    }

    if (data.success) {
      displayResults(data.data);
    } else {
      throw new Error(data.error || 'Analysis failed');
    }

  } catch (error) {
    console.error('Error:', error);
    showError(error.message || 'Something went wrong. Please try again.');
  }
}

// ===== Display Functions =====
function showLoading() {
  legalForm.parentElement.classList.add('hidden');
  errorState.classList.add('hidden');
  resultsSection.classList.add('hidden');
  loadingState.classList.remove('hidden');
  
  // Scroll to loading
  loadingState.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showError(message) {
  loadingState.classList.add('hidden');
  resultsSection.classList.add('hidden');
  errorMessage.textContent = message;
  errorState.classList.remove('hidden');
  
  // Scroll to error
  errorState.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function hideError() {
  errorState.classList.add('hidden');
  legalForm.parentElement.classList.remove('hidden');
}

function displayResults(data) {
  currentResponse = data;

  // Hide loading
  loadingState.classList.add('hidden');

  // Display question
  resultQuestion.textContent = data.question;

  // Display answer with formatting
  resultAnswer.innerHTML = formatAnswer(data.answer);

  // Display related laws
  if (data.relatedLaws && data.relatedLaws.length > 0) {
    relatedLaws.innerHTML = data.relatedLaws
      .map(law => `<span class="law-tag">${escapeHtml(law)}</span>`)
      .join('');
    relatedLawsSection.classList.remove('hidden');
  } else {
    relatedLawsSection.classList.add('hidden');
  }

  // Display disclaimer
  resultDisclaimer.textContent = data.disclaimer;

  // Display AI mode
  aiMode.textContent = data.aiMode || 'AI Assistant';

  // Show results
  resultsSection.classList.remove('hidden');

  // Scroll to results
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function formatAnswer(answer) {
  // Convert markdown-style formatting to HTML
  let formatted = escapeHtml(answer);
  
  // Bold text: **text** or __text__
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/__(.*?)__/g, '<strong>$1</strong>');
  
  // Line breaks
  formatted = formatted.replace(/\n\n/g, '</p><p>');
  formatted = formatted.replace(/\n/g, '<br>');
  
  // Wrap in paragraphs
  formatted = `<p>${formatted}</p>`;
  
  return formatted;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ===== Action Functions =====
function resetForm() {
  // Reset form
  legalForm.reset();
  fileName.textContent = '';
  fileName.classList.remove('show');
  charCount.textContent = '0';
  
  // Hide results and show form
  resultsSection.classList.add('hidden');
  legalForm.parentElement.classList.remove('hidden');
  
  // Scroll to form
  legalForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function copyResponse() {
  if (!currentResponse) return;

  const textToCopy = `Question: ${currentResponse.question}

Answer:
${currentResponse.answer}

${currentResponse.relatedLaws && currentResponse.relatedLaws.length > 0 
  ? `Relevant Laws: ${currentResponse.relatedLaws.join(', ')}\n\n` 
  : ''}${currentResponse.disclaimer}`;

  navigator.clipboard.writeText(textToCopy)
    .then(() => {
      // Visual feedback
      const btn = event.target.closest('.btn-outline');
      const originalText = btn.innerHTML;
      btn.innerHTML = '✓ Copied!';
      btn.style.background = 'var(--success)';
      btn.style.borderColor = 'var(--success)';
      btn.style.color = 'white';
      
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
      }, 2000);
    })
    .catch(err => {
      console.error('Copy failed:', err);
      alert('Failed to copy. Please select and copy manually.');
    });
}

// ===== Examples =====
async function loadExamples() {
  try {
    const response = await fetch(EXAMPLES_ENDPOINT);
    const data = await response.json();

    if (data.success && data.data) {
      displayExamples(data.data);
    }
  } catch (error) {
    console.error('Failed to load examples:', error);
    // Use fallback examples
    displayExamples([
      {
        category: "Property Law",
        question: "What are the legal requirements for property registration in India?"
      },
      {
        category: "Employment Law",
        question: "What are my rights if I'm wrongfully terminated from my job?"
      },
      {
        category: "Consumer Rights",
        question: "How can I file a consumer complaint for a defective product?"
      }
    ]);
  }
}

function displayExamples(examples) {
  examplesList.innerHTML = examples.map(example => `
    <div class="example-card" onclick="useExample('${escapeHtml(example.question)}')">
      <div class="example-category">${escapeHtml(example.category)}</div>
      <div class="example-question">${escapeHtml(example.question)}</div>
    </div>
  `).join('');
}

function useExample(question) {
  questionInput.value = question;
  updateCharCounter();
  
  // Scroll to form
  legalForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
  // Focus on question input
  setTimeout(() => {
    questionInput.focus();
  }, 500);
}

// ===== Utility Functions =====
function showNotification(message, type = 'info') {
  // Simple notification (can be enhanced with a toast library)
  console.log(`[${type.toUpperCase()}] ${message}`);
}

// Make functions available globally
window.resetForm = resetForm;
window.copyResponse = copyResponse;
window.useExample = useExample;
window.hideError = hideError;