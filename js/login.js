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

// Para controle do modo escuro
let darkModeEnabled = false;
let konamiCode = [];
const konamiSequence = ['ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

/**
 * === INICIALIZAÇÃO DO SISTEMA ===
 * Executa quando a página carrega completamente
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Tela de Login - Sistema carregado com sucesso!');
    console.log('💡 Dica: Digite qualquer usuário e senha para entrar');
    console.log('🎨 Easter Egg: Pressione ←→BA para alternar o modo escuro');
    
    initializeSystem();
    setupEventListeners();
    loadDarkModePreference();
});

/**
 * Inicializa as configurações básicas do sistema
 */
function initializeSystem() {
    // Foca no campo de usuário quando a página carrega
    usernameInput.focus();
    
    // Define configurações iniciais se necessário
    setupFormValidation();
}

/**
 * Configura todos os event listeners do sistema
 */
function setupEventListeners() {
    // Evento principal do formulário
    loginForm.addEventListener('submit', handleLogin);
    
    // Remove erros quando o usuário digita
    usernameInput.addEventListener('input', () => clearError('username'));
    passwordInput.addEventListener('input', () => clearError('password'));
    
    // Permite login com Enter em qualquer campo
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && (document.activeElement === usernameInput || document.activeElement === passwordInput)) {
            e.preventDefault();
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
    
    // Easter egg do modo escuro
    document.addEventListener('keydown', handleKonamiCode);
}

/**
 * Configura validação em tempo real dos campos
 */
function setupFormValidation() {
    // Validação do usuário em tempo real
    usernameInput.addEventListener('blur', function() {
        const username = this.value.trim();
        if (username.length > 0 && username.length < 3) {
            showError('username', 'O nome de usuário deve ter pelo menos 3 caracteres');
        }
    });
    
    // Validação da senha em tempo real
    passwordInput.addEventListener('blur', function() {
        const password = this.value.trim();
        if (password.length > 0 && password.length < 4) {
            showError('password', 'A senha deve ter pelo menos 4 caracteres');
        }
    });
}

/**
 * === MANIPULADOR PRINCIPAL DO LOGIN ===
 * Processa o formulário de login
 * @param {Event} e - Evento de submit do formulário
 */
function handleLogin(e) {
    e.preventDefault();
    
    console.log('🚀 Tentativa de login iniciada...');
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Limpa erros anteriores
    clearAllErrors();
    
    // Validação dos campos
    if (!validateLoginForm(username, password)) {
        console.log('❌ Validação falhou');
        return;
    }
    
    // Inicia processo de login
    console.log(`👤 Usuário: ${username}`);
    console.log('🔄 Processando login...');
    
    performLogin(username, password);
}

/**
 * Valida os dados do formulário de login
 * @param {string} username - Nome de usuário
 * @param {string} password - Senha
 * @returns {boolean} - True se válido, false caso contrário
 */
function validateLoginForm(username, password) {
    let isValid = true;
    
    // Valida usuário
    if (!username) {
        showError('username', 'Por favor, digite um nome de usuário');
        isValid = false;
    } else if (username.length < 3) {
        showError('username', 'O nome de usuário deve ter pelo menos 3 caracteres');
        isValid = false;
    }
    
    // Valida senha
    if (!password) {
        showError('password', 'Por favor, digite uma senha');
        isValid = false;
    } else if (password.length < 4) {
        showError('password', 'A senha deve ter pelo menos 4 caracteres');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Executa o processo de login (simulado)
 * @param {string} username - Nome de usuário
 * @param {string} password - Senha
 */
function performLogin(username, password) {
    // Mostra estado de carregamento
    showLoading();
    
    // Salva dados do usuário para uso posterior
    saveUserSession(username);
    
    // Simula delay de autenticação (para parecer mais realista)
    setTimeout(() => {
        console.log('✅ Login realizado com sucesso!');
        showLoginSuccess();
        
        // Redireciona após mostrar sucesso
        setTimeout(() => {
            redirectToMainPage();
        }, 1500);
        
    }, 1000); // 1 segundo de delay
}

/**
 * Salva informações da sessão do usuário
 * @param {string} username - Nome de usuário
 */
function saveUserSession(username) {
    try {
        const sessionData = {
            username: username,
            loginTime: new Date().toISOString(),
            sessionId: generateSessionId()
        };
        
        localStorage.setItem('currentUser', username);
        localStorage.setItem('loginTime', sessionData.loginTime);
        localStorage.setItem('sessionData', JSON.stringify(sessionData));
        
        console.log('💾 Sessão salva com sucesso');
    } catch (error) {
        console.warn('⚠️ Erro ao salvar sessão:', error);
        // Não impede o login se não conseguir salvar
    }
}

/**
 * Gera um ID único para a sessão
 * @returns {string} - ID da sessão
 */
function generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

/**
 * Redireciona para a página principal do sistema
 */
function redirectToMainPage() {
    console.log('🔄 Redirecionando para a página principal...');
    
    // IMPORTANTE: Altere aqui o nome do arquivo da página principal
    // Se sua página principal se chama 'tarefas.html', altere para 'tarefas.html'
    // Se se chama 'index.html', mantenha 'index.html'
    const mainPageUrl = 'index.html'; // ALTERE AQUI se necessário
    
    try {
        window.location.href = mainPageUrl;
    } catch (error) {
        console.error('❌ Erro ao redirecionar:', error);
        alert('Erro ao carregar a página principal. Verifique se o arquivo existe.');
    }
}

/**
 * === FUNÇÕES DE INTERFACE ===
 */

/**
 * Mostra erro em um campo específico
 * @param {string} fieldName - Nome do campo (username/password)
 * @param {string} message - Mensagem de erro
 */
function showError(fieldName, message) {
    const input = document.getElementById(fieldName);
    const errorDiv = document.getElementById(fieldName + 'Error');
    
    if (!input || !errorDiv) return;
    
    input.classList.add('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Remove o erro automaticamente após 5 segundos
    setTimeout(() => clearError(fieldName), 5000);
    
    console.log(`⚠️ Erro no campo ${fieldName}: ${message}`);
}

/**
 * Limpa erro de um campo específico
 * @param {string} fieldName - Nome do campo
 */
function clearError(fieldName) {
    const input = document.getElementById(fieldName);
    const errorDiv = document.getElementById(fieldName + 'Error');
    
    if (!input || !errorDiv) return;
    
    input.classList.remove('error');
    errorDiv.style.display = 'none';
}

/**
 * Limpa todos os erros do formulário
 */
function clearAllErrors() {
    clearError('username');
    clearError('password');
}

/**
 * Mostra estado de carregamento durante o login
 */
function showLoading() {
    loginContainer.classList.add('loading');
    const button = document.querySelector('.btn-login');
    
    if (!button) return;
    
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="bi bi-hourglass-split"></i> Entrando...';
    button.disabled = true;
    
    // Fallback: remove loading após 3 segundos
    setTimeout(() => {
        if (button.disabled) {
            button.innerHTML = originalText;
            button.disabled = false;
            loginContainer.classList.remove('loading');
        }
    }, 3000);
}

/**
 * Mostra feedback visual de sucesso no login
 */
function showLoginSuccess() {
    const button = document.querySelector('.btn-login');
    
    if (!button) return;
    
    loginContainer.classList.remove('loading');
    button.innerHTML = '<i class="bi bi-check-circle"></i> Login realizado com sucesso!';
    button.style.background = 'linear-gradient(135deg, #51cf66 0%, #40c057 100%)';
    button.disabled = false;
    
    // Efeito visual de sucesso
    loginContainer.style.transform = 'scale(1.02)';
    setTimeout(() => {
        loginContainer.style.transform = 'scale(1)';
    }, 200);
}

/**
 * === SISTEMA DE MODO ESCURO ===
 */

/**
 * Carrega preferência do modo escuro
 */
function loadDarkModePreference() {
    try {
        darkModeEnabled = localStorage.getItem('darkMode') === 'true';
        if (darkModeEnabled) {
            document.body.classList.add('dark-mode');
            console.log('🌙 Modo escuro ativado');
        }
    } catch (error) {
        console.warn('⚠️ Erro ao carregar preferência do modo escuro:', error);
    }
}

/**
 * Alterna entre modo claro e escuro
 */
function toggleDarkMode() {
    darkModeEnabled = !darkModeEnabled;
    document.body.classList.toggle('dark-mode', darkModeEnabled);
    
    try {
        localStorage.setItem('darkMode', darkModeEnabled.toString());
    } catch (error) {
        console.warn('⚠️ Erro ao salvar preferência do modo escuro:', error);
    }
    
    // Feedback visual
    loginContainer.style.transform = 'scale(0.98)';
    setTimeout(() => {
        loginContainer.style.transform = 'scale(1)';
    }, 100);
    
    console.log(darkModeEnabled ? '🌙 Modo escuro ativado!' : '☀️ Modo claro ativado!');
}

/**
 * Manipula o código konami para ativar o modo escuro
 * @param {KeyboardEvent} e - Evento de teclado
 */
function handleKonamiCode(e) {
    konamiCode.push(e.code);
    konamiCode = konamiCode.slice(-konamiSequence.length);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        toggleDarkMode();
        konamiCode = []; // Reset do código
    }
}

/**
 * === FUNÇÕES UTILITÁRIAS ===
 */

/**
 * Obtém informações sobre a sessão atual
 * @returns {Object|null} - Dados da sessão ou null
 */
function getCurrentSession() {
    try {
        const sessionData = localStorage.getItem('sessionData');
        return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
        console.warn('⚠️ Erro ao obter sessão:', error);
        return null;
    }
}

/**
 * Limpa dados de sessão (para logout futuro)
 */
function clearSession() {
    try {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('loginTime');
        localStorage.removeItem('sessionData');
        console.log('🧹 Sessão limpa');
    } catch (error) {
        console.warn('⚠️ Erro ao limpar sessão:', error);
    }
}

/**
 * Verifica se há uma sessão ativa válida
 * @returns {boolean} - True se há sessão válida
 */
function hasValidSession() {
    const session = getCurrentSession();
    if (!session) return false;
    
    // Verifica se a sessão não é muito antiga (24 horas)
    const loginTime = new Date(session.loginTime);
    const now = new Date();
    const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
    
    return hoursDiff < 24;
}

/**
 * === TRATAMENTO DE ERROS ===
 */
window.addEventListener('error', function(e) {
    console.error('❌ Erro JavaScript:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('❌ Promise rejeitada:', e.reason);
});

/**
 * === LOG DE DESENVOLVIMENTO ===
 */
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔧 Modo de desenvolvimento detectado');
    
    // Adiciona informações extras para debug
    window.loginDebug = {
        clearSession,
        getCurrentSession,
        hasValidSession,
        toggleDarkMode
    };
    
    console.log('🛠️ Funções de debug disponíveis em window.loginDebug');
}