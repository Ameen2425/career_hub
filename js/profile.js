/**
 * CareerLaunch AI - Profile and Achievements Page Module
 */

const ProfilePage = {
  charts: {},

  init() {
    this.renderProfileDetails();
    this.renderStatsSummary();
    this.renderCategoryRadar();
    this.renderAchievements();
    this.bindEvents();
  },

  renderProfileDetails() {
    const user = App.getActiveUser();
    if (!user) return;

    // Left display
    document.getElementById('profile-avatar-large').textContent = user.profile.avatar || 'U';
    document.getElementById('profile-fullname-display').textContent = user.fullName;
    document.getElementById('profile-title-display').textContent = user.profile.title || 'Aspiring Software Developer';
    document.getElementById('profile-username-display').textContent = '@' + user.username;
    document.getElementById('profile-bio-display').textContent = user.profile.bio || 'No bio added yet.';
    document.getElementById('profile-join-date').textContent = App.formatDate(user.joinDate);
    document.getElementById('profile-login-date').textContent = App.formatDateTime(user.lastLoginDate);

    // Edit form defaults
    document.getElementById('edit-fullname').value = user.fullName;
    document.getElementById('edit-title').value = user.profile.title || '';
    document.getElementById('edit-bio').value = user.profile.bio || '';
  },

  renderStatsSummary() {
    const user = App.getActiveUser();
    if (!user) return;

    const stats = App.getDashboardStats();
    
    // Calculate total study time
    let totalStudyTimeSeconds = 0;
    if (user.dailyAnalytics && user.dailyAnalytics.activityLogs) {
      Object.values(user.dailyAnalytics.activityLogs).forEach(log => {
        totalStudyTimeSeconds += log.studyTime || 0;
      });
    }
    const studyTimeMin = Math.round(totalStudyTimeSeconds / 60);

    // Consistency score
    const consistencyScore = Analytics.getConsistencyScore();

    // Render counts
    document.getElementById('stat-consistency').textContent = consistencyScore + '%';
    document.getElementById('stat-study-time').textContent = studyTimeMin + 'm';
    document.getElementById('stat-questions').textContent = stats.questionsPracticed;
    document.getElementById('stat-quizzes').textContent = stats.quizzesCompleted;
    document.getElementById('stat-highest').textContent = (user.stats.highestScore || 0) + '%';
    document.getElementById('stat-resume').textContent = stats.resumeScore + '%';
  },

  renderAchievements() {
    const user = App.getActiveUser();
    if (!user) return;

    // Check milestones and unlock badges
    this.checkAchievements(user);

    const achievements = user.achievements || [];

    // Redraw badge elements matching their state
    const badgeIds = [
      'badge_first_login', 'badge_7_streak', 'badge_30_streak', 
      'badge_first_quiz', 'badge_100_questions', 'badge_python_master', 
      'badge_javascript_master', 'badge_sql_master', 'badge_resume_expert'
    ];

    badgeIds.forEach(id => {
      const card = document.getElementById(id);
      if (!card) return;

      const isUnlocked = achievements.includes(id);
      const statusEl = card.querySelector('.achievement-status');

      if (isUnlocked) {
        card.classList.remove('locked');
        statusEl.textContent = 'Unlocked';
        statusEl.className = 'achievement-status unlocked';
      } else {
        card.classList.add('locked');
        statusEl.textContent = 'Locked';
        statusEl.className = 'achievement-status locked-badge';
      }
    });
  },

  checkAchievements(user) {
    if (!user) return;
    if (!user.achievements) user.achievements = [];

    let newlyUnlocked = false;

    // Helper: Unlocks badge if not already present
    const unlock = (badgeId, label) => {
      if (!user.achievements.includes(badgeId)) {
        user.achievements.push(badgeId);
        newlyUnlocked = true;
        App.showToast(`Achievement unlocked: ${label}! 🏆`, 'success');
      }
    };

    // 1. First Login (Automatically Unlocked)
    unlock('badge_first_login', 'First Login');

    // 2. Streaks
    const streak = user.dailyAnalytics ? user.dailyAnalytics.streak : 0;
    if (streak >= 7) unlock('badge_7_streak', '7-Day Streak');
    if (streak >= 30) unlock('badge_30_streak', '30-Day Streak');

    // 3. Quizzes completed
    const quizzesCount = user.progress ? user.progress.quizzes.length : 0;
    if (quizzesCount >= 1) unlock('badge_first_quiz', 'First Quiz Completed');

    // 4. Questions viewed
    const totalViewed = user.stats.questionsPracticed || 0;
    if (totalViewed >= 100) unlock('badge_100_questions', 'Century Club (100 Questions)');

    // 5. Category Masters (100% on specific quiz categories)
    if (user.progress && user.progress.quizzes) {
      user.progress.quizzes.forEach(q => {
        if (q.percentage === 100) {
          if (q.category === 'python') unlock('badge_python_master', 'Python Master');
          if (q.category === 'javascript') unlock('badge_javascript_master', 'JavaScript Master');
          if (q.category === 'sql') unlock('badge_sql_master', 'SQL Master');
        }
      });
    }

    // 6. Resume Expert (Score >= 85%)
    const resumeScore = user.resumeData ? user.resumeData.score : 0;
    if (resumeScore >= 85) unlock('badge_resume_expert', 'Resume Expert');

    if (newlyUnlocked) {
      App.saveActiveUser(user);
      setTimeout(() => { App.launchConfetti(); }, 200);
    }
  },

  renderCategoryRadar() {
    const canvas = document.getElementById('category-radar-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    const averages = Analytics.getCategoryAverages();

    if (this.charts.radar) this.charts.radar.destroy();

    this.charts.radar = new Chart(canvas, {
      type: 'radar',
      data: {
        labels: averages.labels,
        datasets: [{
          label: 'Your Average Score %',
          data: averages.data,
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          borderColor: '#6366f1',
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#6366f1'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: { display: false },
            grid: { color: 'rgba(148,163,184,0.2)' },
            angleLines: { color: 'rgba(148,163,184,0.2)' },
            pointLabels: { color: '#94a3b8', font: { size: 10, weight: 'bold' } }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  },

  bindEvents() {
    // Save Profile Changes
    const editForm = document.getElementById('edit-profile-form');
    editForm?.addEventListener('submit', (e) => {
      e.preventDefault();

      const user = App.getActiveUser();
      if (!user) return;

      const newFullName = document.getElementById('edit-fullname').value.trim();
      const newTitle = document.getElementById('edit-title').value.trim();
      const newBio = document.getElementById('edit-bio').value.trim();

      if (!newFullName) {
        App.showToast('Full name is required', 'error');
        return;
      }

      user.fullName = newFullName;
      user.profile.title = newTitle;
      user.profile.bio = newBio;
      user.profile.avatar = Auth.generateAvatarInitials(newFullName);

      App.saveActiveUser(user);
      App.showToast('Profile updated successfully!', 'success');
      
      // Reload UI elements
      this.renderProfileDetails();
      Auth.updateUI(); // Updates sidebar profile details
    });

    // Change Password
    const passwordForm = document.getElementById('change-password-form');
    passwordForm?.addEventListener('submit', (e) => {
      e.preventDefault();

      const user = App.getActiveUser();
      if (!user) return;

      const currentPwd = document.getElementById('current-password').value;
      const newPwd = document.getElementById('new-password').value;
      const confirmNewPwd = document.getElementById('confirm-new-password').value;

      // Reset error texts
      document.getElementById('current-password-error').textContent = '';
      document.getElementById('new-password-error').textContent = '';
      document.getElementById('confirm-new-password-error').textContent = '';

      let hasError = false;

      if (user.password !== currentPwd) {
        document.getElementById('current-password-error').textContent = 'Incorrect current password';
        hasError = true;
      }

      if (newPwd.length < 8) {
        document.getElementById('new-password-error').textContent = 'Password must be at least 8 characters long';
        hasError = true;
      } else if (!/[A-Z]/.test(newPwd) || !/[0-9]/.test(newPwd) || !/[^A-Za-z0-9]/.test(newPwd)) {
        document.getElementById('new-password-error').textContent = 'Password must include uppercase, number, and special character';
        hasError = true;
      }

      if (newPwd !== confirmNewPwd) {
        document.getElementById('confirm-new-password-error').textContent = 'Passwords do not match';
        hasError = true;
      }

      if (hasError) return;

      user.password = newPwd;
      App.saveActiveUser(user);
      App.showToast('Password updated successfully!', 'success');
      passwordForm.reset();
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('profile-avatar-large')) {
    ProfilePage.init();
  }
});

window.ProfilePage = ProfilePage;
window.addEventListener('themechange', () => ProfilePage.renderCategoryRadar());
