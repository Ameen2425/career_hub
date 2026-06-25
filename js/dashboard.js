/**
 * CareerLaunch AI - Dashboard Module
 */

const DashboardPage = {
  charts: {},

  init() {
    this.renderWelcome();
    this.renderStats();
    this.renderCharts();
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
    this.renderQuizPerformance();
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
            label: 'Study Time (Minutes)',
            data: logs.studyTimeMinutes,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#6366f1',
            pointRadius: 5
          },
          {
            label: 'Questions Practiced',
            data: logs.questionsViewed,
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#06b6d4',
            pointRadius: 5
          }
        ]
      },
      options: {
        ...this.getChartOptions('Weekly Activity Trend'),
        plugins: {
          legend: { display: true, labels: { color: '#94a3b8' } }
        }
      }
    });
  },

  renderQuizPerformance() {
    const canvas = document.getElementById('quiz-perf-chart');
    if (!canvas) return;

    const progress = App.getProgress();
    const recent = progress.quizzes.slice(0, 7).reverse();

    if (this.charts.quizPerf) this.charts.quizPerf.destroy();

    this.charts.quizPerf = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: recent.length ? recent.map((_, i) => `Quiz ${i + 1}`) : ['No data'],
        datasets: [{
          label: 'Score %',
          data: recent.length ? recent.map(q => q.percentage) : [0],
          backgroundColor: recent.map(q =>
            q.percentage >= 80 ? '#10b98199' : q.percentage >= 50 ? '#f59e0b99' : '#ef444499'),
          borderColor: recent.map(q =>
            q.percentage >= 80 ? '#10b981' : q.percentage >= 50 ? '#f59e0b' : '#ef4444'),
          borderWidth: 1,
          borderRadius: 8
        }]
      },
      options: {
        ...this.getChartOptions('Recent Quiz Scores'),
        scales: {
          y: { beginAtZero: true, max: 100, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } },
          x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
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
        y: { beginAtZero: true, ticks: { color: '#94a3b8', stepSize: 1 }, grid: { color: 'rgba(148,163,184,0.1)' } },
        x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
      }
    };
  },

  renderRecentActivity() {
    const container = document.getElementById('recent-activity');
    if (!container) return;

    const progress = App.getProgress();
    const resume = App.getResumeData();
    const activities = [];

    progress.quizzes.slice(0, 3).forEach(q => {
      activities.push({
        icon: '🧠',
        text: `Completed quiz: ${q.percentage}% (${q.score}/${q.total})`,
        time: q.date
      });
    });

    resume.history.slice(0, 3).forEach(h => {
      activities.push({
        icon: '📄',
        text: `Analyzed resume "${h.fileName}" — Score: ${h.score}%`,
        time: h.date
      });
    });

    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    if (activities.length === 0) {
      container.innerHTML = '<p class="activity-empty">No recent activity. Start practicing or scan your resume!</p>';
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

window.addEventListener('themechange', () => DashboardPage.renderCharts());
