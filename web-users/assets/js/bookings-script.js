// Script de Reservas para el Portal de Usuarios de AeroNexus

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar página de reservas
    initializeBookings();
});

function initializeBookings() {
    // Cargar datos del usuario
    loadUserData();

    // Configurar escuchadores de eventos
    setupEventListeners();

    // Cargar datos de reservas
    loadBookings();
}

function loadUserData() {
    // Placeholder for loading user data from backend
    const userName = localStorage.getItem('userName') || 'Usuario';
    document.getElementById('user-name').textContent = userName;
}

function setupEventListeners() {
    // Cambio de pestañas
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // Acciones de reserva
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-danger')) {
    // Cancelar reserva
            const bookingCard = e.target.closest('.booking-card');
            const bookingCode = bookingCard.querySelector('strong:contains("Código")').nextSibling.textContent.trim();
            cancelBooking(bookingCode);
        } else if (e.target.classList.contains('btn-primary') && e.target.textContent === 'Check-in') {
    // Check-in
            const bookingCard = e.target.closest('.booking-card');
            const bookingCode = bookingCard.querySelector('strong:contains("Código")').nextSibling.textContent.trim();
            startCheckIn(bookingCode);
        }
    });

    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
}

function switchTab(tabName) {
    // Remover clase activa de todas las pestañas y secciones
    document.querySelectorAll('.tab-btn').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.booking-section').forEach(section => section.classList.remove('active'));

    // Agregar clase activa a la pestaña y sección seleccionada
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-bookings`).classList.add('active');
}

function loadBookings() {
    // Marcador de posición para cargar reservas desde el backend
    // En una implementación real, esto obtendría datos de una API
    // Por ahora, el HTML ya tiene datos de muestra
}

function cancelBooking(bookingCode) {
    if (confirm(`¿Estás seguro de que quieres cancelar la reserva ${bookingCode}? Esta acción no se puede deshacer.`)) {
    // Marcador de posición para lógica de cancelación
        alert(`Reserva ${bookingCode} cancelada exitosamente. Se procesará el reembolso según la política de cancelación.`);
    // En una implementación real, esto enviaría una solicitud al backend
    // Luego recargar los datos de reservas
        location.reload();
    }
}

function startCheckIn(bookingCode) {
    // Almacenar código de reserva para el proceso de check-in
    localStorage.setItem('checkInBooking', bookingCode);

    // Redirigir a la página de check-in
    window.location.href = 'checkin.html';
}

function logout() {
    // Limpiar datos del usuario
    localStorage.removeItem('userName');
    localStorage.removeItem('userToken');
    localStorage.removeItem('selectedFlight');
    localStorage.removeItem('checkInBooking');

    // Redirigir a la página de login
    window.location.href = 'login.html';
}

// Agregar estilos específicos de reservas dinámicamente
const bookingStyles = `
    .booking-tabs {
        display: flex;
        margin-bottom: 2rem;
        border-bottom: 2px solid #e9ecef;
    }

    .tab-btn {
        padding: 0.75rem 1.5rem;
        background: none;
        border: none;
        border-bottom: 3px solid transparent;
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-light);
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .tab-btn.active {
        color: var(--primary-blue);
        border-bottom-color: var(--primary-blue);
    }

    .tab-btn:hover {
        color: var(--primary-blue);
    }

    .booking-section {
        display: none;
    }

    .booking-section.active {
        display: block;
    }

    .bookings-container {
        display: grid;
        gap: 1.5rem;
    }

    .booking-card {
        background: var(--white);
        border-radius: 15px;
        padding: 2rem;
        box-shadow: 0 5px 15px var(--shadow);
        border-left: 5px solid var(--primary-blue);
    }

    .booking-card.completed {
        border-left-color: var(--success);
        opacity: 0.8;
    }

    .booking-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .booking-route {
        display: flex;
        align-items: center;
        gap: 1rem;
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--primary-blue);
    }

    .booking-route i {
        color: var(--accent-teal);
    }

    .booking-status {
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.9rem;
    }

    .booking-status.confirmed {
        background: var(--success);
        color: var(--white);
    }

    .booking-status.completed {
        background: var(--text-light);
        color: var(--white);
    }

    .booking-details {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-wrap: wrap;
        gap: 2rem;
    }

    .booking-info p {
        margin: 0.25rem 0;
        color: var(--text-light);
    }

    .booking-actions {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        min-width: 150px;
    }

    .booking-actions .btn-secondary,
    .booking-actions .btn-primary,
    .booking-actions .btn-danger {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
    }

    .btn-danger {
        background: var(--danger);
        color: var(--white);
        border: none;
        border-radius: 5px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .btn-danger:hover {
        background: #c82333;
        transform: translateY(-2px);
    }

    .no-bookings {
        text-align: center;
        padding: 3rem;
        color: var(--text-light);
        font-style: italic;
    }

    @media (max-width: 768px) {
        .booking-details {
            flex-direction: column;
            align-items: stretch;
        }

        .booking-actions {
            flex-direction: row;
            justify-content: space-between;
        }

        .booking-actions .btn-secondary,
        .booking-actions .btn-primary,
        .booking-actions .btn-danger {
            flex: 1;
            margin: 0 0.25rem;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = bookingStyles;
document.head.appendChild(styleSheet);
