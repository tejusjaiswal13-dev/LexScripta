const BACKEND_URL = "http://localhost:5000";

const outputDiv = document.getElementById("output");
const healthBtn = document.getElementById("healthBtn");
const categoriesBtn = document.getElementById("categoriesBtn");
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");

function showOutput(data) {
  outputDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

/* Health */
healthBtn.addEventListener("click", async () => {
  outputDiv.innerHTML = "Checking backend...";
  const res = await fetch(`${BACKEND_URL}/api/health`);
  const data = await res.json();
  showOutput(data);
});

/* Categories */
categoriesBtn.addEventListener("click", async () => {
  outputDiv.innerHTML = "Loading categories...";
  const res = await fetch(`${BACKEND_URL}/api/categories`);
  const data = await res.json();
  showOutput(data);
});

/* Upload */
uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a file");
    return;
  }

  outputDiv.innerHTML = "Uploading & processing file...";

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${BACKEND_URL}/api/upload`, {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    showOutput(data);
  } catch (err) {
    outputDiv.innerHTML = "❌ Upload failed";
  }
});
