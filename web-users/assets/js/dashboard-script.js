// Script de Dashboard para el Portal de Usuarios de TravelNexus

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar dashboard
    initializeDashboard();
});

function initializeDashboard() {
    // Configurar escuchadores de eventos
    setupEventListeners();

    // Cargar datos iniciales
    loadUpcomingFlights();
}

function setupEventListeners() {
    // Acciones rápidas
    document.getElementById('book-flight').addEventListener('click', function() {
        // Navegar a página de vuelos
        window.location.href = 'flight-search.html';
    });

    document.getElementById('manage-bookings').addEventListener('click', function() {
        // Navegar a página de reservas
        window.location.href = 'bookings.html';
    });

    document.getElementById('online-checkin').addEventListener('click', function() {
        // Navegar a página de check-in
        window.location.href = 'checkin.html';
    });

    document.getElementById('flight-status').addEventListener('click', function() {
        // Marcador de posición - en app real, mostrar modal de estado de vuelos
        alert('Funcionalidad de estado de vuelos próximamente disponible');
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
