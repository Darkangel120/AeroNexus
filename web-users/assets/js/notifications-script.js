// Script de Notificaciones para AeroNexus

document.addEventListener('DOMContentLoaded', function() {
    initializeNotifications();
});

function initializeNotifications() {
    // Cargar notificaciones desde localStorage o API simulada
    loadNotifications();

    // Configurar escuchadores de eventos
    setupNotificationListeners();
}

function loadNotifications() {
    // Simular notificaciones (en producción, esto vendría de una API)
    const mockNotifications = [
        {
            id: 1,
            type: 'flight_update',
            title: 'Actualización de Vuelo',
            message: 'Tu vuelo AN123 ha sido retrasado 30 minutos.',
            timestamp: new Date(Date.now() - 3600000), // 1 hora atrás
            read: false
        },
        {
            id: 2,
            type: 'booking_confirmation',
            title: 'Confirmación de Reserva',
            message: 'Tu reserva para el vuelo AN456 ha sido confirmada.',
            timestamp: new Date(Date.now() - 7200000), // 2 horas atrás
            read: false
        },
        {
            id: 3,
            type: 'checkin_reminder',
            title: 'Recordatorio de Check-in',
            message: 'Recuerda hacer check-in online para tu vuelo mañana.',
            timestamp: new Date(Date.now() - 86400000), // 1 día atrás
            read: true
        },
        {
            id: 4,
            type: 'promotion',
            title: 'Oferta Especial',
            message: '¡20% de descuento en tu próximo vuelo internacional!',
            timestamp: new Date(Date.now() - 172800000), // 2 días atrás
            read: true
        }
    ];

    // Almacenar notificaciones en localStorage
    localStorage.setItem('notifications', JSON.stringify(mockNotifications));

    // Mostrar notificaciones
    displayNotifications(mockNotifications);
}

function displayNotifications(notifications) {
    const notificationDropdown = document.getElementById('notification-dropdown');
    const notificationCount = document.getElementById('notification-count');

    if (!notificationDropdown || !notificationCount) return;

    // Limpiar dropdown
    notificationDropdown.innerHTML = '';

    // Filtrar notificaciones no leídas
    const unreadCount = notifications.filter(n => !n.read).length;
    notificationCount.textContent = unreadCount;
    notificationCount.style.display = unreadCount > 0 ? 'inline' : 'none';

    if (notifications.length === 0) {
        notificationDropdown.innerHTML = '<div class="no-notifications">No tienes notificaciones</div>';
        return;
    }

    // Crear elementos de notificación
    notifications.forEach(notification => {
        const notificationElement = createNotificationElement(notification);
        notificationDropdown.appendChild(notificationElement);
    });

    // Agregar botón de marcar todas como leídas
    if (unreadCount > 0) {
        const markAllReadBtn = document.createElement('button');
        markAllReadBtn.className = 'mark-all-read-btn';
        markAllReadBtn.textContent = 'Marcar todas como leídas';
        markAllReadBtn.addEventListener('click', markAllNotificationsAsRead);
        notificationDropdown.appendChild(markAllReadBtn);
    }
}

function createNotificationElement(notification) {
    const notificationDiv = document.createElement('div');
    notificationDiv.className = `notification-item ${notification.read ? 'read' : 'unread'}`;
    notificationDiv.dataset.id = notification.id;

    const iconClass = getNotificationIcon(notification.type);

    notificationDiv.innerHTML = `
        <div class="notification-icon">
            <i class="${iconClass}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${notification.title}</div>
            <div class="notification-message">${notification.message}</div>
            <div class="notification-time">${formatTimeAgo(notification.timestamp)}</div>
        </div>
        ${!notification.read ? '<div class="notification-unread-dot"></div>' : ''}
    `;

    // Agregar evento de clic para marcar como leída
    notificationDiv.addEventListener('click', () => markNotificationAsRead(notification.id));

    return notificationDiv;
}

function getNotificationIcon(type) {
    const icons = {
        flight_update: 'fas fa-plane',
        booking_confirmation: 'fas fa-check-circle',
        checkin_reminder: 'fas fa-clock',
        promotion: 'fas fa-percent'
    };
    return icons[type] || 'fas fa-bell';
}

function formatTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    return `Hace ${days} días`;
}

function setupNotificationListeners() {
    const notificationIcon = document.getElementById('notification-icon');
    const notificationDropdown = document.getElementById('notification-dropdown');

    if (notificationIcon && notificationDropdown) {
        // Toggle dropdown al hacer clic en el icono
        notificationIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationDropdown.classList.toggle('show');
        });

        // Cerrar dropdown al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!notificationIcon.contains(e.target) && !notificationDropdown.contains(e.target)) {
                notificationDropdown.classList.remove('show');
            }
        });
    }
}

function markNotificationAsRead(notificationId) {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const notification = notifications.find(n => n.id === notificationId);

    if (notification && !notification.read) {
        notification.read = true;
        localStorage.setItem('notifications', JSON.stringify(notifications));
        loadNotifications(); // Recargar notificaciones
    }
}

function markAllNotificationsAsRead() {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.forEach(n => n.read = true);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    loadNotifications(); // Recargar notificaciones
}

// Función para agregar una nueva notificación (puede ser llamada desde otros scripts)
function addNotification(type, title, message) {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const newNotification = {
        id: Date.now(),
        type: type,
        title: title,
        message: message,
        timestamp: new Date(),
        read: false
    };

    notifications.unshift(newNotification); // Agregar al inicio
    localStorage.setItem('notifications', JSON.stringify(notifications));
    loadNotifications(); // Recargar notificaciones
}

// Exportar función para uso en otros scripts
window.addNotification = addNotification;
