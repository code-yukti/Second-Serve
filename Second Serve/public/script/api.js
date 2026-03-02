/**
 * API Utility Module for Second Serve
 * Handles all API calls to the backend
 */

const APIUtils = {

    /**
     * Fetch featured food donations
     */
    async getFeaturedDonations() {
        return this.get('/food/featured');
    },

    /**
     * Fetch nearby donations by coordinates
     */
    async getNearbyDonations(latitude, longitude, radius = 10) {
        return this.get(`/food/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`);
    },

    /**
     * Fetch dashboard statistics
     */
    async getDashboardStatistics() {
        return this.get('/food/statistics/dashboard');
    },

    /**
     * Request food pickup
     */
    async requestPickup(donationId) {
        return this.post(`/food/${donationId}/request-pickup`, {});
    },

    /**
     * Login user
     */
    async login(email, password, userType) {
        return this.post('/auth/login', { email, password, userType });
    },

    /**
     * Sign up user
     */
    async signup(userData) {
        return this.post('/auth/signup', userData);
    },

    /**
     * Create food donation
     */
    async createDonation(donationData) {
        return this.post('/donations/create', donationData);
    },

    /**
     * Get NGOs nearby
     */
    async getNearbyNGOs(latitude, longitude, radius = 10) {
        return this.get(`/ngos/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`);
    },

    /**
     * Show error message to user
     */
    showErrorMessage(message) {
        // Create error alert
        const errorDiv = document.createElement('div');
        errorDiv.className = 'api-error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f44336;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 9999;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => errorDiv.remove(), 5000);
    },

    /**
     * Show success message to user
     */
    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'api-success-message';
        successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 9999;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(successDiv);
        
        setTimeout(() => successDiv.remove(), 5000);
    },

    /**
     * Show loading state
     */
    showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'api-loading';
        loadingDiv.id = 'api-loading-overlay';
        loadingDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 24px;"></i>
                <span>Loading...</span>
            </div>
        `;
        loadingDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 30px 50px;
            border-radius: 10px;
            z-index: 10000;
        `;
        document.body.appendChild(loadingDiv);
    },

    /**
     * Hide loading state
     */
    hideLoading() {
        const loadingDiv = document.getElementById('api-loading-overlay');
        if (loadingDiv) loadingDiv.remove();
    },

    /**
     * Get nearby NGOs based on coordinates
     */
    async getNearbyNGOs(data) {
        return this.post('/locations/nearby-ngos', data);
    },

    /**
     * Get nearby Donors based on coordinates
     */
    async getNearbyDonors(data) {
        return this.post('/locations/nearby-donors', data);
    },
};
