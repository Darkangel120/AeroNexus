// Script de Búsqueda de Vuelos para el Portal de Usuarios de TravelNexus

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

    // Filtrar vuelos predefinidos basados en parámetros de búsqueda
    const matchingFlights = getMatchingFlights(searchParams);

    flightsContainer.innerHTML = '';

    if (matchingFlights.length === 0) {
        flightsContainer.innerHTML = '<p class="no-results">No se encontraron vuelos para los criterios de búsqueda especificados.</p>';
    } else {
        matchingFlights.forEach(flight => {
            const flightCard = createFlightCard(flight);
            flightsContainer.appendChild(flightCard);
        });
    }

    resultsContainer.style.display = 'block';
    scrollToSection('search-results');
}

// Vuelos predefinidos venezolanos
const predefinedFlights = [
    {
        id: 'CO101',
        origin: 'CCS',
        destination: 'MAR',
        departureDate: '2024-12-15',
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
        departureDate: '2024-12-15',
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
        departureDate: '2024-12-15',
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
        departureDate: '2024-12-15',
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
        departureDate: '2024-12-15',
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
        departureDate: '2024-12-15',
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
        departureDate: '2024-12-15',
        departureTime: '11:00',
        arrivalTime: '12:30',
        duration: '1h 30m',
        price: 95,
        airline: 'Venezolana',
        stops: 0,
        class: 'economy'
    }
];

function getMatchingFlights(searchParams) {
    // Filtrar vuelos que coincidan con origen, destino y fecha
    const originCode = getAirportCode(searchParams.origin);
    const destinationCode = getAirportCode(searchParams.destination);

    return predefinedFlights.filter(flight => {
        return flight.origin === originCode &&
               flight.destination === destinationCode &&
               flight.departureDate === searchParams.departureDate;
    }).sort((a, b) => a.price - b.price);
}

function getAirportCode(cityName) {
    // Mapa de ciudades a códigos IATA venezolanos
    const cityToCode = {
        'caracas': 'CCS',
        'maracaibo': 'MAR',
        'valencia': 'VLN',
        'barquisimeto': 'BRM',
        'puerto ordaz': 'PZO',
        'ciudad bolívar': 'CBL',
        'mérida': 'MRD',
        'san antonio del táchira': 'SVZ',
        'barcelona': 'BLA',
        'maturín': 'MUN',
        'cumaná': 'CUM',
        'porlamar': 'PMV',
        'puerto cabello': 'PBL',
        'guanare': 'GUQ',
        'tumeremo': 'TMO'
    };

    const normalizedCity = cityName.toLowerCase().trim();
    return cityToCode[normalizedCity] || cityName.toUpperCase();
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


