// Script de Reservas para el Portal de Usuarios de AeroNexus

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar página de reservas
    initializeBookings();
});

function initializeBookings() {
    // Configurar escuchadores de eventos
    setupEventListeners();

    // Cargar datos de reservas
    loadBookings();
}

function setupEventListeners() {
    // Cambio de pestañas
    const tabButtons = document.querySelectorAll('.tab-btn');

    if (tabButtons.length === 0) {
        console.error('No tab buttons found! Check if bookings-styles.css is loading.');
        return;
    }

    tabButtons.forEach((tab, index) => {
        tab.addEventListener('click', function(event) {
            event.preventDefault();
            switchTab(this.dataset.tab);
        });
    });

    // Acciones de reserva
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-danger')) {
    // Cancelar reserva
            const bookingCard = e.target.closest('.booking-card');
            const bookingCode = bookingCard.querySelector('p strong').nextSibling.textContent.trim();
            cancelBooking(bookingCode);
        } else if (e.target.classList.contains('btn-primary') && e.target.textContent === 'Check-in') {
    // Check-in
            const bookingCard = e.target.closest('.booking-card');
            const bookingCode = bookingCard.querySelector('p strong').nextSibling.textContent.trim();
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

    // Remover clase activa de todas las pestañas
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remover clase activa de todas las secciones (CSS se encarga del display)
    document.querySelectorAll('.booking-section').forEach(section => {
        section.classList.remove('active');
    });

    // Agregar clase activa a la pestaña seleccionada
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    } else {
        console.error('Tab not found:', `[data-tab="${tabName}"]`);
    }

    // Agregar clase activa a la sección seleccionada (CSS se encarga del display)
    const selectedSection = document.getElementById(`${tabName}-bookings`);
    if (selectedSection) {
        selectedSection.classList.add('active');
    } else {
        console.error('Section not found:', `${tabName}-bookings`);
    }
}

// Datos de ejemplo de reservas
const sampleBookings = {
    upcoming: [
        {
            code: 'TN123456',
            airline: 'Conviasa',
            route: { from: 'CCS', to: 'MAR' },
            date: '15 Dic 2024',
            time: '14:30',
            passengers: 1,
            seat: '12A',
            status: 'confirmed'
        }
    ],
    past: [
        {
            code: 'ES789012',
            airline: 'Estelar',
            route: { from: 'CCS', to: 'VLN' },
            date: '10 Nov 2024',
            time: '10:00',
            passengers: 2,
            seat: '8B, 8C',
            status: 'completed'
        }
    ],
    cancelled: [
        {
            code: 'CA567890',
            airline: 'Avior Airlines',
            route: { from: 'CCS', to: 'BLA' },
            date: '5 Dic 2024',
            time: '13:00',
            passengers: 1,
            seat: 'Cancelado',
            status: 'cancelled'
        }
    ]
};

function loadBookings() {
    // Cargar datos de reservas desde el objeto de ejemplo
    // En una implementación real, esto obtendría datos de una API
    renderBookings();
}

function renderBookings() {
    // Renderizar reservas para cada sección
    Object.keys(sampleBookings).forEach(section => {
        const container = document.querySelector(`#${section}-bookings .bookings-container`);
        if (container) {
            const bookings = sampleBookings[section];

            if (bookings.length === 0) {
                // Mostrar mensaje cuando no hay reservas
                container.innerHTML = `
                    <div class="no-bookings">
                        No hay reservas ${getSectionName(section)} en este momento.
                    </div>
                `;
            } else {
                // Renderizar las reservas
                container.innerHTML = bookings.map(booking => createBookingCard(booking)).join('');
            }
        }
    });
}

function getSectionName(section) {
    const names = {
        upcoming: 'próximas',
        past: 'pasadas',
        cancelled: 'canceladas'
    };
    return names[section] || section;
}

function createBookingCard(booking) {
    const statusText = {
        confirmed: 'Confirmada',
        completed: 'Completada',
        cancelled: 'Cancelada'
    };

    const actions = getBookingActions(booking.status, booking.code);

    return `
        <div class="booking-card ${booking.status === 'completed' ? 'completed' : ''} ${booking.status === 'cancelled' ? 'cancelled' : ''}">
            <div class="booking-header">
                <div class="booking-route">
                    <span>${booking.route.from}</span>
                    <i class="fas fa-plane"></i>
                    <span>${booking.route.to}</span>
                </div>
                <span class="booking-status ${booking.status}">${statusText[booking.status]}</span>
            </div>
            <div class="booking-details">
                <div class="booking-info">
                    <p><strong>Código:</strong> ${booking.code}</p>
                    <p><strong>Aerolínea:</strong> ${booking.airline}</p>
                    <p><strong>Fecha:</strong> ${booking.date}</p>
                    <p><strong>Hora:</strong> ${booking.time}</p>
                    <p><strong>Pasajeros:</strong> ${booking.passengers}</p>
                    <p><strong>Asiento:</strong> ${booking.seat}</p>
                </div>
                <div class="booking-actions">
                    ${actions}
                </div>
            </div>
        </div>
    `;
}

function getBookingActions(status, bookingCode) {
    switch (status) {
        case 'confirmed':
            return `
                <button class="btn-primary" onclick="startCheckIn('${bookingCode}')">Check-in</button>
                <button class="btn-secondary">Modificar</button>
                <button class="btn-danger" onclick="cancelBooking('${bookingCode}')">Cancelar</button>
            `;
        case 'completed':
            return `
                <button class="btn-secondary">Ver Detalles</button>
                <button class="btn-secondary">Reclamar Equipaje</button>
            `;
        case 'cancelled':
            return `
                <button class="btn-secondary">Ver Detalles</button>
                <button class="btn-secondary">Reclamar Reembolso</button>
            `;
        default:
            return '';
    }
}

function cancelBooking(bookingCode) {
    if (confirm(`¿Estás seguro de que quieres cancelar la reserva ${bookingCode}? Esta acción no se puede deshacer.`)) {
    // lógica de cancelación
        alert(`Reserva ${bookingCode} cancelada exitosamente. Se procesará el reembolso según la política de cancelación.`);
    // En una implementación real, esto enviaría una solicitud al backend
        location.reload();
    }
}

function startCheckIn(bookingCode) {
    // Almacenar código de reserva para el proceso de check-in
    localStorage.setItem('checkInBooking', bookingCode);

    // Redirigir a la página de check-in
    window.location.href = 'checkin.html';
}




