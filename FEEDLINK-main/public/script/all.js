document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Check for saved user preference in localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme immediately on page load
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if (darkModeToggle) {
            const icon = darkModeToggle.querySelector('i');
            if (icon) icon.classList.replace('fa-moon', 'fa-sun');
        }
    } else {
        body.classList.remove('dark-mode');
        if (darkModeToggle) {
            const icon = darkModeToggle.querySelector('i');
            if (icon) icon.classList.replace('fa-sun', 'fa-moon');
        }
    }

    // Toggle Theme on Button Click
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            body.classList.toggle('dark-mode');
            
            const icon = darkModeToggle.querySelector('i');
            const isDarkMode = body.classList.contains('dark-mode');
            
            if (isDarkMode) {
                localStorage.setItem('theme', 'dark');
                if (icon) icon.classList.replace('fa-moon', 'fa-sun');
            } else {
                localStorage.setItem('theme', 'light');
                if (icon) icon.classList.replace('fa-sun', 'fa-moon');
            }
        });
    }

    // Sync dark mode across browser tabs
    window.addEventListener('storage', (e) => {
        if (e.key === 'theme') {
            if (e.newValue === 'dark') {
                body.classList.add('dark-mode');
                if (darkModeToggle) {
                    const icon = darkModeToggle.querySelector('i');
                    if (icon) icon.classList.replace('fa-moon', 'fa-sun');
                }
            } else {
                body.classList.remove('dark-mode');
                if (darkModeToggle) {
                    const icon = darkModeToggle.querySelector('i');
                    if (icon) icon.classList.replace('fa-sun', 'fa-moon');
                }
            }
        }
    });

    // ============================================
    // AUTHENTICATION UI HANDLER
    // ============================================
    updateAuthUI();

    // Listen for auth changes
    window.addEventListener('storage', (e) => {
        if (e.key === 'authToken' || e.key === 'userName' || e.key === 'userType') {
            updateAuthUI();
        }
    });
});

/**
 * Update navbar based on authentication status
 */
function updateAuthUI() {
    const authToken = localStorage.getItem('authToken');
    const userName = localStorage.getItem('userName');
    const userType = localStorage.getItem('userType');
    const loginBtn = document.querySelector('.login-btn');

    if (!loginBtn) return;

    if (authToken && userName) {
        // Logged in UI
        loginBtn.innerHTML = `
            <i class="fas fa-user"></i> ${userName}
        `;

        // REMOVE dropdown behavior
        loginBtn.onclick = (e) => {
            e.preventDefault();

            const routes = {
                donor: 'donor-dashboard.html',
                ngo: 'ngo-dashboard.html'
            };

            window.location.href = routes[userType] || 'login.html';
        };

    } else {
        // Not logged in
        loginBtn.innerHTML = 'Login / Sign Up';
        loginBtn.onclick = null;
        loginBtn.href = 'login.html';
    }
}


/**
 * Handle logout
 */
function handleLogout(event) {
    event.preventDefault();
    
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userType');
        
        alert('Logged out successfully!');
        window.location.href = 'index.html';
    }
}
// chat-bot
function openChat() {
  window.open(
    "chat.html",           // your chatbot file
    "FeedLinkAI",
    "HeartLinkAI",

  );
}
const toggle = document.getElementById("chat-toggle");
const overlay = document.getElementById("chat-overlay");

toggle.onclick = () => {
  overlay.style.display =
    overlay.style.display === "block" ? "none" : "block";
};
window.addEventListener("message", function(event) {
  if (event.data === "closeFeedlinkChat") {
    overlay.style.display = "none";
  }
});


