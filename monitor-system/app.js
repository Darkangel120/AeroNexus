// Elementos DOM
const elements = {
    currentTime: document.getElementById('current-time'),
    lastUpdate: document.getElementById('last-update'),
    footerTime: document.getElementById('footer-time'),
    flightsList: document.getElementById('flights-list')
};

// Inicialización del sistema
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de Monitores Aeroportuarios AeroNexus - Inicializando...');
    initializeSystem();
});

// Inicializar el sistema
function initializeSystem() {
    // Iniciar actualización de tiempo
    startTimeUpdates();

    // Cargar datos de ejemplo
    loadMockData();

    console.log('Sistema inicializado correctamente');
}

// Actualización del tiempo
function startTimeUpdates() {
    updateTime();
    setInterval(updateTime, 1000); // Actualizar cada segundo
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    elements.currentTime.textContent = timeString;
    elements.footerTime.textContent = timeString;
}

// Mostrar vuelos
function displayFlights(flights) {
    if (!flights || flights.length === 0) {
        return;
    }

    const flightsHtml = flights.map(flight => createFlightHtml(flight)).join('');
    elements.flightsList.innerHTML = flightsHtml;
}

function createFlightHtml(flight) {
    const statusClass = getStatusClass(flight.estado);
    const statusText = getStatusText(flight.estado);
    const lastUpdate = formatLastUpdate(flight.ultimaActualizacion);

    return `
        <div class="flight-item ${statusClass}">
            <div class="flight-info">
                <div class="flight-number">${flight.numeroVuelo}</div>
                <div class="airline-dest">
                    <div class="airline">${flight.aerolinea}</div>
                    <div class="destination">${flight.destino || flight.origen || 'N/A'}</div>
                </div>
                <div class="time-gate">
                    <div class="time-label">Hora</div>
                    <div class="time-value">${flight.horaSalida || flight.horaLlegada || '--:--'}</div>
                </div>
                <div class="gate-info">
                    <div class="gate-label">Puerta</div>
                    <div class="gate-value">${flight.puertaEmbarque || 'N/A'}</div>
                </div>
            </div>
            <div class="flight-status">
                <div class="status-badge ${statusClass}">${statusText}</div>
                <div class="last-update">Actualizado: ${lastUpdate}</div>
            </div>
        </div>
    `;
}

function getStatusClass(status) {
    const statusMap = {
        'PROGRAMADO': 'status-programado',
        'EMBARQUE': 'status-embarque',
        'ULTIMA_LLAMADA': 'status-ultima-llamada',
        'CERRADO': 'status-cerrado',
        'RETRASADO': 'status-retrasado',
        'CANCELADO': 'status-cancelado'
    };
    return statusMap[status] || 'status-programado';
}

function getStatusText(status) {
    const statusMap = {
        'PROGRAMADO': 'Programado',
        'EMBARQUE': 'Embarque',
        'ULTIMA_LLAMADA': 'Última Llamada',
        'CERRADO': 'Cerrado',
        'RETRASADO': 'Retrasado',
        'CANCELADO': 'Cancelado'
    };
    return statusMap[status] || status;
}

function formatLastUpdate(timestamp) {
    if (!timestamp) return '--:--';

    try {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return '--:--';
    }
}

// Actualizar timestamp de última actualización
function updateLastUpdate() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
    elements.lastUpdate.textContent = `Última actualización: ${timeString}`;
}

// Datos de ejemplo
function loadMockData() {
    const mockFlights = [
        {
            numeroVuelo: 'AV801',
            aerolinea: 'Avianca',
            destino: 'Bogotá',
            horaSalida: '14:30',
            puertaEmbarque: 'A15',
            estado: 'EMBARQUE',
            ultimaActualizacion: new Date().toISOString()
        },
        {
            numeroVuelo: 'LA2456',
            aerolinea: 'LATAM',
            destino: 'Santiago',
            horaSalida: '15:45',
            puertaEmbarque: 'B08',
            estado: 'PROGRAMADO',
            ultimaActualizacion: new Date().toISOString()
        },
        {
            numeroVuelo: 'AA1234',
            aerolinea: 'American Airlines',
            destino: 'Miami',
            horaSalida: '16:20',
            puertaEmbarque: 'C12',
            estado: 'ULTIMA_LLAMADA',
            ultimaActualizacion: new Date().toISOString()
        }
    ];

    displayFlights(mockFlights);
    updateLastUpdate();

    // Ocultar loading y mostrar lista de vuelos
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('flights-list').classList.remove('hidden');
}
