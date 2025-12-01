// Script de Dashboard para el Portal de Usuarios de AeroNexus

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar dashboard
    initializeDashboard();
});

function initializeDashboard() {
    // Cargar datos del usuario
    loadUserData();

    // Configurar escuchadores de eventos
    setupEventListeners();

    // Cargar datos iniciales
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
    // Menú desplegable del usuario
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.querySelector('.dropdown');

    userMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    // Cerrar desplegable de notificaciones
        document.getElementById('notification-dropdown').style.display = 'none';
    });

    // Desplegable de notificaciones
    const notificationIcon = document.getElementById('notification-icon');
    const notificationDropdown = document.getElementById('notification-dropdown');

    notificationIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationDropdown.style.display = notificationDropdown.style.display === 'block' ? 'none' : 'block';
    // Cerrar menú desplegable del usuario
        dropdown.style.display = 'none';
    });

    // Cerrar desplegables al hacer clic fuera
    document.addEventListener('click', function() {
        dropdown.style.display = 'none';
        notificationDropdown.style.display = 'none';
    });

    // Funcionalidad de logout
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });

    // Acciones rápidas
    document.getElementById('book-flight').addEventListener('click', function() {
        scrollToSection('flight-search');
    });

    document.getElementById('manage-bookings').addEventListener('click', function() {
    // Marcador de posición - en app real, navegar a página de reservas
        alert('Funcionalidad de gestión de reservas próximamente disponible');
    });

    document.getElementById('online-checkin').addEventListener('click', function() {
    // Marcador de posición - en app real, navegar a página de check-in
        alert('Funcionalidad de check-in online próximamente disponible');
    });

    document.getElementById('flight-status').addEventListener('click', function() {
    // Marcador de posición - en app real, mostrar modal de estado de vuelos
        alert('Funcionalidad de estado de vuelos próximamente disponible');
    });

    // Búsqueda de vuelos
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

    // Marcador de posición para búsqueda de vuelos
    // En una implementación real, esto enviaría una solicitud al backend
    alert(`Buscando vuelos de ${origin} a ${destination} para ${passengers} pasajero(s) el ${departureDate}`);
}

function loadUpcomingFlights() {
    // Marcador de posición para cargar vuelos próximos
    // In a real implementation, this would fetch from an API
    // For now, the HTML already has sample data
}

function logout() {
    // Limpiar datos del usuario
    localStorage.removeItem('userName');
    localStorage.removeItem('userToken');

    // Redirigir a la página de login
    window.location.href = 'login.html';
}

// Funciones de utilidad
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="loading">Cargando...</div>';
    }
}

function hideLoading(elementId) {
    // Remove loading indicator
}

// Agregar estilos de carga dinámicamente
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
