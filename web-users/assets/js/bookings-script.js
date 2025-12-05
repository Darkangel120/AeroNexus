// Script de Reservas para el Portal de Usuarios de TravelNexus

let currentTab = 'upcoming'; // Variable para rastrear la pestaña actual

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar página de reservas
    initializeBookings();
});

function initializeBookings() {
    // Configurar escuchadores de eventos
    setupEventListeners();

    // Cargar datos de reservas
    loadBookings();

    // Verificar si hay un vuelo seleccionado para iniciar creación de reserva (solo desde búsqueda de vuelos)
    if (localStorage.getItem('openModalOnLoad') === 'true') {
        checkSelectedFlight();
        localStorage.removeItem('openModalOnLoad');
    }
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

    // Volver a reservas
    const backToBookingsBtn = document.getElementById('back-to-bookings');
    if (backToBookingsBtn) {
        backToBookingsBtn.addEventListener('click', function() {
            hideCreateReservationSection();
        });
    }

    // Validar vuelo en modal
    const validateFlightBtn = document.getElementById('validate-flight-btn');
    if (validateFlightBtn) {
        validateFlightBtn.addEventListener('click', function() {
            validateFlightInModal();
        });
    }

    // Buscar vuelos en modal
    const searchFlightsBtn = document.getElementById('search-flights-btn');
    if (searchFlightsBtn) {
        searchFlightsBtn.addEventListener('click', function() {
            searchFlightsInModal();
        });
    }

    // Cambiar a modo de validación de vuelo
    const switchToValidationLink = document.getElementById('switch-to-validation');
    if (switchToValidationLink) {
        switchToValidationLink.addEventListener('click', function(e) {
            e.preventDefault();
            showFlightValidation();
        });
    }

    // Volver a vuelos
    const backToFlightsBtn = document.getElementById('back-to-flights');
    if (backToFlightsBtn) {
        backToFlightsBtn.addEventListener('click', function() {
            showFlightSelection();
        });
    }

    // Volver a pasajeros (usando delegación de eventos ya que se genera dinámicamente)
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'back-to-passengers') {
            showPassengerDetails();
        }
    });

    // Payment is now integrated into passenger details section

    // Formulario de reserva
    const reservationForm = document.getElementById('reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processPaymentAndCreateReservation();
        });
    }

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
        } else if (e.target.classList.contains('select-flight-modal')) {
    // Seleccionar vuelo en modal
            const flightId = e.target.dataset.flightId;
            selectFlightInModal(flightId);
        }
    });

    // Crear nueva reserva
    const createReservationBtn = document.getElementById('create-reservation-btn');
    if (createReservationBtn) {
        createReservationBtn.addEventListener('click', function() {
            showCreateReservationSection();
        });
    }

    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
}

function switchTab(tabName) {
    // Actualizar la pestaña actual
    currentTab = tabName;

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

function showCreateReservationSection() {
    // Ocultar título y pestañas
    const bookingsTitle = document.getElementById('bookings-title');
    const bookingTabs = document.getElementById('booking-tabs');
    if (bookingsTitle) bookingsTitle.style.display = 'none';
    if (bookingTabs) bookingTabs.style.display = 'none';

    // Ocultar botón de crear reserva
    const createBtn = document.getElementById('create-reservation-btn');
    if (createBtn) createBtn.style.display = 'none';

    // Ocultar todas las secciones de reservas
    document.querySelectorAll('.booking-section').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none'; // Asegurar que se oculten
    });

    // Mostrar sección de crear reserva
    const createSection = document.getElementById('create-reservation-section');
    if (createSection) {
        createSection.classList.add('active');
        createSection.style.display = 'block'; // Forzar display para superar el inline style

        // Mostrar la sección de validación de vuelo por defecto
        showFlightValidation();
    }
}

function hideCreateReservationSection() {
    const createSection = document.getElementById('create-reservation-section');
    if (createSection) {
        createSection.classList.remove('active');
        resetModalForm(); // Reutilizar función para limpiar formulario
    }

    // Mostrar título y pestañas nuevamente
    const bookingsTitle = document.getElementById('bookings-title');
    const bookingTabs = document.getElementById('booking-tabs');
    if (bookingsTitle) bookingsTitle.style.display = 'block';
    if (bookingTabs) bookingTabs.style.display = 'block';

    // Mostrar botón de crear reserva nuevamente
    const createBtn = document.getElementById('create-reservation-btn');
    if (createBtn) createBtn.style.display = 'block';

    // Mostrar la sección de reservas próximas por defecto
    switchTab('upcoming');
}

// Datos de vuelos predefinidos (sincronizados con flight-search-script.js)
const predefinedFlights = [
    {
        id: 'CO101',
        origin: 'CCS',
        destination: 'MAR',
        departureDate: '2025-12-15',
        departureTime: '08:00',
        arrivalTime: '09:30',
        duration: '1h 30m',
        price: 85,
        airline: 'Conviasa',
        stops: 0,
        class: 'economy'
    },
    {
        id: 'LA102',
        origin: 'CCS',
        destination: 'MAR',
        departureDate: '2025-12-15',
        departureTime: '14:00',
        arrivalTime: '15:30',
        duration: '1h 30m',
        price: 95,
        airline: 'Laser Airlines',
        stops: 0,
        class: 'economy'
    },
    {
        id: 'ES103',
        origin: 'CCS',
        destination: 'VLN',
        departureDate: '2025-12-15',
        departureTime: '10:00',
        arrivalTime: '10:45',
        duration: '45m',
        price: 65,
        airline: 'Estelar',
        stops: 0,
        class: 'economy'
    },
    {
        id: 'CO104',
        origin: 'MAR',
        destination: 'CCS',
        departureDate: '2025-12-15',
        departureTime: '16:00',
        arrivalTime: '17:30',
        duration: '1h 30m',
        price: 90,
        airline: 'Conviasa',
        stops: 0,
        class: 'economy'
    },
    {
        id: 'TU105',
        origin: 'CCS',
        destination: 'BRM',
        departureDate: '2025-12-15',
        departureTime: '12:00',
        arrivalTime: '13:15',
        duration: '1h 15m',
        price: 75,
        airline: 'Turpial Airlines',
        stops: 0,
        class: 'economy'
    },
    {
        id: 'RU106',
        origin: 'CCS',
        destination: 'PMV',
        departureDate: '2025-12-15',
        departureTime: '09:00',
        arrivalTime: '10:45',
        duration: '1h 45m',
        price: 110,
        airline: 'RUTACA Airlines',
        stops: 0,
        class: 'economy'
    },
    {
        id: 'AV107',
        origin: 'VLN',
        destination: 'CCS',
        departureDate: '2025-12-15',
        departureTime: '18:00',
        arrivalTime: '18:45',
        duration: '45m',
        price: 70,
        airline: 'Avior Airlines',
        stops: 0,
        class: 'economy'
    },
    {
        id: 'VE108',
        origin: 'CCS',
        destination: 'MUN',
        departureDate: '2025-12-15',
        departureTime: '11:00',
        arrivalTime: '12:30',
        duration: '1h 30m',
        price: 95,
        airline: 'Venezolana',
        stops: 0,
        class: 'economy'
    }
];

// Función para obtener vuelos coincidentes
function getMatchingFlights(searchParams) {
    return predefinedFlights.filter(flight => {
        return flight.origin.toLowerCase() === searchParams.origin.toLowerCase() &&
               flight.destination.toLowerCase() === searchParams.destination.toLowerCase() &&
               flight.departureDate === searchParams.departureDate;
    });
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

function checkSelectedFlight() {
    // Verificar si hay un vuelo seleccionado en localStorage
    const selectedFlight = localStorage.getItem('selectedFlight');
    if (selectedFlight) {
        // Parsear el vuelo seleccionado
        const flight = JSON.parse(selectedFlight);

        // Mostrar sección de reserva con el vuelo seleccionado
        showCreateReservationSection();

        // Poblar el campo de número de vuelo con el vuelo seleccionado
        populateFlightData(flight);

        // Limpiar el vuelo seleccionado de localStorage
        localStorage.removeItem('selectedFlight');
    }
}



function resetModalForm() {
    // Limpiar campos de búsqueda de vuelos
    document.getElementById('modal-origin').value = '';
    document.getElementById('modal-destination').value = '';
    document.getElementById('modal-departure-date').value = '';
    document.getElementById('modal-passengers').value = '1';

    // Limpiar campo de número de vuelo
    document.getElementById('modal-flight-number').value = '';

    // Limpiar campo de pasajeros en validación
    document.getElementById('validation-passengers').value = '1';

    // Limpiar mensaje de validación
    const validationMessage = document.getElementById('flight-validation-message');
    if (validationMessage) {
        validationMessage.innerHTML = '';
        validationMessage.style.display = 'none';
    }

    // Limpiar resultados de vuelos
    const flightResults = document.getElementById('flight-results');
    if (flightResults) {
        flightResults.innerHTML = '';
        flightResults.style.display = 'none';
    }

    // Limpiar formulario de pasajero
    const passengerContainer = document.getElementById('passenger-forms');
    if (passengerContainer) {
        passengerContainer.innerHTML = '';
    }

    // Limpiar campos de pago
    document.getElementById('card-number').value = '';
    document.getElementById('expiry-date').value = '';
    document.getElementById('cvv').value = '';
    document.getElementById('card-holder').value = '';
}

function populateFlightData(flight) {
    document.getElementById('modal-flight-number').value = flight.id;
    document.getElementById('modal-passengers').value = '1'; // Default to 1 passenger

    showValidatedFlight(flight);
}

function getCityName(code) {
    const codeToCity = {
        'CCS': 'Caracas',
        'MAR': 'Maracaibo',
        'VLN': 'Valencia',
        'BRM': 'Barquisimeto',
        'PMV': 'Porlamar',
        'MUN': 'Maturín',
        'BLA': 'Barcelona',
        'PZO': 'Puerto Ordaz',
        'CBL': 'Ciudad Bolívar',
        'MRD': 'Mérida',
        'SVZ': 'San Antonio del Táchira',
        'CUM': 'Cumaná',
        'PBL': 'Puerto Cabello',
        'GUQ': 'Guanare',
        'TMO': 'Tumeremo'
    };
    return codeToCity[code] || code;
}

function showFlightSelection() {
    document.getElementById('flight-selection-section').style.display = 'block';
    document.getElementById('flight-validation-section').style.display = 'none';
    document.getElementById('passenger-details-section').style.display = 'none';
}

function showFlightValidation() {
    document.getElementById('flight-selection-section').style.display = 'none';
    document.getElementById('flight-validation-section').style.display = 'block';
    document.getElementById('passenger-details-section').style.display = 'none';
}

function showPassengerDetails() {
    document.getElementById('flight-selection-section').style.display = 'none';
    document.getElementById('flight-validation-section').style.display = 'none';
    document.getElementById('passenger-details-section').style.display = 'block';
}

function showPaymentSection() {
    document.getElementById('passenger-details-section').style.display = 'none';
    document.getElementById('payment-section').style.display = 'block';
}

function searchFlightsInModal() {
    const origin = document.getElementById('modal-origin').value.trim();
    const destination = document.getElementById('modal-destination').value.trim();
    const departureDate = document.getElementById('modal-departure-date').value;
    const passengers = document.getElementById('modal-passengers').value;

    if (!origin || !destination || !departureDate) {
        alert('Por favor, complete todos los campos obligatorios');
        return;
    }

    if (origin.toLowerCase() === destination.toLowerCase()) {
        alert('El origen y destino no pueden ser el mismo');
        return;
    }

    // Mostrar loading
    const resultsContainer = document.getElementById('flight-results');
    resultsContainer.innerHTML = '<p class="loading">Buscando vuelos...</p>';
    resultsContainer.style.display = 'block';

    // Simular búsqueda
    setTimeout(() => {
        displayFlightsInModal({
            origin,
            destination,
            departureDate,
            passengers
        });
    }, 1500);
}

function displayFlightsInModal(searchParams) {
    const resultsContainer = document.getElementById('flight-results');
    const matchingFlights = getMatchingFlights(searchParams);

    if (matchingFlights.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results">No se encontraron vuelos disponibles para esta ruta.</p>';
    } else {
        resultsContainer.innerHTML = matchingFlights.map(flight => createFlightCardForModal(flight)).join('');
    }
}

function createFlightCardForModal(flight) {
    return `
        <div class="flight-card-modal">
            <div class="flight-info">
                <div class="flight-route">
                    <span class="origin">${flight.origin}</span>
                    <i class="fas fa-plane"></i>
                    <span class="destination">${flight.destination}</span>
                </div>
                <div class="flight-details">
                    <p><strong>Vuelo:</strong> ${flight.id}</p>
                    <p><strong>Hora:</strong> ${flight.departureTime} - ${flight.arrivalTime}</p>
                    <p><strong>Aerolínea:</strong> ${flight.airline}</p>
                </div>
            </div>
            <div class="flight-status">
                <div class="price-info">
                    <span class="price">$${flight.price}</span>
                    <span class="price-label">por persona</span>
                </div>
                <button class="btn-secondary select-flight-modal" data-flight-id="${flight.id}">
                    Seleccionar
                </button>
            </div>
        </div>
    `;
}

function showSelectedFlight(flight) {
    const resultsContainer = document.getElementById('flight-results');
    resultsContainer.innerHTML = `
        <h4>Vuelo Seleccionado</h4>
        ${createFlightCardForModal(flight)}
    `;
    resultsContainer.style.display = 'block';
}

function validateFlightInModal() {
    const flightNumber = document.getElementById('modal-flight-number').value.trim();
    const passengerCount = parseInt(document.getElementById('validation-passengers').value) || 1;
    const validationMessage = document.getElementById('flight-validation-message');

    if (!flightNumber) {
        validationMessage.innerHTML = '<span style="color: red;">Por favor, ingrese un número de vuelo.</span>';
        validationMessage.style.display = 'block';
        return;
    }

    // Buscar el vuelo en la lista de vuelos predefinidos
    const flight = predefinedFlights.find(f => f.id === flightNumber);

    if (flight) {
        localStorage.setItem('selectedFlight', JSON.stringify(flight));
        localStorage.setItem('passengerCount', passengerCount); // Store passenger count
        validationMessage.innerHTML = '<span style="color: green;">Vuelo válido encontrado.</span>';
        validationMessage.style.display = 'block';
        showValidatedFlight(flight);
        generatePassengerForms(passengerCount);
        showPassengerDetails();
    } else {
        validationMessage.innerHTML = '<span style="color: red;">Número de vuelo no encontrado. Por favor, verifique e intente nuevamente.</span>';
        validationMessage.style.display = 'block';
    }
}

function showValidatedFlight(flight) {
    const resultsContainer = document.getElementById('flight-results');
    resultsContainer.innerHTML = `
        <h4>Vuelo Validado</h4>
        ${createFlightCardForModal(flight)}
    `;
    resultsContainer.style.display = 'block';
}

function selectFlightInModal(flightId) {
    const flight = predefinedFlights.find(f => f.id === flightId);
    if (flight) {
        localStorage.setItem('selectedFlight', JSON.stringify(flight));
        showSelectedFlight(flight);
        const passengerCount = parseInt(document.getElementById('modal-passengers').value) || 1;
        generatePassengerForms(passengerCount);
        showPassengerDetails();
    }
}

function generatePassengerForms(passengerCount) {
    const container = document.getElementById('passenger-forms');
    container.innerHTML = '';

    for (let i = 1; i <= passengerCount; i++) {
        const passengerDiv = document.createElement('div');
        passengerDiv.className = 'passenger-form';
        passengerDiv.innerHTML = `
            <h4>Pasajero ${i}</h4>
            <div class="form-row">
                <div class="form-group">
                    <label for="passenger-${i}-name">Nombre Completo *</label>
                    <input type="text" id="passenger-${i}-name" required>
                </div>
                <div class="form-group">
                    <label for="passenger-${i}-id">Cédula/Pasaporte *</label>
                    <input type="text" id="passenger-${i}-id" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="passenger-${i}-email">Correo Electrónico *</label>
                    <input type="email" id="passenger-${i}-email" required>
                </div>
                <div class="form-group">
                    <label for="passenger-${i}-phone">Teléfono *</label>
                    <input type="tel" id="passenger-${i}-phone" required>
                </div>
            </div>
        `;
        container.appendChild(passengerDiv);
    }

    // Add payment section after passenger forms
    const paymentDiv = document.createElement('div');
    paymentDiv.id = 'payment-section';
    paymentDiv.innerHTML = `
        <h4>Información de Pago</h4>
        <div class="form-row">
            <div class="form-group">
                <label for="card-number">Número de Tarjeta *</label>
                <input type="text" id="card-number" placeholder="1234 5678 9012 3456" required>
            </div>
            <div class="form-group">
                <label for="expiry-date">Fecha de Expiración *</label>
                <input type="text" id="expiry-date" placeholder="MM/YY" required>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="cvv">CVV *</label>
                <input type="text" id="cvv" placeholder="123" required>
            </div>
            <div class="form-group">
                <label for="card-holder">Nombre en la Tarjeta *</label>
                <input type="text" id="card-holder" required>
            </div>
        </div>
        <div class="form-actions">
            <button type="button" class="btn-secondary" id="back-to-passengers">Volver a Pasajeros</button>
            <button type="submit" class="btn-primary" id="confirm-reservation">
                <i class="fas fa-check"></i> Confirmar Reserva y Pagar
            </button>
        </div>
    `;
    container.appendChild(paymentDiv);
}

function processPaymentAndCreateReservation() {
    const selectedFlight = localStorage.getItem('selectedFlight');
    if (!selectedFlight) {
        alert('Por favor, valida un número de vuelo primero.');
        return;
    }

    const flight = JSON.parse(selectedFlight);
    // Get passenger count from localStorage if available (from validation), otherwise from modal-passengers
    const passengerCount = parseInt(localStorage.getItem('passengerCount')) || parseInt(document.getElementById('modal-passengers').value) || 1;

    // Validar datos de pasajeros
    const passengers = [];
    for (let i = 1; i <= passengerCount; i++) {
        const name = document.getElementById(`passenger-${i}-name`).value.trim();
        const id = document.getElementById(`passenger-${i}-id`).value.trim();
        const email = document.getElementById(`passenger-${i}-email`).value.trim();
        const phone = document.getElementById(`passenger-${i}-phone`).value.trim();

        if (!name || !id || !email || !phone) {
            alert(`Por favor, complete todos los campos para el pasajero ${i}.`);
            return;
        }

        passengers.push({ name, id, email, phone });
    }

    // Validar datos de pago
    const cardNumber = document.getElementById('card-number').value.trim();
    const expiryDate = document.getElementById('expiry-date').value.trim();
    const cvv = document.getElementById('cvv').value.trim();
    const cardHolder = document.getElementById('card-holder').value.trim();

    if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
        alert('Por favor, complete todos los campos de pago.');
        return;
    }

    // Simular procesamiento de pago
    alert('Procesando pago...');

    // Generar código de reserva
    const bookingCode = 'TN' + Date.now().toString().slice(-6);

    // Crear objeto de reserva
    const reservation = {
        code: bookingCode,
        flight: flight,
        passengers: passengers,
        payment: {
            cardNumber: cardNumber.slice(-4), // Solo guardar últimos 4 dígitos
            cardHolder: cardHolder,
            amount: flight.price * passengerCount
        },
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };

    // En una implementación real, esto enviaría los datos al backend
    alert(`¡Reserva creada exitosamente!\nCódigo de reserva: ${bookingCode}\n\nSe ha enviado un correo de confirmación.`);

    // Ocultar sección de reserva y recargar página
    hideCreateReservationSection();
    location.reload();
}

function logout() {
    // Limpiar datos de sesión
    localStorage.clear();
    sessionStorage.clear();

    // Redirigir a la página de login
    window.location.href = 'login.html';
}

function updateCreateButtonText() {
    const createReservationBtn = document.getElementById('create-reservation-btn');
    const createSection = document.getElementById('create-reservation-section');

    if (createReservationBtn && createSection) {
        if (createSection.classList.contains('active')) {
            createReservationBtn.textContent = 'Regresar';
        } else {
            createReservationBtn.textContent = 'Crear Nueva Reserva';
        }
    }
}




