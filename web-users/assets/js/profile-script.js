// Script de Perfil para el Portal de Usuarios de AeroNexus

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar página de perfil
    initializeProfile();
});

function initializeProfile() {
    // Configurar escuchadores de eventos
    setupEventListeners();

    // Cargar datos del perfil
    loadProfileData();
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
}

function loadProfileData() {
    // En una implementación real, esto obtendría datos de una API
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

    // En una implementación real, esto enviaría una solicitud al backend
    alert('Información personal guardada exitosamente');

    // Actualizar nombre de visualización
    const fullName = `${data['first-name']} ${data['last-name']}`;
    document.getElementById('profile-name').textContent = fullName;
    document.getElementById('profile-email').textContent = data.email;
    localStorage.setItem('userName', fullName);
}

function saveTravelPreferences() {
    const formData = new FormData(document.getElementById('travel-preferences-form'));
    const data = Object.fromEntries(formData);

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

    // En una implementación real, esto enviaría una solicitud al backend
    alert('Contraseña cambiada exitosamente');

    // Limpiar formulario
    document.getElementById('security-form').reset();
}

function saveNotificationSettings() {
    const formData = new FormData(document.getElementById('notifications-form'));
    const data = Object.fromEntries(formData);

    // En una implementación real, esto enviaría una solicitud al backend
    alert('Configuración de notificaciones guardada exitosamente');
}
