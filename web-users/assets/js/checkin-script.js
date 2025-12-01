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

// Agregar estilos específicos de check-in dinámicamente
const checkInStyles = `
    .checkin-section {
        margin-bottom: 3rem;
    }

    .checkin-steps {
        display: flex;
        justify-content: center;
        margin-bottom: 3rem;
        position: relative;
    }

    .checkin-steps::before {
        content: '';
        position: absolute;
        top: 25px;
        left: 0;
        right: 0;
        height: 2px;
        background: #e9ecef;
        z-index: 1;
    }

    .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        z-index: 2;
        flex: 1;
        max-width: 200px;
    }

    .step-number {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #e9ecef;
        color: var(--text-light);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        margin-bottom: 0.5rem;
        transition: all 0.3s ease;
    }

    .step.active .step-number {
        background: var(--primary-blue);
        color: var(--white);
    }

    .step-title {
        text-align: center;
        font-weight: 600;
        color: var(--text-light);
    }

    .step.active .step-title {
        color: var(--primary-blue);
    }

    .step-content {
        display: none;
        background: var(--white);
        border-radius: 15px;
        padding: 2rem;
        box-shadow: 0 5px 15px var(--shadow);
    }

    .step-content.active {
        display: block;
    }

    .seat-selection {
        margin: 2rem 0;
    }

    .seat-map {
        margin-bottom: 2rem;
    }

    .seat-row {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.5rem;
    }

    .seat-label {
        width: 30px;
        text-align: center;
        font-weight: bold;
        color: var(--text-light);
    }

    .seat {
        width: 40px;
        height: 40px;
        border: 2px solid #e9ecef;
        border-radius: 5px;
        background: var(--white);
        margin: 0 2px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.8rem;
        font-weight: bold;
    }

    .seat.available:hover {
        border-color: var(--primary-blue);
        background: #f8f9fa;
    }

    .seat.selected {
        background: var(--primary-blue);
        color: var(--white);
        border-color: var(--primary-blue);
    }

    .seat.occupied {
        background: var(--danger);
        color: var(--white);
        cursor: not-allowed;
    }

    .aisle {
        width: 20px;
    }

    .seat-legend {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: var(--text-light);
    }

    .legend-item .seat {
        width: 20px;
        height: 20px;
        margin: 0;
        cursor: default;
    }

    .passenger-info {
        margin: 2rem 0;
    }

    .passenger-card {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 10px;
        border-left: 4px solid var(--primary-blue);
    }

    .form-check {
        margin: 2rem 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .boarding-pass {
        background: var(--white);
        border: 2px solid var(--primary-blue);
        border-radius: 15px;
        padding: 2rem;
        margin: 2rem 0;
        text-align: center;
    }

    .pass-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .pass-logo {
        height: 40px;
        width: auto;
    }

    .pass-details {
        margin-bottom: 2rem;
    }

    .pass-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        padding: 0.25rem 0;
        border-bottom: 1px solid #e9ecef;
    }

    .qr-code {
        margin: 1rem 0;
    }

    .qr-code img {
        width: 100px;
        height: 100px;
    }

    .checkin-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
    }

    .loading {
        text-align: center;
        padding: 2rem;
        color: var(--text-light);
    }

    @media (max-width: 768px) {
        .checkin-steps {
            flex-direction: column;
            align-items: center;
        }

        .step {
            margin-bottom: 1rem;
        }

        .checkin-steps::before {
            display: none;
        }

        .seat-row {
            flex-wrap: wrap;
        }

        .pass-row {
            flex-direction: column;
            align-items: center;
            gap: 0.25rem;
        }

        .checkin-actions {
            flex-direction: column;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = checkInStyles;
document.head.appendChild(styleSheet);
