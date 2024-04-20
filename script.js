let sidebar = document.querySelector('.sidebar');
let icon = document.querySelector('.sidebar-icon');
let search = document.querySelector('.fullscreen-search-container');
let searchButton = document.querySelector('.search-button');
let closeSearch = document.querySelector('.x-icon');

sidebar.classList.toggle('active');

icon.onclick = function() {
    sidebar.classList.toggle('active');
};

searchButton.onclick = function() {
    search.classList.toggle('active');
};

closeSearch.onclick = function() {
    search.classList.toggle('active');
};


