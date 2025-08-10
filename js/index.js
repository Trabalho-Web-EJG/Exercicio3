/**
 * === ORGANIZADOR DE TAREFAS DA SALA ===
 * Sistema para gerenciar atividades e prazos escolares
 * Desenvolvido com HTML5, CSS3, Bootstrap e JavaScript
 */

// === VARIÁVEIS GLOBAIS ===
let tasks = []; // Array para armazenar todas as tarefas
let currentFilter = 'all'; // Filtro atual ativo

// === ELEMENTOS DO DOM ===
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const tasksList = document.getElementById('tasksList');
const emptyState = document.getElementById('emptyState');
const filterButtons = document.querySelectorAll('.filter-btn');

// Elementos dos contadores
const totalTasksElement = document.getElementById('totalTasks');
const pendingTasksElement = document.getElementById('pendingTasks');
const completedTasksElement = document.getElementById('completedTasks');

/**
 * === INICIALIZAÇÃO DO SISTEMA ===
 * Carrega as tarefas e configura os eventos quando a página carrega
 */
document.addEventListener('DOMContentLoaded', function() {
    loadTasks(); // Carrega tarefas do localStorage
    setMinDate(); // Define data mínima como hoje
    setupEventListeners(); // Configura eventos
    createSampleTasks(); // Cria tarefas fictícias se não existirem
});

/**
 * Define a data mínima no input como a data atual
 */
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
}

/**
 * Configura todos os eventos do sistema
 */
function setupEventListeners() {
    // Evento de submit do formulário
    taskForm.addEventListener('submit', handleSubmit);

    // Eventos dos botões de filtro
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            setActiveFilter(button.dataset.filter);
        });
    });
}

/**
 * Cria 5 tarefas fictícias para demonstração
 * Apenas se não houver tarefas já salvas
 */
function createSampleTasks() {
    if (tasks.length === 0) {
        const sampleTasks = [
            
            {
                id: generateId(),
                title: "Entregar trabalho de História sobre Segunda Guerra Mundial",
                date: getDatePlusDays(7),
                completed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: generateId(),
                title: "Estudar para prova de Matemática - Geometria",
                date: getDatePlusDays(3),
                completed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: generateId(),
                title: "Apresentar seminário de Biologia sobre Ecossistemas",
                date: getDatePlusDays(10),
                completed: true,
                createdAt: new Date().toISOString()
            },
            {
                id: generateId(),
                title: "Entregar trabalho WEB - Matheus - Trier",
                date: getDatePlusDays(4),
                completed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: generateId(),
                title: "Fazer exercícios de Português - páginas 45 a 50",
                date: getDatePlusDays(2),
                completed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: generateId(),
                title: "Pesquisar sobre Revolução Industrial para projeto",
                date: getDatePlusDays(14),
                completed: false,
                createdAt: new Date().toISOString()
            }
        ];

        tasks = sampleTasks;
        saveTasks(); // Salva no localStorage
        renderTasks(); // Renderiza na tela
        updateStats(); // Atualiza estatísticas
    }
}

/**
 * Gera uma data X dias no futuro
 * @param {number} days - Número de dias para adicionar
 * @returns {string} - Data no formato YYYY-MM-DD
 */
function getDatePlusDays(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

/**
 * Gera um ID único para cada tarefa
 * @returns {string} - ID único baseado em timestamp e número aleatório
 */
function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

/**
 * Manipula o envio do formulário de nova tarefa
 * @param {Event} e - Evento de submit
 */
function handleSubmit(e) {
    e.preventDefault(); // Previne o reload da página
    
    const title = taskInput.value.trim();
    const date = dateInput.value;

    // Validação básica dos campos
    if (!title || !date) {
        showAlert('Por favor, preencha todos os campos!', 'danger');
        return;
    }

    // Verifica se a data não é no passado
    if (new Date(date) < new Date().setHours(0,0,0,0)) {
        showAlert('A data deve ser hoje ou no futuro!', 'warning');
        return;
    }

    // Verifica se a tarefa já existe
    if (taskExists(title)) {
        showAlert('Esta tarefa já foi adicionada!', 'warning');
        return;
    }

    // Cria nova tarefa
    const newTask = {
        id: generateId(),
        title: title,
        date: date,
        completed: false,
        createdAt: new Date().toISOString()
    };

    // Adiciona ao array e salva
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateStats();

    // Limpa o formulário
    taskForm.reset();
    setMinDate(); // Restaura data mínima

    showAlert('Tarefa adicionada com sucesso!', 'success');
}

/**
 * Verifica se uma tarefa já existe
 * @param {string} title - Título da tarefa
 * @returns {boolean} - True se a tarefa já existe
 */
function taskExists(title) {
    return tasks.some(task => 
        task.title.toLowerCase() === title.toLowerCase() && 
        !task.completed
    );
}

/**
 * Exibe alertas para o usuário
 * @param {string} message - Mensagem do alerta
 * @param {string} type - Tipo do alerta (success, danger, warning)
 */
function showAlert(message, type) {
    // Remove alertas existentes
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    // Cria novo alerta
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    // Insere o alerta no início da seção de controles
    const controlsSection = document.querySelector('.controls-section');
    controlsSection.insertBefore(alert, controlsSection.firstChild);

    // Remove automaticamente após 3 segundos
    setTimeout(() => {
        if (alert && alert.parentNode) {
            alert.remove();
        }
    }, 7000);
}

/**
 * Salva as tarefas no localStorage
 * NOTA: No ambiente Claude.ai isso não funcionará, mas funciona em ambiente real
 */
function saveTasks() {
    try {
        localStorage.setItem('schoolTasks', JSON.stringify(tasks));
    } catch (error) {
        console.warn('LocalStorage não disponível neste ambiente');
    }
}

/**
 * Carrega as tarefas do localStorage
 */
function loadTasks() {
    try {
        const savedTasks = localStorage.getItem('schoolTasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
            renderTasks();
            updateStats();
        }
    } catch (error) {
        console.warn('Erro ao carregar tarefas do localStorage');
        tasks = [];
    }
}

/**
 * Renderiza todas as tarefas na tela baseado no filtro atual
 */
function renderTasks() {
    const filteredTasks = getFilteredTasks();
    
    // Se não há tarefas para mostrar, exibe estado vazio
    if (filteredTasks.length === 0) {
        tasksList.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    // Esconde estado vazio e renderiza tarefas
    emptyState.style.display = 'none';
    
    // Ordena tarefas por data
    const sortedTasks = filteredTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Cria HTML para cada tarefa
    tasksList.innerHTML = sortedTasks.map(task => createTaskHTML(task)).join('');
}

/**
 * Retorna as tarefas filtradas baseado no filtro atual
 * @returns {Array} - Array de tarefas filtradas
 */
function getFilteredTasks() {
    switch (currentFilter) {
        case 'pending':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        default:
            return tasks;
    }
}

/**
 * Cria o HTML para uma tarefa individual
 * @param {Object} task - Objeto da tarefa
 * @returns {string} - HTML da tarefa
 */
function createTaskHTML(task) {
    const isUrgent = isTaskUrgent(task.date);
    const isNear = isTaskNear(task.date);
    
    let dateClass = '';
    if (isUrgent && !task.completed) {
        dateClass = 'urgent';
    } else if (isNear && !task.completed) {
        dateClass = 'near';
    }

    const formattedDate = formatDate(task.date);
    
    return `
        <div class="task-card ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
            <div class="task-header">
                <div class="flex-grow-1">
                    <div class="task-title">${escapeHtml(task.title)}</div>
                    <div class="task-date ${dateClass}">
                        <i class="bi bi-calendar"></i> ${formattedDate}
                    </div>
                </div>
            </div>
            <div class="task-actions">
                ${!task.completed ? `
                    <button class="btn btn-success btn-sm" onclick="toggleTask('${task.id}')">
                        <i class="bi bi-check"></i> Concluir
                    </button>
                ` : `
                    <button class="btn btn-secondary btn-sm" onclick="toggleTask('${task.id}')">
                        <i class="bi bi-arrow-counterclockwise"></i> Reabrir
                    </button>
                `}
                <button class="btn btn-danger btn-sm" onclick="deleteTask('${task.id}')">
                    <i class="bi bi-trash"></i> Excluir
                </button>
            </div>
        </div>
    `;
}

/**
 * Verifica se uma tarefa está urgente (menos de 2 dias)
 * @param {string} dateStr - Data da tarefa
 * @returns {boolean} - True se for urgente
 */
function isTaskUrgent(dateStr) {
    const taskDate = new Date(dateStr);
    const today = new Date();
    const diffTime = taskDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1;
}

/**
 * Verifica se uma tarefa está próxima (2-3 dias)
 * @param {string} dateStr - Data da tarefa
 * @returns {boolean} - True se estiver próxima
 */
function isTaskNear(dateStr) {
    const taskDate = new Date(dateStr);
    const today = new Date();
    const diffTime = taskDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 2 && diffDays <= 3;
}

/**
 * Formata uma data para exibição
 * @param {string} dateStr - Data no formato YYYY-MM-DD
 * @returns {string} - Data formatada
 */
function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

/**
 * Escapa caracteres HTML para segurança
 * @param {string} text - Texto para escapar
 * @returns {string} - Texto escapado
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Alterna o status de conclusão de uma tarefa
 * @param {string} taskId - ID da tarefa
 */
function toggleTask(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks();
        renderTasks();
        updateStats();

        const message = tasks[taskIndex].completed ? 
            'Tarefa concluída! Parabéns!' : 
            'Tarefa reaberta!';
        const type = tasks[taskIndex].completed ? 'success' : 'info';
        
        showAlert(message, type);
    }
}

/**
 * Exclui uma tarefa após confirmação
 * @param {string} taskId - ID da tarefa
 */
function deleteTask(taskId) {
    // Confirmação antes de excluir
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) {
        return;
    }

    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    
    // Animação de remoção
    if (taskElement) {
        taskElement.classList.add('removing');
        
        setTimeout(() => {
            // Remove do array
            tasks = tasks.filter(task => task.id !== taskId);
            saveTasks();
            renderTasks();
            updateStats();
            
            showAlert('Tarefa excluída com sucesso!', 'info');
        }, 500);
    }
}

/**
 * Define o filtro ativo
 * @param {string} filter - Tipo de filtro ('all', 'pending', 'completed')
 */
function setActiveFilter(filter) {
    currentFilter = filter;
    
    // Atualiza botões de filtro
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    // Re-renderiza as tarefas
    renderTasks();
}

/**
 * Atualiza as estatísticas mostradas no cabeçalho
 */
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    // Atualiza os contadores com animação
    animateCounter(totalTasksElement, parseInt(totalTasksElement.textContent), total);
    animateCounter(pendingTasksElement, parseInt(pendingTasksElement.textContent), pending);
    animateCounter(completedTasksElement, parseInt(completedTasksElement.textContent), completed);
}

/**
 * Anima a mudança de números nos contadores
 * @param {Element} element - Elemento do contador
 * @param {number} start - Valor inicial
 * @param {number} end - Valor final
 */
function animateCounter(element, start, end) {
    const duration = 500; // 500ms
    const increment = (end - start) / (duration / 16); // 60 FPS
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        
        element.textContent = Math.round(current);
    }, 16);
}

/**
 * === FUNÇÕES UTILITÁRIAS ADICIONAIS ===
 */

/**
 * Exporta as tarefas para um arquivo JSON (funcionalidade extra)
 */
function exportTasks() {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'tarefas_escolares.json';
    link.click();
}

/**
 * Limpa todas as tarefas concluídas
 */
function clearCompleted() {
    if (!confirm('Tem certeza que deseja remover todas as tarefas concluídas?')) {
        return;
    }

    const completedCount = tasks.filter(task => task.completed).length;
    
    if (completedCount === 0) {
        showAlert('Não há tarefas concluídas para remover!', 'info');
        return;
    }

    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
    updateStats();
    
    showAlert(`${completedCount} tarefa(s) concluída(s) removida(s)!`, 'success');
}

/**
 * Obtém estatísticas detalhadas das tarefas
 * @returns {Object} - Objeto com estatísticas
 */
function getTaskStats() {
    const now = new Date();
    const urgent = tasks.filter(task => 
        !task.completed && isTaskUrgent(task.date)
    ).length;
    
    const overdue = tasks.filter(task => {
        if (task.completed) return false;
        const taskDate = new Date(task.date);
        return taskDate < now;
    }).length;

    return {
        total: tasks.length,
        pending: tasks.filter(task => !task.completed).length,
        completed: tasks.filter(task => task.completed).length,
        urgent: urgent,
        overdue: overdue
    };
}

/**
 * === SISTEMA DE NOTIFICAÇÕES PARA TAREFAS URGENTES ===
 * Verifica periodicamente se há tarefas urgentes
 */
function checkUrgentTasks() {
    const urgentTasks = tasks.filter(task => 
        !task.completed && isTaskUrgent(task.date)
    );

// Mostrar a mensagem de alerta a cada 5 minutos
    if (urgentTasks.length > 0) {
    showAlert(
        `Atenção! Você tem ${urgentTasks.length} tarefa(s) urgente(s) para concluir hoje!`, 
        'warning'
    );
}

/**
    if (urgentTasks.length > 0) {
        // Só notifica uma vez por sessão para não ser invasivo
        const notifiedToday = sessionStorage.getItem('urgentNotified');
        const today = new Date().toDateString();
        
        if (notifiedToday !== today) {
            showAlert(
                `Atenção! Você tem ${urgentTasks.length} tarefa(s) urgente(s) para concluir hoje!`, 
                'warning'
            );
            sessionStorage.setItem('urgentNotified', today);
        }
    }
}
*/


// Verifica tarefas urgentes a cada 5 minutos
setInterval(checkUrgentTasks, 5 * 60 * 1000);
// Verifica imediatamente quando a página carrega (após 3 segundos)
setTimeout(checkUrgentTasks, 3000);

/**
 * === ANÁLISE DE PRODUTIVIDADE ===
 * Calcula métricas de produtividade do usuário
 */
function getProductivityAnalysis() {
    if (tasks.length === 0) return null;

    const completedTasks = tasks.filter(task => task.completed);
    const completionRate = (completedTasks.length / tasks.length) * 100;
    
    // Calcula tarefas concluídas na última semana
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentCompletions = completedTasks.filter(task => {
        const completedDate = new Date(task.createdAt);
        return completedDate >= oneWeekAgo;
    }).length;

    return {
        completionRate: Math.round(completionRate),
        recentCompletions: recentCompletions,
        totalCompleted: completedTasks.length,
        averagePerWeek: Math.round(recentCompletions)
    };
}

/**
 * === LOG DE DESENVOLVIMENTO ===
 * Registra ações para debug (apenas em ambiente de desenvolvimento)
 */
function logAction(action, details = {}) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`[Organizador de Tarefas] ${action}:`, details);
    }
}

// Registra carregamento inicial
logAction('Sistema inicializado', { tasksCount: tasks.length });

/**
 * === EASTER EGG: MODO NOTURNO ===
 * Permite alternar entre tema claro e escuro
 */
let darkModeEnabled = localStorage.getItem('darkMode') === 'true';

function toggleDarkMode() {
    darkModeEnabled = !darkModeEnabled;
    document.body.classList.toggle('dark-mode', darkModeEnabled);
    localStorage.setItem('darkMode', darkModeEnabled);
    
    showAlert(
        darkModeEnabled ? 'Modo noturno ativado!' : 'Modo claro ativado!', 
        'info'
    );
}

//  modo escuro 
if (darkModeEnabled) {
    document.body.classList.add('dark-mode');
}

// ativando modo escuro: ←→BA konamicode
let konamiCode = [];
const konamiSequence = [
    
    'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    konamiCode = konamiCode.slice(-konamiSequence.length);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        toggleDarkMode();
        konamiCode = [];
    }
});

/**
 * === FUNÇÃO FINAL DE LIMPEZA ===
 * Executada quando a página é fechada (para estatísticas)
 */
window.addEventListener('beforeunload', function() {
    // Salva timestamp da última sessão
    localStorage.setItem('lastSession', new Date().toISOString());
    
    // Log da sessão (apenas em desenvolvimento)
    logAction('Sessão finalizada', {
        tasksCount: tasks.length,
        completedInSession: tasks.filter(task => task.completed).length,
        sessionDuration: 'N/A'
    });
});

// === FIM DO SISTEMA ===
console.log('✅ Organizador de Tarefas da Sala - Sistema carregado com sucesso!');