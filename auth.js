class AuthManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || {};
        this.initializeFormListeners();
    }

    // initializeFormListeners() {
    //     const signinForm = document.getElementById('signinForm');
    //     const signupForm = document.getElementById('signupForm');

    //     signinForm.addEventListener('submit', (e) => this.handleSignIn(e));
    //     signupForm.addEventListener('submit', (e) => this.handleSignUp(e));
    // }

    handleSignIn(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        // Check if user exists
        if (!this.users[email]) {
            showError('No account with this email is registered yet');
            return;
        }

        // Check if password matches
        if (this.users[email].password !== password) {
            showError('Invalid password');
            return;
        }

        if (remember) {
            localStorage.setItem('rememberedEmail', email);
            localStorage.setItem('rememberedPassword', password);
        }

        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({
            email: email,
            name: this.users[email].name,
            lastLogin: new Date().toISOString()
        }));

        window.location.href = document.referrer || 'course-catalog.html';
    }

    handleSignUp(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate password
        if (password.length < 8) {
            showError('Password must be at least 8 characters long');
            return;
        }

        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        if (this.users[email]) {
            showError('This email is already registered');
            return;
        }

        // Create new user
        this.users[email] = {
            name: name,
            password: password,
            createdAt: new Date().toISOString(),
            courses: [],
            progress: {}
        };

        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(this.users));
        
        // Auto login after signup
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({
            email: email,
            name: name,
            lastLogin: new Date().toISOString()
        }));

        // Show success message before redirecting
        alert('Account created successfully!');
        window.location.href = 'course-catalog.html';
    }

    checkPreviousSession() {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            document.getElementById('email').value = rememberedEmail;
            document.getElementById('password').value = localStorage.getItem('rememberedPassword') || '';
            document.getElementById('remember').checked = true;
        }
    }

    logout() {
        const remember = document.getElementById('remember')?.checked;
        if (!remember) {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedPassword');
        }
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    isLoggedIn() {
        return localStorage.getItem('userLoggedIn') === 'true';
    }
} 