export async function initEnvelopes() {
  await loadCategories();
  setupEnvelopeForm();
}

async function loadCategories() {
  const token = localStorage.getItem("token");
  const res = await fetch("/categories", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const select = document.getElementById("existingCategorySelect");
  if (!res.ok) return (select.innerHTML = "<option>Error loading</option>");

  const categories = await res.json();
  select.innerHTML = `
    <option value="">Select category</option>
    ${categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")}
  `;
}

function setupEnvelopeForm() {
  const form = document.getElementById("envelopeForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const name = document.getElementById("envelopeName").value;
    const budget = document.getElementById("budgetAmount").value;
    const newCategory = document.getElementById("newCategoryName").value.trim();
    const existingCategory = document.getElementById("existingCategorySelect").value;

    let categoryId = existingCategory;

    // Create new category if entered
    if (newCategory) {
      const res = await fetch("/categories", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategory }),
      });
      const newCat = await res.json();
      categoryId = newCat.id;
    }

    // Create envelope
    const res = await fetch("/envelopes", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, budget, categoryId, userId }),
    });

    if (res.ok) {
      alert("Envelope created!");
      form.reset();
      loadCategories();
    } else {
      alert("Error adding envelope.");
    }
  });
}