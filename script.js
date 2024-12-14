const body = document.body;
const container = document.querySelector('.container');
const passwordInput = document.getElementById('password');
const generateBtn = document.getElementById('generateBtn');
const menuIcon = document.getElementById('menuIcon');
const sideMenu = document.getElementById('sideMenu');
const closeMenu = document.getElementById('closeMenu');
const savedPasswordsBtn = document.getElementById('savedPasswordsBtn');
const savedPasswordsModal = document.getElementById('savedPasswordsModal');
const closeModal = document.getElementById('closeModal');
const savePasswordModal = document.getElementById('savePasswordModal');
const closeSaveModal = document.getElementById('closeSaveModal');
const usernameInput = document.getElementById('usernameInput');
const passwordInputModal = document.getElementById('passwordInputModal');
const savePasswordBtn = document.getElementById('savePasswordBtn');
const cancelSaveBtn = document.getElementById('cancelSaveBtn');
const savedPasswordsList = document.getElementById('savedPasswordsList');
const themeToggleSwitch = document.getElementById('themeToggleSwitch');

// Agregar un listener al switch de modo oscuro en el menú
themeToggleSwitch.addEventListener('change', () => {
    const isChecked = themeToggleSwitch.checked;
    body.classList.toggle('dark-mode', isChecked);
    container.classList.toggle('dark-mode', isChecked);
    sideMenu.classList.toggle('dark-mode', isChecked); // Aplicar modo oscuro al menú
    localStorage.setItem('theme', isChecked ? 'dark' : 'light');
});

// Cargar la preferencia de tema del usuario desde el almacenamiento local
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    themeToggleSwitch.checked = currentTheme === 'dark';
    body.classList.toggle('dark-mode', currentTheme === 'dark');
    container.classList.toggle('dark-mode', currentTheme === 'dark');
    sideMenu.classList.toggle('dark-mode', currentTheme === 'dark'); // Aplicar modo oscuro al menú
}

// Manejo del menú hamburguesa
menuIcon.addEventListener('click', () => {
    sideMenu.classList.toggle('active');
});

closeMenu.addEventListener('click', () => {
    sideMenu.classList.remove('active');
});

// Mostrar contraseñas guardadas
savedPasswordsBtn.addEventListener('click', () => {
    displaySavedPasswords();
    savedPasswordsModal.style.display = 'block';
    sideMenu.classList.remove('active');
});

closeModal.addEventListener('click', () => {
    savedPasswordsModal.style.display = 'none';
});

// Copiar contraseña al portapapeles y abrir el modal para guardar
document.getElementById('copyBtn').addEventListener('click', () => {
    const password = passwordInput.value;
    copyToClipboard(password);
    passwordInputModal.value = password; // Establecer la contraseña copiada en el input del modal
    savePasswordModal.style.display = 'block'; // Mostrar el modal para guardar la contraseña
});

closeSaveModal.addEventListener('click', () => {
    savePasswordModal.style.display = 'none';
});

// Guardar contraseña
savePasswordBtn.addEventListener('click', () => {
    const username = usernameInput.value;
    const password = passwordInputModal.value;
    if (username && password) {
        savePassword(username, password);
        usernameInput.value = ''; // Limpiar el input
        passwordInputModal.value = ''; // Limpiar el input
        savePasswordModal.style.display = 'none'; // Ocultar el modal
    } else {
        showNotification('Por favor, completa ambos campos.', 'error');
    }
});

cancelSaveBtn.addEventListener('click', () => {
    savePasswordModal.style.display = 'none';
});

// Función para copiar al portapapeles
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Texto copiado al portapapeles!', 'success');
    }).catch(err => {
        console.error('Error al copiar: ', err);
        showNotification('Error al copiar el texto.', 'error');
    });
}

// Función para mostrar notificaciones
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerText = message;
    document.body.appendChild(notification);

    // Remover la notificación después de 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Func ión para guardar la contraseña
function savePassword(username, password) {
    const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords')) || [];
    savedPasswords.push({ username, password });
    localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
    displaySavedPasswords();
    showNotification('Contraseña guardada exitosamente!', 'success');
}

// Mostrar contraseñas guardadas
function displaySavedPasswords() {
    const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords')) || [];
    savedPasswordsList.innerHTML = ''; // Limpiar la lista
    savedPasswords.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <strong>Usuario:</strong> ${item.username}<br>
            <strong>Contraseña:</strong> ${item.password}
            <button class="copy-btn" data-username="${item.username}" data-password="${item.password}">Copiar</button>
            <button class="delete-btn" data-index="${index}">Eliminar</button>
        `;
        savedPasswordsList.appendChild(card);
    });

    // Agregar evento de copia a los botones
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const username = event.target.getAttribute('data-username');
            const password = event.target.getAttribute('data-password');
            copyToClipboard(`Usuario: ${username}, Contraseña: ${password}`);
        });
    });

    // Agregar evento de eliminación a los botones
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            deletePassword(index);
        });
    });
}

function deletePassword(index) {
    const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords')) || [];
    savedPasswords.splice(index, 1); // Eliminar la contraseña en el índice especificado
    localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords)); // Guardar los cambios
    displaySavedPasswords(); // Actualizar la visualización
    showNotification('Contraseña eliminada exitosamente!', 'success');
}

// Lógica de generación de contraseñas
generateBtn.addEventListener('click', () => {
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeLowercase = document.getElementById('includeLowercase').checked;
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;

    const password = generatePassword(includeNumbers, includeLowercase, includeUppercase, includeSymbols);
    passwordInput.value = password;

    const strength = evaluatePasswordStrength(includeNumbers, includeLowercase, includeUppercase, includeSymbols);
    updatePasswordStrengthIndicator(strength);
});

function generatePassword(includeNumbers, includeLowercase, includeUppercase, includeSymbols) {
    const length = 12; // Longitud de la contraseña

    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    let validChars = '';
    if (includeLowercase) validChars += lowerChars;
    if (includeUppercase) validChars += upperChars;
    if (includeNumbers) validChars += numberChars;
    if (includeSymbols) validChars += symbolChars;

    if (validChars.length === 0) {
        showNotification('Por favor, selecciona al menos una opción.', 'error');
        return '';
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * validChars.length);
        password += validChars[randomIndex];
    }

    return password;
}

function evaluatePasswordStrength(includeNumbers, includeLowercase, includeUppercase, includeSymbols) {
    const criteriaMet = [includeNumbers, includeLowercase, includeUppercase, includeSymbols].filter(Boolean).length;

    if (criteriaMet === 1) {
        return 'weak';
    } else if (criteriaMet === 2) {
        return 'medium';
    } else if (criteriaMet === 3 || criteriaMet === 4) {
        return 'strong';
    }
    return 'weak'; // Por defecto
}

function updatePasswordStrengthIndicator(strength) {
    passwordInput.classList.remove('weak', 'medium', 'strong');

    if (strength === 'weak') {
        passwordInput.classList.add('weak');
        passwordInput.style.borderColor = 'red'; // Color para contraseña débil
    } else if (strength === 'medium') {
        passwordInput.classList.add('medium');
        passwordInput.style.borderColor = 'orange'; // Color para contraseña media
    } else if (strength === 'strong') {
        passwordInput.classList.add('strong');
        passwordInput.style.borderColor = 'green'; // Color para contraseña fuerte
    }
}

// Inicializar la visualización de contraseñas guardadas
displaySavedPasswords();