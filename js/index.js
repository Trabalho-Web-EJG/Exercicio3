//  VARIÁVEIS
let tasks = []; // Array de tarefas
let currentFilter = "all"; // Filtro atual

// === Teclas KONAMI CODE ===
const konamiCode = ["ArrowLeft", "ArrowRight", "KeyB", "KeyA"];
let konamiSequence = [];
let isDarkMode = localStorage.getItem("darkMode") === "true";

// === Elementos do DOM ===
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const tasksList = document.getElementById("tasksList");
const emptyState = document.getElementById("emptyState");
const filterButtons = document.querySelectorAll(".filter-btn");

// Elementos dos contadores
const totalTasksElement = document.getElementById("totalTasks");
const pendingTasksElement = document.getElementById("pendingTasks");
const completedTasksElement = document.getElementById("completedTasks");

//Inicia o sistema quando a página carrega

document.addEventListener("DOMContentLoaded", function () {
  loadTasks();
  setMinDate();
  setupEvents();
  createSampleTasks();
  initializeDarkMode();
  setupKonamiCode();
});

//Ativa modo escuro se estiver salvo

function initializeDarkMode() {
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
  }
}

//Configura o Konami Code

function setupKonamiCode() {
  document.addEventListener("keydown", function (event) {
    konamiSequence.push(event.code);

    if (konamiSequence.length > konamiCode.length) {
      konamiSequence.shift();
    }

    if (konamiSequence.length === konamiCode.length) {
      let isMatch = true;
      for (let i = 0; i < konamiCode.length; i++) {
        if (konamiSequence[i] !== konamiCode[i]) {
          isMatch = false;
          break;
        }
      }

      if (isMatch) {
        toggleDarkMode();
        konamiSequence = [];
      }
    }
  });
}

//Liga e desliga modo escuro

function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle("dark-mode", isDarkMode);

  try {
    localStorage.setItem("darkMode", isDarkMode);
  } catch (error) {
    console.warn("Não foi possível salvar modo escuro");
  }

  const message = isDarkMode
    ? "🌙 Modo escuro ativado!"
    : "☀️ Modo claro ativado!";

  showAlert(message, "info");
}

//Define data mínima como hoje

function setMinDate() {
  const today = new Date().toISOString().split("T")[0];
  dateInput.min = today;
  dateInput.value = today;
}

//Configura todos os eventos

function setupEvents() {
  taskForm.addEventListener("submit", handleSubmit);

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      setActiveFilter(button.dataset.filter);
    });
  });
}

// Cria tarefas de exemplo

function createSampleTasks() {
  if (tasks.length === 0) {
    const sampleTasks = [
      {
        id: generateId(),
        title: "Entregar trabalho de História",
        date: getDatePlusDays(7),
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: "Estudar para prova de Matemática",
        date: getDatePlusDays(2),
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: "Apresentar seminário de Biologia",
        date: getDatePlusDays(10),
        completed: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: "Entregar trabalho WEB - Matheus - Trier",
        date: getDatePlusDays(4),
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: "Fazer exercícios de Português",
        date: getDatePlusDays(1),
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ];

    tasks = sampleTasks;
    saveTasks();
    renderTasks();
    updateStats();
  }
}

// Gera data futura

function getDatePlusDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

//Gera ID único

function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 5);
}

//Processa novo formulário

function handleSubmit(e) {
  e.preventDefault();

  const title = taskInput.value.trim();
  const date = dateInput.value;

  if (!title || !date) {
    showAlert("Preencha todos os campos!", "danger");
    return;
  }

  // Verifica se a data não é antes de hoje
  const today = new Date().toISOString().split("T")[0];

  if (date < today) {
    showAlert("A data deve ser hoje ou futura!", "warning");
    return;
  }

  // Evita a adição de tarefas duplicadas
  if (taskExists(title)) {
    showAlert("Esta tarefa já existe!", "warning");
    return;
  }

  // Criação de nova tarefa
  const newTask = {
    id: generateId(),
    title: title,
    date: date,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  updateStats();

  taskForm.reset();
  setMinDate();

  showAlert("Tarefa adicionada!", "success");
}

// Verifica se tarefa já existe

function taskExists(title) {
  return tasks.some(
    (task) =>
      task.title.toLowerCase() === title.toLowerCase() && !task.completed
  );
}

// Mostra alertas

function showAlert(message, type) {
  const existingAlert = document.querySelector(".alert");
  if (existingAlert) {
    existingAlert.remove();
  }

  const alert = document.createElement("div");
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

  const controlsSection = document.querySelector(".controls-section");
  controlsSection.insertBefore(alert, controlsSection.firstChild);

  setTimeout(() => {
    if (alert && alert.parentNode) {
      alert.remove();
    }
  }, 4000);
}


 //Salva tarefas
 
function saveTasks() {
  try {
    localStorage.setItem("schoolTasks", JSON.stringify(tasks));
  } catch (error) {
    console.warn("Erro ao salvar");
  }
}


 //Carrega tarefas
 
function loadTasks() {
  try {
    const savedTasks = localStorage.getItem("schoolTasks");
    if (savedTasks) {
      tasks = JSON.parse(savedTasks);
      renderTasks();
      updateStats();
    }
  } catch (error) {
    console.warn("Erro ao carregar");
    tasks = [];
  }
}


 //Mostra tarefas na tela
 
function renderTasks() {
  const filteredTasks = getFilteredTasks();

  if (filteredTasks.length === 0) {
    tasksList.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  const sortedTasks = filteredTasks.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  tasksList.innerHTML = sortedTasks
    .map((task) => createTaskHTML(task))
    .join("");
}


 //Filtra tarefas
 
function getFilteredTasks() {
  switch (currentFilter) {
    case "pending":
      return tasks.filter((task) => !task.completed);
    case "completed":
      return tasks.filter((task) => task.completed);
    default:
      return tasks;
  }
}


 //Cria HTML da tarefa
 
function createTaskHTML(task) {
  const isUrgent = isTaskUrgent(task.date);
  const isNear = isTaskNear(task.date);

  let dateClass = "";
  if (isUrgent && !task.completed) {
    dateClass = "urgent";
  } else if (isNear && !task.completed) {
    dateClass = "near";
  }

  const formattedDate = formatDate(task.date);

  return `
        <div class="task-card ${
          task.completed ? "completed" : ""
        }" data-task-id="${task.id}">
            <div class="task-title">${task.title}</div>
            <div class="task-date ${dateClass}">
                <i class="bi bi-calendar"></i> ${formattedDate}
            </div>
            <div class="task-actions">
                ${
                  !task.completed
                    ? `
                    <button class="btn btn-success btn-sm" onclick="toggleTask('${task.id}')">
                        <i class="bi bi-check"></i> Concluir
                    </button>
                `
                    : `
                    <button class="btn btn-secondary btn-sm" onclick="toggleTask('${task.id}')">
                        <i class="bi bi-arrow-counterclockwise"></i> Reabrir
                    </button>
                `
                }
                <button class="btn btn-danger btn-sm" onclick="deleteTask('${
                  task.id
                }')">
                    <i class="bi bi-trash"></i> Excluir
                </button>
            </div>
        </div>
    `;
}


 // Verifica se é urgente
 
function isTaskUrgent(dateStr) {
  const taskDate = new Date(dateStr);
  const today = new Date();
  const diffTime = taskDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 1;
}


// Verifica se está próxima
 
function isTaskNear(dateStr) {
  const taskDate = new Date(dateStr);
  const today = new Date();
  const diffTime = taskDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 2 && diffDays <= 3;
}


 // Formata a data
 
function formatDate(dateStr) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR");
}


 // Marca/desmarca tarefa como concluída
 
function toggleTask(taskId) {
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex !== -1) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    saveTasks();
    renderTasks();
    updateStats();

    const message = tasks[taskIndex].completed
      ? "Tarefa concluída!"
      : "Tarefa reaberta!";

    showAlert(message, "success");
  }
}


 // Exclui uma tarefa
 
function deleteTask(taskId) {
  if (!confirm("Tem certeza que deseja excluir esta tarefa?")) {
    return;
  }

  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  renderTasks();
  updateStats();

  showAlert("Tarefa excluída!", "info");
}


// Define o filtro ativo
 
function setActiveFilter(filter) {
  currentFilter = filter;

  filterButtons.forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.filter === filter) {
      btn.classList.add("active");
    }
  });

  renderTasks();
}


 // Atualiza os contadores
 
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;

  totalTasksElement.textContent = total;
  pendingTasksElement.textContent = pending;
  completedTasksElement.textContent = completed;
}

// inicializacao debug javascript console
console.log("✅ Sistema carregado!");
console.log("🎮 Konami Code: ← → B A para modo escuro!");
