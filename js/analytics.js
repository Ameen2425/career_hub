/**
 * CareerLaunch AI - Performance Analytics Module
 */

const Analytics = {
  init() {
    this.startStudyTimer();
  },

  // Active Timer Tick: Updates today's study time in seconds every 10s
  startStudyTimer() {
    setInterval(() => {
      const user = App.getActiveUser();
      if (!user) return;

      const today = new Date().toDateString();
      if (!user.dailyAnalytics) {
        user.dailyAnalytics = { streak: 1, lastVisit: today, activityLogs: {} };
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
          favoritesAdded: 0
        };
      }

      user.dailyAnalytics.activityLogs[today].studyTime += 10; // Add 10 seconds
      App.saveActiveUser(user);
    }, 10000);
  },

  // Compile last 7 days of activity for charting
  getWeeklyActivityLogs() {
    const user = App.getActiveUser();
    const data = {
      dates: [],
      studyTimeMinutes: [],
      questionsViewed: [],
      quizzesAttempted: []
    };

    if (!user || !user.dailyAnalytics || !user.dailyAnalytics.activityLogs) {
      // Fallback empty week
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        data.dates.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
        data.studyTimeMinutes.push(0);
        data.questionsViewed.push(0);
        data.quizzesAttempted.push(0);
      }
      return data;
    }

    const logs = user.dailyAnalytics.activityLogs;

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toDateString();
      const dateLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      
      data.dates.push(dateLabel);

      if (logs[dateString]) {
        data.studyTimeMinutes.push(Math.round(logs[dateString].studyTime / 60)); // Convert to minutes
        data.questionsViewed.push(logs[dateString].questionsViewed || 0);
        data.quizzesAttempted.push(logs[dateString].quizzesAttempted || 0);
      } else {
        data.studyTimeMinutes.push(0);
        data.questionsViewed.push(0);
        data.quizzesAttempted.push(0);
      }
    }

    return data;
  },

  // Calculate learning consistency score: % of days active in last 30 days
  getConsistencyScore() {
    const user = App.getActiveUser();
    if (!user || !user.dailyAnalytics || !user.dailyAnalytics.activityLogs) return 0;

    const logs = user.dailyAnalytics.activityLogs;
    let activeDays = 0;

    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toDateString();

      if (logs[dateString]) {
        const item = logs[dateString];
        if (item.studyTime > 0 || item.questionsViewed > 0 || item.quizzesAttempted > 0) {
          activeDays++;
        }
      }
    }

    return Math.round((activeDays / 30) * 100);
  },

  // Get average scores per category for radar chart
  getCategoryAverages() {
    const user = App.getActiveUser();
    const categories = ['python', 'java', 'javascript', 'html', 'css', 'sql', 'aptitude', 'hr'];
    const labels = ['Python', 'Java', 'JavaScript', 'HTML', 'CSS', 'SQL', 'Aptitude', 'HR'];
    const scores = categories.map(() => 0);
    const counts = categories.map(() => 0);

    if (!user || !user.progress || !user.progress.quizzes) {
      return { labels, data: categories.map(() => 0) };
    }

    user.progress.quizzes.forEach(q => {
      const catIdx = categories.indexOf(q.category);
      if (catIdx !== -1) {
        scores[catIdx] += q.percentage;
        counts[catIdx]++;
      }
    });

    const averages = scores.map((sum, idx) => {
      return counts[idx] > 0 ? Math.round(sum / counts[idx]) : 0;
    });

    return { labels, data: averages };
  },

  // Get strengths and weaknesses based on category averages
  getAveragesSummary() {
    const averages = this.getCategoryAverages();
    const categories = averages.labels;
    const scores = averages.data;

    const list = categories.map((cat, idx) => ({ name: cat, score: scores[idx] }));
    
    // Filter categories with attempts
    const attempted = list.filter(item => item.score > 0);
    attempted.sort((a, b) => b.score - a.score);

    const strengths = attempted.filter(item => item.score >= 75).map(item => item.name);
    const weaknesses = attempted.filter(item => item.score < 50).map(item => item.name);

    return {
      strengths: strengths.length ? strengths : ['None yet (Complete more quizzes)'],
      weaknesses: weaknesses.length ? weaknesses : ['None yet']
    };
  }
};

Analytics.init();
window.Analytics = Analytics;
