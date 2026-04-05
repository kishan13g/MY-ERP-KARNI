// Load a page dynamically
function loadPage(pageName) {
  fetch(`pages/${pageName}.html`)
    .then(response => response.text())
    .then(html => {
      document.getElementById('app-content').innerHTML = html;
    })
    .catch(err => {
      console.error('Error loading page:', err);
      document.getElementById('app-content').innerHTML = '<h2>Page not found</h2>';
    });
}

// Load the dashboard by default when the page opens
window.onload = function() {
  loadPage('dashboard');
};