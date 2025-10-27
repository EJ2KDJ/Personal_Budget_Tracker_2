export async function initEnvelopes() {
  await loadCategories();
  await loadEnvelopes();
  setupEnvelopeForm();
  setupSearchDropdown();
}

let allEnvelopes = []; // Store all envelopes for filtering

// Load existing categories from database
async function loadCategories() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  try {
    const res = await fetch(`/categories/users/${userId}`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to load categories:", errorText);
      return;
    }

    const data = await res.json();
    const categories = data.categories || [];

    const select = document.getElementById("existingCategorySelect");
    if (!select) return;
    
    select.innerHTML = `<option value="">Select an existing category</option>`;
    
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading categories:", err);
  }
}

// Load user's envelopes
async function loadEnvelopes() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  try {
    const res = await fetch(`/envelopes/users/${userId}`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to load envelopes:", errorText);
      document.getElementById("envelopeList").innerHTML = "<p>Error loading envelopes</p>";
      return;
    }

    const data = await res.json();
    allEnvelopes = data.envelopes || [];
    displayEnvelopes(allEnvelopes);
  } catch (err) {
    console.error("Error loading envelopes:", err);
    document.getElementById("envelopeList").innerHTML = "<p>Error loading envelopes</p>";
  }
}

// Display envelopes in the list
function displayEnvelopes(envelopes) {
  const listContainer = document.getElementById("envelopeList");
  
  if (!listContainer) return;
  
  if (envelopes.length === 0) {
    listContainer.innerHTML = "<p>No envelopes found. Create one to get started!</p>";
    return;
  }

  listContainer.innerHTML = envelopes.map(envelope => `
    <div class="envelope-item" data-id="${envelope.id}">
      <h4>${envelope.title}</h4>
      <p><strong>Budget:</strong> ₱${parseFloat(envelope.budget).toFixed(2)}</p>
      <p><strong>Category ID:</strong> ${envelope.category_id || "N/A"}</p>
      <p><strong>Created:</strong> ${new Date(envelope.createdAt).toLocaleDateString()}</p>
    </div>
  `).join("");
}

// Setup envelope form submission
function setupEnvelopeForm() {
  const form = document.getElementById("addEnvelopeForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const title = document.getElementById("envelopeName").value.trim();
    const budget = document.getElementById("envelopeBudget").value;
    const newCategoryName = document.getElementById("newCategoryName").value.trim();
    const existingCategoryId = document.getElementById("existingCategorySelect").value;

    if (!title || !budget) {
      alert("Please enter envelope name and budget");
      return;
    }

    // Validate that user either selected a category or entered a new one
    if (!newCategoryName && !existingCategoryId) {
      alert("Please either select an existing category or create a new one");
      return;
    }

    let categoryId = existingCategoryId;

    // Create new category if user entered one
    if (newCategoryName && !existingCategoryId) {
      try {
        const categoryRes = await fetch("/categories", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newCategoryName, type: "expense" }),
        });

        if (categoryRes.ok) {
          const categoryData = await categoryRes.json();
          categoryId = categoryData.category.id;
          await loadCategories(); // Reload categories dropdown
        } else {
          const errorText = await categoryRes.text();
          console.error("Failed to create category:", errorText);
          alert("Failed to create category");
          return;
        }
      } catch (err) {
        console.error("Error creating category:", err);
        alert("Error creating category");
        return;
      }
    }

    // Create envelope
    try {
      const res = await fetch("/envelopes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          title, 
          budget: parseFloat(budget),
          category_id: categoryId ? parseInt(categoryId) : null
        }),
      });

      if (res.ok) {
        alert("Envelope created successfully!");
        form.reset();
        await loadEnvelopes(); // Reload envelope list
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error || "Failed to create envelope"}`);
      }
    } catch (err) {
      console.error("Error creating envelope:", err);
      alert("Error creating envelope");
    }
  });
}

// Setup search dropdown functionality
function setupSearchDropdown() {
  const searchInput = document.getElementById("searchInput");
  const dropdownBtn = document.getElementById("searchDropdownBtn");
  const dropdown = document.getElementById("searchDropdown");
  
  if (!searchInput || !dropdownBtn || !dropdown) return;
  
  const dropdownOptions = dropdown.querySelectorAll("p");

  let currentSearchField = "title"; // Default search field

  // Toggle dropdown
  dropdownBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("hidden");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && e.target !== dropdownBtn) {
      dropdown.classList.add("hidden");
    }
  });

  // Handle dropdown option selection
  dropdownOptions.forEach((option) => {
    option.addEventListener("click", () => {
      currentSearchField = option.dataset.field;
      dropdown.classList.add("hidden");
      
      // Update placeholder based on selected field
      const placeholders = {
        title: "Search by name...",
        budget: "Search by budget...",
        category: "Search by category ID...",
        date: "Search by date..."
      };
      searchInput.placeholder = placeholders[currentSearchField] || "Search...";
      
      // Trigger search if there's already text
      if (searchInput.value.trim()) {
        performSearch(searchInput.value.trim(), currentSearchField);
      }
    });
  });

  // Handle search input
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.trim();
    performSearch(searchTerm, currentSearchField);
  });
}

// Perform search/filter on envelopes
function performSearch(searchTerm, field) {
  if (!searchTerm) {
    displayEnvelopes(allEnvelopes);
    return;
  }

  const filtered = allEnvelopes.filter((envelope) => {
    const searchLower = searchTerm.toLowerCase();

    switch (field) {
      case "title":
        return envelope.title.toLowerCase().includes(searchLower);
      
      case "budget":
        return envelope.budget.toString().includes(searchTerm);
      
      case "category":
        return envelope.category_id && envelope.category_id.toString().includes(searchTerm);
      
      case "date":
        const dateStr = new Date(envelope.createdAt).toLocaleDateString();
        return dateStr.includes(searchTerm);
      
      default:
        return false;
    }
  });

  displayEnvelopes(filtered);
}