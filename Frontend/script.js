// ===== CONFIGURATION =====
const BACKEND_URL = "http://127.0.0.1:5000";

const API_BASE = `${BACKEND_URL}/api/v1/legal`;

// ===== DOM ELEMENTS =====
const elements = {
  fileInput: document.getElementById("fileInput"),
  uploadBtn: document.getElementById("uploadBtn"),
  dropZone: document.getElementById("dropZone"),
  filePreview: document.getElementById("filePreview"),

  questionInput: document.getElementById("questionInput"),
  askBtn: document.getElementById("askBtn"),
  charCount: document.getElementById("charCount"),

  resultsSection: document.getElementById("resultsSection"),
  output: document.getElementById("output"),
  clearBtn: document.getElementById("clearBtn"),
  copyBtn: document.getElementById("copyBtn"),

  steps: document.querySelectorAll(".step"),
  exampleChips: document.querySelectorAll(".example-chip")
};

// ===== STATE =====
let state = {
  uploadedFile: null,
  extractedText: "",
  currentStep: 1,
  isProcessing: false
};

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  initializeEventListeners();
  checkBackendHealth();
});

function initializeEventListeners() {
  elements.fileInput.addEventListener("change", handleFileSelection);
  elements.uploadBtn.addEventListener("click", handleFileUpload);

  elements.dropZone.addEventListener("dragover", handleDragOver);
  elements.dropZone.addEventListener("dragleave", handleDragLeave);
  elements.dropZone.addEventListener("drop", handleDrop);

  elements.questionInput.addEventListener("input", handleQuestionInput);
  elements.askBtn.addEventListener("click", handleAskQuestion);

  elements.exampleChips.forEach(chip => {
    chip.addEventListener("click", () => {
      elements.questionInput.value = chip.dataset.question;
      handleQuestionInput();
      elements.questionInput.focus();
    });
  });

  elements.clearBtn?.addEventListener("click", resetApp);
  elements.copyBtn?.addEventListener("click", copyToClipboard);

  elements.questionInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && e.ctrlKey) handleAskQuestion();
  });
}

// ===== BACKEND HEALTH CHECK (FIXED) =====
async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE}/examples`);
    if (!response.ok) throw new Error("API reachable but unhealthy");
  } catch (err) {
    console.error("Backend health check failed:", err);
    showNotification(
      "Unable to connect to backend. Please ensure the server is running.",
      "error"
    );
  }
}

// ===== FILE HANDLING =====
function handleFileSelection(e) {
  const file = e.target.files[0];
  if (file) validateAndPreviewFile(file);
}

function handleDragOver(e) {
  e.preventDefault();
  elements.dropZone.classList.add("drag-over");
}

function handleDragLeave(e) {
  e.preventDefault();
  elements.dropZone.classList.remove("drag-over");
}

function handleDrop(e) {
  e.preventDefault();
  elements.dropZone.classList.remove("drag-over");

  const file = e.dataTransfer.files[0];
  if (file) {
    validateAndPreviewFile(file);
    elements.fileInput.files = e.dataTransfer.files;
  }
}

function validateAndPreviewFile(file) {
  const validTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "image/jpeg",
    "image/jpg",
    "image/png"
  ];

  if (!validTypes.includes(file.type)) {
    showNotification("Invalid file type.", "error");
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    showNotification("File too large (max 10MB).", "error");
    return;
  }

  state.uploadedFile = file;
  showFilePreview(file);
  elements.uploadBtn.disabled = false;
}

function showFilePreview(file) {
  elements.filePreview.innerHTML = `
    <div style="display:flex;align-items:center;gap:1rem">
      <div style="font-size:2rem">${getFileIcon(file.type)}</div>
      <div style="flex:1">
        <strong>${file.name}</strong>
        <div>${(file.size / 1024).toFixed(2)} KB</div>
      </div>
      <button onclick="removeFile()">Remove</button>
    </div>
  `;
  elements.filePreview.classList.remove("hidden");
}

function getFileIcon(type) {
  if (type.includes("pdf")) return "📄";
  if (type.includes("word")) return "📝";
  if (type.includes("image")) return "🖼️";
  return "📎";
}

function removeFile() {
  state.uploadedFile = null;
  state.extractedText = "";
  elements.fileInput.value = "";
  elements.filePreview.classList.add("hidden");
  elements.uploadBtn.disabled = true;
  updateStep(1);
}

window.removeFile = removeFile;

// ===== UPLOAD =====
async function handleFileUpload() {
  if (!state.uploadedFile || state.isProcessing) return;

  state.isProcessing = true;
  showButtonLoading(elements.uploadBtn, true);

  try {
    const formData = new FormData();
    formData.append("file", state.uploadedFile);

    const response = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);

    state.extractedText = data.extractedText || "";
    updateStep(2);
    showNotification("Document processed successfully!", "success");
  } catch (err) {
    console.error(err);
    showNotification("Document upload failed.", "error");
  } finally {
    state.isProcessing = false;
    showButtonLoading(elements.uploadBtn, false);
  }
}

// ===== QUESTIONS =====
function handleQuestionInput() {
  const len = elements.questionInput.value.length;
  elements.charCount.textContent = len;
  elements.askBtn.disabled = len < 10 || state.isProcessing;
}

async function handleAskQuestion() {
  if (state.isProcessing) return;

  state.isProcessing = true;
  showButtonLoading(elements.askBtn, true);
  updateStep(3);

  try {
    const response = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: elements.questionInput.value.trim(),
        documentText: state.extractedText || undefined
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);

    displayResults(data);
  } catch (err) {
    console.error(err);
    showNotification("Failed to get answer.", "error");
  } finally {
    state.isProcessing = false;
    showButtonLoading(elements.askBtn, false);
  }
}

// ===== UI HELPERS =====
function updateStep(step) {
  elements.steps.forEach((el, i) => {
    el.classList.toggle("active", i + 1 === step);
    el.classList.toggle("completed", i + 1 < step);
  });
}

function showButtonLoading(btn, loading) {
  btn.disabled = loading;
}

function showNotification(message, type = "info") {
  alert(message); // keep simple & reliable
}

function displayResults(data) {
  elements.output.innerHTML = `<p>${data.answer}</p>`;
  elements.resultsSection.classList.remove("hidden");
}

function resetApp() {
  location.reload();
}

async function copyToClipboard() {
  await navigator.clipboard.writeText(elements.output.innerText);
}
