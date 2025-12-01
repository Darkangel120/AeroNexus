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


