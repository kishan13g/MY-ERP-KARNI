// Define routes
const routes = {
  'dashboard': 'pages/dashboard.html',
  'sales-invoice': 'pages/sales_invoice.html',
  'customers': 'pages/customers.html',
  // Add more routes as needed
};

// Load content based on route
function loadRoute(route) {
  const path = routes[route];
  if (!path) return;

  fetch(path)
    .then(response => response.text())
    .then(html => {
      document.getElementById('app-content').innerHTML = html;
    })
    .catch(err => console.error('Error loading page:', err));
}

// Handle navigation clicks
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('[data-route]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const route = e.target.getAttribute('data-route');
      loadRoute(route);
    });
  });

  // Load default route (e.g., dashboard)
  loadRoute('dashboard');
});