let sidebar = document.querySelector('.sidebar');
let icon = document.querySelector('.sidebar-icon');

icon.onclick = function() {
    sidebar.classList.toggle('active');
};
