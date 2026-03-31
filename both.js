// ========================
// SHARED CONFIGURATION
// ========================
const config = {
    questionsPerPage: 5,
    pdfOptions: {
        margin: 10,
        filename: 'exam_results.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            scrollX: 0,
            scrollY: 0,
            windowWidth: document.documentElement.scrollWidth,
            windowHeight: document.documentElement.scrollHeight
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }
};

// ========================
// QUESTION DATA
// ========================
const questions = [
    { 
        question: "What is the capital of France?", 
        options: ["Berlin", "Madrid", "Paris", "Rome"], 
        answer: "Paris",
        explanation: "Paris has been the capital of France since the 5th century." 
    },
    { 
        question: "Which planet is known as the Red Planet?", 
        options: ["Earth", "Mars", "Jupiter", "Venus"], 
        answer: "Mars",
        explanation: "Mars appears red due to iron oxide (rust) on its surface." 
    },
    { 
        question: "What is 2 + 2?", 
        options: ["3", "4", "5", "6"], 
        answer: "4",
        explanation: "Basic arithmetic addition." 
    },
    { 
        question: "Who painted the Mona Lisa?", 
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"], 
        answer: "Leonardo da Vinci",
        explanation: "Leonardo da Vinci painted the Mona Lisa in the early 16th century." 
    },
    { 
        question: "What is the largest ocean on Earth?", 
        options: ["Atlantic", "Indian", "Arctic", "Pacific"], 
        answer: "Pacific",
        explanation: "The Pacific Ocean covers about 63 million square miles." 
    }
];

// ========================
// STATE MANAGEMENT
// ========================
const appState = {
    currentPage: 0,
    userAnswers: new Array(questions.length).fill(null),
    startTime: Date.now(),
    timerInterval: null
};

// ========================
// CORE INITIALIZATION
// ========================
document.addEventListener('DOMContentLoaded', function() {
    initializeToastSystem();
    
    if (document.getElementById('question-container')) {
        initializeExamPage();
    } else if (document.getElementById('userInfo')) {
        initializeResultsPage();
    }
});

// ========================
// EXAM PAGE FUNCTIONALITY
// ========================
function initializeExamPage() {
    // Verify user registration
    if (!getUserInfo()) {
        showToast('Please complete registration first', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }

    // Start exam timer
    startExamTimer();
    
    // Initial render
    renderQuestions();
    
    // Set up event listeners
    document.getElementById("next-btn").addEventListener("click", handleNextPage);
    document.getElementById("prev-btn").addEventListener("click", handlePrevPage);
    document.getElementById("submit-btn").addEventListener("click", handleExamSubmit);
    
    // Prevent accidental navigation
    window.addEventListener('beforeunload', handleBeforeUnload);
}

function renderQuestions() {
    const start = appState.currentPage * config.questionsPerPage;
    const end = Math.min(start + config.questionsPerPage, questions.length);
    const container = document.getElementById("question-container");
    
    container.innerHTML = questions.slice(start, end).map((q, i) => {
        const questionIndex = start + i;
        return `
            <div class="question">
                <div class="question-header">
                    <p><strong>${questionIndex + 1}. ${q.question}</strong></p>
                </div>
                <div class="options">
                    ${q.options.map(option => `
                        <label class="option">
                            <input type="radio" name="q${questionIndex}" value="${option}" 
                                   ${appState.userAnswers[questionIndex] === option ? 'checked' : ''}>
                            <span class="option-text">${option}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');

    updatePaginationControls();
    updateQuestionCounter();
}

function updatePaginationControls() {
    const totalPages = Math.ceil(questions.length / config.questionsPerPage);
    document.getElementById("prev-btn").disabled = appState.currentPage === 0;
    document.getElementById("next-btn").style.display = 
        appState.currentPage < totalPages - 1 ? "inline-block" : "none";
    document.getElementById("submit-btn").style.display = 
        appState.currentPage === totalPages - 1 ? "inline-block" : "none";
}

function updateQuestionCounter() {
    const currentSet = appState.currentPage * config.questionsPerPage;
    document.getElementById("page-counter").textContent = 
        `Questions ${currentSet + 1}-${Math.min(currentSet + config.questionsPerPage, questions.length)} of ${questions.length}`;
}

function saveCurrentAnswers() {
    document.querySelectorAll("#question-container input[type='radio']:checked").forEach(input => {
        const questionIndex = parseInt(input.name.substring(1));
        appState.userAnswers[questionIndex] = input.value;
    });
}

function handleNextPage() {
    saveCurrentAnswers();
    appState.currentPage++;
    renderQuestions();
}

function handlePrevPage() {
    saveCurrentAnswers();
    appState.currentPage--;
    renderQuestions();
}

function handleExamSubmit(e) {
    e.preventDefault();
    saveCurrentAnswers();
    
    const unansweredCount = appState.userAnswers.filter(a => a === null).length;
    if (unansweredCount > 0 && !confirm(`You have ${unansweredCount} unanswered questions. Submit anyway?`)) {
        return;
    }
    
    processExamSubmission();
}

function processExamSubmission() {
    // Calculate time taken
    const timeTaken = Math.floor((Date.now() - appState.startTime) / 1000);
    
    // Prepare results
    const examResults = {
        userInfo: { ...getUserInfo(), timeTaken },
        questions: questions.map((q, i) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.answer,
            userAnswer: appState.userAnswers[i],
            isCorrect: appState.userAnswers[i] === q.answer,
            explanation: q.explanation || ""
        }))
    };
    
    // Store results
    sessionStorage.setItem('examResults', JSON.stringify(examResults));
    localStorage.setItem('examResults', JSON.stringify(examResults));
    
    // Show loading state
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Grading Exam...';
    
    // Redirect to results
    setTimeout(() => window.location.href = "results.html", 800);
}

function startExamTimer() {
    const timerElement = document.getElementById('exam-timer');
    if (!timerElement) return;
    
    appState.startTime = Date.now();
    appState.timerInterval = setInterval(() => {
        const seconds = Math.floor((Date.now() - appState.startTime) / 1000);
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerElement.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
}

// ========================
// RESULTS PAGE FUNCTIONALITY
// ========================
function initializeResultsPage() {
    const examResults = getExamResults();
    
    if (!examResults) {
        showToast('No exam results found. Please take the exam first.', 'error');
        setTimeout(() => window.location.href = 'index.html', 3000);
        return;
    }

    displayUserInfo(examResults.userInfo);
    const scoreData = calculateScores(examResults.questions);
    displayScoreSummary(scoreData);
    displayQuestionResults(examResults.questions);
    renderProgressCircle(scoreData.scorePercentage);
    
    // Set up event listeners
    document.getElementById('downloadPdf')?.addEventListener('click', downloadResultsAsPDF);
    document.getElementById('printResults')?.addEventListener('click', printResultsPage);
}

function getExamResults() {
    return JSON.parse(sessionStorage.getItem('examResults')) || 
           JSON.parse(localStorage.getItem('examResults'));
}

function displayUserInfo(userInfo) {
    const container = document.getElementById('userInfo');
    if (!container) return;
    
    container.innerHTML = `
        <div class="info-item">
            <span class="info-label">Full Name:</span>
            <span class="info-value">${userInfo.fullName || 'Not provided'}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Matric Number:</span>
            <span class="info-value">${userInfo.matricNumber || 'Not provided'}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Department:</span>
            <span class="info-value">${userInfo.department || 'Not provided'}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Level:</span>
            <span class="info-value">${userInfo.level || 'Not provided'}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Date:</span>
            <span class="info-value">${new Date().toLocaleDateString()}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Time Taken:</span>
            <span class="info-value">${formatTime(userInfo.timeTaken)}</span>
        </div>
    `;
}

function calculateScores(questions) {
    const result = { correct: 0, incorrect: 0, unanswered: 0 };
    
    questions.forEach(q => {
        if (q.userAnswer === null || q.userAnswer === undefined) {
            result.unanswered++;
        } else if (q.isCorrect) {
            result.correct++;
        } else {
            result.incorrect++;
        }
    });
    
    result.scorePercentage = Math.round((result.correct / questions.length) * 100);
    return result;
}

function displayScoreSummary(scoreData) {
    document.getElementById('correctCount').textContent = scoreData.correct;
    document.getElementById('incorrectCount').textContent = scoreData.incorrect;
    document.getElementById('unansweredCount').textContent = scoreData.unanswered;
    document.getElementById('scoreValue').textContent = `${scoreData.scorePercentage}%`;
}

function displayQuestionResults(questions) {
    const container = document.getElementById('resultsList');
    if (!container) return;
    
    container.innerHTML = questions.map((q, i) => {
        const statusClass = q.isCorrect ? 'correct' : 
                          (q.userAnswer === null || q.userAnswer === undefined) ? 'unanswered' : 'incorrect';
        
        return `
            <div class="result-item ${statusClass}">
                <div class="result-question">${i + 1}. ${q.question}</div>
                <div class="result-answer">
                    <span class="answer-label">Your answer:</span> 
                    ${q.userAnswer ? `<span class="answer-user">${q.userAnswer}</span>` : '<span class="answer-missing">No answer</span>'}
                </div>
                <div class="result-answer">
                    <span class="answer-label">Correct answer:</span> 
                    <span class="answer-correct">${q.correctAnswer}</span>
                </div>
                ${q.explanation ? `<div class="result-explanation"><span class="answer-label">Explanation:</span> ${q.explanation}</div>` : ''}
            </div>
        `;
    }).join('');
}

function renderProgressCircle(percentage) {
    const circle = document.querySelector('.progress-ring-circle');
    if (!circle) return;
    
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
    
    // Animate the progress
    setTimeout(() => {
        circle.style.strokeDashoffset = offset;
        circle.style.stroke = 
            percentage >= 70 ? '#4caf50' :
            percentage >= 40 ? '#ff9800' : '#f44336';
    }, 100);
}

function downloadResultsAsPDF() {
    const element = document.querySelector('.container');
    const btn = document.getElementById('downloadPdf');
    
    if (!element || !btn) return;
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing PDF...';
    
    if (typeof html2pdf !== 'undefined') {
        generatePDF(element);
    } else {
        loadPDFLibrary().then(() => generatePDF(element));
    }
}

function generatePDF(element) {
    html2pdf().set(config.pdfOptions).from(element).save()
        .then(() => {
            const btn = document.getElementById('downloadPdf');
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-file-pdf"></i> Download PDF';
            }
        });
}

function loadPDFLibrary() {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = resolve;
        document.head.appendChild(script);
    });
}

function printResultsPage() {
    window.print();
}

// ========================
// SHARED UTILITIES
// ========================
function getUserInfo() {
    return JSON.parse(sessionStorage.getItem('userInfo')) || 
           JSON.parse(localStorage.getItem('userInfo'));
}

function formatTime(seconds) {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
}

function handleBeforeUnload(e) {
    if (window.location.pathname.includes('exam.html')) {
        e.preventDefault();
        e.returnValue = 'Your exam progress will be lost if you leave this page.';
        return e.returnValue;
    }
}

// ========================
// TOAST NOTIFICATION SYSTEM
// ========================
function initializeToastSystem() {
    if (!document.getElementById('toast-container')) {
        const container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
}

function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        warning: 'fa-exclamation-triangle',
        error: 'fa-times-circle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <div class="toast-icon"><i class="fas ${icons[type] || icons.info}"></i></div>
        <div class="toast-message">${message}</div>
        <div class="toast-close"><i class="fas fa-times"></i></div>
    `;
    
    container.appendChild(toast);
    
    // Auto-dismiss
    const dismissTimer = setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, duration);
    
    // Manual dismiss
    toast.querySelector('.toast-close').addEventListener('click', () => {
        clearTimeout(dismissTimer);
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    });
}