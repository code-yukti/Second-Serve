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
        // User is logged in - show user name and logout
        loginBtn.innerHTML = `
            <i class="fas fa-user"></i> ${userName}
            <i class="fas fa-caret-down" style="margin-left: 5px;"></i>
        `;
        loginBtn.style.position = 'relative';
        
        // Create dropdown menu if it doesn't exist
        let dropdown = loginBtn.nextElementSibling;
        if (!dropdown || !dropdown.classList.contains('user-dropdown')) {
            dropdown = document.createElement('div');
            dropdown.className = 'user-dropdown';
            dropdown.innerHTML = `
                <a href="${userType === 'donor' ? 'donor-dashboard.html' : userType === 'ngo' ? 'ngo-dashboard.html' : 'admin-panel.html'}">
                    <i class="fas fa-dashboard"></i> Dashboard
                </a>
                ${userType === 'donor' ? '<a href="donate.html"><i class="fas fa-hand-holding-heart"></i> Donate Food</a>' : ''}
                ${userType === 'ngo' ? '<a href="find-food.html"><i class="fas fa-search"></i> Find Food</a>' : ''}
                ${userType === 'admin' ? '<a href="database-dashboard.html"><i class="fas fa-database"></i> Database</a>' : ''}
                <a href="#" onclick="handleLogout(event)"><i class="fas fa-sign-out-alt"></i> Logout</a>
            `;
            dropdown.style.cssText = `
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                min-width: 200px;
                display: none;
                z-index: 1000;
                margin-top: 10px;
            `;
            dropdown.querySelectorAll('a').forEach(link => {
                link.style.cssText = `
                    display: block;
                    padding: 12px 20px;
                    color: #333;
                    text-decoration: none;
                    transition: background 0.3s;
                    border-bottom: 1px solid #eee;
                `;
                link.onmouseover = () => link.style.background = '#f5f5f5';
                link.onmouseout = () => link.style.background = 'white';
            });
            loginBtn.parentNode.style.position = 'relative';
            loginBtn.parentNode.appendChild(dropdown);
        }

        // Toggle dropdown on click
        loginBtn.onclick = (e) => {
            e.preventDefault();
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        };

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!loginBtn.contains(e.target) && dropdown) {
                dropdown.style.display = 'none';
            }
        });

    } else {
        // User is not logged in - show login button
        loginBtn.innerHTML = 'Login / Sign Up';
        loginBtn.onclick = null;
        loginBtn.href = 'login.html';
        
        // Remove dropdown if exists
        const dropdown = loginBtn.nextElementSibling;
        if (dropdown && dropdown.classList.contains('user-dropdown')) {
            dropdown.remove();
        }
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