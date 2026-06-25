/**
 * CareerLaunch Hub - Study Planner Logic
 */

const StudyPlanner = {
  tasks: [],
  activePeriod: 'daily',
  activeCategoryFilter: 'all',

  init() {
    this.loadTasks();
    this.bindEvents();
    this.renderTasks();
    this.updateAnalytics();
  },

  loadTasks() {
    this.tasks = App.getPlannerTasks();
  },

  bindEvents() {
    // Quick Add Submit
    document.getElementById('quick-add-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addTask();
    });

    // Period Tabs
    document.querySelectorAll('.period-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activePeriod = btn.getAttribute('data-period');
        
        document.querySelectorAll('.period-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        this.renderTasks();
        this.updateAnalytics();
      });
    });

    // Category Filter Tags
    document.querySelectorAll('.filter-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        this.activeCategoryFilter = tag.getAttribute('data-category');
        
        document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        
        this.renderTasks();
      });
    });
  },

  renderTasks() {
    const listContainer = document.getElementById('tasks-list-container');
    const emptyState = document.getElementById('tasks-empty-state');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    // Filter by period and category
    const filtered = this.tasks.filter(task => {
      const matchPeriod = task.period === this.activePeriod;
      const matchCategory = this.activeCategoryFilter === 'all' || task.category === this.activeCategoryFilter;
      return matchPeriod && matchCategory;
    });

    if (filtered.length === 0) {
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';

    // Render cards
    filtered.forEach(task => {
      const item = document.createElement('div');
      item.className = `task-item ${task.completed ? 'completed' : ''}`;
      
      item.innerHTML = `
        <div class="task-left">
          <input type="checkbox" id="task-chk-${task.id}" class="task-checkbox-input" ${task.completed ? 'checked' : ''}>
          <label for="task-chk-${task.id}" class="task-checkbox-label" title="Mark Completed"></label>
          <span class="task-text">${this.escapeHTML(task.text)}</span>
        </div>
        <div class="task-meta">
          <span class="task-cat-badge">${task.category}</span>
          <button class="task-delete-btn" onclick="StudyPlanner.deleteTask(${task.id})" title="Delete Goal">🗑️</button>
        </div>
      `;

      // Checkbox listener
      const checkbox = item.querySelector(`#task-chk-${task.id}`);
      checkbox.addEventListener('change', (e) => {
        this.toggleTask(task.id, e.target.checked);
      });

      listContainer.appendChild(item);
    });
  },

  addTask() {
    const inputEl = document.getElementById('task-text-input');
    const catSelect = document.getElementById('task-cat-select');
    if (!inputEl) return;

    const text = inputEl.value.trim();
    const category = catSelect.value;

    if (!text) {
      App.showToast('Please type a task description', 'warning');
      return;
    }

    const newTask = {
      id: Date.now(),
      text,
      category,
      period: this.activePeriod,
      completed: false,
      createdDate: new Date().toISOString()
    };

    this.tasks.push(newTask);
    App.savePlannerTasks(this.tasks);

    inputEl.value = '';
    
    this.renderTasks();
    this.updateAnalytics();
    App.showToast('Task added successfully!', 'success');
  },

  toggleTask(id, isChecked) {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.tasks[idx].completed = isChecked;
      
      if (isChecked) {
        App.trackPerformanceEvent('taskCompleted');
      }
      
      App.savePlannerTasks(this.tasks);
      this.renderTasks();
      this.updateAnalytics();
      App.showToast(isChecked ? 'Goal marked completed!' : 'Goal marked incomplete', 'info');
    }
  },

  deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.tasks = this.tasks.filter(t => t.id !== id);
      App.savePlannerTasks(this.tasks);
      this.renderTasks();
      this.updateAnalytics();
      App.showToast('Task deleted', 'info');
    }
  },

  updateAnalytics() {
    // Analytics calculations are done specifically for the current activePeriod
    const periodTasks = this.tasks.filter(t => t.period === this.activePeriod);
    const completed = periodTasks.filter(t => t.completed).length;
    const total = periodTasks.length;
    const remaining = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Update numbers text
    document.getElementById('total-tasks-val').textContent = total;
    document.getElementById('completed-tasks-val').textContent = completed;
    document.getElementById('remaining-tasks-val').textContent = remaining;

    // Animate radial circle
    // Circumference = 2 * PI * r = 2 * PI * 60 = 377
    const circle = document.getElementById('radial-fill-circle');
    const textPct = document.getElementById('radial-pct-text');
    
    if (circle && textPct) {
      const offset = 377 - (377 * percent / 100);
      circle.style.strokeDashoffset = offset;
      
      App.animateCounter(textPct, percent, 1000, '%');
    }

    // Dynamic header subtitle based on period
    const descMap = {
      daily: "Today's Goal Accomplishment",
      weekly: "Weekly Milestone Progress",
      monthly: "Monthly Objective Productivity"
    };
    document.getElementById('radial-subtitle').textContent = descMap[this.activePeriod];
  },

  escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};

document.addEventListener('DOMContentLoaded', () => StudyPlanner.init());
// Bind window variables for direct HTML onclick triggers
window.StudyPlanner = StudyPlanner;
