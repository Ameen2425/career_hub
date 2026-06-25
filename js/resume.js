/**
 * CareerLaunch Hub - Resume Analyzer UI (Frontend Simulation)
 */

const ResumePage = {
  uploadedFile: null,
  analysisResult: null,

  SAMPLE_ANALYSIS: {
    atsScore: 85,
    technicalMatch: 78,
    communicationRating: 82,
    projectStrength: 88,
    overallScore: 83,
    skills: [
      { name: 'JavaScript', match: 92 },
      { name: 'React', match: 85 },
      { name: 'Node.js', match: 70 },
      { name: 'Python', match: 65 },
      { name: 'SQL', match: 80 },
      { name: 'Git', match: 90 }
    ],
    missingKeywords: ['TypeScript', 'Docker', 'AWS', 'CI/CD', 'Agile', 'REST APIs'],
    strengths: [
      'Strong project descriptions with measurable outcomes',
      'Clear technical skills section with relevant keywords',
      'Consistent formatting and professional layout',
      'Good use of action verbs (developed, implemented, optimized)'
    ],
    weaknesses: [
      'Missing cloud platform experience keywords',
      'Summary section could be more targeted to role',
      'Some bullet points lack quantifiable metrics'
    ],
    suggestions: [
      'Add a tailored professional summary for each application',
      'Include metrics: "Reduced load time by 40%" instead of "Improved performance"',
      'Add certifications section if applicable',
      'Include links to GitHub and portfolio projects',
      'Optimize for ATS with standard section headings'
    ]
  },

  init() {
    this.bindEvents();
    this.loadSavedAnalysis();
    this.renderCharts();
  },

  bindEvents() {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('resume-file');
    const analyzeBtn = document.getElementById('analyze-btn');
    const removeBtn = document.getElementById('remove-file');

    if (dropzone) {
      dropzone.addEventListener('click', () => fileInput?.click());
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
      dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length) this.handleFile(e.dataTransfer.files[0]);
      });
    }

    fileInput?.addEventListener('change', (e) => {
      if (e.target.files.length) this.handleFile(e.target.files[0]);
    });

    analyzeBtn?.addEventListener('click', () => this.runAnalysis());
    removeBtn?.addEventListener('click', () => this.clearFile());
  },

  handleFile(file) {
    const validTypes = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const validExt = /\.(pdf|doc|docx|txt)$/i.test(file.name);

    if (!validTypes.includes(file.type) && !validExt) {
      App.showToast('Please upload PDF, DOC, DOCX, or TXT files', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      App.showToast('File must be under 5MB', 'error');
      return;
    }

    this.uploadedFile = file;
    this.showPreview(file);
    document.getElementById('analyze-btn')?.removeAttribute('disabled');
    App.showToast('Resume uploaded successfully!', 'success');
  },

  showPreview(file) {
    const preview = document.getElementById('resume-preview');
    const dropzone = document.getElementById('dropzone');
    if (!preview) return;

    dropzone?.classList.add('hidden');
    preview.classList.remove('hidden');

    document.getElementById('preview-filename').textContent = file.name;
    document.getElementById('preview-filesize').textContent = `${(file.size / 1024).toFixed(1)} KB`;
    document.getElementById('preview-filetype').textContent = file.type || 'Document';

    const icon = file.name.match(/\.pdf$/i) ? '📄' : file.name.match(/\.(doc|docx)$/i) ? '📝' : '📃';
    document.getElementById('preview-icon').textContent = icon;
  },

  clearFile() {
    this.uploadedFile = null;
    document.getElementById('resume-preview')?.classList.add('hidden');
    document.getElementById('dropzone')?.classList.remove('hidden');
    document.getElementById('analyze-btn')?.setAttribute('disabled', 'true');
    document.getElementById('resume-file').value = '';
  },

  runAnalysis() {
    if (!this.uploadedFile) {
      App.showToast('Please upload a resume first', 'warning');
      return;
    }

    const resultsSection = document.getElementById('analysis-results');
    const skeleton = document.getElementById('analysis-skeleton');
    const analyzeBtn = document.getElementById('analyze-btn');

    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'Analyzing...';
    resultsSection?.classList.remove('hidden');
    skeleton?.classList.remove('hidden');
    document.getElementById('analysis-content')?.classList.add('hidden');

    setTimeout(() => {
      this.analysisResult = { ...this.SAMPLE_ANALYSIS, fileName: this.uploadedFile.name, analyzedAt: new Date().toISOString() };
      this.saveAnalysis();
      document.getElementById('analysis-placeholder')?.classList.add('hidden');
      this.renderAnalysis();
      skeleton?.classList.add('hidden');
      document.getElementById('analysis-content')?.classList.remove('hidden');
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = 'Re-analyze Resume';
      App.showToast('Analysis complete! ATS Score: 85%', 'success');
    }, 2200);
  },

  saveAnalysis() {
    const data = App.getResumeData();
    data.score = this.analysisResult.overallScore;
    data.lastAnalyzed = this.analysisResult.analyzedAt;
    data.history.unshift({
      score: this.analysisResult.overallScore,
      atsScore: this.analysisResult.atsScore,
      date: this.analysisResult.analyzedAt,
      fileName: this.analysisResult.fileName
    });
    if (data.history.length > 10) data.history = data.history.slice(0, 10);
    App.saveResumeData(data);
  },

  loadSavedAnalysis() {
    const data = App.getResumeData();
    if (data.lastAnalyzed && data.score) {
      this.analysisResult = { ...this.SAMPLE_ANALYSIS, overallScore: data.score, analyzedAt: data.lastAnalyzed };
      document.getElementById('analysis-placeholder')?.classList.add('hidden');
      document.getElementById('analysis-results')?.classList.remove('hidden');
      document.getElementById('analysis-skeleton')?.classList.add('hidden');
      document.getElementById('analysis-content')?.classList.remove('hidden');
      this.renderAnalysis();
    }
  },

  renderAnalysis() {
    if (!this.analysisResult) return;
    const r = this.analysisResult;

    this.animateScore('ats-score', r.atsScore);
    this.animateScore('overall-score', r.overallScore);
    document.getElementById('tech-match').textContent = r.technicalMatch + '%';
    document.getElementById('comm-rating').textContent = r.communicationRating + '%';
    document.getElementById('project-strength').textContent = r.projectStrength + '%';

    const progressBar = document.getElementById('score-progress-bar');
    if (progressBar) {
      setTimeout(() => { progressBar.style.width = r.overallScore + '%'; }, 100);
    }

    const skillsContainer = document.getElementById('skills-bars');
    if (skillsContainer) {
      skillsContainer.innerHTML = r.skills.map(s => `
        <div class="skill-bar-item">
          <div class="skill-bar-header"><span>${s.name}</span><span>${s.match}%</span></div>
          <div class="skill-bar-track"><div class="skill-bar-fill" data-width="${s.match}"></div></div>
        </div>`).join('');

      setTimeout(() => {
        skillsContainer.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
      }, 200);
    }

    document.getElementById('missing-keywords').innerHTML = r.missingKeywords.map(k =>
      `<span class="keyword-tag missing">${k}</span>`).join('');

    document.getElementById('strengths-list').innerHTML = r.strengths.map(s =>
      `<li>${s}</li>`).join('');

    document.getElementById('weaknesses-list').innerHTML = r.weaknesses.map(w =>
      `<li>${w}</li>`).join('');

    document.getElementById('suggestions-list').innerHTML = r.suggestions.map(s =>
      `<li>${s}</li>`).join('');

    this.renderCharts();
  },

  animateScore(elementId, target) {
    const el = document.getElementById(elementId);
    if (!el) return;
    App.animateCounter(el, target, 1500, '%');
  },

  charts: {},

  renderCharts() {
    if (typeof Chart === 'undefined' || !this.analysisResult) return;

    const atsCanvas = document.getElementById('ats-chart');
    if (atsCanvas) {
      if (this.charts.ats) this.charts.ats.destroy();
      const score = this.analysisResult.atsScore;
      this.charts.ats = new Chart(atsCanvas, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [score, 100 - score],
            backgroundColor: ['#6366f1', 'rgba(51,65,85,0.3)'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '78%',
          plugins: { legend: { display: false }, tooltip: { enabled: false } }
        }
      });
    }

    const radarCanvas = document.getElementById('skills-radar');
    if (radarCanvas) {
      if (this.charts.radar) this.charts.radar.destroy();
      this.charts.radar = new Chart(radarCanvas, {
        type: 'radar',
        data: {
          labels: this.analysisResult.skills.map(s => s.name),
          datasets: [{
            label: 'Skill Match',
            data: this.analysisResult.skills.map(s => s.match),
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderColor: '#6366f1',
            pointBackgroundColor: '#6366f1'
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
              pointLabels: { color: '#94a3b8', font: { size: 11 } }
            }
          },
          plugins: { legend: { display: false } }
        }
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('dropzone')) ResumePage.init();
});

window.addEventListener('themechange', () => ResumePage.renderCharts());
