/**
 * CareerLaunch Hub - Mock Interview Simulator Logic
 */

const InterviewSimulator = {
  // Question Bank per Category
  questions: {
    hr: [
      "Tell me about yourself and your background.",
      "What are your greatest strengths and weaknesses?",
      "Tell me about a time you faced a difficult challenge in a team project and how you resolved it.",
      "Why do you want to join our engineering team?",
      "Where do you see yourself in five years, and how does this role fit your career goals?"
    ],
    python: [
      "Explain the differences between lists and tuples in Python. When would you choose one over the other?",
      "What is PEP 8, and why is it important for writing readable and maintainable Python code?",
      "How does memory management and garbage collection work in Python?",
      "What are decorators in Python? Can you describe how you would write and use one?",
      "What is the difference between a shallow copy and a deep copy, and when should you use copy.deepcopy()?"
    ],
    javascript: [
      "Explain the structural and scoping differences between var, let, and const in JavaScript.",
      "What is a closure in JavaScript, and what is a common practical use case for it?",
      "Describe how Promises work in JS. How does async/await improve upon promise chaining?",
      "What is the Event Loop in JavaScript, and how does it handle asynchronous callbacks?",
      "Explain event delegation and its advantages when handling events in the DOM."
    ],
    sql: [
      "What is the difference between an INNER JOIN, a LEFT JOIN, and a FULL OUTER JOIN?",
      "Explain the structural differences and execution ordering between the WHERE and HAVING clauses.",
      "What are primary keys and foreign keys, and how do they enforce database referential integrity?",
      "What is database normalization, and what are the main differences between 1NF, 2NF, and 3NF?",
      "How do database indexes improve query lookup times? What are the potential trade-offs of having too many indexes?"
    ],
    fullstack: [
      "Explain the core principles of a RESTful API. What are the key HTTP methods and their semantic purposes?",
      "How do you manage application state in a frontend framework like React, and when would you use global state managers?",
      "What are the major structural differences and trade-offs between SQL (relational) and NoSQL (non-relational) databases?",
      "Describe the best practices for securing user authentication and password storage in a modern web application.",
      "How do you optimize full-stack application performance, specifically tackling database bottlenecks and front-end bundle size?"
    ]
  },

  // State Variables
  currentMode: 'hr',
  currentQuestionIndex: 0,
  chatHistory: [],
  responses: [],
  isTyping: false,
  startTime: null,

  init() {
    this.bindEvents();
    this.resetState();
    this.selectMode('hr');
  },

  resetState() {
    this.currentQuestionIndex = 0;
    this.chatHistory = [];
    this.responses = [];
    this.isTyping = false;
    this.startTime = null;
    
    // Toggle UI views
    document.getElementById('setup-panel').style.display = 'block';
    document.getElementById('chat-panel').style.display = 'none';
    document.getElementById('summary-panel').style.display = 'none';
    document.getElementById('chat-box').innerHTML = '';
    document.getElementById('user-response-input').value = '';
    document.getElementById('char-count').textContent = '0 characters';
  },

  bindEvents() {
    // Mode Buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = btn.getAttribute('data-mode');
        this.selectMode(mode);
      });
    });

    // Start Button
    document.getElementById('start-btn')?.addEventListener('click', () => {
      this.startInterview();
    });

    // Send Button
    document.getElementById('send-btn')?.addEventListener('click', () => {
      this.submitResponse();
    });

    // Input keydown (Enter to send, Shift+Enter for newline)
    document.getElementById('user-response-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.submitResponse();
      }
    });

    // Char count listener
    document.getElementById('user-response-input')?.addEventListener('input', (e) => {
      const len = e.target.value.length;
      document.getElementById('char-count').textContent = `${len} character${len === 1 ? '' : 's'}`;
    });

    // Skip Button
    document.getElementById('skip-btn')?.addEventListener('click', () => {
      this.skipQuestion();
    });

    // End Button
    document.getElementById('end-btn')?.addEventListener('click', () => {
      this.endInterview();
    });

    // Restart Button
    document.getElementById('restart-btn')?.addEventListener('click', () => {
      this.resetState();
    });
  },

  selectMode(mode) {
    this.currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
    });

    // Update avatar label based on interviewer
    const titles = {
      hr: 'HR Recruiter',
      python: 'Lead Python Architect',
      javascript: 'Staff Frontend Engineer',
      sql: 'Senior Database Administrator',
      fullstack: 'Director of Engineering'
    };
    const avatars = {
      hr: '👩‍💼',
      python: '🐍',
      javascript: '💻',
      sql: '🗄️',
      fullstack: '🚀'
    };
    const names = {
      hr: 'Sarah Jenkins',
      python: 'Dr. Py-Coder',
      javascript: 'Alex TC39',
      sql: 'DB-Admin Larry',
      fullstack: 'CTO Elena'
    };

    document.getElementById('interviewer-avatar').textContent = avatars[mode];
    document.getElementById('interviewer-name').textContent = names[mode];
    document.getElementById('interviewer-title').textContent = titles[mode];
  },

  startInterview() {
    this.resetState();
    this.startTime = Date.now();
    
    document.getElementById('setup-panel').style.display = 'none';
    document.getElementById('chat-panel').style.display = 'flex';
    
    // Trigger first interviewer greeting & question
    const greet = `Hello! Welcome to your simulated ${this.currentMode.toUpperCase()} technical interview. I will be assessing your core principles, confidence, and coding communication today. Let's begin with the first question:`;
    
    this.showInterviewerMessage(greet, () => {
      const q = this.questions[this.currentMode][0];
      this.showInterviewerMessage(q);
    });
  },

  showInterviewerMessage(text, callback = null) {
    this.showTypingIndicator();
    
    setTimeout(() => {
      this.hideTypingIndicator();
      this.appendMessage('ai', text);
      this.chatHistory.push({ sender: 'ai', text });
      
      if (callback) {
        callback();
      }
    }, 1000);
  },

  showTypingIndicator() {
    if (this.isTyping) return;
    this.isTyping = true;
    
    const chatBox = document.getElementById('chat-box');
    const row = document.createElement('div');
    row.id = 'typing-row';
    row.className = 'message-row ai';
    row.innerHTML = `
      <div class="msg-avatar">${document.getElementById('interviewer-avatar').textContent}</div>
      <div class="msg-bubble">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    chatBox.appendChild(row);
    chatBox.scrollTop = chatBox.scrollHeight;
  },

  hideTypingIndicator() {
    const el = document.getElementById('typing-row');
    if (el) {
      el.remove();
    }
    this.isTyping = false;
  },

  appendMessage(sender, text) {
    const chatBox = document.getElementById('chat-box');
    const row = document.createElement('div');
    row.className = `message-row ${sender}`;
    
    const avatar = sender === 'ai' 
      ? document.getElementById('interviewer-avatar').textContent 
      : '👤';
      
    row.innerHTML = `
      <div class="msg-avatar">${avatar}</div>
      <div class="msg-bubble">${text}</div>
    `;
    
    chatBox.appendChild(row);
    chatBox.scrollTop = chatBox.scrollHeight;
  },

  submitResponse() {
    if (this.isTyping) return;
    
    const inputEl = document.getElementById('user-response-input');
    const val = inputEl.value.trim();
    if (!val) return;
    
    // Append user response
    this.appendMessage('user', val);
    this.chatHistory.push({ sender: 'user', text: val });
    this.responses.push({
      questionIndex: this.currentQuestionIndex,
      question: this.questions[this.currentMode][this.currentQuestionIndex],
      response: val,
      skipped: false
    });
    
    inputEl.value = '';
    document.getElementById('char-count').textContent = '0 characters';
    
    // Advance index
    this.currentQuestionIndex++;
    this.checkNextStep();
  },

  skipQuestion() {
    if (this.isTyping) return;
    
    this.appendMessage('user', '*Skipped question*');
    this.chatHistory.push({ sender: 'user', text: '*Skipped question*' });
    this.responses.push({
      questionIndex: this.currentQuestionIndex,
      question: this.questions[this.currentMode][this.currentQuestionIndex],
      response: '',
      skipped: true
    });
    
    this.currentQuestionIndex++;
    this.checkNextStep();
  },

  checkNextStep() {
    const totalQ = this.questions[this.currentMode].length;
    if (this.currentQuestionIndex < totalQ) {
      const q = this.questions[this.currentMode][this.currentQuestionIndex];
      this.showInterviewerMessage(q);
    } else {
      this.showInterviewerMessage("Excellent. That covers all the questions I had for this interview. Let me compile your assessment scores.", () => {
        setTimeout(() => this.endInterview(), 1200);
      });
    }
  },

  endInterview() {
    document.getElementById('chat-panel').style.display = 'none';
    document.getElementById('summary-panel').style.display = 'block';

    const scores = this.calculateScores();
    
    // Animate stats
    App.animateCounter(document.getElementById('tech-score-val'), scores.technical, 1500, '%');
    App.animateCounter(document.getElementById('comm-score-val'), scores.communication, 1500, '%');
    App.animateCounter(document.getElementById('conf-score-val'), scores.confidence, 1500, '%');

    // Build feedback tips
    const feedbackList = document.getElementById('feedback-tips-list');
    feedbackList.innerHTML = '';
    
    scores.feedback.forEach(tip => {
      const li = document.createElement('li');
      li.className = 'feedback-item';
      li.innerHTML = `<span class="feedback-bullet">✦</span> <span>${tip}</span>`;
      feedbackList.appendChild(li);
    });

    // Save to global systems
    const result = {
      id: Date.now(),
      date: new Date().toISOString(),
      mode: this.currentMode,
      questionsAnswered: this.responses.filter(r => !r.skipped).length,
      totalQuestions: this.questions[this.currentMode].length,
      scores: {
        technical: scores.technical,
        communication: scores.communication,
        confidence: scores.confidence
      },
      feedback: scores.feedback
    };

    App.saveInterviewResult(result);
    App.trackPerformanceEvent('interviewCompleted');
    App.launchConfetti();
  },

  calculateScores() {
    let techTotal = 0;
    let commTotal = 0;
    let answeredCount = 0;

    // Mode-specific keywords for tech evaluation
    const keywords = {
      python: ['def', 'class', 'import', 'lambda', 'dict', 'list', 'self', 'return', 'loop', 'range', 'try', 'except', 'decorator', 'copy', 'memory'],
      javascript: ['const', 'let', 'function', 'arrow', 'promise', 'async', 'await', 'callback', 'array', 'map', 'filter', 'reduce', 'dom', 'event', 'closure', 'scoping', 'loop'],
      sql: ['select', 'from', 'where', 'join', 'group', 'having', 'order', 'index', 'key', 'insert', 'update', 'null', 'primary', 'foreign'],
      fullstack: ['api', 'frontend', 'backend', 'database', 'react', 'node', 'express', 'rest', 'client', 'server', 'http', 'middleware', 'state', 'security'],
      hr: ['team', 'project', 'communication', 'lead', 'challenge', 'resolved', 'learned', 'skills', 'manage', 'conflict', 'growth', 'strength', 'weakness', 'goals']
    };

    const activeKeywords = keywords[this.currentMode] || [];

    this.responses.forEach(resp => {
      if (resp.skipped) return;
      answeredCount++;

      // Evaluate Technical Score (check keywords and response length)
      let techVal = 40; // baseline for answering
      const words = resp.response.toLowerCase().split(/\s+/);
      
      // Keyword match count
      let matchCount = 0;
      activeKeywords.forEach(kw => {
        if (resp.response.toLowerCase().includes(kw)) {
          matchCount++;
        }
      });
      techVal += Math.min(40, matchCount * 8); // up to +40%
      techVal += Math.min(20, Math.floor(words.length / 5)); // up to +20% for details
      techTotal += Math.min(100, techVal);

      // Evaluate Communication Score
      let commVal = 50; // baseline
      // Reward length and structural separators
      if (resp.response.includes(',') || resp.response.includes('.')) {
        commVal += 15;
      }
      commVal += Math.min(35, Math.floor(words.length / 4)); // length helps communication articulation

      // Penalize too many filler words
      const fillers = ['like', 'um', 'uh', 'basically', 'actually', 'probably'];
      let fillerCount = 0;
      fillers.forEach(f => {
        const occurrences = (resp.response.toLowerCase().match(new RegExp(`\\b${f}\\b`, 'g')) || []).length;
        fillerCount += occurrences;
      });
      commVal -= Math.min(30, fillerCount * 6);
      commTotal += Math.max(30, commVal);
    });

    const technical = answeredCount > 0 ? Math.round(techTotal / this.questions[this.currentMode].length) : 0;
    const communication = answeredCount > 0 ? Math.round(commTotal / this.questions[this.currentMode].length) : 0;
    
    // Confidence score based on skip rates, text length consistency, and solid communication
    let confidence = 85;
    const skips = this.responses.filter(r => r.skipped).length;
    confidence -= (skips * 15); // penalize -15% per skip
    if (communication < 70) confidence -= 10;
    if (technical > 80) confidence += 5;
    confidence = Math.max(10, Math.min(100, confidence));

    // Dynamic feedback compilation
    const feedback = [];
    if (skips > 0) {
      feedback.push(`You skipped ${skips} question${skips === 1 ? '' : 's'}. Try practicing these offline in the Question Bank before repeating.`);
    } else {
      feedback.push("Great job completing the simulator session without skipping any questions!");
    }

    if (technical < 70) {
      feedback.push(`For the ${this.currentMode.toUpperCase()} interview, try to incorporate more domain-specific jargon (e.g. ${activeKeywords.slice(0, 4).join(', ')}) in your answers.`);
    } else {
      feedback.push(`Strong showing of domain-specific concepts in your ${this.currentMode.toUpperCase()} responses.`);
    }

    if (communication < 70) {
      feedback.push("Your sentences felt brief or included common fillers (like 'um' or 'basically'). Try to structure your answers using the STAR method (Situation, Task, Action, Result).");
    } else {
      feedback.push("Excellent articulation and clean structural response syntax observed.");
    }

    if (confidence < 75) {
      feedback.push("Maintain a steady flow and avoid skippable items to increase confidence rates.");
    } else {
      feedback.push("You projected solid professional confidence throughout this interactive interview session.");
    }

    return { technical, communication, confidence, feedback };
  }
};

document.addEventListener('DOMContentLoaded', () => InterviewSimulator.init());
