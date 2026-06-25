/**
 * CareerLaunch Hub - Authentication & Routing System
 */

// Immediate Protection Check to Prevent Content Flashing
(function() {
  const protectedPages = [
    'dashboard.html', 
    'interview.html', 
    'quiz.html', 
    'resume-analyzer.html', 
    'resources.html', 
    'profile.html',
    'interview-simulator.html',
    'coding-playground.html',
    'roadmaps.html',
    'notes.html',
    'study-planner.html'
  ];
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  if (protectedPages.includes(currentPage)) {
    const sessionUser = sessionStorage.getItem('cla_session_user');
    const rememberUser = localStorage.getItem('cla_remember_user');
    
    if (!sessionUser && !rememberUser) {
      // Force redirect to login page if unauthorized
      window.location.replace('login.html');
    } else if (!sessionUser && rememberUser) {
      // Auto-restore session from Remember Me
      sessionStorage.setItem('cla_session_user', rememberUser);
      sessionStorage.setItem('cla_session_start', Date.now().toString());
    }
  }
})();

const Auth = {
  USERS_KEY: 'cla_users',
  SESSION_USER_KEY: 'cla_session_user',
  SESSION_START_KEY: 'cla_session_start',
  REMEMBER_KEY: 'cla_remember_user',

  init() {
    this.bindEvents();
    this.updateUI();
  },

  getRegisteredUsers() {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  },

  saveRegisteredUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  },

  register(fullName, email, username, password) {
    const users = this.getRegisteredUsers();
    
    // Check uniqueness
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, message: 'Username is already taken' };
    }
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'Email address is already registered' };
    }

    const newUser = {
      fullName,
      email,
      username,
      password, // In a real application, passwords must be hashed.
      joinDate: new Date().toISOString(),
      lastLoginDate: new Date().toISOString(),
      profile: {
        avatar: this.generateAvatarInitials(fullName),
        bio: 'Aspiring Software Engineer',
        title: 'Developer'
      },
      stats: {
        questionsPracticed: 0,
        practicedQuestionIds: [],
        quizzesAttempted: 0,
        highestScore: 0,
        averageScore: 0
      },
      progress: {
        quizzes: [],
        stats: {
          totalQuizzes: 0,
          highestScore: 0,
          averageScore: 0,
          totalCorrect: 0,
          totalQuestions: 0
        }
      },
      favorites: [],
      achievements: ['badge_first_login'], // First Login automatically unlocked
      dailyAnalytics: {
        streak: 1,
        lastVisit: new Date().toDateString(),
        activityLogs: {}
      }
    };

    users.push(newUser);
    this.saveRegisteredUsers(users);
    
    // Auto-login after registration
    this.setSession(username);
    return { success: true };
  },

  login(usernameOrEmail, password, rememberMe = false) {
    const users = this.getRegisteredUsers();
    const user = users.find(u => 
      (u.username.toLowerCase() === usernameOrEmail.toLowerCase() || 
       u.email.toLowerCase() === usernameOrEmail.toLowerCase()) && 
      u.password === password
    );

    if (!user) {
      return { success: false, message: 'Invalid username/email or password' };
    }

    // Set last login time
    user.lastLoginDate = new Date().toISOString();
    
    // Update streak data
    if (user.dailyAnalytics) {
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
      }
    } else {
      user.dailyAnalytics = {
        streak: 1,
        lastVisit: new Date().toDateString(),
        activityLogs: {}
      };
    }

    // Check streak achievements
    if (user.dailyAnalytics.streak >= 7 && !user.achievements.includes('badge_7_streak')) {
      user.achievements.push('badge_7_streak');
    }
    if (user.dailyAnalytics.streak >= 30 && !user.achievements.includes('badge_30_streak')) {
      user.achievements.push('badge_30_streak');
    }

    this.saveRegisteredUsers(users);
    
    this.setSession(user.username);
    
    if (rememberMe) {
      localStorage.setItem(this.REMEMBER_KEY, user.username);
    } else {
      localStorage.removeItem(this.REMEMBER_KEY);
    }

    return { success: true, user };
  },

  logout() {
    sessionStorage.removeItem(this.SESSION_USER_KEY);
    sessionStorage.removeItem('cla_session_active');
    sessionStorage.removeItem(this.SESSION_START_KEY);
    localStorage.removeItem(this.REMEMBER_KEY);
    window.location.href = 'login.html';
  },

  resetPassword(email) {
    const users = this.getRegisteredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return { success: false, message: 'No account found with this email' };
    }
    
    // Simulated Password Reset (sets password to 'Temp123!' or displays success toast)
    return { success: true, message: 'Simulated password reset email sent successfully!' };
  },

  setSession(username) {
    sessionStorage.setItem(this.SESSION_USER_KEY, username);
    sessionStorage.setItem('cla_session_active', 'true');
    sessionStorage.setItem(this.SESSION_START_KEY, Date.now().toString());
  },

  generateAvatarInitials(fullName) {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  },

  updateUI() {
    // Check if user is logged in and render profile widgets in sidebars
    const sessionUser = sessionStorage.getItem(this.SESSION_USER_KEY);
    if (!sessionUser) return;

    const users = this.getRegisteredUsers();
    const user = users.find(u => u.username === sessionUser || u.email === sessionUser);
    if (!user) return;

    // Dynamically inject Profile sidebar elements if present
    const sidebarFooter = document.querySelector('.sidebar-footer');
    if (sidebarFooter && !document.getElementById('sidebar-profile')) {
      const profileCard = document.createElement('div');
      profileCard.id = 'sidebar-profile';
      profileCard.className = 'sidebar-profile-card';
      profileCard.innerHTML = `
        <div class="sidebar-avatar-circle">${user.profile.avatar}</div>
        <div class="sidebar-profile-details">
          <div class="sidebar-profile-name">${user.fullName}</div>
          <button id="sidebar-logout" class="sidebar-logout-btn">Logout ➔</button>
        </div>
      `;
      sidebarFooter.insertBefore(profileCard, sidebarFooter.firstChild);
      
      document.getElementById('sidebar-logout')?.addEventListener('click', () => {
        this.logout();
      });
    }

    // Set Welcome back message inside main dashboard page if available
    const greetingEl = document.getElementById('dashboard-greeting');
    if (greetingEl) {
      const hour = new Date().getHours();
      const greetText = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
      greetingEl.textContent = `${greetText}, ${user.fullName}`;
    }
  },

  bindEvents() {
    document.addEventListener('DOMContentLoaded', () => {
      this.updateUI();
    });
  }
};

Auth.bindEvents();
window.Auth = Auth;
