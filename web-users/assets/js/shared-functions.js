// Script de Funciones Compartidas para TravelNexus

class UserMenuManager {
    constructor() {
        this.userName = localStorage.getItem('userName') || 'Oswaldo Gómez';
        this.setupUserMenu();
    }

    setupUserMenu() {
        this.updateUserName();
        this.setupEventListeners();
    }

    updateUserName() {
        const userNameElements = document.querySelectorAll('#user-name');
        userNameElements.forEach(element => {
            element.textContent = this.userName;
        });

        const userGreetingElements = document.querySelectorAll('#user-greeting');
        userGreetingElements.forEach(element => {
            element.textContent = this.userName;
        });
    }

    setupEventListeners() {
        const userMenu = document.querySelector('.user-menu');
        const dropdown = document.querySelector('.dropdown');
        const userNameElement = document.getElementById('user-name');

        if (userMenu && dropdown && userNameElement) {
            // User name click toggles dropdown
            userNameElement.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('show');
            });
            userNameElement.style.cursor = 'pointer';

            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target) && !userNameElement.contains(e.target)) {
                    dropdown.classList.remove('show');
                }
            });

            // Logout functionality
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            }

            // Profile link
            const profileLink = document.getElementById('profile-link');
            if (profileLink) {
                profileLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    dropdown.classList.remove('show'); // Close dropdown after navigation
                    window.location.href = 'profile.html';
                });
            }
        }
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
        window.location.href = '../login.html';
    }
}

// Funciones compartidas
function loadUserData() {
    // Placeholder for loading user data from backend
    const userName = localStorage.getItem('userName') || 'Oswaldo Gómez';
    document.getElementById('user-name').textContent = userName;
    document.getElementById('user-greeting').textContent = userName;
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        // Preserve existing structure and add loading overlay
        const existingContent = element.innerHTML;
        element.innerHTML = '<div class="loading">Cargando...</div>' + existingContent;
        element.style.display = 'block';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar administrador de menú de usuario
    window.userMenuManager = new UserMenuManager();
});
