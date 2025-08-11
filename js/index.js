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
 * Cria 6 tarefas fictícias para demonstração
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
                date: getDatePlusDays(3),
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

    // Remove automaticamente após 10 segundos
    setTimeout(() => {
        if (alert && alert.parentNode) {
            alert.remove();
        }
    }, 10000);
}

/**
 * Salva as tarefas no localStorage
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
}

// Verifica tarefas urgentes a cada 5 minutos
setInterval(checkUrgentTasks, 5 * 60 * 1000);
// Verifica imediatamente quando a página carrega (após 2 segundos)
setTimeout(checkUrgentTasks, 2000);

// === INICIALIZAÇÃO FINAL ===
console.log('✅ Organizador de Tarefas da Sala - Sistema carregado com sucesso!');