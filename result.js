document.addEventListener('DOMContentLoaded', function() {
    // Retrieve results from sessionStorage or localStorage
    const examResults = JSON.parse(sessionStorage.getItem('examResults')) || 
                       JSON.parse(localStorage.getItem('examResults'));

    if (!examResults) {
        showToast('No exam results found. Please take the exam first.', 'error');
        setTimeout(() => window.location.href = 'index.html', 3000);
        return;
    }

    // Display user information
    displayUserInfo(examResults.userInfo);
    
    // Calculate and display scores
    const scoreData = calculateAndDisplayScores(examResults.questions);
    
    // Display detailed results
    displayDetailedResults(examResults.questions);
    
    // Update the progress circle
    updateProgressCircle(scoreData.scorePercentage);
    
    // Set up event listeners for buttons
    const downloadPdfButton = document.getElementById('downloadPdf');
    if (downloadPdfButton) {
        downloadPdfButton.addEventListener('click', downloadAsPDF);
    }
    
    const printResultsButton = document.getElementById('printResults');
    if (printResultsButton) {
        printResultsButton.addEventListener('click', printResults);
    }
});

function displayUserInfo(userInfo) {
    const userInfoContainer = document.getElementById('userInfo');
    if (!userInfoContainer) {
        console.error('User info container not found in DOM');
        return;
    }
    
    const userInfoHTML = `
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
    
    userInfoContainer.innerHTML = userInfoHTML;
}

function formatTime(seconds) {
    if (!seconds && seconds !== 0) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
}

function calculateAndDisplayScores(questions) {
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    
    questions.forEach(question => {
        if (!question.userAnswer) {
            unansweredCount++;
        } else if (question.isCorrect) {
            correctCount++;
        } else {
            incorrectCount++;
        }
    });
    
    const totalQuestions = questions.length;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    
    // Update the score display
    const correctElement = document.getElementById('correctCount');
    const incorrectElement = document.getElementById('incorrectCount');
    const unansweredElement = document.getElementById('unansweredCount');
    const scoreElement = document.getElementById('scoreValue');
    
    if (correctElement) correctElement.textContent = correctCount;
    if (incorrectElement) incorrectElement.textContent = incorrectCount;
    if (unansweredElement) unansweredElement.textContent = unansweredCount;
    if (scoreElement) scoreElement.textContent = `${scorePercentage}%`;
    
    return { correctCount, incorrectCount, unansweredCount, scorePercentage };
}

function displayDetailedResults(questions) {
    const resultsList = document.getElementById('resultsList');
    if (!resultsList) {
        console.error('Results list container not found in DOM');
        return;
    }
    
    let resultsHTML = '';
    
    questions.forEach((question, index) => {
        const status = question.userAnswer ? 
                       (question.isCorrect ? 'correct' : 'incorrect') : 
                       'unanswered';
        
        let userAnswerDisplay = '';
        
        if (!question.userAnswer) {
            userAnswerDisplay = '<span class="answer-missing">No answer provided</span>';
        } else {
            userAnswerDisplay = `<span class="answer-user">${question.userAnswer}</span>`;
        }
        
        resultsHTML += `
            <div class="result-item ${status}">
                <div class="result-question">${index + 1}. ${question.question}</div>
                <div class="result-answer">
                    <span class="answer-label">Your answer:</span> ${userAnswerDisplay}
                </div>
                <div class="result-answer">
                    <span class="answer-label">Correct answer:</span> <span class="answer-correct">${question.correctAnswer}</span>
                </div>
                ${question.explanation ? `<div class="result-explanation"><span class="answer-label">Explanation:</span> ${question.explanation}</div>` : ''}
            </div>
        `;
    });
    
    resultsList.innerHTML = resultsHTML;
}

function updateProgressCircle(percentage) {
    const circle = document.querySelector('.progress-ring-circle');
    if (!circle) {
        console.error('Progress circle not found in DOM');
        return;
    }
    
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
    
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    
    // Change color based on performance
    if (percentage >= 70) {
        circle.style.stroke = '#4caf50'; // Green for good
    } else if (percentage >= 40) {
        circle.style.stroke = '#ff9800'; // Orange for average
    } else {
        circle.style.stroke = '#f44336'; // Red for poor
    }
}

function downloadAsPDF() {
    // Check if html2pdf is loaded
    if (typeof html2pdf === 'undefined') {
        // Load html2pdf.js dynamically
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = () => {
            generatePDF();
        };
        document.head.appendChild(script);
    } else {
        generatePDF();
    }
}

function generatePDF() {
    const element = document.querySelector('.container');
    const opt = {
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
    };
    
    html2pdf().set(opt).from(element).save();
}

function printResults() {
    window.print();
}

function showToast(message, type = 'info', duration = 3000) {
    let toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
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
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, duration);
    
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    });
}