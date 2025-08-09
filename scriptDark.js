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

        // Ativa modo escuro se foi salvo anteriormente
        if (darkModeEnabled) {
            document.body.classList.add('dark-mode');
        }

        // Konami Code para ativar modo escuro: ↑↑↓↓←→←→BA
        let konamiCode = [];
        const konamiSequence = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
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
