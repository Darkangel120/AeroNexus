// Script de Check-in para el Portal de Usuarios de AeroNexus

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar página de check-in
    initializeCheckIn();
});

function initializeCheckIn() {
    // Cargar datos del usuario
    loadUserData();

    // Configurar escuchadores de eventos
    setupEventListeners();

    // Verificar si hay un código de reserva de la página de reservas
    const checkInBooking = localStorage.getItem('checkInBooking');
    if (checkInBooking) {
        document.getElementById('booking-code').value = checkInBooking;
        localStorage.removeItem('checkInBooking');
    }
}

function loadUserData() {
    // Marcador de posición para cargar datos del usuario desde el backend
    const userName = localStorage.getItem('userName') || 'Usuario';
    document.getElementById('user-name').textContent = userName;
}

function setupEventListeners() {
    // Formulario de check-in
    document.getElementById('checkin-form').addEventListener('submit', function(e) {
        e.preventDefault();
        searchBooking();
    });

    // Botón para iniciar check-in
    document.getElementById('start-checkin-btn').addEventListener('click', function() {
        startCheckInProcess();
    });

    // Navegación de pasos
    document.getElementById('next-step-1').addEventListener('click', function() {
        nextStep(1);
    });

    document.getElementById('next-step-2').addEventListener('click', function() {
        nextStep(2);
    });

    // Selección de asiento
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('seat') && e.target.classList.contains('available')) {
            selectSeat(e.target);
        }
    });

    // Descargar tarjeta de embarque
    document.getElementById('download-pass').addEventListener('click', function() {
        downloadBoardingPass();
    });

    // Volver al dashboard
    document.getElementById('back-to-dashboard').addEventListener('click', function() {
        window.location.href = 'dashboard.html';
    });

    // Funcionalidad de logout
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
}

function searchBooking() {
    const bookingCode = document.getElementById('booking-code').value.trim().toUpperCase();
    const lastName = document.getElementById('last-name').value.trim();

    if (!bookingCode || !lastName) {
        alert('Por favor, complete todos los campos');
        return;
    }

    // Mostrar carga
    showLoading('checkin-details');

    // Simular llamada a API
    setTimeout(() => {
    // Datos de reserva simulados
        const mockBooking = {
            code: bookingCode,
            passenger: `${lastName}, Juan`,
            flight: 'AN123',
            origin: 'MEX',
            destination: 'CDG',
            date: '15 Dic 2024',
            time: '14:30',
            passengers: 1
        };

        displayBookingDetails(mockBooking);
    }, 1000);
}

function displayBookingDetails(booking) {
    // Actualizar detalles del vuelo
    document.getElementById('flight-origin').textContent = booking.origin;
    document.getElementById('flight-destination').textContent = booking.destination;
    document.getElementById('flight-number').textContent = booking.flight;
    document.getElementById('flight-date').textContent = booking.date;
    document.getElementById('flight-time').textContent = booking.time;
    document.getElementById('passenger-count').textContent = booking.passengers;

    // Mostrar sección de detalles de reserva
    document.getElementById('checkin-selection').style.display = 'none';
    document.getElementById('checkin-details').style.display = 'block';
}

function startCheckInProcess() {
    document.getElementById('checkin-details').style.display = 'none';
    document.getElementById('checkin-process').style.display = 'block';
}

function selectSeat(seatElement) {
    // Remover selección anterior
    document.querySelectorAll('.seat.selected').forEach(seat => {
        seat.classList.remove('selected');
        seat.classList.add('available');
    });

    // Seleccionar nuevo asiento
    seatElement.classList.remove('available');
    seatElement.classList.add('selected');

    // Almacenar asiento seleccionado
    const seatNumber = seatElement.dataset.seat;
    localStorage.setItem('selectedSeat', seatNumber);

    // Actualizar información del pasajero
    document.getElementById('selected-seat').textContent = seatNumber;
}

function nextStep(currentStep) {
    if (currentStep === 1) {
    // Validar selección de asiento
        const selectedSeat = document.querySelector('.seat.selected');
        if (!selectedSeat) {
            alert('Por favor, selecciona un asiento');
            return;
        }

        // Ir al paso 2
        updateStepIndicator(2);
        showStep(2);
    } else if (currentStep === 2) {
    // Validar aceptación de términos
        const termsCheck = document.getElementById('terms-check');
        if (!termsCheck.checked) {
            alert('Por favor, acepta los términos y condiciones');
            return;
        }

    // Completar check-in
        completeCheckIn();
    }
}

function updateStepIndicator(activeStep) {
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector(`.step[data-step="${activeStep}"]`).classList.add('active');
}

function showStep(stepNumber) {
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`step-${stepNumber}`).classList.add('active');
}

function completeCheckIn() {
    // Actualizar indicador de paso
    updateStepIndicator(3);
    showStep(3);

    // Generar datos de tarjeta de embarque
    const selectedSeat = localStorage.getItem('selectedSeat') || '1A';
    const gate = 'A' + Math.floor(Math.random() * 20) + 1;

    // Actualizar tarjeta de embarque
    document.getElementById('bp-passenger').textContent = document.getElementById('passenger-name').textContent;
    document.getElementById('bp-flight').textContent = document.getElementById('flight-number').textContent;
    document.getElementById('bp-date').textContent = document.getElementById('flight-date').textContent;
    document.getElementById('bp-time').textContent = document.getElementById('flight-time').textContent;
    document.getElementById('bp-origin').textContent = document.getElementById('flight-origin').textContent;
    document.getElementById('bp-destination').textContent = document.getElementById('flight-destination').textContent;
    document.getElementById('bp-seat').textContent = selectedSeat;
    document.getElementById('bp-gate').textContent = gate;

    // Limpiar datos almacenados
    localStorage.removeItem('selectedSeat');
}

function downloadBoardingPass() {
    // En una implementación real, esto generaría un PDF o imagen
    alert('Descargando tarjeta de embarque...');
    // Para fines de demostración, mostraremos una alerta
}

function logout() {
    // Limpiar datos del usuario
    localStorage.removeItem('userName');
    localStorage.removeItem('userToken');
    localStorage.removeItem('selectedFlight');
    localStorage.removeItem('checkInBooking');
    localStorage.removeItem('selectedSeat');

    // Redirigir a la página de login
    window.location.href = 'login.html';
}

// Funciones de utilidad
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="loading">Buscando reserva...</div>';
        element.style.display = 'block';
    }
}
