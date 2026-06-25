/**
 * CareerLaunch AI - Mock Quiz Module
 */

const QuizPage = {
  questions: [],
  currentIndex: 0,
  answers: [],
  timer: null,
  timeRemaining: 0,
  totalTime: 0,
  category: 'all',
  questionCount: 10,
  charts: {},

  init() {
    this.bindEvents();
    this.showStartScreen();
    this.renderQuizHistory();
  },

  bindEvents() {
    document.getElementById('start-quiz')?.addEventListener('click', () => this.startQuiz());
    document.getElementById('prev-question')?.addEventListener('click', () => this.navigate(-1));
    document.getElementById('next-question')?.addEventListener('click', () => this.navigate(1));
    document.getElementById('restart-quiz')?.addEventListener('click', () => this.showStartScreen());
    document.getElementById('share-score')?.addEventListener('click', () => this.shareResults());
  },

  showStartScreen() {
    this.stopTimer();
    document.getElementById('quiz-start')?.classList.remove('hidden');
    document.getElementById('quiz-active')?.classList.add('hidden');
    document.getElementById('quiz-results')?.classList.add('hidden');
    this.renderQuizHistory();
  },

  startQuiz() {
    this.category = document.getElementById('quiz-category')?.value || 'all';
    this.questionCount = parseInt(document.getElementById('quiz-count')?.value || '10', 10);
    this.totalTime = parseInt(document.getElementById('quiz-time')?.value || '600', 10);

    let pool = QuizData;
    if (this.category !== 'all') pool = QuizData.filter(q => q.category === this.category);

    this.questions = this.shuffleArray([...pool]).slice(0, Math.min(this.questionCount, pool.length));
    this.currentIndex = 0;
    this.answers = new Array(this.questions.length).fill(null);
    this.timeRemaining = this.totalTime;

    document.getElementById('quiz-start')?.classList.add('hidden');
    document.getElementById('quiz-active')?.classList.remove('hidden');
    document.getElementById('quiz-results')?.classList.add('hidden');

    this.startTimer();
    this.renderQuestion();
  },

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  startTimer() {
    this.stopTimer();
    this.updateTimerDisplay();
    this.timer = setInterval(() => {
      this.timeRemaining--;
      this.updateTimerDisplay();
      if (this.timeRemaining <= 0) this.finishQuiz();
    }, 1000);
  },

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  updateTimerDisplay() {
    const el = document.getElementById('quiz-timer');
    if (!el) return;
    const mins = Math.floor(this.timeRemaining / 60);
    const secs = this.timeRemaining % 60;
    el.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    el.classList.toggle('warning', this.timeRemaining <= 60);
  },

  renderQuestion() {
    const q = this.questions[this.currentIndex];
    if (!q) return;

    const progress = ((this.currentIndex + 1) / this.questions.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('progress-text').textContent = `Question ${this.currentIndex + 1} of ${this.questions.length}`;
    document.getElementById('quiz-question-category').innerHTML = `<span class="category-badge ${q.category}">${q.category}</span>`;
    document.getElementById('quiz-question-text').textContent = q.question;

    const optionsContainer = document.getElementById('quiz-options');
    const letters = ['A', 'B', 'C', 'D'];

    optionsContainer.innerHTML = q.options.map((opt, i) => `
      <button class="quiz-option ${this.answers[this.currentIndex] === i ? 'selected' : ''}" data-index="${i}">
        <span class="option-letter">${letters[i]}</span><span>${opt}</span>
      </button>`).join('');

    optionsContainer.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        optionsContainer.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.answers[this.currentIndex] = parseInt(btn.dataset.index, 10);
      });
    });

    document.getElementById('prev-question').disabled = this.currentIndex === 0;
    document.getElementById('next-question').textContent =
      this.currentIndex === this.questions.length - 1 ? 'Finish Quiz' : 'Next →';
  },

  navigate(direction) {
    if (direction === 1 && this.currentIndex === this.questions.length - 1) {
      this.finishQuiz();
      return;
    }
    this.currentIndex = Math.max(0, Math.min(this.currentIndex + direction, this.questions.length - 1));
    this.renderQuestion();
  },

  finishQuiz() {
    this.stopTimer();
    const timeTaken = this.totalTime - this.timeRemaining;
    let correct = 0;
    this.questions.forEach((q, i) => { if (this.answers[i] === q.correct) correct++; });

    const total = this.questions.length;
    const percentage = Math.round((correct / total) * 100);

    App.saveQuizResult({ score: correct, total, correct, percentage, category: this.category, timeTaken });

    document.getElementById('quiz-active')?.classList.add('hidden');
    document.getElementById('quiz-results')?.classList.remove('hidden');
    document.getElementById('final-score').textContent = `${percentage}%`;
    document.getElementById('result-correct').textContent = correct;
    document.getElementById('result-incorrect').textContent = total - correct;
    document.getElementById('result-time').textContent = this.formatTime(timeTaken);

    this.renderAnalysis(correct, total);
    this.renderPerformanceChart(percentage);
    if (percentage >= 80) App.launchConfetti();
    this.lastResults = { correct, total, percentage, timeTaken };
  },

  renderAnalysis(correct, total) {
    const container = document.getElementById('quiz-analysis');
    if (!container) return;
    const letters = ['A', 'B', 'C', 'D'];

    container.innerHTML = this.questions.map((q, i) => {
      const userAnswer = this.answers[i];
      const isCorrect = userAnswer === q.correct;
      return `
        <div class="question-card" style="margin-bottom: 12px;">
          <div class="question-header" style="cursor: default;">
            <div class="question-info">
              <div class="question-meta">
                <span class="category-badge ${q.category}">${q.category}</span>
                <span class="difficulty-badge ${isCorrect ? 'easy' : 'hard'}">${isCorrect ? 'Correct' : 'Incorrect'}</span>
              </div>
              <div class="question-title">${i + 1}. ${q.question}</div>
            </div>
          </div>
          <div class="answer-content" style="padding: 16px 24px;">
            <p>Your answer: <strong>${userAnswer !== null ? letters[userAnswer] + '. ' + q.options[userAnswer] : 'Not answered'}</strong></p>
            ${!isCorrect ? `<p>Correct: <strong style="color: var(--success);">${letters[q.correct]}. ${q.options[q.correct]}</strong></p>` : ''}
          </div>
        </div>`;
    }).join('');
  },

  renderPerformanceChart(percentage) {
    const canvas = document.getElementById('quiz-performance-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    if (this.charts.performance) this.charts.performance.destroy();

    this.charts.performance = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Correct', 'Incorrect'],
        datasets: [{
          data: [percentage, 100 - percentage],
          backgroundColor: ['#10b981', '#334155'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } }
      }
    });
  },

  renderQuizHistory() {
    const tbody = document.getElementById('quiz-history-body');
    if (!tbody) return;

    const progress = App.getProgress();
    if (progress.quizzes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);">No quiz history yet. Take your first quiz!</td></tr>';
      return;
    }

    tbody.innerHTML = progress.quizzes.slice(0, 10).map(q => `
      <tr>
        <td>${App.formatDateTime(q.date)}</td>
        <td>${q.category === 'all' ? 'Mixed' : q.category}</td>
        <td>${q.score}/${q.total}</td>
        <td><span class="score-badge ${App.getScoreBadgeClass(q.percentage)}">${q.percentage}%</span></td>
        <td>${Math.floor(q.timeTaken / 60)}m ${q.timeTaken % 60}s</td>
      </tr>`).join('');
  },

  formatTime(seconds) {
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  },

  shareResults() {
    if (this.lastResults) {
      App.shareScore(this.lastResults.correct, this.lastResults.total, this.lastResults.percentage);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('quiz-start')) QuizPage.init();
});
