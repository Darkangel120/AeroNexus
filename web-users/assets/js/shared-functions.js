// Script de Funciones Compartidas para AeroNexus

class NotificationManager {
    constructor() {
        this.notifications = [];
        this.loadNotifications();
        this.setupEventListeners();
        this.renderNotifications();
    }

    loadNotifications() {
        const stored = localStorage.getItem('aeroNexusNotifications');
        if (stored) {
            this.notifications = JSON.parse(stored);
        } else {
            // Notificaciones por defecto
            this.notifications = [
                {
                    id: 1,
                    type: 'flight',
                    title: 'Actualización de Vuelo',
                    message: 'Tu vuelo AN123 ha sido confirmado.',
                    timestamp: new Date().toISOString(),
                    read: false,
                    icon: 'fas fa-plane'
                },
                {
                    id: 2,
                    type: 'booking',
                    title: 'Recordatorio de Reserva',
                    message: 'Tu vuelo sale en 24 horas.',
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    read: false,
                    icon: 'fas fa-calendar-check'
                }
            ];
            this.saveNotifications();
        }
    }

    saveNotifications() {
        localStorage.setItem('aeroNexusNotifications', JSON.stringify(this.notifications));
    }

    addNotification(type, title, message) {
        const notification = {
            id: Date.now(),
            type,
            title,
            message,
            timestamp: new Date().toISOString(),
            read: false,
            icon: this.getIconForType(type)
        };

        this.notifications.unshift(notification);
        this.saveNotifications();
        this.renderNotifications();
        this.showToast(notification);
    }

    getIconForType(type) {
        const icons = {
            flight: 'fas fa-plane',
            booking: 'fas fa-calendar-check',
            checkin: 'fas fa-qrcode',
            general: 'fas fa-info-circle'
        };
        return icons[type] || icons.general;
    }

    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification && !notification.read) {
            notification.read = true;
            this.saveNotifications();
            this.renderNotifications();
        }
    }

    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    setupEventListeners() {
        const notificationIcon = document.getElementById('notification-icon');
        const notificationDropdown = document.getElementById('notification-dropdown');

        if (notificationIcon && notificationDropdown) {
            notificationIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                notificationDropdown.classList.toggle('show');
            });

            document.addEventListener('click', (e) => {
                if (!notificationDropdown.contains(e.target) && !notificationIcon.contains(e.target)) {
                    notificationDropdown.classList.remove('show');
                }
            });

            notificationDropdown.addEventListener('click', (e) => {
                if (e.target.classList.contains('notification-item')) {
                    const id = parseInt(e.target.dataset.id);
                    this.markAsRead(id);
                }
            });
        }
    }

    renderNotifications() {
        const dropdown = document.getElementById('notification-dropdown');
        const countElement = document.getElementById('notification-count');

        if (!dropdown || !countElement) return;

        const unreadCount = this.getUnreadCount();
        countElement.textContent = unreadCount;
        countElement.style.display = unreadCount > 0 ? 'block' : 'none';

        dropdown.innerHTML = '';

        if (this.notifications.length === 0) {
            dropdown.innerHTML = '<div class="no-notifications">No tienes notificaciones</div>';
            return;
        }

        this.notifications.forEach(notification => {
            const item = document.createElement('div');
            item.className = `notification-item ${notification.read ? '' : 'unread'}`;
            item.dataset.id = notification.id;

            const timeAgo = this.getTimeAgo(notification.timestamp);

            item.innerHTML = `
                <div class="notification-icon">
                    <i class="${notification.icon}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${timeAgo}</div>
                </div>
                ${!notification.read ? '<div class="notification-dot"></div>' : ''}
            `;

            dropdown.appendChild(item);
        });
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Ahora';
        if (minutes < 60) return `Hace ${minutes} minutos`;
        if (hours < 24) return `Hace ${hours} horas`;
        return `Hace ${days} días`;
    }

    showToast(notification) {
        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${notification.icon}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${notification.title}</div>
                <div class="toast-message">${notification.message}</div>
            </div>
            <button class="toast-close">&times;</button>
        `;

        document.body.appendChild(toast);

        // Mostrar toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);

        // Cerrar manualmente
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        });
    }
}

class CheckInManager {
    constructor() {
        this.currentStep = 1;
        this.bookingData = null;
        this.selectedSeat = null;
        this.initializeCheckIn();
    }

    initializeCheckIn() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.updateUI();
    }

    loadFromStorage() {
        const checkInBooking = localStorage.getItem('checkInBooking');
        if (checkInBooking) {
            document.getElementById('booking-code').value = checkInBooking;
            localStorage.removeItem('checkInBooking');
        }

        const savedStep = localStorage.getItem('checkInStep');
        if (savedStep) {
            this.currentStep = parseInt(savedStep);
        }

        const savedBooking = localStorage.getItem('checkInBookingData');
        if (savedBooking) {
            this.bookingData = JSON.parse(savedBooking);
        }

        const savedSeat = localStorage.getItem('selectedSeat');
        if (savedSeat) {
            this.selectedSeat = savedSeat;
        }
    }

    saveToStorage() {
        localStorage.setItem('checkInStep', this.currentStep);
        if (this.bookingData) {
            localStorage.setItem('checkInBookingData', JSON.stringify(this.bookingData));
        }
        if (this.selectedSeat) {
            localStorage.setItem('selectedSeat', this.selectedSeat);
        }
    }

    setupEventListeners() {
        // Formulario de búsqueda de reserva
        const bookingForm = document.getElementById('booking-search-form');
        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.searchBooking();
            });
        }

        // Botón para iniciar check-in
        const startCheckInBtn = document.getElementById('start-checkin-btn');
        if (startCheckInBtn) {
            startCheckInBtn.addEventListener('click', () => this.startCheckIn());
        }

        // Selección de asiento
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('seat') && e.target.classList.contains('available')) {
                this.selectSeat(e.target);
            }
        });

        // Botones de navegación
        const nextStep1 = document.getElementById('next-step-1');
        if (nextStep1) {
            nextStep1.addEventListener('click', () => this.nextStep(1));
        }

        const nextStep2 = document.getElementById('next-step-2');
        if (nextStep2) {
            nextStep2.addEventListener('click', () => this.nextStep(2));
        }

        // Confirmar check-in
        const confirmBtn = document.getElementById('confirm-checkin-btn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.confirmCheckIn());
        }

        // Descargar pase de abordar
        const downloadBtn = document.getElementById('download-pass');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadBoardingPass());
        }

        // Volver al dashboard
        const backBtn = document.getElementById('back-to-dashboard');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.backToDashboard());
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
        const bookingCode = document.getElementById('booking-code').value.trim().toUpperCase();
        const lastName = document.getElementById('last-name').value.trim();

        if (!bookingCode || !lastName) {
            alert('Por favor, complete todos los campos');
            return;
        }

        // Mostrar carga
        this.showLoading('checkin-details');

        // Simular llamada a API
        setTimeout(() => {
            // Datos de reserva simulados
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
            this.saveToStorage();
        }, 1000);
    }

    displayBookingDetails() {
        if (!this.bookingData) return;

        // Actualizar detalles del vuelo
        const elements = {
            'flight-origin': this.bookingData.origin,
            'flight-destination': this.bookingData.destination,
            'flight-number': this.bookingData.flight,
            'flight-date': this.bookingData.date,
            'flight-time': this.bookingData.time,
            'passenger-count': this.bookingData.passengers
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });

        // Mostrar sección de detalles
        document.getElementById('checkin-selection').style.display = 'none';
        document.getElementById('checkin-details').style.display = 'block';
    }

    startCheckIn() {
        document.getElementById('checkin-details').style.display = 'none';
        document.getElementById('checkin-process').style.display = 'block';
        this.currentStep = 2;
        this.saveToStorage();
        this.updateUI();
    }

    selectSeat(seatElement) {
        // Remover selección anterior
        document.querySelectorAll('.seat.selected').forEach(seat => {
            seat.classList.remove('selected');
            seat.classList.add('available');
        });

        // Seleccionar nuevo asiento
        seatElement.classList.remove('available');
        seatElement.classList.add('selected');

        // Almacenar asiento seleccionado
        this.selectedSeat = seatElement.dataset.seat;
        localStorage.setItem('selectedSeat', this.selectedSeat);

        // Actualizar información del pasajero
        const selectedSeatElement = document.getElementById('selected-seat');
        if (selectedSeatElement) {
            selectedSeatElement.textContent = this.selectedSeat;
        }

        // Habilitar botón continuar
        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) {
            continueBtn.disabled = false;
        }
    }

    nextStep(step) {
        if (step === 1) {
            // Validar selección de asiento
            if (!this.selectedSeat) {
                alert('Por favor, selecciona un asiento');
                return;
            }

            this.currentStep = 3;
            this.showStep(3);
        } else if (step === 2) {
            // Validar aceptación de términos
            const termsCheck = document.getElementById('terms-check');
            if (termsCheck && !termsCheck.checked) {
                alert('Por favor, acepta los términos y condiciones');
                return;
            }

            this.confirmCheckIn();
        }

        this.saveToStorage();
        this.updateUI();
    }

    showStep(stepNumber) {
        document.querySelectorAll('.checkin-step').forEach(step => {
            step.style.display = 'none';
        });

        const stepElement = document.getElementById(`step-${stepNumber}`);
        if (stepElement) {
            stepElement.style.display = 'block';
        }
    }

    confirmCheckIn() {
        this.currentStep = 4;
        this.showStep(4);

        // Generar datos de tarjeta de embarque
        const gate = 'A' + Math.floor(Math.random() * 20) + 1;

        // Actualizar tarjeta de embarque
        const updates = {
            'bp-passenger': this.bookingData.passenger,
            'bp-flight': this.bookingData.flight,
            'bp-date': this.bookingData.date,
            'bp-time': this.bookingData.time,
            'bp-origin': this.bookingData.origin,
            'bp-destination': this.bookingData.destination,
            'bp-seat': this.selectedSeat,
            'bp-gate': gate,
            'boarding-seat': this.selectedSeat
        };

        Object.entries(updates).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });

        // Notificar al usuario
        if (window.notificationManager) {
            window.notificationManager.addNotification(
                'checkin',
                'Check-in Completado',
                `Tu check-in para el vuelo ${this.bookingData.flight} ha sido completado exitosamente.`
            );
        }

        this.saveToStorage();
    }

    downloadBoardingPass() {
        alert('Descargando tarjeta de embarque...');
        // En una implementación real, esto generaría un PDF
    }

    backToDashboard() {
        window.location.href = 'dashboard.html';
    }

    logout() {
        // Limpiar datos del usuario
        localStorage.removeItem('userName');
        localStorage.removeItem('userToken');
        localStorage.removeItem('selectedFlight');
        localStorage.removeItem('checkInBooking');
        localStorage.removeItem('checkInStep');
        localStorage.removeItem('checkInBookingData');
        localStorage.removeItem('selectedSeat');

        // Redirigir a la página de login
        window.location.href = 'login.html';
    }

    updateUI() {
        // Actualizar indicadores de paso
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });

        const activeStep = document.querySelector(`.step[data-step="${this.currentStep}"]`);
        if (activeStep) {
            activeStep.classList.add('active');
        }

        // Mostrar paso actual
        this.showStep(this.currentStep);

        // Actualizar nombre de usuario
        const userName = localStorage.getItem('userName') || 'Usuario';
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = userName;
        }
    }

    showLoading(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = '<div class="loading">Buscando reserva...</div>';
            element.style.display = 'block';
        }
    }
}

// Función global para iniciar check-in desde otras páginas
function startCheckIn(bookingCode) {
    localStorage.setItem('checkInBooking', bookingCode);
    window.location.href = 'checkin.html';
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar administrador de notificaciones
    window.notificationManager = new NotificationManager();

    // Inicializar administrador de check-in si estamos en la página de check-in
    if (document.getElementById('checkin')) {
        window.checkInManager = new CheckInManager();
    }

    // Cargar datos del usuario
    const userName = localStorage.getItem('userName') || 'Usuario';
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = userName;
    }

    const userGreeting = document.getElementById('user-greeting');
    if (userGreeting) {
        userGreeting.textContent = userName;
    }
});

// Estilos CSS para notificaciones
const notificationStyles = `
    .notifications {
        position: relative;
    }

    .notification-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #dc3545;
        color: white;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        font-size: 11px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }

    .notification-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        width: 350px;
        max-height: 400px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
    }

    .notification-dropdown.show {
        display: block;
    }

    .notification-item {
        padding: 12px 16px;
        border-bottom: 1px solid #f8f9fa;
        cursor: pointer;
        transition: background-color 0.2s;
        display: flex;
        align-items: flex-start;
        gap: 12px;
    }

    .notification-item:hover {
        background-color: #f8f9fa;
    }

    .notification-item.unread {
        background-color: #fff3cd;
    }

    .notification-icon {
        color: var(--primary-blue);
        font-size: 16px;
        margin-top: 2px;
    }

    .notification-content {
        flex: 1;
    }

    .notification-title {
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
    }

    .notification-message {
        color: #666;
        font-size: 14px;
        margin-bottom: 4px;
    }

    .notification-time {
        color: #999;
        font-size: 12px;
    }

    .notification-dot {
        width: 8px;
        height: 8px;
        background: var(--primary-blue);
        border-radius: 50%;
        margin-top: 6px;
    }

    .no-notifications {
        padding: 20px;
        text-align: center;
        color: #666;
        font-style: italic;
    }

    .notification-toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        padding: 16px;
        max-width: 350px;
        z-index: 1001;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
        display: flex;
        align-items: flex-start;
        gap: 12px;
    }

    .notification-toast.show {
        transform: translateX(0);
        opacity: 1;
    }

    .toast-icon {
        color: var(--primary-blue);
        font-size: 20px;
        margin-top: 2px;
    }

    .toast-content {
        flex: 1;
    }

    .toast-title {
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
    }

    .toast-message {
        color: #666;
        font-size: 14px;
    }

    .toast-close {
        background: none;
        border: none;
        font-size: 20px;
        color: #999;
        cursor: pointer;
        padding: 0;
        margin-left: 8px;
    }

    .toast-close:hover {
        color: #333;
    }

    @media (max-width: 768px) {
        .notification-dropdown {
            width: 300px;
            right: -10px;
        }

        .notification-toast {
            left: 10px;
            right: 10px;
            max-width: none;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
