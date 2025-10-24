document.addEventListener("DOMContentLoaded", async () => {
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
        }

    } catch (err) {
        console.error(`Failed to load module for tab "${tab}":`, err);
    }
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