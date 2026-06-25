/**
 * CareerLaunch Hub - Learning Roadmaps Manager
 */

const LearningRoadmaps = {
  // Roadmaps Configuration Map
  roadmaps: {
    python: {
      name: "Full Stack Python",
      desc: "Master end-to-end web applications using Python, Django, Flask, and PostgreSQL.",
      badge: "badge_python_roadmap",
      badgeIcon: "🐍",
      milestones: [
        {
          id: "py_m1",
          title: "Python Core Foundations",
          desc: "Understand types, loops, lists/dicts, functions, scope, modules, and PEP 8 guidelines.",
          links: [
            { text: "Python Official Docs", url: "https://docs.python.org/3/" },
            { text: "CareerLaunch Coding Tips", url: "resources.html" }
          ]
        },
        {
          id: "py_m2",
          title: "Object-Oriented Programming",
          desc: "Master classes, inheritance, polymorphism, encapsulation, magic methods, and decorators.",
          links: [
            { text: "OOP in Python Guide", url: "https://realpython.com/python3-object-oriented-programming/" }
          ]
        },
        {
          id: "py_m3",
          title: "Web Frameworks (Django / Flask)",
          desc: "Build routing systems, templating, request handling, middleware, and ORM migrations.",
          links: [
            { text: "Django Project Tutorial", url: "https://docs.djangoproject.com/en/stable/intro/tutorial01/" }
          ]
        },
        {
          id: "py_m4",
          title: "Database Integration & APIs",
          desc: "Design database schemas in Django ORM/SQLAlchemy and build RESTful API endpoints.",
          links: [
            { text: "Django REST Framework", url: "https://www.django-rest-framework.org/" }
          ]
        },
        {
          id: "py_m5",
          title: "Testing, Containerization & Deployment",
          desc: "Write unit tests using Pytest, dockerize the application, and deploy to AWS/Heroku.",
          links: [
            { text: "Pytest Guide", url: "https://docs.pytest.org/" },
            { text: "Dockerizing Python App", url: "https://docs.docker.com/language/python/" }
          ]
        }
      ]
    },
    frontend: {
      name: "Frontend Developer",
      desc: "Build highly responsive, interactive, and beautiful user interfaces using modern CSS, JS, and React.",
      badge: "badge_frontend_roadmap",
      badgeIcon: "🎨",
      milestones: [
        {
          id: "fe_m1",
          title: "Advanced CSS & Modern Layouts",
          desc: "Master Flexbox, CSS Grid, Custom Properties, Media Queries, and Glassmorphic SaaS layouts.",
          links: [
            { text: "CSS Tricks Grid Guide", url: "https://css-tricks.com/snippets/css/complete-guide-grid/" }
          ]
        },
        {
          id: "fe_m2",
          title: "DOM Manipulation & ES6+ Javascript",
          desc: "Understand Event listeners, arrow functions, template literals, array map/filter/reduce, and closures.",
          links: [
            { text: "JS Reference Guide", url: "resources.html" }
          ]
        },
        {
          id: "fe_m3",
          title: "Asynchronous JS & API Integrations",
          desc: "Fetch external data using Promises, async/await, and handle loading states elegantly.",
          links: [
            { text: "MDN Fetch API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" }
          ]
        },
        {
          id: "fe_m4",
          title: "React.js Framework Core",
          desc: "Learn state, props, lifecycle hooks (useEffect, useState), reusable components, and React Router.",
          links: [
            { text: "React Documentation", url: "https://react.dev/" }
          ]
        },
        {
          id: "fe_m5",
          title: "Performance Optimization & Bundlers",
          desc: "Optimize images, lazy load components, understand webpack/Vite, and audit pages via Lighthouse.",
          links: [
            { text: "Vite App Guide", url: "https://vitejs.dev/" }
          ]
        }
      ]
    },
    backend: {
      name: "Backend Developer",
      desc: "Architect server-side logic, database query operations, system security, and scalability.",
      badge: "badge_backend_roadmap",
      badgeIcon: "⚙️",
      milestones: [
        {
          id: "be_m1",
          title: "Server Runtimes & MVC Architecture",
          desc: "Set up servers in Node.js (Express) or Python (FastAPI) and understand MVC structural routing.",
          links: [
            { text: "Express.js Guide", url: "https://expressjs.com/" }
          ]
        },
        {
          id: "be_m2",
          title: "Database Modeling (SQL & NoSQL)",
          desc: "Design robust relational schemas in PostgreSQL/MySQL and document stores in MongoDB.",
          links: [
            { text: "SQL Cheat Sheets", url: "resources.html" }
          ]
        },
        {
          id: "be_m3",
          title: "Security, Authentication & JWT",
          desc: "Implement JSON Web Tokens (JWT), session cookies, hashing algorithms (bcrypt), and CORS headers.",
          links: [
            { text: "JWT.io Introduction", url: "https://jwt.io/introduction" }
          ]
        },
        {
          id: "be_m4",
          title: "System Caching & Queueing",
          desc: "Optimize high-load backend endpoints with Redis caching layers and message queuing services.",
          links: [
            { text: "Redis Documentation", url: "https://redis.io/docs/" }
          ]
        },
        {
          id: "be_m5",
          title: "CI/CD & Serverless Deployments",
          desc: "Automate code deployments using GitHub Actions and set up production instances in cloud machines.",
          links: [
            { text: "GitHub Actions Guide", url: "https://docs.github.com/en/actions" }
          ]
        }
      ]
    },
    javascript: {
      name: "JavaScript Mastery",
      desc: "Deep dive into JS runtimes, prototypes, engine components, and build system engineering.",
      badge: "badge_js_roadmap",
      badgeIcon: "🟨",
      milestones: [
        {
          id: "js_m1",
          title: "Scope, Closure & Execution Context",
          desc: "Master block scope, lexical environments, call stacks, closures, and variable hoisting.",
          links: [
            { text: "JS Closures deep-dive", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures" }
          ]
        },
        {
          id: "js_m2",
          title: "Object Prototypes & OOP",
          desc: "Understand prototype chaining, __proto__, prototypal inheritance, and ES6 class syntax constructors.",
          links: [
            { text: "Prototypes MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain" }
          ]
        },
        {
          id: "js_m3",
          title: "Asynchronous JavaScript Engine",
          desc: "Master microtasks vs macrotasks, requestAnimationFrame, and event loop processing priority.",
          links: [
            { text: "Event Loop JS", url: "https://javascript.info/event-loop" }
          ]
        },
        {
          id: "js_m4",
          title: "Design Patterns in JavaScript",
          desc: "Learn structural design patterns like Singleton, Factory, Module, and Observer in vanilla JS.",
          links: [
            { text: "Learning JS Design Patterns", url: "https://www.patterns.dev/posts/classic-design-patterns/" }
          ]
        },
        {
          id: "js_m5",
          title: "Web APIs & Advanced Features",
          desc: "Interact with browser features: WebSockets, Web Workers, IndexedDB, and Custom Web Components.",
          links: [
            { text: "Web Worker API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API" }
          ]
        }
      ]
    },
    sql: {
      name: "SQL & DB Mastery",
      desc: "Optimize relational schemas, write high-performance queries, and manage indexing strategies.",
      badge: "badge_sql_roadmap",
      badgeIcon: "💾",
      milestones: [
        {
          id: "sql_m1",
          title: "Relational Theory & DDL/DML",
          desc: "Understand relational mathematics, constraints (Primary Key, Foreign Key, Check), and basic CRUD statements.",
          links: [
            { text: "SQL Tutorial", url: "resources.html" }
          ]
        },
        {
          id: "sql_m2",
          title: "Joins, Subqueries & Unions",
          desc: "Master Inner/Left/Right/Full Outer Joins, Correlated Subqueries, Common Table Expressions (CTEs), and Set Operations.",
          links: [
            { text: "SQL Joins visual guide", url: "https://sqlbolt.com/" }
          ]
        },
        {
          id: "sql_m3",
          title: "Window Functions & Grouping",
          desc: "Implement ROW_NUMBER(), DENSE_RANK(), PARTITION BY, and aggregate filter methods.",
          links: [
            { text: "Window Functions Tutorial", url: "https://mode.com/sql-tutorial/sql-window-functions/" }
          ]
        },
        {
          id: "sql_m4",
          title: "Indexes, Query Planning & Execution",
          desc: "Understand B-Trees, Clustered/Non-clustered indexes, and how to analyze queries via EXPLAIN plans.",
          links: [
            { text: "Use The Index, Luke!", url: "https://use-the-index-luke.com/" }
          ]
        },
        {
          id: "sql_m5",
          title: "Transactions, ACID & Concurrency Lock",
          desc: "Understand Atomicity, Consistency, Isolation, Durability (ACID), Isolation Levels, and database deadlock profiles.",
          links: [
            { text: "ACID Principles", url: "https://en.wikipedia.org/wiki/ACID" }
          ]
        }
      ]
    }
  },

  activeRoadmap: 'python',

  init() {
    this.bindEvents();
    this.renderSelectors();
    this.loadRoadmap('python');
  },

  bindEvents() {
    // We bind checklist checkboxes dynamically when drawing the milestones.
  },

  renderSelectors() {
    const listPanel = document.getElementById('roadmaps-list');
    if (!listPanel) return;

    listPanel.innerHTML = '';
    const progress = App.getRoadmapProgress();

    Object.keys(this.roadmaps).forEach(key => {
      const road = this.roadmaps[key];
      const roadProgress = progress[key] || {};
      
      const total = road.milestones.length;
      const checked = Object.values(roadProgress).filter(v => v === true).length;
      const percent = total > 0 ? Math.round((checked / total) * 100) : 0;

      const card = document.createElement('div');
      card.className = `glass-card roadmap-selector-card ${this.activeRoadmap === key ? 'active' : ''}`;
      card.setAttribute('data-id', key);
      
      // Completed marker if 100%
      const badgeDisplay = percent === 100 
        ? `<span class="roadmap-card-badge" style="background:var(--success); color:white;">Completed 🏆</span>` 
        : `<span class="roadmap-card-badge">${percent}%</span>`;

      card.innerHTML = `
        <div class="roadmap-card-header">
          <span class="roadmap-card-title">${road.name}</span>
          ${badgeDisplay}
        </div>
        <p style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4; margin-bottom: 8px;">
          ${road.desc.substring(0, 75)}...
        </p>
        <div class="roadmap-progress-bar-wrap">
          <div class="roadmap-progress-bar-fill" style="width: ${percent}%;"></div>
        </div>
      `;

      card.addEventListener('click', () => {
        this.loadRoadmap(key);
      });

      listPanel.appendChild(card);
    });
  },

  loadRoadmap(roadmapKey) {
    this.activeRoadmap = roadmapKey;
    
    // Update active highlight classes
    document.querySelectorAll('.roadmap-selector-card').forEach(card => {
      card.classList.toggle('active', card.getAttribute('data-id') === roadmapKey);
    });

    const road = this.roadmaps[roadmapKey];
    if (!road) return;

    // Header updates
    document.getElementById('roadmap-title').textContent = road.name;
    document.getElementById('roadmap-description').textContent = road.desc;

    // Load progress checks
    const progress = App.getRoadmapProgress();
    const roadProgress = progress[roadmapKey] || {};
    const total = road.milestones.length;
    const checked = Object.values(roadProgress).filter(v => v === true).length;
    const percent = total > 0 ? Math.round((checked / total) * 100) : 0;

    // Timeline calculations
    const container = document.getElementById('roadmap-timeline');
    container.innerHTML = '';

    road.milestones.forEach((stone, index) => {
      const isCompleted = roadProgress[stone.id] === true;
      const li = document.createElement('div');
      li.className = `timeline-item ${isCompleted ? 'completed' : ''}`;
      
      let resourceLinks = '';
      stone.links.forEach(l => {
        resourceLinks += `<a href="${l.url}" class="resource-link">${l.text} ➔</a> `;
      });

      li.innerHTML = `
        <div class="timeline-marker">${index + 1}</div>
        <div class="timeline-content-card">
          <div class="timeline-body">
            <h3 class="timeline-title">
              <span>${stone.title}</span>
              ${isCompleted ? '<span style="color:var(--success); font-size:0.875rem;">✓ Completed</span>' : ''}
            </h3>
            <p class="timeline-desc">${stone.desc}</p>
            <div class="timeline-resources">
              ${resourceLinks}
            </div>
          </div>
          <div>
            <input type="checkbox" id="chk-${stone.id}" class="milestone-checkbox-input" ${isCompleted ? 'checked' : ''}>
            <label for="chk-${stone.id}" class="milestone-checkbox-label" title="Mark Completed"></label>
          </div>
        </div>
      `;

      // Event listener for completion change
      const checkbox = li.querySelector(`#chk-${stone.id}`);
      checkbox.addEventListener('change', (e) => {
        this.toggleMilestone(roadmapKey, stone.id, e.target.checked);
      });

      container.appendChild(li);
    });

    // Check complete display badge
    const badgeDiv = document.getElementById('roadmap-completed-badge-wrap');
    if (percent === 100) {
      badgeDiv.innerHTML = `
        <div class="completed-badge-display">
          <span>Completed ${road.badgeIcon}</span>
          <span>Credential Awarded!</span>
        </div>
      `;
    } else {
      badgeDiv.innerHTML = '';
    }
  },

  toggleMilestone(roadmapKey, milestoneId, isChecked) {
    const progress = App.getRoadmapProgress();
    if (!progress[roadmapKey]) {
      progress[roadmapKey] = {};
    }

    progress[roadmapKey][milestoneId] = isChecked;
    App.saveRoadmapProgress(progress);

    // Calculate percent for completion toast checks
    const road = this.roadmaps[roadmapKey];
    const total = road.milestones.length;
    const checked = Object.values(progress[roadmapKey]).filter(v => v === true).length;
    const percent = total > 0 ? Math.round((checked / total) * 100) : 0;

    // Award badge if 100%
    if (percent === 100) {
      const user = App.getActiveUser();
      if (user) {
        if (!user.achievements) user.achievements = [];
        if (!user.achievements.includes(road.badge)) {
          user.achievements.push(road.badge);
          App.saveActiveUser(user);
          App.showToast(`Congratulations! You earned the ${road.name} badge! 🏆`, 'success');
          App.launchConfetti();
        }
      }
    }

    App.trackPerformanceEvent('roadmapChecked');
    
    // Re-render
    this.renderSelectors();
    this.loadRoadmap(roadmapKey);
  }
};

document.addEventListener('DOMContentLoaded', () => LearningRoadmaps.init());
