function toggleNav() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar.style.width === '300px') {
        sidebar.style.width = '50px';
        
    } else {
        sidebar.style.width = '300px';
    }
    // change button to reflect state
    const btn = document.querySelector('.sidebar .closebtn');
    if (sidebar.style.width === '300px') {
        btn.innerHTML = '&times;'; // close icon
    } else {
        btn.innerHTML = '&#9776;'; // open icon
    }
}