// Profile data fetch and display
document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
        window.location.href = 'login.html';
        return;
    }


    try {
        const response = await fetch(`/users/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text(); // 🔍 capture backend message
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const user = await response.json();

        // Display data in profile tab
        document.getElementById("profile-username").textContent = user.username;
        document.getElementById("profile-email").textContent = user.email;
        document.getElementById("profile-created").textContent =
            new Date(user.createdAt || user.created_at).toLocaleDateString();

    } catch (err) {
        console.error(err);
        alert('Error fetching user data.');
    }
});


// Tab navigation
const tabs = document.querySelectorAll('.sidebar a:not(.closebtn)');
const sections = document.querySelectorAll('.tab-section');

tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = tab.dataset.target;

        sections.forEach(section => section.classList.remove('active'));
        tabs.forEach(t => t.classList.remove('active'));

        document.getElementById(targetId).classList.add('active');
        tab.classList.add('active');
    });
});

// Sidebar toggle function
function toggleNav() {
    const sidebar = document.querySelector('.sidebar');
    const btn = document.querySelector('.sidebar .closebtn');
    const body = document.body;

    sidebar.classList.toggle('closed');

    if (sidebar.classList.contains('closed')) {
        sidebar.style.width = '50px';
        body.style.marginLeft = '50px';
        btn.innerHTML = '&#9776;';
    } else {
        sidebar.style.width = '300px';
        body.style.marginLeft = '300px';
        btn.innerHTML = '&times;';
    }
}