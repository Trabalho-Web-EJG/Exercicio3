document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("tasks")) {
    // Tarefas fictícias
    const sampleTasks = [
      {
        id: Date.now(),
        text: "Estudar JavaScript para o projeto",
        date: getFutureDate(3),
        completed: false,
      },
      {
        id: Date.now() + 1,
        text: "Revisar CSS e Bootstrap",
        date: getFutureDate(5),
        completed: false,
      },
      {
        id: Date.now() + 2,
        text: "Entregar atividade no AVA",
        date: getFutureDate(7),
        completed: false,
      }
    ];
    saveTasks(sampleTasks);
  }
  renderTasks();
});

document.getElementById("add-task").addEventListener("click", () => {
  const taskText = document.getElementById("task-input").value.trim();
  const taskDate = document.getElementById("date-input").value;

  if (!taskText || !taskDate) return;

  const tasks = loadTasks();
  tasks.push({
    id: Date.now(),
    text: taskText,
    date: taskDate,
    completed: false,
  });

  saveTasks(tasks);
  clearInputs();
  renderTasks();
});

function toggleTask(id) {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === id);
  task.completed = !task.completed;
  saveTasks(tasks);
  renderTasks();
}

function deleteTask(id) {
  const tasks = loadTasks().filter(t => t.id !== id);
  saveTasks(tasks);
  renderTasks();
}

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderTasks(btn.dataset.filter);
  });
});

function loadTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function clearInputs() {
  document.getElementById("task-input").value = "";
  document.getElementById("date-input").value = "";
}

function renderTasks(filter = "all") {
  const list = document.getElementById("task-list");
  list.innerHTML = "";
  let tasks = loadTasks();

  tasks.sort((a, b) => new Date(a.date) - new Date(b.date));

  if (filter === "pending") tasks = tasks.filter(t => !t.completed);
  else if (filter === "completed") tasks = tasks.filter(t => t.completed);

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `list-group-item d-flex justify-content-between align-items-center fade-in ${task.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <div>
        <strong>${task.text}</strong> <small class="text-muted">(${task.date})</small>
      </div>
      <div>
        <button class="btn btn-sm btn-outline-success me-2" onclick="toggleTask(${task.id})">✓</button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteTask(${task.id})">✕</button>
      </div>
    `;

    list.appendChild(li);
  });

  if (tasks.length === 0) {
    const emptyMsg = document.createElement("li");
    emptyMsg.className = "list-group-item text-center text-muted";
    emptyMsg.innerText = "Nenhuma tarefa encontrada.";
    list.appendChild(emptyMsg);
  }
}

// Função utilitária para datas futuras
function getFutureDate(daysAhead) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0]; // formato yyyy-mm-dd
}
