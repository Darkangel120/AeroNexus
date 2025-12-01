// Script de Perfil para el Portal de Usuarios de AeroNexus

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar página de perfil
    initializeProfile();
});

function initializeProfile() {
    // Cargar datos del usuario
    loadUserData();

    // Configurar escuchadores de eventos
    setupEventListeners();

    // Cargar datos del perfil
    loadProfileData();
}

function loadUserData() {
    // Marcador de posición para cargar datos del usuario desde el backend
    const userName = localStorage.getItem('userName') || 'Usuario';
    document.getElementById('user-name').textContent = userName;
}

function setupEventListeners() {
    // Formulario de información personal
    document.getElementById('personal-info-form').addEventListener('submit', function(e) {
        e.preventDefault();
        savePersonalInfo();
    });

    // Formulario de preferencias de viaje
    document.getElementById('travel-preferences-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveTravelPreferences();
    });

    // Formulario de seguridad
    document.getElementById('security-form').addEventListener('submit', function(e) {
        e.preventDefault();
        changePassword();
    });

    // Formulario de notificaciones
    document.getElementById('notifications-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveNotificationSettings();
    });

    // Funcionalidad de logout
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
}

function loadProfileData() {
    // Marcador de posición para cargar datos del perfil desde el backend
    // En una implementación real, esto obtendría datos de una API
    // Por ahora, el HTML ya tiene datos de ejemplo
}

function savePersonalInfo() {
    const formData = new FormData(document.getElementById('personal-info-form'));
    const data = Object.fromEntries(formData);

    // Validar formulario
    if (!data['first-name'] || !data['last-name'] || !data.email) {
        alert('Por favor, complete todos los campos obligatorios');
        return;
    }

    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Por favor, ingrese un correo electrónico válido');
        return;
    }

    // Marcador de posición para guardar información personal
    // En una implementación real, esto enviaría una solicitud al backend
    alert('Información personal guardada exitosamente');

    // Actualizar nombre de visualización
    const fullName = `${data['first-name']} ${data['last-name']}`;
    document.getElementById('profile-name').textContent = fullName;
    document.getElementById('profile-email').textContent = data.email;
    localStorage.setItem('userName', fullName);
    document.getElementById('user-name').textContent = fullName;
}

function saveTravelPreferences() {
    const formData = new FormData(document.getElementById('travel-preferences-form'));
    const data = Object.fromEntries(formData);

    // Marcador de posición para guardar preferencias de viaje
    // En una implementación real, esto enviaría una solicitud al backend
    alert('Preferencias de viaje guardadas exitosamente');
}

function changePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validar formulario
    if (!currentPassword || !newPassword || !confirmPassword) {
        alert('Por favor, complete todos los campos');
        return;
    }

    // Validar fortaleza de la contraseña
    if (newPassword.length < 8) {
        alert('La nueva contraseña debe tener al menos 8 caracteres');
        return;
    }

    // Validar confirmación de contraseña
    if (newPassword !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    // Marcador de posición para cambiar contraseña
    // En una implementación real, esto enviaría una solicitud al backend
    alert('Contraseña cambiada exitosamente');

    // Limpiar formulario
    document.getElementById('security-form').reset();
}

function saveNotificationSettings() {
    const formData = new FormData(document.getElementById('notifications-form'));
    const data = Object.fromEntries(formData);

    // Marcador de posición para guardar configuración de notificaciones
    // En una implementación real, esto enviaría una solicitud al backend
    alert('Configuración de notificaciones guardada exitosamente');
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