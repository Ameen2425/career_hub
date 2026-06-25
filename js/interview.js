/**
 * CareerLaunch AI - Interview Preparation Hub
 * Question bank, search, filters, favorites
 */

const QuestionsData = [
  { id: 1, category: 'python', difficulty: 'easy', question: 'What is the difference between a list and a tuple in Python?', answer: 'Lists are mutable (can be modified after creation) while tuples are immutable. Lists use square brackets [] and tuples use parentheses (). Tuples are generally faster and can be used as dictionary keys since they are hashable.' },
  { id: 2, category: 'python', difficulty: 'easy', question: 'Explain the difference between == and is in Python.', answer: '== compares the values of two objects for equality, while is checks if two variables refer to the same object in memory (identity). For example, [1,2] == [1,2] is True, but [1,2] is [1,2] is False because they are different objects.' },
  { id: 3, category: 'python', difficulty: 'medium', question: 'What are Python decorators and how do they work?', answer: 'Decorators are functions that modify the behavior of other functions or methods. They use the @ syntax and are essentially syntactic sugar for function composition. A decorator takes a function, adds functionality, and returns a modified function.' },
  { id: 4, category: 'python', difficulty: 'medium', question: 'Explain list comprehension with an example.', answer: 'List comprehension provides a concise way to create lists. Syntax: [expression for item in iterable if condition]. Example: squares = [x**2 for x in range(10)] creates [0, 1, 4, 9, 16, 25, 36, 49, 64, 81].' },
  { id: 5, category: 'python', difficulty: 'hard', question: 'What is the Global Interpreter Lock (GIL) in Python?', answer: 'The GIL is a mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecode simultaneously. Python threads cannot achieve true parallelism for CPU-bound tasks, but I/O-bound tasks and multiprocessing can still benefit from concurrency.' },
  { id: 6, category: 'python', difficulty: 'easy', question: 'What is the difference between append() and extend() in Python lists?', answer: 'append() adds a single element to the end of a list, while extend() adds all elements from an iterable. Example: [1,2].append([3,4]) gives [1,2,[3,4]], but [1,2].extend([3,4]) gives [1,2,3,4].' },
  { id: 7, category: 'python', difficulty: 'medium', question: 'Explain *args and **kwargs in Python.', answer: '*args allows a function to accept any number of positional arguments as a tuple. **kwargs allows accepting any number of keyword arguments as a dictionary. They are commonly used for flexible function signatures and wrapper functions.' },
  { id: 8, category: 'python', difficulty: 'medium', question: 'What are Python generators and yield?', answer: 'Generators are iterators that generate values on-the-fly using yield instead of return. They are memory efficient for large datasets. When yield is called, the function pauses and saves its state, resuming when next() is called.' },
  { id: 9, category: 'python', difficulty: 'hard', question: 'Explain the difference between deep copy and shallow copy.', answer: 'Shallow copy creates a new object but inserts references to the original nested objects. Deep copy creates a new object and recursively copies all nested objects. Use copy.copy() for shallow and copy.deepcopy() for deep copies.' },
  { id: 10, category: 'python', difficulty: 'easy', question: 'What is PEP 8?', answer: 'PEP 8 is Python\'s official style guide for writing readable and consistent code. It covers naming conventions (snake_case for functions/variables, PascalCase for classes), indentation (4 spaces), line length, and import organization.' },

  { id: 11, category: 'java', difficulty: 'easy', question: 'What is the difference between JDK, JRE, and JVM?', answer: 'JVM (Java Virtual Machine) executes Java bytecode. JRE (Java Runtime Environment) includes JVM plus libraries needed to run Java programs. JDK (Java Development Kit) includes JRE plus development tools like compiler (javac) and debugger.' },
  { id: 12, category: 'java', difficulty: 'easy', question: 'Explain the difference between == and .equals() in Java.', answer: '== compares object references (memory addresses) for objects, or values for primitives. .equals() compares the content/logical equality of objects when properly overridden. Always override equals() and hashCode() together for custom classes.' },
  { id: 13, category: 'java', difficulty: 'medium', question: 'What is the difference between abstract class and interface?', answer: 'Abstract classes can have both abstract and concrete methods, instance variables, and constructors. Interfaces (Java 8+) can have default and static methods but primarily define contracts. A class can implement multiple interfaces but extend only one abstract class.' },
  { id: 14, category: 'java', difficulty: 'medium', question: 'Explain Java Collections Framework hierarchy.', answer: 'Collection interface has List (ArrayList, LinkedList), Set (HashSet, TreeSet), and Queue (PriorityQueue) subinterfaces. Map (HashMap, TreeMap) is separate. Choose based on ordering needs, duplicate allowance, and access patterns.' },
  { id: 15, category: 'java', difficulty: 'hard', question: 'What is garbage collection in Java?', answer: 'Garbage collection automatically reclaims memory from objects no longer referenced. JVM uses algorithms like Mark-and-Sweep, Generational GC. Developers cannot force GC but can suggest it with System.gc(). Understanding object references helps prevent memory leaks.' },
  { id: 16, category: 'java', difficulty: 'medium', question: 'Explain multithreading in Java.', answer: 'Java supports multithreading via Thread class or Runnable interface. synchronized blocks prevent race conditions. ExecutorService manages thread pools. java.util.concurrent provides advanced utilities like CountDownLatch, ConcurrentHashMap, and CompletableFuture.' },
  { id: 17, category: 'java', difficulty: 'easy', question: 'What are access modifiers in Java?', answer: 'public (accessible everywhere), protected (same package + subclasses), default/package-private (same package only), private (same class only). They enforce encapsulation and control API surface area.' },
  { id: 18, category: 'java', difficulty: 'hard', question: 'Explain Java Stream API with an example.', answer: 'Stream API (Java 8+) enables functional-style operations on collections: filter, map, reduce, collect. Example: list.stream().filter(x -> x > 5).map(x -> x * 2).collect(Collectors.toList()). Streams support lazy evaluation and parallel processing.' },

  { id: 19, category: 'javascript', difficulty: 'easy', question: 'What is the difference between var, let, and const?', answer: 'var is function-scoped and can be redeclared. let is block-scoped and can be reassigned but not redeclared. const is block-scoped and cannot be reassigned or redeclared. let and const are in the temporal dead zone until initialized.' },
  { id: 20, category: 'javascript', difficulty: 'medium', question: 'Explain closures in JavaScript.', answer: 'A closure is a function that retains access to its outer scope variables even after the outer function has returned. Closures enable data privacy, factory functions, and callbacks.' },
  { id: 21, category: 'javascript', difficulty: 'medium', question: 'What is the event loop in JavaScript?', answer: 'The event loop handles asynchronous operations by checking the call stack and task queue. When the stack is empty, it moves callbacks from the queue to the stack, enabling non-blocking I/O despite JavaScript being single-threaded.' },
  { id: 22, category: 'javascript', difficulty: 'hard', question: 'Explain prototypal inheritance in JavaScript.', answer: 'Every JavaScript object has an internal [[Prototype]] link. Property lookups traverse the prototype chain until found or null. ES6 classes are syntactic sugar over prototypal inheritance.' },
  { id: 23, category: 'javascript', difficulty: 'easy', question: 'What is the difference between == and ===?', answer: '== performs type coercion before comparison. === performs strict comparison without coercion. Always use === to avoid unexpected type coercion bugs.' },
  { id: 24, category: 'javascript', difficulty: 'medium', question: 'What are Promises and async/await?', answer: 'Promises represent eventual completion or failure of async operations with states: pending, fulfilled, rejected. async/await is syntactic sugar making async code look synchronous.' },
  { id: 25, category: 'javascript', difficulty: 'easy', question: 'Explain hoisting in JavaScript.', answer: 'Hoisting moves declarations to the top of their scope during compilation. var is hoisted as undefined. function declarations are fully hoisted. let and const are hoisted but not initialized (temporal dead zone).' },
  { id: 26, category: 'javascript', difficulty: 'hard', question: 'What is the difference between null and undefined?', answer: 'undefined means a variable declared but not assigned. null is an intentional assignment representing no value. typeof null returns "object" (historical bug). Both are falsy.' },
  { id: 27, category: 'javascript', difficulty: 'medium', question: 'Explain the this keyword in JavaScript.', answer: 'this refers to the object executing the current function. Its value depends on call context: global, method, constructor, arrow functions (lexical), or explicit binding via call/apply/bind.' },
  { id: 28, category: 'javascript', difficulty: 'medium', question: 'What is debouncing and throttling?', answer: 'Debouncing delays execution until after a pause in events (search input). Throttling limits execution to once per interval (scroll handlers). Both optimize performance for frequent events.' },

  { id: 29, category: 'html', difficulty: 'easy', question: 'What is semantic HTML and why is it important?', answer: 'Semantic HTML uses meaningful tags like header, nav, main, article, section, and footer. It improves accessibility, SEO, code readability, and helps screen readers understand page structure.' },
  { id: 30, category: 'html', difficulty: 'easy', question: 'Explain the difference between block and inline elements.', answer: 'Block elements take full width and start on new lines. Inline elements only take necessary width and flow within text. Block elements can contain other blocks; inline elements generally cannot.' },
  { id: 31, category: 'html', difficulty: 'medium', question: 'What are data attributes in HTML5?', answer: 'Data attributes (data-*) store custom data on HTML elements. Access via element.dataset in JavaScript. Useful for configuration without extra DOM queries.' },
  { id: 32, category: 'html', difficulty: 'medium', question: 'Explain HTML5 form validation attributes.', answer: 'Built-in validation includes required, type (email, url, number), pattern, min/max, minlength/maxlength, step. CSS :valid and :invalid style fields. JavaScript checkValidity() provides programmatic control.' },
  { id: 33, category: 'html', difficulty: 'easy', question: 'What is the purpose of the alt attribute in images?', answer: 'Alt text provides alternatives when images cannot display. Essential for accessibility, SEO, and fallback when images fail to load.' },
  { id: 34, category: 'html', difficulty: 'hard', question: 'Explain defer vs async script loading.', answer: 'async downloads in parallel and executes immediately when ready (order not guaranteed). defer downloads in parallel but executes after HTML parsing in order. Use defer for dependent scripts.' },

  { id: 35, category: 'css', difficulty: 'easy', question: 'Explain the CSS box model.', answer: 'Every element has content, padding, border, and margin. box-sizing: content-box adds padding/border to width. border-box includes padding and border in the specified width.' },
  { id: 36, category: 'css', difficulty: 'medium', question: 'What is the difference between Flexbox and CSS Grid?', answer: 'Flexbox is one-dimensional for component layouts. CSS Grid is two-dimensional for page layouts. Flexbox distributes space along one axis; Grid excels at complex two-dimensional placement.' },
  { id: 37, category: 'css', difficulty: 'medium', question: 'Explain CSS specificity.', answer: 'Specificity: inline (1000), IDs (100), classes/attributes/pseudo-classes (10), elements (1). Higher wins. !important overrides. Equal specificity: last rule wins.' },
  { id: 38, category: 'css', difficulty: 'hard', question: 'What are CSS custom properties (variables)?', answer: 'Defined with --name: value, used with var(--name). They cascade and inherit, enabling dynamic theming. JavaScript can modify them via setProperty().' },
  { id: 39, category: 'css', difficulty: 'easy', question: 'Explain responsive design and media queries.', answer: 'Responsive design adapts layouts to screen sizes using media queries like @media (max-width: 768px). Use relative units (rem, %, vw) for flexibility.' },
  { id: 40, category: 'css', difficulty: 'medium', question: 'What are CSS animations vs transitions?', answer: 'Transitions animate property changes between two states triggered by events. Animations use @keyframes for complex multi-step animations with iteration and direction control.' },

  { id: 41, category: 'sql', difficulty: 'easy', question: 'What is the difference between INNER JOIN and LEFT JOIN?', answer: 'INNER JOIN returns only matching rows from both tables. LEFT JOIN returns all left table rows with matching right rows (NULL if no match).' },
  { id: 42, category: 'sql', difficulty: 'medium', question: 'Explain WHERE vs HAVING clauses.', answer: 'WHERE filters rows before grouping. HAVING filters groups after GROUP BY and can use aggregate functions.' },
  { id: 43, category: 'sql', difficulty: 'medium', question: 'What are database indexes?', answer: 'Indexes speed up data retrieval like a book index. They improve SELECT but slow writes. Use on frequently queried, JOIN, and WHERE columns.' },
  { id: 44, category: 'sql', difficulty: 'hard', question: 'Explain ACID properties.', answer: 'Atomicity (all or nothing), Consistency (valid state transitions), Isolation (concurrent transactions don\'t interfere), Durability (committed data persists after crashes).' },
  { id: 45, category: 'sql', difficulty: 'easy', question: 'What is the difference between DELETE and TRUNCATE?', answer: 'DELETE removes rows individually with WHERE support and triggers. TRUNCATE removes all rows quickly, cannot use WHERE, and resets auto-increment counters.' },
  { id: 46, category: 'sql', difficulty: 'medium', question: 'Explain normalization.', answer: 'Normalization reduces redundancy: 1NF (atomic values), 2NF (no partial dependencies), 3NF (no transitive dependencies). Denormalization is sometimes used for read performance.' },
  { id: 47, category: 'sql', difficulty: 'easy', question: 'What is a primary key vs foreign key?', answer: 'Primary key uniquely identifies rows. Foreign key links tables referencing another table\'s primary key, enforcing referential integrity.' },

  { id: 48, category: 'aptitude', difficulty: 'easy', question: 'If a train travels 120 km in 2 hours, what is its average speed?', answer: 'Average speed = 120 km / 2 hours = 60 km/h.' },
  { id: 49, category: 'aptitude', difficulty: 'medium', question: 'Next number: 2, 6, 12, 20, 30, ?', answer: 'Pattern n(n+1): next is 6×7 = 42.' },
  { id: 50, category: 'aptitude', difficulty: 'medium', question: 'Price increased 20% then decreased 20%. Net change?', answer: '4% decrease. 100 → 120 → 96. Percentage changes are multiplicative.' },
  { id: 51, category: 'aptitude', difficulty: 'hard', question: 'Arrangements of letters in "MISSISSIPPI"?', answer: '11! / (4! × 4! × 2!) = 34,650 ways.' },
  { id: 52, category: 'aptitude', difficulty: 'easy', question: '5 workers finish in 12 days. How long for 8 workers?', answer: '7.5 days. Work = Workers × Days (constant).' },
  { id: 53, category: 'aptitude', difficulty: 'medium', question: 'Probability of exactly 2 heads in 3 coin tosses?', answer: '3/8 = 37.5%. Favorable: HHT, HTH, THH.' },
  { id: 54, category: 'aptitude', difficulty: 'easy', question: 'Angle between clock hands at 3:15?', answer: '7.5°. Hour hand at 97.5°, minute at 90°.' },

  { id: 55, category: 'hr', difficulty: 'easy', question: 'Tell me about yourself.', answer: 'Structure: present role/education, relevant past experience, future goals aligned with the role. Keep it 1-2 minutes, professional, and focused on career relevance—not personal life.' },
  { id: 56, category: 'hr', difficulty: 'medium', question: 'What are your strengths and weaknesses?', answer: 'Strengths: pick 2-3 with examples (problem-solving, teamwork). Weaknesses: choose a real one with steps you\'re taking to improve. Avoid clichés like "I\'m a perfectionist" without substance.' },
  { id: 57, category: 'hr', difficulty: 'medium', question: 'Why do you want to work here?', answer: 'Research the company. Mention specific values, products, culture, or growth opportunities. Connect your skills and career goals to what the company offers.' },
  { id: 58, category: 'hr', difficulty: 'hard', question: 'Describe a challenging situation and how you handled it.', answer: 'Use STAR method: Situation, Task, Action, Result. Pick a real example showing problem-solving, ownership, and measurable positive outcome.' },
  { id: 59, category: 'hr', difficulty: 'easy', question: 'Where do you see yourself in 5 years?', answer: 'Show ambition aligned with the role: growing expertise, taking on leadership, contributing to company goals. Avoid unrealistic titles or implying you\'ll leave quickly.' },
  { id: 60, category: 'hr', difficulty: 'medium', question: 'Why should we hire you?', answer: 'Summarize unique value: relevant skills, achievements, cultural fit, and enthusiasm. Differentiate from other candidates with specific examples.' },
  { id: 61, category: 'hr', difficulty: 'medium', question: 'How do you handle stress and pressure?', answer: 'Describe healthy strategies: prioritization, breaking tasks down, communication with team, maintaining work-life balance. Give a brief example of delivering under deadline.' },
  { id: 62, category: 'hr', difficulty: 'easy', question: 'Do you have any questions for us?', answer: 'Always prepare 2-3 questions: team structure, success metrics, growth opportunities, company culture. Avoid asking only about salary/benefits in first rounds.' }
];

const QuizData = [
  { id: 'q1', category: 'python', question: 'Which is mutable in Python?', options: ['Tuple', 'String', 'List', 'Integer'], correct: 2 },
  { id: 'q2', category: 'python', question: 'What does yield do?', options: ['Returns and terminates', 'Pauses and returns generator', 'Creates a class', 'Imports module'], correct: 1 },
  { id: 'q3', category: 'python', question: 'Invalid Python data type?', options: ['Dictionary', 'Set', 'Array', 'Boolean'], correct: 2 },
  { id: 'q4', category: 'java', question: 'Which is NOT a Java access modifier?', options: ['public', 'protected', 'internal', 'private'], correct: 2 },
  { id: 'q5', category: 'java', question: 'Which collection does not allow duplicates?', options: ['ArrayList', 'HashSet', 'LinkedList', 'Vector'], correct: 1 },
  { id: 'q6', category: 'java', question: 'JVM stands for?', options: ['Java Virtual Machine', 'Java Version Manager', 'Joint Virtual Memory', 'Java Visual Module'], correct: 0 },
  { id: 'q7', category: 'javascript', question: 'typeof null returns?', options: ['"null"', '"undefined"', '"object"', '"number"'], correct: 2 },
  { id: 'q8', category: 'javascript', question: 'Adds element to array end?', options: ['push()', 'pop()', 'shift()', 'unshift()'], correct: 0 },
  { id: 'q9', category: 'javascript', question: 'Arrow functions lack their own:', options: ['Parameters', 'Return', 'this binding', 'Body'], correct: 2 },
  { id: 'q10', category: 'html', question: 'Largest heading tag?', options: ['<heading>', '<h1>', '<head>', '<header>'], correct: 1 },
  { id: 'q11', category: 'html', question: 'Required input attribute?', options: ['mandatory', 'required', 'validate', 'needed'], correct: 1 },
  { id: 'q12', category: 'css', question: 'Flex container direction property?', options: ['flex-direction', 'flex-flow', 'direction', 'align-items'], correct: 0 },
  { id: 'q13', category: 'css', question: 'position: absolute positions relative to?', options: ['Document flow', 'Nearest positioned ancestor', 'Viewport', 'Parent center'], correct: 1 },
  { id: 'q14', category: 'sql', question: 'Filter grouped data with?', options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'], correct: 1 },
  { id: 'q15', category: 'sql', question: 'Returns all rows from both tables?', options: ['INNER JOIN', 'LEFT JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'], correct: 2 },
  { id: 'q16', category: 'aptitude', question: '15% of 200?', options: ['15', '20', '30', '25'], correct: 2 },
  { id: 'q17', category: 'aptitude', question: 'x + 5 = 12, x = ?', options: ['5', '6', '7', '8'], correct: 2 },
  { id: 'q18', category: 'hr', question: 'Best method for behavioral questions?', options: ['STAR', 'SWOT', 'SMART', 'PEST'], correct: 0 },
  { id: 'q19', category: 'hr', question: '"Tell me about yourself" should be:', options: ['Personal life story', 'Career-focused summary', 'Company history', 'Salary expectations'], correct: 1 },
  { id: 'q20', category: 'python', question: 'Output of print(2 ** 3)?', options: ['6', '8', '9', '5'], correct: 1 },
  { id: 'q21', category: 'javascript', question: 'Parse JSON to object?', options: ['JSON.parse()', 'JSON.stringify()', 'JSON.object()', 'JSON.convert()'], correct: 0 },
  { id: 'q22', category: 'java', question: 'Java is primarily?', options: ['Interpreted only', 'Compiled to bytecode', 'Assembly language', 'Scripting language'], correct: 1 },
  { id: 'q23', category: 'css', question: 'Unit relative to root font size?', options: ['em', 'rem', 'px', 'vh'], correct: 1 },
  { id: 'q24', category: 'sql', question: 'Removes all rows quickly?', options: ['DELETE', 'DROP', 'TRUNCATE', 'REMOVE'], correct: 2 },
  { id: 'q25', category: 'aptitude', question: 'Square root of 144?', options: ['11', '12', '13', '14'], correct: 1 },
  { id: 'q26', category: 'python', question: 'Exception handling keyword?', options: ['catch', 'except', 'error', 'handle'], correct: 1 },
  { id: 'q27', category: 'javascript', question: 'Result of [] + []?', options: ['[]', '""', 'undefined', 'Error'], correct: 1 },
  { id: 'q28', category: 'html', question: 'Meta viewport controls?', options: ['Page title', 'Responsive scaling', 'Encoding', 'Keywords'], correct: 1 },
  { id: 'q29', category: 'css', question: 'display: flex creates?', options: ['Block', 'Flex container', 'Grid', 'Inline block'], correct: 1 },
  { id: 'q30', category: 'sql', question: 'Counts rows in SQL?', options: ['SUM()', 'COUNT()', 'TOTAL()', 'NUM()'], correct: 1 }
];

const InterviewPage = {
  currentFilter: 'all',
  searchQuery: '',
  viewMode: 'all',

  init() {
    this.renderQuestions();
    this.bindEvents();
    this.renderDailyQuestion();
    this.updateFavoritesCount();
  },

  bindEvents() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderQuestions();
      });
    }

    document.querySelectorAll('.filter-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        this.currentFilter = tag.dataset.category;
        this.renderQuestions();
      });
    });

    document.querySelectorAll('.view-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.viewMode = tab.dataset.view;
        this.renderQuestions();
      });
    });
  },

  getFilteredQuestions() {
    let pool = QuestionsData;

    if (this.viewMode === 'favorites') {
      const favs = App.getFavorites();
      pool = pool.filter(q => favs.includes(q.id));
    }

    return pool.filter(q => {
      const matchesCategory = this.currentFilter === 'all' || q.category === this.currentFilter;
      const matchesSearch = !this.searchQuery ||
        q.question.toLowerCase().includes(this.searchQuery) ||
        q.answer.toLowerCase().includes(this.searchQuery) ||
        q.category.toLowerCase().includes(this.searchQuery);
      return matchesCategory && matchesSearch;
    });
  },

  renderQuestions() {
    const container = document.getElementById('questions-list');
    if (!container) return;

    const questions = this.getFilteredQuestions();
    const countEl = document.getElementById('question-count');
    if (countEl) countEl.textContent = questions.length;

    if (questions.length === 0) {
      container.innerHTML = `
        <div class="empty-state glass-card">
          <div class="empty-state-icon">${this.viewMode === 'favorites' ? '❤️' : '🔍'}</div>
          <h3>${this.viewMode === 'favorites' ? 'No favorites yet' : 'No questions found'}</h3>
          <p>${this.viewMode === 'favorites' ? 'Save questions from the bank to review them here.' : 'Try adjusting your search or filter.'}</p>
        </div>`;
      return;
    }

    container.innerHTML = questions.map(q => this.createQuestionCard(q)).join('');
    this.bindQuestionEvents();
  },

  createQuestionCard(q) {
    const isFav = App.isFavorite(q.id);
    const catLabel = q.category === 'html' ? 'HTML' : q.category === 'css' ? 'CSS' : q.category;
    return `
      <div class="question-card" data-id="${q.id}">
        <div class="question-header">
          <div class="question-info">
            <div class="question-meta">
              <span class="category-badge ${q.category}">${catLabel}</span>
              <span class="difficulty-badge ${q.difficulty}">${q.difficulty}</span>
            </div>
            <div class="question-title">${q.question}</div>
          </div>
          <div class="question-actions">
            <button class="favorite-btn ${isFav ? 'active' : ''}" data-id="${q.id}" aria-label="Toggle favorite">
              ${isFav ? '❤️' : '🤍'}
            </button>
            <div class="expand-icon">▼</div>
          </div>
        </div>
        <div class="question-answer">
          <div class="answer-content"><p>${q.answer}</p></div>
        </div>
      </div>`;
  },

  bindQuestionEvents() {
    document.querySelectorAll('.question-card .question-header').forEach(header => {
      header.addEventListener('click', (e) => {
        if (e.target.closest('.favorite-btn')) return;
        const card = header.closest('.question-card');
        const wasExpanded = card.classList.contains('expanded');
        card.classList.toggle('expanded');
        if (!wasExpanded) {
          const id = parseInt(card.dataset.id, 10);
          App.incrementPracticed(id);
        }
      });
    });

    document.querySelectorAll('.favorite-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id, 10);
        const isFav = App.toggleFavorite(id);
        btn.classList.toggle('active', isFav);
        btn.innerHTML = isFav ? '❤️' : '🤍';
        this.updateFavoritesCount();
        if (this.viewMode === 'favorites') this.renderQuestions();
      });
    });
  },

  updateFavoritesCount() {
    const el = document.getElementById('favorites-count');
    if (el) el.textContent = App.getFavorites().length;
  },

  renderDailyQuestion() {
    const el = document.getElementById('daily-question-text');
    if (!el) return;
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    el.textContent = QuestionsData[dayOfYear % QuestionsData.length].question;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('questions-list')) InterviewPage.init();
});
