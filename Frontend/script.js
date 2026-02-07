const BACKEND_URL = "http://localhost:5000";

const outputDiv = document.getElementById("output");
const healthBtn = document.getElementById("healthBtn");
const categoriesBtn = document.getElementById("categoriesBtn");

/* ---------- Helper function ---------- */
function showOutput(data) {
  outputDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

/* ---------- Check backend health ---------- */
healthBtn.addEventListener("click", async () => {
  outputDiv.innerHTML = "Checking backend...";

  try {
    const response = await fetch(`${BACKEND_URL}/api/health`);
    const data = await response.json();
    showOutput(data);
  } catch (error) {
    outputDiv.innerHTML = "❌ Backend not reachable";
  }
});

/* ---------- Load categories ---------- */
categoriesBtn.addEventListener("click", async () => {
  outputDiv.innerHTML = "Loading categories...";

  try {
    const response = await fetch(`${BACKEND_URL}/api/categories`);
    const data = await response.json();
    showOutput(data);
  } catch (error) {
    outputDiv.innerHTML = "❌ Failed to load categories";
  }
});
