const BACKEND_URL = "http://localhost:5000";

const outputDiv = document.getElementById("output");
const healthBtn = document.getElementById("healthBtn");
const categoriesBtn = document.getElementById("categoriesBtn");
const uploadBtn = document.getElementById("uploadBtn");
const askBtn = document.getElementById("askBtn");
const fileInput = document.getElementById("fileInput");
const questionInput = document.getElementById("questionInput");

let extractedText = "";

function showOutput(text) {
  outputDiv.innerHTML = `<pre>${text}</pre>`;
}

/* Health */
healthBtn.addEventListener("click", async () => {
  const res = await fetch(`${BACKEND_URL}/api/health`);
  const data = await res.json();
  showOutput(JSON.stringify(data, null, 2));
});

/* Categories */
categoriesBtn.addEventListener("click", async () => {
  const res = await fetch(`${BACKEND_URL}/api/categories`);
  const data = await res.json();
  showOutput(JSON.stringify(data, null, 2));
});

/* Upload file */
uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a file first");
    return;
  }

  outputDiv.innerHTML = "Processing document...";

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BACKEND_URL}/api/upload`, {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  extractedText = data.text || "";
  showOutput("Document uploaded successfully.\n\nYou can now ask a question.");
});

/* Ask AI */
askBtn.addEventListener("click", async () => {
  const question = questionInput.value.trim();

  if (!question) {
    alert("Please type a question");
    return;
  }

  if (!extractedText) {
    alert("Please upload a document first");
    return;
  }

  outputDiv.innerHTML = "AI is thinking...";

  const response = await fetch(`${BACKEND_URL}/api/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      question,
      documentText: extractedText
    })
  });

  const data = await response.json();
  showOutput(data.answer);
});
