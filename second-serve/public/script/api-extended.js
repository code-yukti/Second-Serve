/**
 * Extended API Functions for FeedLink
 * Adds additional API methods to the existing APIUtils
 */

// Ensure APIUtils exists (defined in api-utils.js)
if (typeof APIUtils === 'undefined') {
    console.error('APIUtils not defined. Make sure api-utils.js is loaded first.');
}

// Add extended methods to APIUtils
Object.assign(APIUtils, {
    /**
     * Fetch featured food donations
     */
    async getFeaturedDonations() {
        try {
            const result = await this.get('/food/featured', { showError: false });
            return result;
        } catch (error) {
            console.error('Error fetching featured donations:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Fetch nearby donations by coordinates
     */
    async getNearbyDonations(latitude, longitude, radius = 10) {
        try {
            return await this.get(`/food/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`, { showError: false });
        } catch (error) {
            console.error('Error fetching nearby donations:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Fetch dashboard statistics
     */
    async getDashboardStatistics() {
        try {
            const result = await this.get('/food/statistics/dashboard', { showError: false });
            return result;
        } catch (error) {
            console.error('Error fetching statistics:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Request food pickup
     */
    async requestPickup(donationId) {
        try {
            return await this.post(`/food/${donationId}/request-pickup`, {});
        } catch (error) {
            console.error('Error requesting pickup:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Create food donation
     */
    async createDonation(donationData) {
        try {
            return await this.post('/food/donate', donationData);
        } catch (error) {
            console.error('Error creating donation:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Get NGOs nearby
     */
    async getNearbyNGOs(latitude, longitude, radius = 10) {
        try {
            return await this.get(`/ngos/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`, { showError: false });
        } catch (error) {
            console.error('Error fetching nearby NGOs:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Get nearby Donors based on coordinates
     */
    async getNearbyDonors(data) {
        try {
            return await this.post('/locations/nearby-donors', data);
        } catch (error) {
            console.error('Error fetching nearby donors:', error);
            return { success: false, error: error.message };
        }
    },
});
