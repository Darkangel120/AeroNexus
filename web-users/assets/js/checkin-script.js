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
        const codeInput = document.getElementById('booking-code');
        if (codeInput) codeInput.value = checkInBooking;
        localStorage.removeItem('checkInBooking');
    }
}

function loadUserData() {
    // Marcador de posición para cargar datos del usuario desde el backend
    const userName = localStorage.getItem('userName') || 'Usuario';
    const userNameEl = document.getElementById('user-name');
    if (userNameEl) userNameEl.textContent = userName;

    const userGreeting = document.getElementById('user-greeting');
    if (userGreeting) userGreeting.textContent = userName;
}

function setupEventListeners() {
    // Formulario de búsqueda de reserva
    const bookingSearchForm = document.getElementById('booking-search-form');
    if (bookingSearchForm) {
        bookingSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            searchBooking();
        });
    }

    // Selección de asiento (delegación)
    document.addEventListener('click', function(e) {
        if (e.target.classList && e.target.classList.contains('seat') && e.target.classList.contains('available')) {
            selectSeat(e.target);
        }
    });

    // Botón continuar en selección de asiento
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            // Validar selección de asiento
            const selectedSeat = document.querySelector('.seat.selected');
            if (!selectedSeat) {
                alert('Por favor, selecciona un asiento');
                return;
            }
            // Pasar a confirmación (step 4)
            // Actualizar asiento confirmado en la vista de confirmación
            const seatNumber = selectedSeat.dataset.seat || 'Ninguno';
            const confirmedSeatEl = document.getElementById('confirmed-seat');
            if (confirmedSeatEl) confirmedSeatEl.textContent = seatNumber;

            showStep(4);
            updateStepIndicator(4);
            updateStepTitles(4);
        });
    }

    // Checkbox de términos
    const termsCheckbox = document.getElementById('terms-checkbox');
    if (termsCheckbox) {
        termsCheckbox.addEventListener('change', function() {
            const confirmBtn = document.getElementById('confirm-checkin-btn');
            if (confirmBtn) {
                confirmBtn.disabled = !this.checked;
            }
        });
    }

    // Botón confirmar check-in
    const confirmCheckinBtn = document.getElementById('confirm-checkin-btn');
    if (confirmCheckinBtn) {
        confirmCheckinBtn.addEventListener('click', function() {
            completeCheckIn();
        });
    }

    // Funcionalidad de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

function searchBooking() {
    const bookingCodeInput = document.getElementById('booking-code');
    const lastNameInput = document.getElementById('last-name');

    const bookingCode = bookingCodeInput ? bookingCodeInput.value.trim().toUpperCase() : '';
    const lastName = lastNameInput ? lastNameInput.value.trim() : '';

    if (!bookingCode || !lastName) {
        alert('Por favor, complete todos los campos');
        return;
    }

    // Mostrar loader opcional
    showLoading('step-1');

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
    }, 800);
}

function displayBookingDetails(booking) {
    // Ocultar paso 1 y mostrar paso 2
    showStep(2);

    // Actualizar indicador de pasos y títulos
    updateStepIndicator(2);
    updateStepTitles(2);

    // Rellenar datos de vuelo en el paso 2 (si existen elementos)
    const step2 = document.getElementById('step-2');
    if (step2) {
        // Aquí puedes mapear booking a elementos del DOM si tuvieran ids específicos.
        // Ejemplo: actualizar texto de vuelo/fecha/hora si estuvieran en elementos con ids.
    }
}

// Permite iniciar check-in desde otra página (bookings)
window.startCheckIn = function(bookingCode) {
    if (!bookingCode) return;
    localStorage.setItem('checkInBooking', bookingCode);
    // Redirigir a la página de check-in (ruta relativa desde modules)
    window.location.href = 'checkin.html';
};

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
    const selectedSeatEl = document.getElementById('selected-seat');
    if (selectedSeatEl) selectedSeatEl.textContent = seatNumber;

    // Habilitar botón continuar
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) continueBtn.disabled = false;
}

function updateStepIndicator(activeStep) {
    // Limpiar todas
    for (let i = 1; i <= 4; i++) {
        const el = document.getElementById(`step-${i}-indicator`);
        if (el) el.classList.remove('active');
    }
    const activeEl = document.getElementById(`step-${activeStep}-indicator`);
    if (activeEl) activeEl.classList.add('active');
}

function updateStepTitles(activeStep) {
    const titleSpans = document.querySelectorAll('.step-titles span');
    if (!titleSpans || titleSpans.length === 0) return;
    titleSpans.forEach((s, idx) => {
        s.classList.toggle('active', (idx + 1) === activeStep);
    });
}

function showStep(stepNumber) {
    // Oculta todas las secciones de checkin
    document.querySelectorAll('.checkin-step').forEach(sec => {
        sec.style.display = 'none';
    });

    const target = document.getElementById(`step-${stepNumber}`);
    if (target) {
        target.style.display = 'block';
    }

    // Actualizar indicador y títulos para reflejar el paso activo
    if (typeof updateStepIndicator === 'function') updateStepIndicator(stepNumber);
    if (typeof updateStepTitles === 'function') updateStepTitles(stepNumber);

    // Si existe el manager, sincronizar su estado
    if (window.checkInManager) {
        window.checkInManager.currentStep = stepNumber;
        if (typeof window.checkInManager.updateStepIndicators === 'function') {
            window.checkInManager.updateStepIndicators();
        }
        if (typeof window.checkInManager.saveToStorage === 'function') {
            window.checkInManager.saveToStorage();
        }
    }
}

function completeCheckIn() {
    // Obtener asiento confirmado
    const selectedSeat = localStorage.getItem('selectedSeat') || 'Ninguno';

    // Ocultar paso 4 y mostrar paso 5
    showStep(5);

    // Actualizar indicadores: quitar active de todos y dejar el último visible
    for (let i = 1; i <= 4; i++) {
        const ind = document.getElementById(`step-${i}-indicator`);
        if (ind) ind.classList.remove('active');
    }

    // Actualizar títulos de pasos (marcar como completado: quitar todos los active)
    updateStepTitles(0);

    // Actualizar tarjeta de embarque
    const boardingSeatEl = document.getElementById('boarding-seat');
    if (boardingSeatEl) boardingSeatEl.textContent = selectedSeat;

    // También actualizar elemento confirmado-seat si existe
    const confirmedSeatEl = document.getElementById('confirmed-seat');
    if (confirmedSeatEl) confirmedSeatEl.textContent = selectedSeat;

    // Limpiar datos almacenados
    localStorage.removeItem('selectedSeat');
}

function downloadBoardingPass() {
    // En una implementación real, esto generaría un PDF o imagen
    alert('Descargando tarjeta de embarque...');
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
        // Si está en step-1, se puede mostrar un loader dentro del step
        // Buscamos un contenedor dentro del elemento para mostrar mensaje
        const loader = element.querySelector('.loading') || document.createElement('div');
        loader.className = 'loading';
        loader.textContent = 'Buscando reserva...';
        if (!element.contains(loader)) element.appendChild(loader);
        element.style.display = 'block';
    }
}

/*
  CheckInManager: funciones de check-in centralizadas.
  - Maneja búsqueda de reserva, mostrar pasos, selección de asiento,
    confirmación y notificaciones (si window.notificationManager existe).
*/
class CheckInManager {
    constructor() {
        this.currentStep = 1;
        this.bookingData = null;
        this.selectedSeat = null;
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.updateUI();
    }

    loadFromStorage() {
        const checkInBooking = localStorage.getItem('checkInBooking');
        if (checkInBooking) {
            const codeInput = document.getElementById('booking-code');
            if (codeInput) codeInput.value = checkInBooking;
            localStorage.removeItem('checkInBooking');
        }

        const savedStep = localStorage.getItem('checkInStep');
        if (savedStep) this.currentStep = parseInt(savedStep, 10);

        const savedBooking = localStorage.getItem('checkInBookingData');
        if (savedBooking) this.bookingData = JSON.parse(savedBooking);

        const savedSeat = localStorage.getItem('selectedSeat');
        if (savedSeat) this.selectedSeat = savedSeat;
    }

    saveToStorage() {
        localStorage.setItem('checkInStep', this.currentStep);
        if (this.bookingData) localStorage.setItem('checkInBookingData', JSON.stringify(this.bookingData));
        if (this.selectedSeat) localStorage.setItem('selectedSeat', this.selectedSeat);
    }

    setupEventListeners() {
        // Búsqueda de reserva
        const bookingForm = document.getElementById('booking-search-form');
        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.searchBooking();
            });
        }

        // Delegación de selección de asiento
        document.addEventListener('click', (e) => {
            const target = e.target.closest && e.target.closest('.seat');
            if (target && target.classList.contains('available')) {
                this.selectSeat(target);
            }
        });

        // Botón continuar (desde selección de asiento)
        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                if (!this.selectedSeat) {
                    alert('Por favor, selecciona un asiento');
                    return;
                }
                // mostrar confirmación (step-4)
                this.currentStep = 4;
                this.showStep(4);
                this.updateStepIndicators();
                this.fillConfirmation();
                this.saveToStorage();
            });
        }

        // Checkbox de términos (habilita confirmar)
        const termsCheckbox = document.getElementById('terms-checkbox') || document.getElementById('terms-check');
        if (termsCheckbox) {
            termsCheckbox.addEventListener('change', (e) => {
                const confirmBtn = document.getElementById('confirm-checkin-btn');
                if (confirmBtn) confirmBtn.disabled = !e.target.checked;
            });
        }

        // Confirmar check-in
        const confirmBtn = document.getElementById('confirm-checkin-btn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.confirmCheckIn());
        }

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    searchBooking() {
        const bookingCodeInput = document.getElementById('booking-code');
        const lastNameInput = document.getElementById('last-name');

        const bookingCode = bookingCodeInput ? bookingCodeInput.value.trim().toUpperCase() : '';
        const lastName = lastNameInput ? lastNameInput.value.trim() : '';

        if (!bookingCode || !lastName) {
            alert('Por favor, complete todos los campos');
            return;
        }

        this.showLoading('step-1');

        // Simular API
        setTimeout(() => {
            this.bookingData = {
                code: bookingCode,
                passenger: `${lastName}, Juan`,
                flight: 'AN123',
                origin: 'MEX',
                destination: 'CDG',
                date: '15 Dic 2024',
                time: '14:30',
                passengers: 1
            };

            this.displayBookingDetails();
            this.currentStep = 2;
            this.saveToStorage();
            this.updateUI();
        }, 800);
    }

    displayBookingDetails() {
        // Mostrar step 2 con los datos (si existen elementos en DOM)
        this.showStep(2);
        this.updateStepIndicators();

        const map = {
            'flight-origin': this.bookingData.origin,
            'flight-destination': this.bookingData.destination,
            'flight-number': this.bookingData.flight,
            'flight-date': this.bookingData.date,
            'flight-time': this.bookingData.time,
            'passenger-count': this.bookingData.passengers
        };

        Object.entries(map).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        });

        // Habilitar acción para iniciar selección de asientos si existe botón
        const startBtn = document.getElementById('start-checkin-btn') || document.getElementById('select-seat-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.currentStep = 3;
                this.showStep(3);
                this.updateStepIndicators();
                this.saveToStorage();
            });
        } else {
            // Si no hay botón, avanzar automáticamente a selección de asiento
            this.currentStep = 3;
            this.showStep(3);
            this.updateStepIndicators();
        }
    }

    selectSeat(seatElement) {
        // Quitar selección anterior
        document.querySelectorAll('.seat.selected').forEach(s => {
            s.classList.remove('selected');
            s.classList.add('available');
        });

        seatElement.classList.remove('available');
        seatElement.classList.add('selected');

        this.selectedSeat = seatElement.dataset.seat || seatElement.getAttribute('data-seat') || 'N/A';
        localStorage.setItem('selectedSeat', this.selectedSeat);

        const selectedSeatEl = document.getElementById('selected-seat');
        if (selectedSeatEl) selectedSeatEl.textContent = this.selectedSeat;

        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) continueBtn.disabled = false;
    }

    fillConfirmation() {
        // Rellenar datos de confirmación/boarding pass si existen IDs
        const updates = {
            'confirmed-seat': this.selectedSeat,
            'boarding-seat': this.selectedSeat,
            'bp-seat': this.selectedSeat,
            'bp-flight': this.bookingData ? this.bookingData.flight : '',
            'bp-passenger': this.bookingData ? this.bookingData.passenger : ''
        };

        Object.entries(updates).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        });
    }

    confirmCheckIn() {
        // Validaciones básicas
        if (!this.bookingData) {
            alert('No hay datos de reserva. Realiza la búsqueda primero.');
            return;
        }

        this.currentStep = 5;
        this.showStep(5);
        this.updateStepIndicators();

        // Generar gate aleatorio simple
        const gate = 'A' + (Math.floor(Math.random() * 20) + 1);
        const bpUpdates = {
            'bp-gate': gate,
            'bp-seat': this.selectedSeat || 'N/A',
            'boarding-seat': this.selectedSeat || 'N/A'
        };

        Object.entries(bpUpdates).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        });

        // Notificación si el NotificationManager está disponible
        if (window.notificationManager && typeof window.notificationManager.addNotification === 'function') {
            window.notificationManager.addNotification(
                'checkin',
                `Check-in completado para ${this.bookingData.passenger}. Vuelo: ${this.bookingData.flight}`,
                'success'
            );
        }

        // Limpiar datos sensibles
        this.bookingData = null;
        localStorage.removeItem('checkInBookingData');
    }

    logout() {
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
    showLoading(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            // Si está en step-1, se puede mostrar un loader dentro del step
            // Buscamos un contenedor dentro del elemento para mostrar mensaje
            const loader = element.querySelector('.loading') || document.createElement('div');
            loader.className = 'loading';
            loader.textContent = 'Buscando reserva...';
            if (!element.contains(loader)) element.appendChild(loader);
            element.style.display = 'block';
        }
    }

    updateStepIndicators() {
        // Limpiar todos los indicadores
        for (let i = 1; i <= 4; i++) {
            const el = document.getElementById(`step-${i}-indicator`);
            if (el) el.classList.remove('active');
        }

        // Activar solo el indicador actual
        const activeEl = document.getElementById(`step-${this.currentStep}-indicator`);
        if (activeEl) activeEl.classList.add('active');
    }

    updateUI() {
        // Mostrar el paso actual
        this.showStep(this.currentStep);

        // Actualizar indicadores de paso
        this.updateStepIndicators();

        // Rellenar datos si es necesario (ej. paso 2 y 4)
        if (this.currentStep === 2 && this.bookingData) {
            this.fillConfirmation();
        }
    }

    showStep(stepNumber) {
        // Oculta todas las secciones de checkin
        document.querySelectorAll('.checkin-step').forEach(sec => {
            sec.style.display = 'none';
        });

        const target = document.getElementById(`step-${stepNumber}`);
        if (target) {
            target.style.display = 'block';
        }

        // Actualizar indicador y títulos para reflejar el paso activo
        if (typeof updateStepIndicator === 'function') updateStepIndicator(stepNumber);
        if (typeof updateStepTitles === 'function') updateStepTitles(stepNumber);

        // Si existe el manager, sincronizar su estado
        if (window.checkInManager) {
            window.checkInManager.currentStep = stepNumber;
            if (typeof window.checkInManager.updateStepIndicators === 'function') {
                window.checkInManager.updateStepIndicators();
            }
            if (typeof window.checkInManager.saveToStorage === 'function') {
                window.checkInManager.saveToStorage();
            }
        }
    }
}

// Al final del archivo: inicializar CheckInManager si estamos en la página de check-in
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('checkin') && !window.checkInManager) {
        window.checkInManager = new CheckInManager();
    }
});
