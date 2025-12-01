// Script de Búsqueda de Vuelos para el Portal de Usuarios de AeroNexus

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar búsqueda de vuelos
    initializeFlightSearch();
});

function initializeFlightSearch() {
    // Cargar datos del usuario
    loadUserData();

    // Configurar escuchadores de eventos
    setupEventListeners();

    // Establecer fecha mínima para entradas de fecha
    setMinimumDates();
}



function setupEventListeners() {
    // Formulario de búsqueda de vuelos
    document.getElementById('flight-search-form').addEventListener('submit', function(e) {
        e.preventDefault();
        performFlightSearch();
    });

    // Funcionalidad de logout
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });

    // Enlaces de navegación
    document.querySelectorAll('.main-nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

function setMinimumDates() {
    const today = new Date().toISOString().split('T')[0];
    const departureDate = document.getElementById('departure-date');
    const returnDate = document.getElementById('return-date');

    departureDate.setAttribute('min', today);
    returnDate.setAttribute('min', today);

    // Actualizar mínimo de fecha de retorno cuando cambia la fecha de salida
    departureDate.addEventListener('change', function() {
        returnDate.setAttribute('min', this.value);
        if (returnDate.value && returnDate.value < this.value) {
            returnDate.value = this.value;
        }
    });
}

function performFlightSearch() {
    const origin = document.getElementById('origin').value.trim();
    const destination = document.getElementById('destination').value.trim();
    const departureDate = document.getElementById('departure-date').value;
    const returnDate = document.getElementById('return-date').value;
    const passengers = document.getElementById('passengers').value;
    const flightClass = document.getElementById('class').value;

    if (!origin || !destination || !departureDate) {
        alert('Por favor, complete todos los campos obligatorios');
        return;
    }

    if (origin.toLowerCase() === destination.toLowerCase()) {
        alert('El origen y destino no pueden ser el mismo');
        return;
    }

    // Mostrar estado de carga
    showLoading('search-results');

    // Simular retraso de llamada a API
    setTimeout(() => {
        displaySearchResults({
            origin,
            destination,
            departureDate,
            returnDate,
            passengers,
            flightClass
        });
    }, 1500);
}

function displaySearchResults(searchParams) {
    const resultsContainer = document.getElementById('search-results');
    const flightsContainer = resultsContainer.querySelector('.flights-container');

    // Datos de vuelo simulados
    const mockFlights = generateMockFlights(searchParams);

    flightsContainer.innerHTML = '';

    if (mockFlights.length === 0) {
        flightsContainer.innerHTML = '<p class="no-results">No se encontraron vuelos para los criterios de búsqueda especificados.</p>';
    } else {
        mockFlights.forEach(flight => {
            const flightCard = createFlightCard(flight);
            flightsContainer.appendChild(flightCard);
        });
    }

    resultsContainer.style.display = 'block';
    scrollToSection('search-results');
}

function generateMockFlights(searchParams) {
    // Generar datos de vuelo simulados basados en parámetros de búsqueda
    const flights = [];
    const numFlights = Math.floor(Math.random() * 5) + 3; // 3-7 vuelos

    for (let i = 0; i < numFlights; i++) {
        const departureTime = new Date(searchParams.departureDate);
        departureTime.setHours(6 + Math.floor(Math.random() * 14), Math.floor(Math.random() * 60)); // 6 AM a 8 PM

        const duration = 2 + Math.floor(Math.random() * 12); // 2-14 horas
        const arrivalTime = new Date(departureTime.getTime() + duration * 60 * 60 * 1000);

        const price = 150 + Math.floor(Math.random() * 850); // $150-$1000

        flights.push({
            id: `AN${100 + i}`,
            origin: searchParams.origin.toUpperCase(),
            destination: searchParams.destination.toUpperCase(),
            departureDate: searchParams.departureDate,
            departureTime: departureTime.toTimeString().substring(0, 5),
            arrivalTime: arrivalTime.toTimeString().substring(0, 5),
            duration: `${duration}h ${Math.floor(Math.random() * 60)}m`,
            price: price,
            airline: 'AeroNexus',
            stops: Math.random() > 0.7 ? 1 : 0,
            class: searchParams.flightClass
        });
    }

    return flights.sort((a, b) => a.price - b.price);
}

function createFlightCard(flight) {
    const card = document.createElement('div');
    card.className = 'flight-card';

    card.innerHTML = `
        <div class="flight-info">
            <div class="flight-route">
                <span class="origin">${flight.origin}</span>
                <i class="fas fa-plane"></i>
                <span class="destination">${flight.destination}</span>
            </div>
            <div class="flight-details">
                <p><strong>Vuelo:</strong> ${flight.id}</p>
                <p><strong>Hora:</strong> ${flight.departureTime} - ${flight.arrivalTime}</p>
                <p><strong>Duración:</strong> ${flight.duration}</p>
                <p><strong>Aerolínea:</strong> ${flight.airline}</p>
                ${flight.stops > 0 ? `<p><strong>Escalas:</strong> ${flight.stops}</p>` : '<p><strong>Directo</strong></p>'}
            </div>
        </div>
        <div class="flight-status">
            <div class="price-info">
                <span class="price">$${flight.price}</span>
                <span class="price-label">por persona</span>
            </div>
            <button class="btn-secondary select-flight" data-flight-id="${flight.id}">
                Seleccionar
            </button>
        </div>
    `;

    // Agregar escuchador de eventos para selección de vuelo
    card.querySelector('.select-flight').addEventListener('click', function() {
        selectFlight(flight);
    });

    return card;
}

function selectFlight(flight) {
    // Almacenar vuelo seleccionado en localStorage o sesión
    localStorage.setItem('selectedFlight', JSON.stringify(flight));

    // Redirigir a página de reservas o mostrar modal de reservas
    alert(`Vuelo ${flight.id} seleccionado. Redirigiendo a la página de reservas...`);
    window.location.href = 'bookings.html';
}


