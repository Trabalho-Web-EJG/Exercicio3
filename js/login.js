/**
 * === SCRIPT DA TELA DE LOGIN ===
 * Sistema de autenticação básica para projeto escolar
 * Desenvolvido por: Elessando de Abreu
 */

// === VARIÁVEIS GLOBAIS ===
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginContainer = document.querySelector('.login-container');

// Modo escuro via Konami Code
let darkModeEnabled = false;
let konamiCode = [];
const konamiSequence = ['ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

/**
 * === INICIALIZAÇÃO DO SISTEMA ===
 */
document.addEventListener('DOMContentLoaded', function () {
    console.log('🔐 Tela de Login carregada');
    console.log('🎮 Pressione ← → B A para ativar o modo escuro');

    usernameInput.focus();
    setupEventListeners();
    loadDarkModePreference();
});

/**
 * Configura os eventos do formulário e teclado
 */
function setupEventListeners() {
    loginForm.addEventListener('submit', handleLogin);
    // Konami Code
    document.addEventListener('keydown', handleKonamiCode);
}

/**
 * Processa o login ao enviar o formulário
 */
function handleLogin(e) {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    showLoading();

    setTimeout(() => {
        showLoginSuccess();
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 1000);
}

/**
 * Mostra estado de carregamento
 */
function showLoading() {
    loginContainer.classList.add('loading');
    const button = document.querySelector('.btn-login');
    
    button.innerHTML = '<i class="bi bi-hourglass-split"></i> Entrando...';
    button.disabled = true;
}

/**
 * Mostra mensagem de login bem-sucedido
 */
function showLoginSuccess() {
    const button = document.querySelector('.btn-login');
    
    loginContainer.classList.remove('loading');
    button.innerHTML = '<i class="bi bi-check-circle"></i> Login realizado com sucesso!';
    button.style.background = 'linear-gradient(135deg, #51cf66 0%, #40c057 100%)';
    button.disabled = false;
}

/**
 * === MODO ESCURO - KONAMI CODE ===
 */

/**
 * Lê preferência salva
 */
function loadDarkModePreference() {
    try {
        darkModeEnabled = localStorage.getItem('darkMode') === 'true';
        if (darkModeEnabled) {
            document.body.classList.add('dark-mode');
            console.log('🌙 Modo escuro ativado');
        }
    } catch (error) {
        console.warn('Erro ao carregar modo escuro:', error);
    }
}

/**
 * Ativa/desativa modo escuro
 */
function toggleDarkMode() {
    darkModeEnabled = !darkModeEnabled;
    document.body.classList.toggle('dark-mode', darkModeEnabled);

    try {
        localStorage.setItem('darkMode', darkModeEnabled.toString());
    } catch (error) {
        console.warn('Erro ao salvar modo escuro:', error);
    }

    console.log(darkModeEnabled ? '🌙 Modo escuro ativado!' : '☀️ Modo claro ativado!');
}

/**
 * Detecta sequência Konami para ativar modo escuro
 */
function handleKonamiCode(e) {
    konamiCode.push(e.code);
    konamiCode = konamiCode.slice(-konamiSequence.length);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        toggleDarkMode();
        konamiCode = [];
    }
}