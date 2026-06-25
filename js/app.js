/**
 * CareerLaunch Hub - Core Application Module
 * Theme, navigation, storage, toasts, and shared utilities
 */

const App = {
  STORAGE_KEYS: {
    THEME: 'cla_theme',
    FAVORITES: 'cla_favorites',
    PROGRESS: 'cla_progress',
    STREAK: 'cla_streak',
    LAST_VISIT: 'cla_last_visit',
    RESUME: 'cla_resume',
    PRACTICED: 'cla_practiced',
    PRACTICED_IDS: 'cla_practiced_ids',
    USERS: 'cla_users'
  },

  init() {
    this.initTheme();
    this.initNavbar();
    this.initSidebar();
    this.initLoadingScreen();
    this.initStreak();
    this.setActiveNavLink();
    this.createToastContainer();
    this.initPageTransition();
  },

  initTheme() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEYS.THEME) || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeIcon(savedTheme);

    document.querySelectorAll('#theme-toggle, .theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => this.toggleTheme());
    });
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(this.STORAGE_KEYS.THEME, newTheme);
    this.updateThemeIcon(newTheme);
    window.dispatchEvent(new CustomEvent('themechange', { detail: newTheme }));
  },

  updateThemeIcon(theme) {
    document.querySelectorAll('#theme-toggle, .theme-toggle-btn').forEach(btn => {
      btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    });
  },

  initNavbar() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.navbar-nav');

    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
      });
    }

    if (menuToggle && navLinks) {
      menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
      });

      navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          menuToggle.classList.remove('active');
          navLinks.classList.remove('open');
        });
      });
    }
  },

  initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const toggle = document.getElementById('sidebar-toggle');

    if (toggle && sidebar) {
      toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay?.classList.toggle('visible');
      });
    }

    if (overlay && sidebar) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('visible');
      });
    }

    this.setActiveNavLink();
  },

  initLoadingScreen() {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      window.addEventListener('load', () => {
        setTimeout(() => loader.classList.add('hidden'), 500);
      });
    }
  },

  initPageTransition() {
    document.body.classList.add('page-loaded');
  },

  initStreak() {
    const user = this.getActiveUser();
    if (!user) return;
    
    if (!user.dailyAnalytics) {
      user.dailyAnalytics = { streak: 0, lastVisit: "", activityLogs: {} };
    }
    
    const today = new Date().toDateString();
    const lastVisit = user.dailyAnalytics.lastVisit;
    
    if (lastVisit !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastVisit === yesterday.toDateString()) {
        user.dailyAnalytics.streak += 1;
      } else {
        user.dailyAnalytics.streak = 1;
      }
      user.dailyAnalytics.lastVisit = today;
      
      if (window.ProfilePage && window.ProfilePage.checkAchievements) {
        window.ProfilePage.checkAchievements(user);
      }
      this.saveActiveUser(user);
    }
    
    document.querySelectorAll('#streak-count, .streak-count').forEach(el => {
      el.textContent = user.dailyAnalytics.streak;
    });
  },

  setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .sidebar-link').forEach(link => {
      const href = link.getAttribute('href');
      const isActive = href === currentPage || (currentPage === '' && href === 'index.html');
      link.classList.toggle('active', isActive);
    });
  },

  createToastContainer() {
    if (!document.querySelector('.toast-container')) {
      const container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
  },

  showToast(message, type = 'info') {
    const container = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  },

  // Auth Session Helpers
  getActiveUser() {
    const sessionUser = sessionStorage.getItem('cla_session_user');
    if (!sessionUser) return null;
    const users = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.USERS) || '[]');
    return users.find(u => u.username === sessionUser || u.email === sessionUser) || null;
  },

  saveActiveUser(user) {
    if (!user) return;
    const users = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.USERS) || '[]');
    const idx = users.findIndex(u => u.username === user.username);
    if (idx !== -1) {
      users[idx] = user;
      localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  },

  trackPerformanceEvent(eventType, value = null) {
    const user = this.getActiveUser();
    if (!user) return;
    
    const today = new Date().toDateString();
    if (!user.dailyAnalytics) {
      user.dailyAnalytics = { streak: 0, lastVisit: "", activityLogs: {} };
    }
    if (!user.dailyAnalytics.activityLogs) {
      user.dailyAnalytics.activityLogs = {};
    }
    if (!user.dailyAnalytics.activityLogs[today]) {
      user.dailyAnalytics.activityLogs[today] = {
        questionsViewed: 0,
        quizzesAttempted: 0,
        quizScores: [],
        studyTime: 0,
        favoritesAdded: 0,
        notesCreated: 0,
        tasksCompleted: 0,
        interviewsSimulated: 0,
        codeRuns: 0
      };
    }
    
    const log = user.dailyAnalytics.activityLogs[today];
    
    if (eventType === 'questionViewed') {
      log.questionsViewed += 1;
      user.stats.questionsPracticed = (user.stats.questionsPracticed || 0) + 1;
    } else if (eventType === 'quizCompleted') {
      log.quizzesAttempted += 1;
      if (value !== null) {
        log.quizScores.push(value);
      }
    } else if (eventType === 'favoriteAdded') {
      log.favoritesAdded += 1;
    } else if (eventType === 'noteCreated') {
      log.notesCreated = (log.notesCreated || 0) + 1;
    } else if (eventType === 'taskCompleted') {
      log.tasksCompleted = (log.tasksCompleted || 0) + 1;
    } else if (eventType === 'interviewCompleted') {
      log.interviewsSimulated = (log.interviewsSimulated || 0) + 1;
    } else if (eventType === 'codeRun') {
      log.codeRuns = (log.codeRuns || 0) + 1;
    }
    
    this.saveActiveUser(user);
    
    if (window.ProfilePage && window.ProfilePage.checkAchievements) {
      window.ProfilePage.checkAchievements(user);
    }
  },

  getFavorites() {
    const user = this.getActiveUser();
    return user ? (user.favorites || []) : [];
  },

  saveFavorite(questionId) {
    const user = this.getActiveUser();
    if (!user) return false;
    if (!user.favorites) user.favorites = [];
    if (!user.favorites.includes(questionId)) {
      user.favorites.push(questionId);
      this.saveActiveUser(user);
      this.showToast('Question saved to favorites!', 'success');
      this.trackPerformanceEvent('favoriteAdded');
      return true;
    }
    return false;
  },

  removeFavorite(questionId) {
    const user = this.getActiveUser();
    if (!user) return;
    if (!user.favorites) user.favorites = [];
    user.favorites = user.favorites.filter(id => id !== questionId);
    this.saveActiveUser(user);
    this.showToast('Removed from favorites', 'info');
  },

  isFavorite(questionId) {
    return this.getFavorites().includes(questionId);
  },

  toggleFavorite(questionId) {
    if (this.isFavorite(questionId)) {
      this.removeFavorite(questionId);
      return false;
    }
    this.saveFavorite(questionId);
    return true;
  },

  getProgress() {
    const user = this.getActiveUser();
    const fallback = { quizzes: [], stats: { totalQuizzes: 0, highestScore: 0, averageScore: 0, totalCorrect: 0, totalQuestions: 0 } };
    return user ? (user.progress || fallback) : fallback;
  },

  saveQuizResult(result) {
    const user = this.getActiveUser();
    if (!user) return this.getProgress();
    if (!user.progress) {
      user.progress = { quizzes: [], stats: { totalQuizzes: 0, highestScore: 0, averageScore: 0, totalCorrect: 0, totalQuestions: 0 } };
    }
    
    const progress = user.progress;
    progress.quizzes.unshift({
      id: Date.now(),
      date: new Date().toISOString(),
      score: result.score,
      total: result.total,
      percentage: result.percentage,
      category: result.category,
      timeTaken: result.timeTaken
    });

    if (progress.quizzes.length > 50) {
      progress.quizzes = progress.quizzes.slice(0, 50);
    }

    progress.stats.totalQuizzes = progress.quizzes.length;
    progress.stats.highestScore = Math.max(progress.stats.highestScore, result.percentage);
    progress.stats.totalCorrect += result.correct;
    progress.stats.totalQuestions += result.total;
    progress.stats.averageScore = Math.round(
      progress.quizzes.reduce((sum, q) => sum + q.percentage, 0) / progress.quizzes.length
    );

    user.stats.quizzesAttempted = progress.stats.totalQuizzes;
    user.stats.highestScore = progress.stats.highestScore;
    user.stats.averageScore = progress.stats.averageScore;

    this.saveActiveUser(user);
    this.trackPerformanceEvent('quizCompleted', result.percentage);
    return progress;
  },

  getPracticedCount() {
    const user = this.getActiveUser();
    return user ? (user.stats.questionsPracticed || 0) : 0;
  },

  getPracticedQuestionIds() {
    const user = this.getActiveUser();
    return user ? (user.stats.practicedQuestionIds || []) : [];
  },

  incrementPracticed(questionId) {
    const user = this.getActiveUser();
    if (!user) return 0;
    
    if (!user.stats.questionsPracticed) user.stats.questionsPracticed = 0;
    user.stats.questionsPracticed += 1;
    
    if (questionId) {
      if (!user.stats.practicedQuestionIds) user.stats.practicedQuestionIds = [];
      if (!user.stats.practicedQuestionIds.includes(questionId)) {
        user.stats.practicedQuestionIds.push(questionId);
      }
    }
    
    this.saveActiveUser(user);
    this.trackPerformanceEvent('questionViewed');
    return user.stats.questionsPracticed;
  },

  getResumeData() {
    const user = this.getActiveUser();
    const fallback = { score: 0, lastAnalyzed: null, history: [] };
    return user ? (user.resumeData || fallback) : fallback;
  },

  saveResumeData(data) {
    const user = this.getActiveUser();
    if (!user) return;
    user.resumeData = data;
    user.stats.resumeScore = data.score || 0;
    this.saveActiveUser(user);
  },

  // Notes System Storage
  getNotes() {
    const user = this.getActiveUser();
    return user ? (user.notes || []) : [];
  },

  saveNotes(notes) {
    const user = this.getActiveUser();
    if (!user) return;
    user.notes = notes;
    this.saveActiveUser(user);
  },

  // Roadmap Progress Storage
  getRoadmapProgress() {
    const user = this.getActiveUser();
    return user ? (user.roadmapProgress || {}) : {};
  },

  saveRoadmapProgress(progress) {
    const user = this.getActiveUser();
    if (!user) return;
    user.roadmapProgress = progress;
    this.saveActiveUser(user);
  },

  // Study Planner Storage
  getPlannerTasks() {
    const user = this.getActiveUser();
    return user ? (user.plannerTasks || []) : [];
  },

  savePlannerTasks(tasks) {
    const user = this.getActiveUser();
    if (!user) return;
    user.plannerTasks = tasks;
    this.saveActiveUser(user);
  },

  // Interview Simulator Storage
  getInterviewHistory() {
    const user = this.getActiveUser();
    return user ? (user.interviewHistory || []) : [];
  },

  saveInterviewResult(result) {
    const user = this.getActiveUser();
    if (!user) return;
    if (!user.interviewHistory) user.interviewHistory = [];
    user.interviewHistory.unshift(result);
    this.saveActiveUser(user);
  },

  // Coding Playground Storage
  getPlaygroundDrafts() {
    const user = this.getActiveUser();
    return user ? (user.playgroundDrafts || { html: '', css: '', js: '' }) : { html: '', css: '', js: '' };
  },

  savePlaygroundDrafts(drafts) {
    const user = this.getActiveUser();
    if (!user) return;
    user.playgroundDrafts = drafts;
    this.saveActiveUser(user);
  },

  getDashboardStats() {
    const user = this.getActiveUser();
    if (!user) {
      return {
        questionsPracticed: 0,
        quizzesCompleted: 0,
        averageQuizScore: 0,
        highestQuizScore: 0,
        resumeScore: 0,
        learningProgress: 0,
        favoritesCount: 0,
        streak: 0,
        notesCount: 0,
        goalCompletionRate: 0,
        roadmapProgressPercent: 0,
        playgroundRunsCount: 0,
        interviewsSimulatedCount: 0
      };
    }
    
    const progress = this.getProgress();
    const resume = this.getResumeData();
    const uniqueIds = this.getPracticedQuestionIds();
    const learningProgress = Math.min(100, Math.round((uniqueIds.length / 62) * 100));

    // Calculate Notes Count
    const notesCount = (user.notes || []).length;

    // Calculate Planner Task Completion Rate
    const tasks = user.plannerTasks || [];
    const completedTasks = tasks.filter(t => t.completed).length;
    const goalCompletionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    // Calculate Roadmap Progress Percent
    const roadmap = user.roadmapProgress || {};
    let totalRoadmapItems = 0;
    let checkedRoadmapItems = 0;
    Object.values(roadmap).forEach(rMap => {
      if (rMap && typeof rMap === 'object') {
        Object.values(rMap).forEach(val => {
          totalRoadmapItems++;
          if (val === true) checkedRoadmapItems++;
        });
      }
    });
    const roadmapProgressPercent = totalRoadmapItems > 0 ? Math.round((checkedRoadmapItems / totalRoadmapItems) * 100) : 0;

    // Calculate Playground runs count & Interview simulator count
    let codeRuns = 0;
    let interviewsSimulatedCount = (user.interviewHistory || []).length;
    if (user.dailyAnalytics && user.dailyAnalytics.activityLogs) {
      Object.values(user.dailyAnalytics.activityLogs).forEach(log => {
        codeRuns += log.codeRuns || 0;
      });
    }

    return {
      questionsPracticed: user.stats.questionsPracticed || 0,
      quizzesCompleted: progress.stats.totalQuizzes || 0,
      averageQuizScore: progress.stats.averageScore || 0,
      highestQuizScore: progress.stats.highestScore || 0,
      resumeScore: resume.score || 0,
      learningProgress,
      favoritesCount: this.getFavorites().length,
      streak: user.dailyAnalytics ? user.dailyAnalytics.streak : 0,
      notesCount,
      goalCompletionRate,
      roadmapProgressPercent,
      playgroundRunsCount: codeRuns,
      interviewsSimulatedCount
    };
  },

  launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#6366f1', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 10 + 5,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 3 + 2,
        angle: Math.random() * 360,
        spin: Math.random() * 10 - 5
      });
    }

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        p.y += p.speed;
        p.x += Math.sin(p.angle * Math.PI / 180) * 2;
        p.angle += p.spin;
      });

      frame++;
      if (frame < 200) requestAnimationFrame(animate);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    animate();
  },

  async shareScore(score, total, percentage) {
    const text = `I scored ${score}/${total} (${percentage}%) on CareerLaunch Hub! 🚀 Can you beat my score?`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'CareerLaunch Hub Quiz Score', text });
        this.showToast('Score shared successfully!', 'success');
      } catch (err) {
        if (err.name !== 'AbortError') this.copyToClipboard(text);
      }
    } else {
      this.copyToClipboard(text);
    }
  },

  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      this.showToast('Copied to clipboard!', 'success');
    }).catch(() => {
      this.showToast('Could not copy to clipboard', 'error');
    });
  },

  animateCounter(element, target, duration = 1800, suffix = '') {
    const startTime = performance.now();
    const isFloat = String(target).includes('.');

    const update = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      element.textContent = isFloat ? value.toFixed(1) + suffix : Math.floor(value) + suffix;

      if (progress < 1) requestAnimationFrame(update);
      else element.textContent = target + suffix;
    };

    requestAnimationFrame(update);
  },

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  formatDateTime(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  getScoreBadgeClass(percentage) {
    if (percentage >= 80) return 'high';
    if (percentage >= 50) return 'medium';
    return 'low';
  },

  getMotivationalQuotes() {
    return [
      { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
      { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
      { text: 'Your career is a marathon, not a sprint. Pace yourself and keep moving forward.', author: 'CareerLaunch Hub' },
      { text: 'Opportunities don\'t happen. You create them.', author: 'Chris Grosser' },
      { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
      { text: 'Every interview is practice for the one that changes everything.', author: 'CareerLaunch Hub' },
      { text: 'Don\'t watch the clock; do what it does. Keep going.', author: 'Sam Levenson' },
      { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt' }
    ];
  },

  getDailyQuote() {
    const quotes = this.getMotivationalQuotes();
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return quotes[dayOfYear % quotes.length];
  },

  showSkeleton(container, count = 4) {
    if (!container) return;
    container.innerHTML = Array(count).fill(`
      <div class="skeleton-card">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text short"></div>
      </div>
    `).join('');
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
