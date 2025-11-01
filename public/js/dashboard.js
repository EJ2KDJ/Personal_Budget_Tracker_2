document.addEventListener("DOMContentLoaded", async () => {
    lucide.createIcons();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
        window.location.href = "login.html";
        return;
    }

    const lastTabId = localStorage.getItem("activeTab") || "profile";
    const lastTabEl = document.querySelector(`.sidebar a[data-target="${lastTabId}"]`);

    if (lastTabEl) switchTab(lastTabEl);
    else switchTab(document.querySelector('.sidebar a[data-target="profile"]'));

    setupLogout();
});

const tabs = document.querySelectorAll('.sidebar a:not(.closebtn)');
const sections = document.querySelectorAll('.tab-section');

function switchTab(tab) {
    const targetId = tab.dataset.target;

    sections.forEach(section => section.classList.remove('active'));
    tabs.forEach(t => t.classList.remove('active'));

    document.getElementById(targetId).classList.add('active');
    tab.classList.add('active');
    localStorage.setItem("activeTab", targetId);
    loadTabModule(targetId);
}

tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab(tab);
    });
});

async function loadTabModule(tab) {
    try {
        if (tab === "profile") {
            const { initProfile } = await import("./profile.js");
            initProfile();
        } else if (tab === "envelopes") {
            const { initEnvelopes } = await import("./envelope.js");
            initEnvelopes();
        } else if (tab === "transfers") {
            const { initTransfers } = await import("./transfers.js");
            initTransfers();
        } else if (tab === "transactions") {
            const { initTransactions } = await import("./transaction.js");
            initTransactions();
        }
    } catch (err) {
        console.error(`Failed to load module for tab "${tab}":`, err);
    }
}

function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const confirmLogout = confirm('Are you sure you want to logout?');
        
        if (confirmLogout) {
            // Clear all stored data
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('activeTab');
            
            // Redirect to login page
            window.location.href = 'login.html';
        }
    });
}

function toggleNav() {
    const sidebar = document.querySelector(".sidebar");
    const btn = document.querySelector(".sidebar .closebtn");
    const body = document.body;

    sidebar.classList.toggle("closed");

    if (sidebar.classList.contains("closed")) {
        sidebar.style.width = "50px";
        body.style.marginLeft = "50px";
        btn.innerHTML = "&#9776;";
    } else {
        sidebar.style.width = "300px";
        body.style.marginLeft = "300px";
        btn.innerHTML = "&times;";
    }
}