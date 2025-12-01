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

// Agregar estilos específicos de perfil dinámicamente
const profileStyles = `
    .profile-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        align-items: start;
    }

    .profile-card {
        background: var(--white);
        border-radius: 15px;
        padding: 2rem;
        box-shadow: 0 5px 15px var(--shadow);
        margin-bottom: 2rem;
    }

    .profile-header {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 2px solid #f8f9fa;
    }

    .profile-avatar {
        font-size: 4rem;
        color: var(--primary-blue);
    }

    .profile-details h3 {
        margin-bottom: 0.5rem;
        color: var(--text-dark);
    }

    .profile-details p {
        color: var(--text-light);
        margin-bottom: 0.5rem;
    }

    .member-status {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        background: linear-gradient(90deg, var(--primary-blue) 0%, #38D9E7 100%);
        color: var(--white);
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
    }

    .form-check {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
        padding: 0.75rem;
        background: #f8f9fa;
        border-radius: 8px;
    }

    .form-check input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: var(--primary-blue);
    }

    .form-check label {
        margin: 0;
        font-weight: 500;
        color: var(--text-dark);
        cursor: pointer;
    }

    .profile-card h4 {
        margin-bottom: 1.5rem;
        color: var(--text-dark);
        font-size: 1.25rem;
    }

    .profile-info-section .profile-card:first-child {
        background: linear-gradient(135deg, var(--primary-blue) 0%, #1e3a8a 50%, #3b82f6 100%);
        color: var(--white);
    }

    .profile-info-section .profile-card:first-child .profile-details h3,
    .profile-info-section .profile-card:first-child .profile-details p {
        color: var(--white);
    }

    .profile-info-section .profile-card:first-child .member-status {
        background: rgba(255, 255, 255, 0.2);
        color: var(--white);
    }

    @media (max-width: 768px) {
        .profile-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
        }

        .profile-header {
            flex-direction: column;
            text-align: center;
        }

        .form-row {
            flex-direction: column;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = profileStyles;
document.head.appendChild(styleSheet);
