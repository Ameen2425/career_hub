/**
 * CareerLaunch Hub - Dashboard Page Module
 */

const DashboardPage = {
  charts: {},

  init() {
    this.renderWelcome();
    this.renderStats();
    this.renderCharts();
    this.renderWidgets();
    this.renderRecentActivity();
  },

  renderWelcome() {
    const quote = App.getDailyQuote();
    const quoteEl = document.getElementById('dashboard-quote');
    const authorEl = document.getElementById('dashboard-quote-author');
    if (quoteEl) quoteEl.textContent = `"${quote.text}"`;
    if (authorEl) authorEl.textContent = `— ${quote.author}`;

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const greetEl = document.getElementById('dashboard-greeting');
    if (greetEl) greetEl.textContent = greeting;
  },

  renderStats() {
    const stats = App.getDashboardStats();
    const items = [
      { id: 'dash-practiced', value: stats.questionsPracticed, suffix: '' },
      { id: 'dash-quizzes', value: stats.quizzesCompleted, suffix: '' },
      { id: 'dash-avg-score', value: stats.averageQuizScore, suffix: '%' },
      { id: 'dash-resume', value: stats.resumeScore, suffix: '%' },
      { id: 'dash-learning-progress', value: stats.learningProgress, suffix: '%' }
    ];

    items.forEach(({ id, value, suffix }) => {
      const el = document.getElementById(id);
      if (el) App.animateCounter(el, value, 1800, suffix);
    });
  },

  renderCharts() {
    if (typeof Chart === 'undefined') return;

    this.renderWeeklyProgress();
    this.renderMonthlyPlannerProductivity();
    this.renderResumeTracking();
  },

  renderWeeklyProgress() {
    const canvas = document.getElementById('weekly-progress-chart');
    if (!canvas) return;

    const logs = Analytics.getWeeklyActivityLogs();

    if (this.charts.weekly) this.charts.weekly.destroy();

    this.charts.weekly = new Chart(canvas, {
      type: 'line',
      data: {
        labels: logs.dates,
        datasets: [
          {
            label: 'Study Time (m)',
            data: logs.studyTimeMinutes,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.05)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#6366f1'
          },
          {
            label: 'Questions View',
            data: logs.questionsViewed,
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.05)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#06b6d4'
          },
          {
            label: 'Mock Quizzes',
            data: logs.quizzesAttempted,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#10b981'
          },
          {
            label: 'Mock Interviews',
            data: logs.interviewsSimulated,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.05)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#f59e0b'
          },
          {
            label: 'Code Runs',
            data: logs.codeRuns,
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.05)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#8b5cf6'
          }
        ]
      },
      options: {
        ...this.getChartOptions('Weekly Activity Profile'),
        plugins: {
          legend: { display: true, labels: { color: '#94a3b8', boxWidth: 12 } }
        }
      }
    });
  },

  renderMonthlyPlannerProductivity() {
    const canvas = document.getElementById('monthly-planner-chart');
    if (!canvas) return;

    const tasks = App.getPlannerTasks();
    
    // Group goals count completed vs remaining by category
    const categories = ['Interview Practice', 'Coding Practice', 'Resume Improvement', 'Mock Tests'];
    const shortLabels = ['Interviews', 'Coding', 'Resume', 'Tests'];
    
    const completedCounts = categories.map(() => 0);
    const totalCounts = categories.map(() => 0);

    tasks.forEach(t => {
      const idx = categories.indexOf(t.category);
      if (idx !== -1) {
        totalCounts[idx]++;
        if (t.completed) {
          completedCounts[idx]++;
        }
      }
    });

    if (this.charts.planner) this.charts.planner.destroy();

    this.charts.planner = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: shortLabels,
        datasets: [
          {
            label: 'Completed',
            data: completedCounts,
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderColor: '#10b981',
            borderWidth: 1,
            borderRadius: 6
          },
          {
            label: 'Total Active',
            data: totalCounts,
            backgroundColor: 'rgba(99, 102, 241, 0.3)',
            borderColor: '#6366f1',
            borderWidth: 1,
            borderRadius: 6
          }
        ]
      },
      options: {
        ...this.getChartOptions('Planner Productivity'),
        scales: {
          y: { beginAtZero: true, ticks: { color: '#94a3b8', stepSize: 1 }, grid: { color: 'rgba(148,163,184,0.1)' } },
          x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
        },
        plugins: {
          legend: { display: true, labels: { color: '#94a3b8', boxWidth: 12 } }
        }
      }
    });
  },

  renderResumeTracking() {
    const canvas = document.getElementById('resume-tracking-chart');
    if (!canvas) return;

    const resume = App.getResumeData();
    const history = resume.history.slice(0, 6).reverse();

    if (this.charts.resume) this.charts.resume.destroy();

    this.charts.resume = new Chart(canvas, {
      type: 'line',
      data: {
        labels: history.length ? history.map((h, i) => `Scan ${i + 1}`) : ['Current'],
        datasets: [{
          label: 'Resume Score',
          data: history.length ? history.map(h => h.score) : [resume.score || 0],
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6, 182, 212, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#06b6d4'
        }]
      },
      options: {
        ...this.getChartOptions('Resume Score Trend'),
        scales: {
          y: { beginAtZero: true, max: 100, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } },
          x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
        }
      }
    });
  },

  getChartOptions(title) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: false }
      },
      scales: {
        y: { beginAtZero: true, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } },
        x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
      }
    };
  },

  renderWidgets() {
    const stats = App.getDashboardStats();
    
    // 1. Today's Goal Progress (Radial widget)
    const radialFill = document.getElementById('dash-radial-fill');
    const radialText = document.getElementById('dash-radial-text');
    const radialDesc = document.getElementById('dash-radial-desc');
    
    if (radialFill && radialText && radialDesc) {
      const percentage = stats.goalCompletionRate;
      // Circumference of r=50 is 2*PI*50 = 314
      const offset = 314 - (314 * percentage / 100);
      radialFill.style.strokeDashoffset = offset;
      
      App.animateCounter(radialText, percentage, 1200, '%');
      
      const tasks = App.getPlannerTasks();
      const dailyTasks = tasks.filter(t => t.period === 'daily');
      const completed = dailyTasks.filter(t => t.completed).length;
      
      if (dailyTasks.length === 0) {
        radialDesc.textContent = "No daily goals created yet.";
      } else {
        radialDesc.textContent = `${completed}/${dailyTasks.length} daily goals completed`;
      }
    }

    // 2. Upcoming Goals (Task Checklist)
    const upcomingContainer = document.getElementById('dash-upcoming-tasks');
    if (upcomingContainer) {
      const tasks = App.getPlannerTasks().filter(t => !t.completed).slice(0, 3);
      if (tasks.length === 0) {
        upcomingContainer.innerHTML = '<p style="color:var(--text-muted); font-size:0.875rem; text-align:center; padding:16px;">No upcoming goals active.</p>';
      } else {
        upcomingContainer.innerHTML = tasks.map(t => `
          <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:var(--bg-glass); border:1px solid var(--border-glass); border-radius:var(--radius-sm);">
            <div style="display:flex; align-items:center; gap:8px;">
              <input type="checkbox" id="dash-task-chk-${t.id}" onchange="DashboardPage.toggleDashTask(${t.id}, this.checked)" style="cursor:pointer; width:16px; height:16px;">
              <span style="font-size:0.875rem; color:var(--text-primary);">${t.text}</span>
            </div>
            <span style="font-size:0.7rem; padding:2px 6px; border-radius:10px; background:var(--bg-tertiary); color:var(--text-secondary);">${t.category.split(' ')[0]}</span>
          </div>
        `).join('');
      }
    }

    // 3. Recent Notes (Pinned widget list)
    const notesContainer = document.getElementById('dash-recent-notes');
    if (notesContainer) {
      const pinnedNotes = App.getNotes().filter(n => n.isPinned).slice(0, 2);
      if (pinnedNotes.length === 0) {
        notesContainer.innerHTML = '<p style="color:var(--text-muted); font-size:0.875rem; text-align:center; padding:16px;">No pinned notes. Pin notes inside Personal Notes page to feature them here.</p>';
      } else {
        notesContainer.innerHTML = pinnedNotes.map(n => `
          <div style="padding:10px 14px; background:var(--bg-glass); border:1px solid rgba(99, 102, 241, 0.3); border-radius:var(--radius-sm); position:relative;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <strong style="font-size:0.875rem; color:var(--text-primary);">${n.title}</strong>
              <span style="font-size:0.7rem; color:var(--primary-light); font-weight:700; text-transform:uppercase;">📌 Pinned</span>
            </div>
            <p style="font-size:0.8125rem; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${n.content}</p>
          </div>
        `).join('');
      }
    }

    // 4. Roadmap progress paths widget
    const roadmapsContainer = document.getElementById('dash-roadmaps-progress');
    if (roadmapsContainer) {
      const roadmaps = [
        { key: 'python', label: 'Full Stack Python', icon: '🐍' },
        { key: 'frontend', label: 'Frontend Developer', icon: '🎨' },
        { key: 'backend', label: 'Backend Developer', icon: '⚙️' }
      ];
      
      const roadmapProgMap = App.getRoadmapProgress();
      
      roadmapsContainer.innerHTML = roadmaps.map(road => {
        const roadProgress = roadmapProgMap[road.key] || {};
        // Count completions of active keys
        // We know each has 5 milestones
        let total = 5;
        let checked = Object.values(roadProgress).filter(v => v === true).length;
        const percent = Math.round((checked / total) * 100);
        
        return `
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; font-size:0.8125rem;">
              <span>${road.icon} ${road.label}</span>
              <strong style="color:var(--primary-light);">${percent}%</strong>
            </div>
            <div style="width:100%; height:6px; background:var(--bg-tertiary); border-radius:3px; overflow:hidden;">
              <div style="height:100%; width:${percent}%; background:var(--gradient-hero);"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // 5. Interview Simulator latest session summary
    const simSummaryContainer = document.getElementById('dash-simulator-summary');
    if (simSummaryContainer) {
      const history = App.getInterviewHistory();
      if (history.length === 0) {
        simSummaryContainer.innerHTML = '<p style="color:var(--text-muted); font-size:0.8125rem; margin:0;">No simulator session records found. Launch the simulator to practice technical dialogues.</p>';
      } else {
        const last = history[0];
        const avg = Math.round((last.scores.technical + last.scores.communication + last.scores.confidence) / 3);
        const dateFormatted = App.formatDate(last.date);
        
        simSummaryContainer.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong style="font-size:0.9rem; color:var(--text-primary); text-transform:uppercase;">${last.mode} Interview</strong>
              <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Completed on ${dateFormatted}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:1.25rem; font-weight:800; color:var(--primary-light);">${avg}%</div>
              <div style="font-size:0.7rem; color:var(--text-secondary);">Avg Rating</div>
            </div>
          </div>
        `;
      }
    }

    // 6. Playground compile count loading
    const playCounter = document.getElementById('dash-playground-count');
    if (playCounter) {
      playCounter.textContent = stats.playgroundRunsCount;
    }
  },

  toggleDashTask(taskId, isChecked) {
    const tasks = App.getPlannerTasks();
    const idx = tasks.findIndex(t => t.id === taskId);
    if (idx !== -1) {
      tasks[idx].completed = isChecked;
      if (isChecked) App.trackPerformanceEvent('taskCompleted');
      
      App.savePlannerTasks(tasks);
      this.renderWidgets();
      this.renderStats();
      this.renderCharts();
      App.showToast(isChecked ? 'Goal marked completed!' : 'Goal marked incomplete', 'info');
    }
  },

  renderRecentActivity() {
    const container = document.getElementById('recent-activity');
    if (!container) return;

    const progress = App.getProgress();
    const resume = App.getResumeData();
    const notes = App.getNotes();
    const history = App.getInterviewHistory();
    const activities = [];

    // Pull Mock Quiz results
    progress.quizzes.slice(0, 3).forEach(q => {
      activities.push({
        icon: '🧠',
        text: `Completed mock quiz: ${q.percentage}% (${q.score}/${q.total}) in ${q.category}`,
        time: q.date
      });
    });

    // Pull Resume Scan logs
    resume.history.slice(0, 3).forEach(h => {
      activities.push({
        icon: '📄',
        text: `Analyzed resume "${h.fileName}" — Score: ${h.score}%`,
        time: h.date
      });
    });

    // Pull Notes details
    notes.slice(0, 3).forEach(n => {
      activities.push({
        icon: '📝',
        text: `Created notebook note: "${n.title}" tagged [${n.category}]`,
        time: n.lastModified
      });
    });

    // Pull Interview Simulator logs
    history.slice(0, 3).forEach(sim => {
      const avg = Math.round((sim.scores.technical + sim.scores.communication + sim.scores.confidence) / 3);
      activities.push({
        icon: '🤖',
        text: `Simulated mock ${sim.mode.toUpperCase()} interview — Rating: ${avg}%`,
        time: sim.date
      });
    });

    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    if (activities.length === 0) {
      container.innerHTML = '<p class="activity-empty">No recent activity. Start practicing, planning, or mock testing!</p>';
      return;
    }

    container.innerHTML = activities.slice(0, 5).map(a => `
      <div class="activity-item">
        <span class="activity-icon">${a.icon}</span>
        <div class="activity-content">
          <p>${a.text}</p>
          <span class="activity-time">${App.formatDateTime(a.time)}</span>
        </div>
      </div>`).join('');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('dashboard-page')) DashboardPage.init();
});

// Bind window variables for direct HTML onclick triggers
window.DashboardPage = DashboardPage;
window.addEventListener('themechange', () => DashboardPage.renderCharts());
