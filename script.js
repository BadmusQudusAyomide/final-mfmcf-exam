document.addEventListener('DOMContentLoaded', function() {
    // Create toast notification container
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);

    // For registration page
    const examBtn = document.getElementById('examBtn');
    const registrationModal = document.getElementById('registrationModal');
    const closeBtn = document.getElementById('closeBtn');
    const registrationForm = document.getElementById('registrationForm');
    
    if (examBtn && registrationModal && closeBtn && registrationForm) {
        // Open modal when exam button is clicked
        examBtn.addEventListener('click', function() {
            registrationModal.style.display = 'flex';
        });
        
        // Close modal when close button is clicked
        closeBtn.addEventListener('click', function() {
            registrationModal.style.display = 'none';
        });
        
        // Close modal when clicking outside the modal content
        window.addEventListener('click', function(event) {
            if (event.target === registrationModal) {
                registrationModal.style.display = 'none';
            }
        });
        
        // Handle form submission
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form values
            const fullName = document.getElementById('fullName').value;
            const matricNumber = document.getElementById('matricNumber').value;
            const department = document.getElementById('department').value;
            const level = document.getElementById('level').value;
            const phone = document.getElementById('phone').value;
            
            // Store user info in sessionStorage
            const userInfo = {
                fullName,
                matricNumber,
                department,
                level,
                phone
            };
            sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
            
            // Show success toast
            showToast('Registration successful! Redirecting to exam...', 'success');
            
            // Redirect to exam page after delay
            setTimeout(() => {
                window.location.href = 'exam.html';
            }, 2000);
        });
    }

    // For instruction page
    const agreeCheckbox = document.getElementById('agreeCheckbox');
    const startExamBtn = document.getElementById('startExamBtn');
    
    if (agreeCheckbox && startExamBtn) {
        // Enable/disable start exam button based on checkbox
        agreeCheckbox.addEventListener('change', function() {
            startExamBtn.disabled = !this.checked;
            startExamBtn.classList.toggle('enabled', this.checked);
        });
        
        // Handle start exam button click
        startExamBtn.addEventListener('click', function() {
            // Redirect to the exam page
            window.location.href = 'exam.html';
        });
        
        // Page visibility tracking (for cheating prevention)
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                // User switched tabs or minimized window
                showToast('Warning: Please remain on this page during the exam!', 'warning', 5000);
                // In a real app, you would record this violation
            }
        });
        
        // Fullscreen detection (additional cheating prevention)
        window.addEventListener('resize', function() {
            if (window.innerHeight < screen.height - 100) {
                // Possible attempt to view other windows
                showToast('Warning: Keep this window maximized during the exam!', 'warning', 5000);
                // Record this violation in a real app
            }
        });
    }

    // Toast notification function
    function showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Add icon based on type
        let icon;
        switch(type) {
            case 'success':
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'warning':
                icon = '<i class="fas fa-exclamation-triangle"></i>';
                break;
            case 'error':
                icon = '<i class="fas fa-times-circle"></i>';
                break;
            default:
                icon = '<i class="fas fa-info-circle"></i>';
        }
        
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-message">${message}</div>
            <div class="toast-close"><i class="fas fa-times"></i></div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto-remove after duration
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, duration);
        
        // Allow manual close
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        });
    }
});