// This is a simple Password Generator App that will generate random password maybe you can use them to secure your account.
// I tried my best to make the code as simple as possible please don't mind the variable names.
// Also, this idea came in my mind after checking Traversy Media's latest video.

// Clear the console on every refresh
console.clear();

// Range Slider Properties
const sliderProps = {
    fill: "#0B1EDF",
    background: "rgba(255, 255, 255, 0.214)",
};

// Selecting the Range Slider container which will affect the LENGTH property of the password
const slider = document.querySelector(".range__slider");
const sliderValue = document.querySelector(".length__title");

// Using Event Listener to apply the fill and also change the value of the text
slider.querySelector("input").addEventListener("input", event => {
    sliderValue.setAttribute("data-length", event.target.value);
    applyFill(event.target);
});

// Selecting the range input and passing it in the applyFill function
applyFill(slider.querySelector("input"));

// This function is responsible for creating the trailing color and setting the fill
function applyFill(slider) {
    const percentage = (100 * (slider.value - slider.min)) / (slider.max - slider.min);
    const bg = `linear-gradient(90deg, ${sliderProps.fill} ${percentage}%, ${sliderProps.background} ${percentage + 0.1}%)`;
    slider.style.background = bg;
    sliderValue.setAttribute("data-length", slider.value);
}

// Object of all the function names that we will use to create random letters of password
const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol,
};

// Random more secure value
function secureMathRandom() {
    return window.crypto.getRandomValues(new Uint32Array(1))[0] / (Math.pow(2, 32) - 1);
}

// Generator Functions
function getRandomLower() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}
function getRandomUpper() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}
function getRandomNumber() {
    return String.fromCharCode(Math.floor(secureMathRandom() * 10) + 48);
}
function getRandomSymbol() {
    const symbols = '~!@#$%^&*()_+{}":?><;.,';
    return symbols[Math.floor(Math.random() * symbols.length)];
}

// Selecting all the DOM Elements that are necessary
const resultEl = document.getElementById("result");
const lengthEl = document.getElementById("slider");
const uppercaseEl = document.getElementById("uppercase");
const lowercaseEl = document.getElementById("lowercase");
const numberEl = document.getElementById("number");
const symbolEl = document.getElementById("symbol");
const generateBtn = document.getElementById("generate");
const copyBtn = document.getElementById("copy-btn");
const resultContainer = document.querySelector(".result");
const copyInfo = document.querySelector(".result__info.right");
const copiedInfo = document.querySelector(".result__info.left");

let generatedPassword = false;

// Update CSS Props of the COPY button
let resultContainerBound = {
    left: resultContainer.getBoundingClientRect().left,
    top: resultContainer.getBoundingClientRect().top,
};

// This will update the position of the copy button based on mouse Position
resultContainer.addEventListener("mousemove", e => {
    resultContainerBound = {
        left: resultContainer.getBoundingClientRect().left,
        top: resultContainer.getBoundingClientRect().top,
    };
    if (generatedPassword) {
        copyBtn.style.opacity = '1';
        copyBtn.style.pointerEvents = 'all';
        copyBtn.style.setProperty("--x", `${e.x - resultContainerBound.left}px`);
        copyBtn.style.setProperty("--y", `${e.y - resultContainerBound.top}px`);
    } else {
        copyBtn.style.opacity = '0';
        copyBtn.style.pointerEvents = 'none';
    }
});

window.addEventListener("resize", e => {
    resultContainerBound = {
        left: resultContainer.getBoundingClientRect().left,
        top: resultContainer.getBoundingClientRect().top,
    };
});

// Copy Password in clipboard
copyBtn.addEventListener("click", () => {
    const textarea = document.createElement("textarea");
    const password = resultEl.innerText;

    // Verifica si la contraseña es válida
    if (!password || password === "CLICK GENERATE") {
        return;
    }

    textarea.value = password; // Asigna la contraseña al textarea
    document .body.appendChild(textarea); // Agrega el textarea al DOM
    textarea.select(); // Selecciona el contenido del textarea
    document.execCommand("copy"); // Copia el contenido al portapapeles
    textarea.remove(); // Elimina el textarea del DOM

    // Actualiza la interfaz de usuario
    copyInfo.style.transform = "translateY(200%)";
    copyInfo.style.opacity = "0";
    copiedInfo.style.transform = "translateY(0%)";
    copiedInfo.style.opacity = "0.75";
    showNotification("Contraseña copiada al portapapeles.", "success"); // Notificación de éxito
});

// When Generate is clicked, Password is generated
generateBtn.addEventListener("click", () => {
    const length = +lengthEl.value;
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numberEl.checked;
    const hasSymbol = symbolEl.checked;
    generatedPassword = true;
    resultEl.innerText = generatePassword(length, hasLower, hasUpper, hasNumber, hasSymbol);
    copyInfo.style.transform = "translateY(0%)";
    copyInfo.style.opacity = "0.75";
    copiedInfo.style.transform = "translateY(200%)";
    copiedInfo.style.opacity = "0";
});

// Function responsible for generating password and returning it
function generatePassword(length, lower, upper, number, symbol) {
    let generatedPassword = "";
    const typesCount = lower + upper + number + symbol;
    const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(item => Object.values(item)[0]);
    if (typesCount === 0) {
        return "";
    }
    for (let i = 0; i < length; i++) {
        typesArr.forEach(type => {
            const funcName = Object.keys(type)[0];
            generatedPassword += randomFunc[funcName]();
        });
    }
    return generatedPassword.slice(0, length);
}

// Function that handles the checkboxes state, so at least one needs to be selected
function disableOnlyCheckbox() {
    let totalChecked = [uppercaseEl, lowercaseEl, numberEl, symbolEl].filter(el => el.checked);
    totalChecked.forEach(el => {
        if (totalChecked.length === 1) {
            el.disabled = true;
        } else {
            el.disabled = false;
        }
    });
}

[uppercaseEl, lowercaseEl, numberEl, symbolEl].forEach(el => {
    el.addEventListener('click', () => {
        disableOnlyCheckbox();
    });
});

// Modal functionality
const guardarBtn = document.getElementById("guardarbtn");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const cancelModal = document.getElementById("cancelModal");
const savePassword = document.getElementById("savePassword");
const platformInput = document.getElementById("platform");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

// Open modal on "Guardar Contraseña" button click
guardarBtn.addEventListener("click", function() {
    modal.style.display = "block";
    passwordInput.value = resultEl.innerText; // Use the generated password
});

// Close modal on "X" click
closeModal.addEventListener("click", function() {
    modal.style.display = "none";
});

// Close modal on "Cancelar" click
cancelModal.addEventListener("click", function() {
    modal.style.display = "none";
});

// Save information to localStorage on "Guardar" click
savePassword.addEventListener("click", function() {
    const platform = platformInput.value;
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (platform && username && password) {
        const credentials = {
            platform: platform,
            username: username,
            password: password
        };
        localStorage.setItem(platform, JSON.stringify(credentials)); // Save to localStorage
        modal.style.display = "none"; // Close modal
        showNotification("Información guardada exitosamente.", "success"); // Success message
    } else {
        showNotification("Por favor, completa todos los campos.", "error"); // Error message
    }
});

// Close modal if clicked outside of it
window.addEventListener("click", function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Selecciona los elementos del DOM
const menuIcon = document.getElementById("menuIcon");
const sideMenu = document.getElementById("sideMenu");
const closeMenu = document.getElementById("closeMenu");

// Abre el menú lateral al hacer clic en el icono del menú ```javascript
menuIcon.addEventListener("click", () => {
    sideMenu.classList.add("active");
});

// Cierra el menú lateral al hacer clic en el botón de cerrar
closeMenu.addEventListener("click", () => {
    sideMenu.classList.remove("active");
});

// Cierra el menú lateral si se hace clic fuera de él
window.addEventListener("click", (event) => {
    if (event.target === sideMenu) {
        sideMenu.classList.remove("active");
    }
});

// Función para mostrar notificaciones
function showNotification(message, type) {
    const notification = document.getElementById("notification");
    notification.innerText = message;

    // Limpia las clases anteriores
    notification.classList.remove("success", "error");

    // Agrega la clase correspondiente según el tipo
    if (type === "success") {
        notification.classList.add("success");
    } else if (type === "error") {
        notification.classList.add("error");
    }

    notification.classList.add("show");

    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
}

// Reemplaza las alertas en el código existente
savePassword.addEventListener("click", function() {
    const platform = platformInput.value;
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (platform && username && password) {
        const credentials = {
            platform: platform,
            username: username,
            password: password
        };
        localStorage.setItem(platform, JSON.stringify(credentials)); // Save to localStorage
        modal.style.display = "none"; // Close modal
        showNotification("Información guardada exitosamente.", "success"); // Success message
    } else {
        showNotification("Por favor, completa todos los campos.", "error"); // Error message
    }
});

// Selección de elementos del DOM
const savedPasswordsModal = document.getElementById("savedPasswordsModal");
const closeSavedPasswordsModal = document.getElementById("closeSavedPasswordsModal");
const savedPasswordsContainer = document.getElementById("savedPasswordsContainer");

// Función para abrir el modal de contraseñas guardadas
function openSavedPasswordsModal() {
    savedPasswordsContainer.innerHTML = ""; // Limpiar el contenedor
    loadSavedPasswords(); // Cargar las contraseñas guardadas
    savedPasswordsModal.style.display = "block"; // Mostrar el modal
}

// Función para cerrar el modal de contraseñas guardadas
closeSavedPasswordsModal.addEventListener("click", () => {
    savedPasswordsModal.style.display = "none"; // Cerrar el modal
});

function loadSavedPasswords() {
    const keys = Object.keys(localStorage);
    savedPasswordsContainer.innerHTML = ""; // Limpiar el contenedor antes de cargar

    keys.forEach(key => {
        const storedValue = localStorage.getItem(key);
        
        // Verifica si el valor almacenado es válido
        if (storedValue) {
            try {
                const credentials = JSON.parse(storedValue);
                
                // Asegúrate de que las propiedades necesarias existan
                if (credentials.platform && credentials.username && credentials.password) {
                    const card = document.createElement("div");
                    card.classList.add("card");
                    card.innerHTML = `
                        <h3>${credentials.platform}</h3>
                        <p><strong>Usuario:</strong> ${credentials.username}</p>
                        <p><strong>Contraseña:</strong> ${credentials.password}</p>
                        <button class="edit-btn" onclick="editPassword('${key}')">Editar</button>
                        <button class="delete-btn" onclick="deletePassword('${key}')">Eliminar</button>
                    `;

                    // Agregar evento de clic para copiar el contenido al portapapeles
                    card.addEventListener("click", () => {
                        copyToClipboard(`Plataforma: ${credentials.platform}\nUsuario: ${credentials.username}\nContraseña: ${credentials.password}`);
                        // Agregar efecto visual
                        card.classList.add("clicked");
                        setTimeout(() => {
                            card.classList.remove("clicked");
                        }, 300); // Eliminar la clase
                        // después de 300ms
                    });

                    savedPasswordsContainer.appendChild(card);
                }
            } catch (error) {
                console.error(`Error al analizar el valor de localStorage para la clave "${key}":`, error);
                // Opcional: Eliminar el valor corrupto de localStorage
                localStorage.removeItem(key);
            }
        }
    });
}

console.log(localStorage);
// Función para eliminar una contraseña guardada
function deletePassword(key) {
    localStorage.removeItem(key);
    loadSavedPasswords(); // Recargar las contraseñas después de eliminar
    showNotification("Contraseña eliminada exitosamente.", "success"); // Notificación de éxito
}

// Función para editar una contraseña guardada
function editPassword(key) {
    const credentials = JSON.parse(localStorage.getItem(key));
    document.getElementById("platform").value = credentials.platform;
    document.getElementById("username").value = credentials.username;
    document.getElementById("password").value = credentials.password;
    document.getElementById("modal").style.display = "block"; // Mostrar el modal de guardar
    closeSavedPasswordsModal.click(); // Cerrar el modal de contraseñas guardadas
}

// Cerrar modal si se hace clic fuera de él
window.addEventListener("click", (event) => {
    if (event.target === savedPasswordsModal) {
        savedPasswordsModal.style.display = "none"; // Cerrar el modal
    }
});

// Función para copiar texto al portapapeles
function copyToClipboard(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text; // Asigna el texto que deseas copiar
    document.body.appendChild(textarea); // Agrega el textarea al DOM
    textarea.select(); // Selecciona el contenido del textarea
    document.execCommand("copy"); // Copia el contenido al portapapeles
    textarea.remove(); // Elimina el textarea del DOM

    // Notificación de éxito (opcional)
    showNotification("Contenido copiado al portapapeles.", "success");
}