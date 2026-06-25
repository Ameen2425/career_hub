# CareerLaunch AI 🚀

**CareerLaunch AI** is a premium, all-in-one career preparation platform built with pure HTML, CSS, and JavaScript. It combines interview preparation, AI resume analysis UI, and career learning resources into a single polished SaaS-style web application — perfect for students, freshers, and professionals preparing for their dream jobs.

![CareerLaunch AI Banner](assets/images/screenshot-placeholder.png)

> **Note:** Replace `assets/images/screenshot-placeholder.png` with your actual screenshots after deployment.

---

## 🌐 Live Demo

Deploy this project on **GitHub Pages** for free:

```
https://YOUR_USERNAME.github.io/Interview-Preparation-Hub/
```

### Quick Deploy Steps

1. Push this repository to GitHub
2. Go to **Settings → Pages**
3. Set source to **Deploy from branch: main / root**
4. Save and wait ~2 minutes for your live URL

---

## ✨ Features

### 📊 Dashboard Home
- Career progress overview with welcome banner
- Daily motivational quotes
- Animated stats cards (questions practiced, quizzes, average quiz score, resume ATS score, learning progress)
- Chart.js analytics: weekly progress, quiz performance, resume tracking
- Quick action shortcuts and recent activity feed

### 🎯 Module 1: Interview Preparation Hub
- **62+ curated questions** across 8 categories:
  - Python, Java, JavaScript, HTML, CSS, SQL, Aptitude, HR
- Search questions by keyword
- Filter by category and difficulty (Easy, Medium, Hard)
- Expand/collapse answers
- Save to favorites with local storage
- Question of the Day widget

### 🧠 Mock Quiz System
- MCQ-based timed quizzes
- Random question selection
- Configurable category, count, and time limit
- Score calculation with detailed analysis
- Performance analytics chart
- Quiz history persisted in local storage
- Confetti celebration for 80%+ scores
- Share score functionality

### 📄 Module 2: AI Resume Analyzer (UI)
- Drag & drop upload zone
- Resume preview with file details
- ATS score visualization (circular chart)
- Skills match analysis with progress bars
- Radar chart for skill breakdown
- Missing keywords section
- Strengths, weaknesses, and improvement suggestions
- Resume score progress bar
- Analysis history tracking

### 📚 Module 3: Career Resources Hub
- Interactive timelines detailing full stack paths (e.g. Python Full Stack Roadmap)
- Tailored roadmaps for Frontend, Backend, and Data Structures & Algorithms
- Resume writing blueprints and ATS compliance checksheets
- Recruiter outreach and GitHub profile README optimization guides
- Structured project ideas grouped by complexity with recommended tech stacks
- Coding interview tips & daily motivation widgets with quote/tip generators

### 🎨 UI/UX
- Premium SaaS dashboard design
- Dark mode & light mode with local storage persistence
- Glassmorphism effects and professional gradients
- Smooth animations and micro-interactions
- Animated counters and loading skeletons
- Fully responsive (mobile, tablet, desktop)
- Sidebar navigation with mobile overlay

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Semantic structure |
| CSS3 | Styling, glassmorphism, animations |
| Vanilla JavaScript | Application logic |
| Chart.js | Data visualization |
| Local Storage | Data persistence |
| Google Fonts (Inter) | Typography |

**No frameworks. No backend. No build step required.**

---

## 📁 Project Structure

```
CareerLaunch-AI/
├── index.html              # Landing page
├── dashboard.html          # Main dashboard
├── interview.html          # Question bank
├── quiz.html               # Mock quiz
├── resume-analyzer.html    # Resume analyzer UI
├── resources.html          # Career Resources Hub
├── css/
│   ├── style.css           # Global styles & theme
│   ├── dashboard.css       # Dashboard styles
│   ├── interview.css       # Interview hub styles
│   └── resume.css          # Resume analyzer styles
├── js/
│   ├── app.js              # Core app module
│   ├── interview.js        # Questions & quiz data
│   ├── quiz.js             # Quiz logic
│   ├── resume.js           # Resume analyzer
│   └── dashboard.js        # Dashboard charts
├── assets/
│   ├── images/
│   ├── icons/
│   └── illustrations/
└── README.md
```

---

## 🚀 Installation & Usage

### Option 1: Open Directly
1. Clone or download the repository
2. Open `index.html` in any modern browser
3. Navigate to the dashboard and explore all modules

### Option 2: Local Server (Recommended)
```bash
# Using Python
python -m http.server 8080

# Using Node.js (npx)
npx serve .

# Then visit http://localhost:8080
```

### Option 3: GitHub Pages
Push to GitHub and enable Pages from the repository settings (see Live Demo section above).

---

## 📸 Screenshots

| Page | Description |
|---|---|
| `assets/images/dashboard.png` | Dashboard with stats and charts |
| `assets/images/interview.png` | Interview question bank |
| `assets/images/quiz.png` | Mock quiz interface |
| `assets/images/resume.png` | Resume analyzer results |
| `assets/images/resources.png` | Career Resources Hub |

> Add your screenshots to `assets/images/` and update the paths above.

---

## 💾 Local Storage Keys

| Key | Data Stored |
|---|---|
| `cla_theme` | Dark/light theme preference |
| `cla_favorites` | Saved question IDs |
| `cla_progress` | Quiz results and statistics |
| `cla_streak` | Daily visit streak |
| `cla_resume` | Resume analysis history |
| `cla_practiced` | Total questions viewed count |
| `cla_practiced_ids` | Unique question IDs viewed (for progress calculation) |

---

## 🔮 Future Enhancements

- [ ] Real AI backend integration (OpenAI / Gemini API) for resume analysis
- [ ] User authentication and cloud sync
- [ ] Flashcard mode for spaced repetition learning
- [ ] Company-specific interview question sets
- [ ] PDF resume parsing with real text extraction
- [ ] Email reminders for job application follow-ups
- [ ] Export job tracker data to CSV
- [ ] PWA support for offline access
- [ ] Multi-language support
- [ ] Collaborative study groups

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request with your improvements

---

## 📄 License

This project is open source and available for portfolio and educational use.

---

## 👤 Author

Built as a portfolio project to demonstrate modern frontend development skills.

**CareerLaunch AI** — *Launch Your Dream Career* 🚀
