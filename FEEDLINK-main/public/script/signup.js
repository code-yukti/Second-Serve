document.addEventListener('DOMContentLoaded', function() {
    // Password Visibility Toggle
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordToggle = document.getElementById('passwordToggle');
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const cityInput = document.getElementById('city');
    const phoneInput = document.getElementById('phone');
    const userTypeSelect = document.getElementById('userType');
    const donorTypeField = document.getElementById('donorTypeField');
    const donorTypeSelect = document.getElementById('donorType');
    const signupForm = document.getElementById('signupForm');
    const submitBtn = document.querySelector('.signup-submit');
    const useLocationBtn = document.getElementById('useLocationBtn');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    const locationStatus = document.getElementById('locationStatus');

    function setupPasswordToggle(input, button) {
        if (!input || !button) return;
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            // Toggle icon
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    setupPasswordToggle(passwordInput, passwordToggle);
    setupPasswordToggle(confirmPasswordInput, confirmPasswordToggle);

    // Allow passwords with proper length validation
    // Removed character limit - will validate minimum length on submission

    // Real-time password match validation
    function validatePasswordMatch() {
        // Remove any existing error/success messages first
        const existingError = confirmPasswordInput.parentElement.querySelector('.error-message');
        const existingSuccess = confirmPasswordInput.parentElement.querySelector('.success-message');
        if (existingError) existingError.remove();
        if (existingSuccess) existingSuccess.remove();

        if (passwordInput.value && confirmPasswordInput.value) {
            if (passwordInput.value !== confirmPasswordInput.value) {
                confirmPasswordInput.style.borderColor = '#f44336'; // Red border
                confirmPasswordInput.style.boxShadow = '0 0 5px rgba(244, 67, 54, 0.3)';
                
                // Show only one error message
                const errorMsg = document.createElement('small');
                errorMsg.className = 'error-message';
                errorMsg.style.cssText = 'color: #f44336; display: block; margin-top: 5px; font-size: 0.9rem;';
                errorMsg.textContent = '✗ Passwords do not match';
                confirmPasswordInput.parentElement.appendChild(errorMsg);
            } else {
                confirmPasswordInput.style.borderColor = '#4caf50'; // Green border
                confirmPasswordInput.style.boxShadow = '0 0 5px rgba(76, 175, 80, 0.3)';
                
                // Show only one success message
                const successMsg = document.createElement('small');
                successMsg.className = 'success-message';
                successMsg.style.cssText = 'color: #4caf50; display: block; margin-top: 5px; font-size: 0.9rem;';
                successMsg.textContent = '✓ Passwords match';
                confirmPasswordInput.parentElement.appendChild(successMsg);
            }
        } else {
            confirmPasswordInput.style.borderColor = '';
            confirmPasswordInput.style.boxShadow = '';
        }
    }

    // Listen to password input changes
    if (passwordInput) {
        passwordInput.addEventListener('input', validatePasswordMatch);
    }

    // Listen to confirm password input changes
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    }
    if (userTypeSelect && donorTypeField && donorTypeSelect) {
        const toggleDonorField = function() {
            if (userTypeSelect.value === 'donor') {
                donorTypeField.classList.add('show');
                donorTypeField.style.display = 'block';
                donorTypeSelect.required = true;
            } else {
                donorTypeField.classList.remove('show');
                donorTypeField.style.display = 'none';
                donorTypeSelect.required = false;
                donorTypeSelect.value = '';
            }
        };

        userTypeSelect.addEventListener('change', toggleDonorField);
        toggleDonorField(); // Initialize on page load
    }

    // Handle "Use my current location" button
    async function handleUseLocation() {
        if (!useLocationBtn) return;
        if (!navigator.geolocation) {
            APIUtils.showErrorMessage('Geolocation is not supported by your browser.');
            return;
        }

        useLocationBtn.disabled = true;
        const icon = useLocationBtn.querySelector('i');
        const originalIconClass = icon ? icon.className : '';
        if (icon) icon.className = 'fas fa-spinner fa-spin';
        if (locationStatus) locationStatus.textContent = 'Locating...';

        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            if (latitudeInput) latitudeInput.value = lat;
            if (longitudeInput) longitudeInput.value = lon;

            // Try reverse geocoding via Nominatim
            try {
                const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
                const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
                if (resp.ok) {
                    const data = await resp.json();
                    const addr = data.address || {};
                    const place = addr.city || addr.town || addr.village || addr.county || addr.state || data.display_name || '';
                    if (cityInput) cityInput.value = place;
                    if (locationStatus) locationStatus.textContent = 'Location detected';
                } else {
                    if (locationStatus) locationStatus.textContent = '';
                    APIUtils.showErrorMessage('Unable to determine address from your location.');
                }
            } catch (err) {
                console.error('Reverse geocode error', err);
                APIUtils.showErrorMessage('Failed to fetch location details.');
            } finally {
                if (icon) icon.className = originalIconClass;
                useLocationBtn.disabled = false;
            }

        }, (err) => {
            console.error('Geolocation error', err);
            APIUtils.showErrorMessage('Unable to get your location. Please allow location access and try again.');
            if (icon) icon.className = originalIconClass;
            useLocationBtn.disabled = false;
            if (locationStatus) locationStatus.textContent = '';
        }, { timeout: 10000 });
    }

    if (useLocationBtn) {
        useLocationBtn.addEventListener('click', handleUseLocation);
    }

    // Handle form submission
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Collect form data
            const userData = {
                userType: userTypeSelect.value,
                donorType: donorTypeSelect.value || null,
                fullName: fullNameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value,
                confirmPassword: confirmPasswordInput.value,
                city: cityInput.value.trim(),
                phone: phoneInput.value.trim() || null,
            };

            // Validate all fields
            if (!userData.userType) {
                APIUtils.showErrorMessage('Please select your role');
                return;
            }

            if (userData.userType === 'donor' && !userData.donorType) {
                APIUtils.showErrorMessage('Please select your donor type');
                return;
            }

            if (!userData.fullName) {
                APIUtils.showErrorMessage('Please enter your full name');
                return;
            }

            if (!userData.email || !validateEmail(userData.email)) {
                APIUtils.showErrorMessage('Please enter a valid email address');
                return;
            }

            if (!userData.password) {
                APIUtils.showErrorMessage('Please enter a password');
                return;
            }

            if (userData.password.length < 8) {
                APIUtils.showErrorMessage('Password must be at least 8 characters long');
                return;
            }

            if (userData.password !== userData.confirmPassword) {
                APIUtils.showErrorMessage('Passwords do not match!');
                confirmPasswordInput.focus();
                return;
            }

            if (!userData.city) {
                APIUtils.showErrorMessage('Please enter your city');
                return;
            }

            // Show loading state
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            submitBtn.disabled = true;

            try {
                // Remove confirmPassword before sending to backend
                const sendData = { ...userData };
                delete sendData.confirmPassword;

                // Send signup request directly
                const response = await fetch('http://localhost:5000/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(sendData)
                });

                const result = await response.json();

                if (response.ok && result.token) {
                    // Store authentication data
                    localStorage.setItem('authToken', result.token);
                    localStorage.setItem('userType', userData.userType);
                    localStorage.setItem('userEmail', userData.email);
                    localStorage.setItem('userName', userData.fullName);
                    
                    console.log('✅ Signup successful, token stored');
                    APIUtils.showSuccessMessage('Account created successfully! Redirecting...');
                    
                    // Redirect to homepage (immediate)
                    window.location.href = 'index.html';
                } else {
                    APIUtils.showErrorMessage(result.message || 'Failed to create account. Please try again.');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                console.error('Signup error:', error);
                APIUtils.showErrorMessage('An error occurred during signup. Please try again.');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

/**
 * Validate email format
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}