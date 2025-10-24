export async function initProfile() {
  await loadUserProfile();
  setupUpdateForm();
  lucide.createIcons();
}

async function loadUserProfile() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  try {
    const res = await fetch(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch user info");

    const user = await res.json();
    document.getElementById("profile-username").textContent = user.username;
    document.getElementById("profile-email").textContent = user.email;
    document.getElementById("profile-created").textContent = new Date(
      user.createdAt || user.created_at
    ).toLocaleDateString();
  } catch (err) {
    console.error(err);
    alert("Error loading user data.");
  }
}

function setupUpdateForm() {
  const form = document.getElementById("updateProfileForm");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const updateData = {
      username: form.username.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value.trim(),
    };

    // Remove empty fields
    Object.keys(updateData).forEach(
      (key) => !updateData[key] && delete updateData[key]
    );

    if (Object.keys(updateData).length === 0)
      return alert("Please fill out a field to update.");

    try {
      const res = await fetch(`/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) throw new Error(await res.text());
      alert("Profile updated!");
      await loadUserProfile();
      form.reset();
    } catch (err) {
      console.error(err);
      alert("Error updating profile.");
    }
  });
}