// Check authentication
if (!localStorage.getItem('adminAuthenticated')) {
    window.location.href = 'admin-login.html';
}

// API Configuration
const API_BASE = 'http://localhost:5000/api';
let charts = {};
let allUsers = [];
let allDonations = [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadOverviewData();
    updateSessionInfo();
    setInterval(updateSessionInfo, 1000);
});

// Navigation
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active from all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName + '-section').classList.add('active');
    
    // Update active menu item
    if (event && event.target) {
        event.target.closest('.menu-item').classList.add('active');
    }
    
    // Update title
    const titles = {
        'overview': 'Dashboard Overview',
        'users': 'User Management',
        'donations': 'Donation Management',
        'analytics': 'Analytics & Insights',
        'database': 'Direct Database Access',
        'system': 'System Monitor'
    };
    document.getElementById('sectionTitle').textContent = titles[sectionName];
    
    // Load section data
    switch(sectionName) {
        case 'overview':
            loadOverviewData();
            break;
        case 'users':
            loadUsers();
            break;
        case 'donations':
            loadDonations();
            break;
        case 'analytics':
            loadAnalytics();
            break;
        case 'database':
            loadDatabaseInfo();
            break;
        case 'system':
            loadSystemInfo();
            break;
    }
}

// Load Overview Data
async function loadOverviewData() {
    try {
        const [usersRes, donationsRes] = await Promise.all([
            fetch(`${API_BASE}/admin/users`),
            fetch(`${API_BASE}/admin/donations`)
        ]);

        const users = await usersRes.json();
        const donations = await donationsRes.json();

        allUsers = users;
        allDonations = donations;

        // Update stats
        document.getElementById('totalUsers').textContent = users.length;
        document.getElementById('totalDonors').textContent = users.filter(u => u.role === 'donor').length;
        document.getElementById('totalNGOs').textContent = users.filter(u => u.role === 'ngo').length;
        document.getElementById('totalDonations').textContent = donations.length;

        // Create charts
        createUserGrowthChart(users);
        createDonationStatusChart(donations);
        
        // Show recent activity
        showRecentActivity(users, donations);

    } catch (error) {
        console.error('Error loading overview:', error);
        alert('Error loading data. Make sure the backend server is running on localhost:5000');
    }
}

// Create User Growth Chart
function createUserGrowthChart(users) {
    const ctx = document.getElementById('userGrowthChart');
    if (!ctx) return;

    // Group users by date
    const dateMap = {};
    users.forEach(user => {
        const date = new Date(user.created_at || Date.now()).toLocaleDateString();
        dateMap[date] = (dateMap[date] || 0) + 1;
    });

    const labels = Object.keys(dateMap).slice(-7);
    const data = labels.map(date => dateMap[date]);

    if (charts.userGrowth) charts.userGrowth.destroy();
    
    charts.userGrowth = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'New Users',
                data: data,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Create Donation Status Chart
function createDonationStatusChart(donations) {
    const ctx = document.getElementById('donationStatusChart');
    if (!ctx) return;

    const statusCount = {
        available: 0,
        claimed: 0,
        completed: 0,
        expired: 0,
        cancelled: 0
    };

    donations.forEach(d => {
        statusCount[d.status] = (statusCount[d.status] || 0) + 1;
    });

    if (charts.donationStatus) charts.donationStatus.destroy();

    charts.donationStatus = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Available', 'Claimed', 'Completed', 'Expired', 'Cancelled'],
            datasets: [{
                data: Object.values(statusCount),
                backgroundColor: [
                    '#43e97b',
                    '#ffc107',
                    '#4facfe',
                    '#dc3545',
                    '#6c757d'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

// Show Recent Activity
function showRecentActivity(users, donations) {
    const activityList = document.getElementById('recentActivityList');
    if (!activityList) return;

    const activities = [];

    // Add recent users
    users.slice(-5).forEach(user => {
        activities.push({
            text: `New ${user.role} registered: ${user.fullName} (${user.email})`,
            time: new Date(user.created_at || Date.now()),
            type: 'user'
        });
    });

    // Add recent donations
    donations.slice(-5).forEach(donation => {
        activities.push({
            text: `New donation: ${donation.foodName} - ${donation.quantity} ${donation.unit}`,
            time: new Date(donation.created_at || Date.now()),
            type: 'donation'
        });
    });

    // Sort by time
    activities.sort((a, b) => b.time - a.time);

    activityList.innerHTML = activities.slice(0, 10).map(activity => `
        <div class="activity-item">
            <div>${activity.text}</div>
            <div class="activity-time">${formatTime(activity.time)}</div>
        </div>
    `).join('');
}

// Load Users
async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE}/admin/users`);
        const users = await response.json();
        allUsers = users;

        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td><span class="status-badge status-${user.role}">${user.role.toUpperCase()}</span></td>
                <td>${user.city}</td>
                <td>${user.phone || 'N/A'}</td>
                <td>${formatDate(user.created_at)}</td>
                <td>
                    <button class="btn-action btn-view" onclick="viewUser(${user.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteUser(${user.id}, '${user.fullName}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // Add search functionality
        document.getElementById('userSearch').oninput = function(e) {
            const search = e.target.value.toLowerCase();
            const rows = tbody.querySelectorAll('tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(search) ? '' : 'none';
            });
        };

    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Load Donations
async function loadDonations() {
    try {
        const status = document.getElementById('statusFilter')?.value || '';
        const response = await fetch(`${API_BASE}/admin/donations`);
        let donations = await response.json();
        
        if (status) {
            donations = donations.filter(d => d.status === status);
        }
        allDonations = donations;

        const tbody = document.getElementById('donationsTableBody');
        tbody.innerHTML = donations.map(donation => `
            <tr>
                <td>${donation.id}</td>
                <td>${donation.foodName}</td>
                <td>${donation.donor_name || 'Unknown'}</td>
                <td>${donation.quantity} ${donation.unit}</td>
                <td>${donation.category || 'N/A'}</td>
                <td><span class="status-badge status-${donation.status}">${donation.status}</span></td>
                <td>${formatDate(donation.created_at)}</td>
                <td>
                    <button class="btn-action btn-view" onclick="viewDonation(${donation.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteDonation(${donation.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // Add search functionality
        document.getElementById('donationSearch').oninput = function(e) {
            const search = e.target.value.toLowerCase();
            const rows = tbody.querySelectorAll('tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(search) ? '' : 'none';
            });
        };

    } catch (error) {
        console.error('Error loading donations:', error);
    }
}

// Load Analytics
async function loadAnalytics() {
    try {
        const [usersRes, donationsRes] = await Promise.all([
            fetch(`${API_BASE}/admin/users`),
            fetch(`${API_BASE}/admin/donations`)
        ]);

        const users = await usersRes.json();
        const donations = await donationsRes.json();

        createCategoryChart(donations);
        createCityChart(users);
        createMonthlyTrendChart(donations);
        createRoleChart(users);

    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

// Create Category Chart
function createCategoryChart(donations) {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    const categories = {};
    donations.forEach(d => {
        categories[d.category] = (categories[d.category] || 0) + 1;
    });

    if (charts.category) charts.category.destroy();

    charts.category = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: [
                    '#667eea', '#764ba2', '#f093fb', '#4facfe',
                    '#43e97b', '#fa709a', '#ffc107'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

// Create City Chart
function createCityChart(users) {
    const ctx = document.getElementById('cityChart');
    if (!ctx) return;

    const cities = {};
    users.forEach(u => {
        cities[u.city] = (cities[u.city] || 0) + 1;
    });

    const topCities = Object.entries(cities)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    if (charts.city) charts.city.destroy();

    charts.city = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topCities.map(c => c[0]),
            datasets: [{
                label: 'Users',
                data: topCities.map(c => c[1]),
                backgroundColor: '#667eea'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Create Monthly Trend Chart
function createMonthlyTrendChart(donations) {
    const ctx = document.getElementById('monthlyTrendChart');
    if (!ctx) return;

    const months = {};
    donations.forEach(d => {
        const month = new Date(d.created_at || Date.now()).toLocaleDateString('en', { month: 'short', year: 'numeric' });
        months[month] = (months[month] || 0) + 1;
    });

    if (charts.monthly) charts.monthly.destroy();

    charts.monthly = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(months),
            datasets: [{
                label: 'Donations',
                data: Object.values(months),
                borderColor: '#43e97b',
                backgroundColor: 'rgba(67, 233, 123, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

// Create Role Chart
function createRoleChart(users) {
    const ctx = document.getElementById('roleChart');
    if (!ctx) return;

    const roles = {};
    users.forEach(u => {
        roles[u.role] = (roles[u.role] || 0) + 1;
    });

    if (charts.role) charts.role.destroy();

    charts.role = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(roles).map(r => r.toUpperCase()),
            datasets: [{
                data: Object.values(roles),
                backgroundColor: ['#4facfe', '#f093fb', '#764ba2']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

// Load Database Info
function loadDatabaseInfo() {
    document.getElementById('sqlQuery').value = 'SELECT * FROM users LIMIT 10;';
}

// Execute SQL Query
async function executeQuery() {
    const query = document.getElementById('sqlQuery').value.trim();
    
    if (!query.toLowerCase().startsWith('select')) {
        alert('Only SELECT queries are allowed for security reasons.');
        return;
    }

    alert('Direct SQL execution requires a special backend endpoint. Use the Quick Queries instead.');
}

// Quick Queries
async function quickQuery(type) {
    const resultsDiv = document.getElementById('queryResults');
    
    try {
        let data;
        switch(type) {
            case 'users':
                const usersRes = await fetch(`${API_BASE}/admin/users`);
                data = await usersRes.json();
                break;
            case 'donations':
                const donationsRes = await fetch(`${API_BASE}/admin/donations`);
                data = await donationsRes.json();
                break;
            case 'recent':
                const recentRes = await fetch(`${API_BASE}/admin/donations`);
                const allData = await recentRes.json();
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                data = allData.filter(d => new Date(d.created_at) > yesterday);
                break;
            case 'stats':
                const [u, d] = await Promise.all([
                    fetch(`${API_BASE}/admin/users`).then(r => r.json()),
                    fetch(`${API_BASE}/admin/donations`).then(r => r.json())
                ]);
                data = {
                    totalUsers: u.length,
                    totalDonations: d.length,
                    donors: u.filter(user => user.role === 'donor').length,
                    ngos: u.filter(user => user.role === 'ngo').length,
                    available: d.filter(don => don.status === 'available').length,
                    completed: d.filter(don => don.status === 'completed').length
                };
                break;
        }

        resultsDiv.innerHTML = `
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 15px;">
                <pre style="overflow: auto; max-height: 400px;">${JSON.stringify(data, null, 2)}</pre>
            </div>
        `;
    } catch (error) {
        resultsDiv.innerHTML = `<div style="color: red; padding: 15px;">Error: ${error.message}</div>`;
    }
}

// Load System Info
function loadSystemInfo() {
    document.getElementById('dbSize').textContent = 'N/A (requires backend)';
    document.getElementById('totalRecords').textContent = 'Loading...';
    
    // Get stats
    Promise.all([
        fetch(`${API_BASE}/admin/users`).then(r => r.json()),
        fetch(`${API_BASE}/admin/donations`).then(r => r.json())
    ])
    .then(([users, donations]) => {
        document.getElementById('totalRecords').textContent = (users.length + donations.length) || 'N/A';
    })
    .catch(() => {
        document.getElementById('totalRecords').textContent = 'N/A';
    });

    document.getElementById('lastBackup').textContent = localStorage.getItem('lastBackup') || 'Never';
}

// User Actions
function viewUser(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
        alert(`User Details:\n\nID: ${user.id}\nName: ${user.fullName}\nEmail: ${user.email}\nRole: ${user.role}\nCity: ${user.city}\nPhone: ${user.phone || 'N/A'}\nJoined: ${formatDate(user.created_at)}`);
    }
}

// DELETE USER
async function deleteUser(userId, userName) {
    if (!confirm(`Are you sure you want to delete user: ${userName}?\n\nThis action cannot be undone and will also delete all their donations.`)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
            alert('User deleted successfully!');
            loadUsers();
            loadOverviewData();
        } else {
            alert('Error: ' + (data.error || 'Could not delete user'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting user');
    }
}

// Donation Actions
function viewDonation(donationId) {
    const donation = allDonations.find(d => d.id === donationId);
    if (donation) {
        alert(`Donation Details:\n\nID: ${donation.id}\nFood: ${donation.foodName}\nQuantity: ${donation.quantity} ${donation.unit}\nCategory: ${donation.category || 'N/A'}\nStatus: ${donation.status}\nAddress: ${donation.address}, ${donation.city}\nCreated: ${formatDate(donation.created_at)}`);
    }
}

// DELETE DONATION
async function deleteDonation(donationId) {
    if (!confirm('Are you sure you want to delete this donation?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/admin/donations/${donationId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
            alert('Donation deleted successfully!');
            loadDonations();
            loadOverviewData();
        } else {
            alert('Error: ' + (data.error || 'Could not delete donation'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting donation');
    }
}

// DELETE ALL DONATIONS
async function deleteAllDonations() {
    if (!confirm('⚠️ WARNING! This will DELETE ALL DONATIONS!\n\nThis action cannot be undone. Are you absolutely sure?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/admin/donations`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
            alert('✅ All donations deleted successfully! (' + data.changes + ' records removed)');
            loadDonations();
            loadOverviewData();
        } else {
            alert('Error: ' + (data.error || 'Could not delete all donations'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting all donations');
    }
}

// System Actions
function backupDatabase() {
    if (confirm('Create a database backup? This will save the current state.')) {
        localStorage.setItem('lastBackup', new Date().toISOString());
        alert('Backup timestamp saved locally. Full backup requires backend implementation.');
    }
}

function clearAllSessions() {
    if (confirm('Clear all user sessions? Users will need to log in again.')) {
        alert('This would clear all user tokens from the database (requires backend endpoint).');
    }
}

function resetDatabase() {
    if (confirm('Reset database to initial test data? This will DELETE all current data!')) {
        alert('This would run the init-database.js script (requires backend endpoint).');
    }
}

// Export Data
function exportData() {
    const section = document.querySelector('.section.active').id.replace('-section', '');
    
    let data;
    if (section === 'overview') {
        data = { users: allUsers, donations: allDonations };
    } else if (section === 'users') {
        data = allUsers;
    } else if (section === 'donations') {
        data = allDonations;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedlink-${section}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Refresh Data
function refreshData() {
    const section = document.querySelector('.menu-item.active')?.getAttribute('href')?.substring(1);
    if (section) {
        showSection(section);
    }
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
}

function formatTime(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

function updateSessionInfo() {
    const loginTime = localStorage.getItem('adminLoginTime');
    if (loginTime) {
        document.getElementById('loginTime').textContent = new Date(loginTime).toLocaleString();
        
        const duration = Math.floor((Date.now() - new Date(loginTime)) / 1000);
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        document.getElementById('sessionDuration').textContent = `${hours}h ${minutes}m`;
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminLoginTime');
        window.location.href = 'admin-login.html';
    }
}

function filterUsers() {
    alert('Advanced filter options coming soon!');
}
