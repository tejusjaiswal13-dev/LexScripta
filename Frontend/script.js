// ===== CONFIGURATION =====
const BACKEND_URL = "http://localhost:5000";
const API_BASE = `${BACKEND_URL}/api/v1/legal`;

// ===== DOM ELEMENTS =====
const elements = {
  // File Upload
  fileInput: document.getElementById("fileInput"),
  uploadBtn: document.getElementById("uploadBtn"),
  dropZone: document.getElementById("dropZone"),
  filePreview: document.getElementById("filePreview"),
  
  // Question
  questionInput: document.getElementById("questionInput"),
  askBtn: document.getElementById("askBtn"),
  charCount: document.getElementById("charCount"),
  
  // Results
  resultsSection: document.getElementById("resultsSection"),
  output: document.getElementById("output"),
  clearBtn: document.getElementById("clearBtn"),
  copyBtn: document.getElementById("copyBtn"),
  
  // Steps
  steps: document.querySelectorAll(".step"),
  
  // Example chips
  exampleChips: document.querySelectorAll(".example-chip")
};

// ===== STATE =====
let state = {
  uploadedFile: null,
  extractedText: "",
  currentStep: 1,
  isProcessing: false
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
  checkBackendHealth();
});

function initializeEventListeners() {
  // File upload events
  elements.fileInput.addEventListener('change', handleFileSelection);
  elements.uploadBtn.addEventListener('click', handleFileUpload);
  
  // Drag and drop
  elements.dropZone.addEventListener('dragover', handleDragOver);
  elements.dropZone.addEventListener('dragleave', handleDragLeave);
  elements.dropZone.addEventListener('drop', handleDrop);
  
  // Question events
  elements.questionInput.addEventListener('input', handleQuestionInput);
  elements.askBtn.addEventListener('click', handleAskQuestion);
  
  // Example chips
  elements.exampleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      elements.questionInput.value = chip.dataset.question;
      handleQuestionInput();
      elements.questionInput.focus();
    });
  });
  
  // Clear button
  elements.clearBtn?.addEventListener('click', resetApp);
  
  // Copy button
  elements.copyBtn?.addEventListener('click', copyToClipboard);
  
  // Enter key to submit
  elements.questionInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAskQuestion();
    }
  });
}

// ===== BACKEND HEALTH CHECK =====
async function checkBackendHealth() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      showNotification('Backend connection issue', 'warning');
    }
  } catch (error) {
    console.error('Backend health check failed:', error);
    showNotification('Unable to connect to backend. Please ensure server is running.', 'error');
  }
}

// ===== FILE HANDLING =====
function handleFileSelection(e) {
  const file = e.target.files[0];
  if (file) {
    validateAndPreviewFile(file);
  }
}

function handleDragOver(e) {
  e.preventDefault();
  elements.dropZone.classList.add('drag-over');
}

function handleDragLeave(e) {
  e.preventDefault();
  elements.dropZone.classList.remove('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  elements.dropZone.classList.remove('drag-over');
  
  const file = e.dataTransfer.files[0];
  if (file) {
    validateAndPreviewFile(file);
    elements.fileInput.files = e.dataTransfer.files;
  }
}

function validateAndPreviewFile(file) {
  // Validate file type
  const validTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];
  
  if (!validTypes.includes(file.type)) {
    showNotification('Invalid file type. Please upload PDF, DOCX, or image files.', 'error');
    return;
  }
  
  // Validate file size (10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    showNotification('File too large. Maximum size is 10MB.', 'error');
    return;
  }
  
  // Update state
  state.uploadedFile = file;
  
  // Show preview
  showFilePreview(file);
  
  // Enable upload button
  elements.uploadBtn.disabled = false;
}

function showFilePreview(file) {
  const fileIcon = getFileIcon(file.type);
  const fileSize = (file.size / 1024).toFixed(2);
  
  elements.filePreview.innerHTML = `
    <div style="display: flex; align-items: center; gap: 1rem; width: 100%;">
      <div style="font-size: 2rem;">${fileIcon}</div>
      <div style="flex: 1;">
        <div style="font-weight: 600; color: var(--color-text);">${file.name}</div>
        <div style="font-size: 0.875rem; color: var(--color-text-secondary);">${fileSize} KB</div>
      </div>
      <button onclick="removeFile()" style="background: var(--color-error); color: white; border: none; padding: 0.5rem 1rem; border-radius: var(--radius-md); cursor: pointer;">
        Remove
      </button>
    </div>
  `;
  elements.filePreview.classList.remove('hidden');
}

function getFileIcon(type) {
  if (type.includes('pdf')) return '📄';
  if (type.includes('word')) return '📝';
  if (type.includes('image')) return '🖼️';
  return '📎';
}

function removeFile() {
  state.uploadedFile = null;
  state.extractedText = "";
  elements.fileInput.value = '';
  elements.filePreview.classList.add('hidden');
  elements.uploadBtn.disabled = true;
  updateStep(1);
}

async function handleFileUpload() {
  if (!state.uploadedFile || state.isProcessing) return;
  
  state.isProcessing = true;
  showButtonLoading(elements.uploadBtn, true);
  
  try {
    const formData = new FormData();
    formData.append('file', state.uploadedFile);
    
    const response = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to process document');
    }
    
    // Store extracted text
    state.extractedText = data.extractedText || data.text || "";
    
    showNotification('Document processed successfully! Now ask a question about it.', 'success');
    updateStep(2);
    elements.questionInput.focus();
    
    // If AI response is already available
    if (data.answer) {
      displayResults(data);
    }
    
  } catch (error) {
    console.error('Upload error:', error);
    showNotification(error.message || 'Failed to upload document. Please try again.', 'error');
  } finally {
    state.isProcessing = false;
    showButtonLoading(elements.uploadBtn, false);
  }
}

// ===== QUESTION HANDLING =====
function handleQuestionInput() {
  const text = elements.questionInput.value;
  elements.charCount.textContent = text.length;
  
  // Enable/disable ask button
  elements.askBtn.disabled = text.trim().length === 0 || state.isProcessing;
}

async function handleAskQuestion() {
  const question = elements.questionInput.value.trim();
  
  if (!question || state.isProcessing) return;
  
  // Validation
  if (question.length < 10) {
    showNotification('Please ask a more detailed question (at least 10 characters).', 'warning');
    return;
  }
  
  state.isProcessing = true;
  showButtonLoading(elements.askBtn, true);
  updateStep(3);
  
  try {
    const requestBody = {
      question: question
    };
    
    // Include document text if available
    if (state.extractedText) {
      requestBody.documentText = state.extractedText;
    }
    
    const response = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get AI response');
    }
    
    displayResults(data);
    
  } catch (error) {
    console.error('Question error:', error);
    showNotification(error.message || 'Failed to get answer. Please try again.', 'error');
  } finally {
    state.isProcessing = false;
    showButtonLoading(elements.askBtn, false);
  }
}

// ===== RESULTS DISPLAY =====
function displayResults(data) {
  const { answer, relatedLaws, disclaimer, mode } = data;
  
  // Format the answer
  let formattedAnswer = formatAnswer(answer);
  
  // Build output HTML
  let html = `
    <div class="ai-response">
      ${formattedAnswer}
    </div>
  `;
  
  // Add related laws if available
  if (relatedLaws && relatedLaws.length > 0) {
    html += `
      <div class="related-laws">
        <h3>📚 Related Indian Laws</h3>
        <ul>
          ${relatedLaws.map(law => `<li>${law}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  
  // Add mode indicator
  if (mode) {
    html += `
      <div style="margin-top: 1rem; padding: 0.5rem; background: var(--color-bg-secondary); border-radius: var(--radius-sm); font-size: 0.875rem; color: var(--color-text-secondary); text-align: center;">
        Powered by: ${mode}
      </div>
    `;
  }
  
  elements.output.innerHTML = html;
  elements.resultsSection.classList.remove('hidden');
  
  // Scroll to results
  setTimeout(() => {
    elements.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function formatAnswer(answer) {
  // Convert markdown-style formatting to HTML
  let formatted = answer
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Bullet points
    .replace(/^[•\-]\s+(.+)$/gm, '<li>$1</li>')
    // Headers (if markdown style)
    .replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^#{2}\s+(.+)$/gm, '<h3>$1</h3>')
    // Paragraphs
    .split('\n\n')
    .map(para => {
      if (para.includes('<li>')) {
        return '<ul>' + para + '</ul>';
      } else if (para.includes('<h3>')) {
        return para;
      } else if (para.trim()) {
        return '<p>' + para + '</p>';
      }
      return '';
    })
    .join('');
  
  return formatted;
}

// ===== UTILITY FUNCTIONS =====
function updateStep(stepNumber) {
  state.currentStep = stepNumber;
  
  elements.steps.forEach((step, index) => {
    const num = index + 1;
    step.classList.remove('active', 'completed');
    
    if (num < stepNumber) {
      step.classList.add('completed');
    } else if (num === stepNumber) {
      step.classList.add('active');
    }
  });
}

function showButtonLoading(button, isLoading) {
  const btnText = button.querySelector('.btn-text');
  const btnLoader = button.querySelector('.btn-loader');
  
  if (isLoading) {
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    button.disabled = true;
  } else {
    btnText.classList.remove('hidden');
    btnLoader.classList.add('hidden');
    button.disabled = false;
  }
}

function showNotification(message, type = 'info') {
  // Create toast notification
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : type === 'success' ? '#10b981' : '#0891b2'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    z-index: 1000;
    max-width: 400px;
    animation: slideIn 0.3s ease-out;
  `;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

// Add animations to document
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
`;
document.head.appendChild(style);

function resetApp() {
  if (confirm('Are you sure you want to start over? This will clear all your data.')) {
    state = {
      uploadedFile: null,
      extractedText: "",
      currentStep: 1,
      isProcessing: false
    };
    
    elements.fileInput.value = '';
    elements.questionInput.value = '';
    elements.filePreview.classList.add('hidden');
    elements.resultsSection.classList.add('hidden');
    elements.uploadBtn.disabled = true;
    elements.charCount.textContent = '0';
    
    updateStep(1);
    showNotification('App reset successfully', 'success');
  }
}

async function copyToClipboard() {
  const text = elements.output.innerText;
  
  try {
    await navigator.clipboard.writeText(text);
    showNotification('Copied to clipboard!', 'success');
  } catch (error) {
    console.error('Copy failed:', error);
    showNotification('Failed to copy. Please select and copy manually.', 'error');
  }
}

// Make removeFile available globally
window.removeFile = removeFile;