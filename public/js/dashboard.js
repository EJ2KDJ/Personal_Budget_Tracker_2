function toggleNav() {
    const sidebar = document.querySelector('.sidebar');
    const btn = document.querySelector('.sidebar .closebtn');
    const navLinks = document.querySelectorAll('.sidebar a:not(.closebtn)'); 

    sidebar.classList.toggle('closed');

    if (sidebar.classList.contains('closed')) {
        sidebar.style.width = '50px';
        btn.innerHTML = '&#9776;'; // hamburger icon
        navLinks.forEach(link => {
            link.style.opacity = '0';
        });
    } else {
        sidebar.style.width = '300px';
        btn.innerHTML = '&times;'; // close icon
        navLinks.forEach(link => {
            link.style.opacity = '1';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }
});