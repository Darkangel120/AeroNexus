// Dashboard Script for AeroNexus User Portal

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initializeDashboard();
});

function initializeDashboard() {
    // Load user data
    loadUserData();

    // Setup event listeners
    setupEventListeners();

    // Load initial data
    loadUpcomingFlights();
    loadNotifications();
}

function loadUserData() {
    // Placeholder for loading user data from backend
    // In a real implementation, this would fetch from an API
    const userName = localStorage.getItem('userName') || 'Usuario';
    document.getElementById('user-name').textContent = userName;
    document.getElementById('user-greeting').textContent = userName;
}

function setupEventListeners() {
    // User menu dropdown
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.querySelector('.dropdown');

    userMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        // Close notification dropdown
        document.getElementById('notification-dropdown').style.display = 'none';
    });

    // Notifications dropdown
    const notificationIcon = document.getElementById('notification-icon');
    const notificationDropdown = document.getElementById('notification-dropdown');

    notificationIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationDropdown.style.display = notificationDropdown.style.display === 'block' ? 'none' : 'block';
        // Close user menu dropdown
        dropdown.style.display = 'none';
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        dropdown.style.display = 'none';
        notificationDropdown.style.display = 'none';
    });

    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });

    // Quick actions
    document.getElementById('book-flight').addEventListener('click', function() {
        scrollToSection('flight-search');
    });

    document.getElementById('manage-bookings').addEventListener('click', function() {
        // Placeholder - in real app, navigate to bookings page
        alert('Funcionalidad de gestión de reservas próximamente disponible');
    });

    document.getElementById('online-checkin').addEventListener('click', function() {
        // Placeholder - in real app, navigate to check-in page
        alert('Funcionalidad de check-in online próximamente disponible');
    });

    document.getElementById('flight-status').addEventListener('click', function() {
        // Placeholder - in real app, show flight status modal
        alert('Funcionalidad de estado de vuelos próximamente disponible');
    });

    // Flight search
    document.getElementById('search-btn').addEventListener('click', function() {
        performFlightSearch();
    });

    // Navigation links
    document.querySelectorAll('.main-nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function performFlightSearch() {
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const departureDate = document.getElementById('departure-date').value;
    const returnDate = document.getElementById('return-date').value;
    const passengers = document.getElementById('passengers').value;

    if (!origin || !destination || !departureDate) {
        alert('Por favor, complete todos los campos obligatorios');
        return;
    }

    // Placeholder for flight search
    // In a real implementation, this would send a request to the backend
    alert(`Buscando vuelos de ${origin} a ${destination} para ${passengers} pasajero(s) el ${departureDate}`);
}

function loadUpcomingFlights() {
    // Placeholder for loading upcoming flights
    // In a real implementation, this would fetch from an API
    // For now, the HTML already has sample data
}

function loadNotifications() {
    // Placeholder for loading notifications
    // In a real implementation, this would fetch from an API
    // For now, the HTML already has sample data
}

function logout() {
    // Clear user data
    localStorage.removeItem('userName');
    localStorage.removeItem('userToken');

    // Redirect to login page
    window.location.href = 'login.html';
}

// Utility functions
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="loading">Cargando...</div>';
    }
}

function hideLoading(elementId) {
    // Remove loading indicator
}

// Add loading styles dynamically
const loadingStyles = `
    .loading {
        text-align: center;
        padding: 2rem;
        color: var(--text-light);
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = loadingStyles;
document.head.appendChild(styleSheet);
