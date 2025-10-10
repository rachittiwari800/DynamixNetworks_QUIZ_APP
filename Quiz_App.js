class QuizApp {
  constructor() {
    this.currentIndex = 0;
    this.score = 0;
    this.questions = [];
    this.category = '';
    this.difficulty = '';
    this.userAnswers = [];
    this.timeLeft = 30;
    this.timerId = null;

    this.loadQuestionBank();
    this.setupEventListeners();
  }

  loadQuestionBank() {
    this.questionBank = {
      webdev: {
        easy: [
          {
            question: "What does HTML stand for?",
            options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyper Text Markdown Language"],
            answer: 0
          },
          {
            question: "What does CSS stand for?",
            options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style System", "Colorful Style Sheets"],
            answer: 0
          },
          {
            question: "CSS is used for?",
            options: ["Structure", "Styling", "Programming", "Database"],
            answer: 1
          }
        ],
        medium: [
          {
            question: "Which of the following is NOT a JavaScript data type?",
            options: ["Number", "Boolean", "Character", "Object"],
            answer: 2
          },
          {
            question: "Which property is used to change text color in CSS?",
            options: ["font-color", "text-color", "color", "foreground"],
            answer: 2
          },
          {
            question: "Which method is used to add an element at the end of an array in JavaScript?",
            options: [".add()", ".append()", ".push()", ".insert()"],
            answer: 2
          }
        ],
        hard: [
          {
            question: "What does the ‘this’ keyword refer to in JavaScript (in non-strict mode)?",
            options: ["Global object", "Current function", "Parent object", "Undefined"],
            answer: 0
          },
          {
            question: "Which CSS property is used to create a flex container?",
            options: ["display: flex", "flex: container", "container: flex", "flexbox: enable"],
            answer: 0
          },
          {
            question: "Which of the following is a correct way to declare an async function?",
            options: ["function async myFunc()", "async function myFunc()", "myFunc() async", "declare async myFunc()"],
            answer: 1
          }
        ]
      },
      math: {
        easy: [
          {
            question: "What is 5 + 3?",
            options: ["5", "8", "10", "15"],
            answer: 1
          },
          {
            question: "What is 10 - 4?",
            options: ["6", "4", "8", "14"],
            answer: 0
          },
          {
            question: "What is 7 × 3?",
            options: ["10", "17", "21", "30"],
            answer: 2
          }
        ],
        medium: [
          {
            question: "What is the square root of 81?",
            options: ["7", "8", "9", "10"],
            answer: 2
          },
          {
            question: "Solve: 12 ÷ 3 × 2",
            options: ["2", "4", "6", "8"],
            answer: 3
          },
          {
            question: "What is 15% of 200?",
            options: ["25", "30", "35", "40"],
            answer: 1
          }
        ],
        hard: [
          {
            question: "If x = 2, what is the value of 3x² + 4x + 1?",
            options: ["12", "17", "21", "25"],
            answer: 2
          },
          {
            question: "What is the derivative of x²?",
            options: ["2x", "x²", "x", "x³"],
            answer: 0
          },
          {
            question: "Solve for x: 2x + 5 = 15",
            options: ["x=5", "x=6", "x=7", "x=10"],
            answer: 0
          }
        ]
      },
      gk: {
        easy: [
          {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Mercury"],
            answer: 1
          },
          {
            question: "Who is known as the Father of the Nation (India)?",
            options: ["Bhagat Singh", "Mahatma Gandhi", "Subhash Chandra Bose", "Jawaharlal Nehru"],
            answer: 1
          },
          {
            question: "Which is the largest continent?",
            options: ["Africa", "Asia", "Europe", "Australia"],
            answer: 1
          }
        ],
        medium: [
          {
            question: "Who invented the light bulb?",
            options: ["Thomas Edison", "Albert Einstein", "Nikola Tesla", "Isaac Newton"],
            answer: 0
          },
          {
            question: "In which year did World War II end?",
            options: ["1940", "1942", "1945", "1950"],
            answer: 2
          },
          {
            question: "Which country is called the Land of Rising Sun?",
            options: ["China", "Japan", "Korea", "Thailand"],
            answer: 1
          }
        ],
        hard: [
          {
            question: "Who wrote the book 'Origin of Species'?",
            options: ["Charles Darwin", "Gregor Mendel", "Albert Einstein", "Isaac Newton"],
            answer: 0
          },
          {
            question: "Which is the longest river in the world?",
            options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
            answer: 1
          },
          {
            question: "Which country hosted the first modern Olympic Games?",
            options: ["Italy", "France", "Greece", "USA"],
            answer: 2
          }
        ]
      }
    };
  }

  setupEventListeners() {
    document.querySelectorAll('.selection-card').forEach(card =>
      card.addEventListener('click', e => this.handleSelection(e))
    );
    document.getElementById('startBtn').addEventListener('click', () => this.startQuiz());
    document.getElementById('nextBtn').addEventListener('click', () => this.nextQuestion());
    document.getElementById('retakeBtn').addEventListener('click', () => this.restartQuiz());
    document.getElementById('newQuizBtn').addEventListener('click', () => this.resetQuiz());
    document.getElementById('reviewBtn').addEventListener('click', () => this.showReview());
    document.getElementById('backToResultsBtn').addEventListener('click', () => this.showResults());
  }

  handleSelection(e) {
    const card = e.currentTarget;
    const category = card.dataset.category;
    const difficulty = card.dataset.difficulty;

    if (category) {
      this.category = category;
      document.querySelectorAll('[data-category]').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    }
    if (difficulty) {
      this.difficulty = difficulty;
      document.querySelectorAll('[data-difficulty]').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    }

    const startBtn = document.getElementById('startBtn');
    startBtn.disabled = !(this.category && this.difficulty);
  }

  startQuiz() {
    this.questions = this.shuffleArray([...this.questionBank[this.category][this.difficulty]]);
    this.currentIndex = 0;
    this.score = 0;
    this.userAnswers = [];
    this.showScreen('quizScreen');
    this.displayQuestion();
  }

  shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  displayQuestion() {
    const questionObj = this.questions[this.currentIndex];
    document.getElementById('questionText').textContent = questionObj.question;

    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    questionObj.options.forEach((option, i) => {
      const optionDiv = document.createElement('div');
      optionDiv.classList.add('option');
      optionDiv.innerHTML = `<span class="option-letter">${String.fromCharCode(65+i)}</span>${option}`;
      optionDiv.addEventListener('click', () => this.selectAnswer(i));
      optionsContainer.appendChild(optionDiv);
    });

    document.getElementById('progressBar').style.width = `${((this.currentIndex + 1) / this.questions.length) * 100}%`;
    document.getElementById('progressText').textContent = `Question ${this.currentIndex + 1} of ${this.questions.length}`;
    document.getElementById('nextBtn').style.display = 'none';

    this.resetTimer();
  }

  resetTimer() {
    clearInterval(this.timerId);
    this.timeLeft = 30;
    document.getElementById('timer').textContent = `${this.timeLeft}s`;
    this.timerId = setInterval(() => {
      this.timeLeft--;
      document.getElementById('timer').textContent = `${this.timeLeft}s`;
      if (this.timeLeft <= 0) this.handleTimeout();
    }, 1000);
  }

  selectAnswer(selectedIndex) {
    clearInterval(this.timerId);
    const questionObj = this.questions[this.currentIndex];
    const options = document.querySelectorAll('.option');

    options.forEach((option, i) => {
      option.removeEventListener('click', () => this.selectAnswer(i));
      if (i === questionObj.answer) option.classList.add('correct');
      if (i === selectedIndex && i !== questionObj.answer) option.classList.add('incorrect');
    });

    this.userAnswers.push({ question: questionObj.question, selected: selectedIndex, correct: questionObj.answer });

    if (selectedIndex === questionObj.answer) this.score++;

    document.getElementById('nextBtn').style.display = 'inline-block';
  }

  handleTimeout() {
    clearInterval(this.timerId);
    const questionObj = this.questions[this.currentIndex];
    const options = document.querySelectorAll('.option');
    options.forEach((option, i) => {
      if (i === questionObj.answer) option.classList.add('correct');
    });

    this.userAnswers.push({ question: questionObj.question, selected: null, correct: questionObj.answer });
    document.getElementById('nextBtn').style.display = 'inline-block';
  }

  nextQuestion() {
    this.currentIndex++;
    if (this.currentIndex < this.questions.length) this.displayQuestion();
    else this.showResults();
  }

  showResults() {
    this.showScreen('resultsScreen');
    const scorePercent = Math.round((this.score / this.questions.length) * 100);
    document.getElementById('finalScore').textContent = `${scorePercent}%`;

    const feedback = document.getElementById('feedback');
    if (scorePercent >= 80) {
      feedback.className = 'feedback excellent';
      document.getElementById('feedbackTitle').textContent = 'Excellent! 🎯';
      document.getElementById('feedbackText').textContent = 'You really know your stuff!';
    } else if (scorePercent >= 50) {
      feedback.className = 'feedback good';
      document.getElementById('feedbackTitle').textContent = 'Good effort! 👍';
      document.getElementById('feedbackText').textContent = 'Keep practicing and you\'ll master it.';
    } else {
      feedback.className = 'feedback needs-improvement';
      document.getElementById('feedbackTitle').textContent = 'Keep Learning 📚';
      document.getElementById('feedbackText').textContent = 'Try again and improve your score!';
    }
  }

  showReview() {
    this.showScreen('reviewScreen');
    const reviewContainer = document.getElementById('reviewContainer');
    reviewContainer.innerHTML = '';

    this.userAnswers.forEach((item, i) => {
      const reviewItem = document.createElement('div');
      reviewItem.classList.add('question');
      reviewItem.innerHTML = `<h3>Q${i + 1}: ${item.question}</h3>
        <p><strong>Your Answer:</strong> ${item.selected !== null ? this.questions[i].options[item.selected] : 'No Answer'}</p>
        <p><strong>Correct Answer:</strong> ${this.questions[i].options[item.correct]}</p>`;
      reviewContainer.appendChild(reviewItem);
    });
  }

  restartQuiz() {
    this.currentIndex = 0;
    this.score = 0;
    this.userAnswers = [];
    this.showScreen('quizScreen');
    this.displayQuestion();
  }

  resetQuiz() {
    this.category = '';
    this.difficulty = '';
    document.querySelectorAll('.selection-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('startBtn').disabled = true;
    this.showScreen('startScreen');
  }

  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new QuizApp();
});
