

// Import the functions you need from the SDKs you need
// Use Firebase JS SDK as ES modules from the official CDN so the browser can resolve them
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjEts7YggVOCsmtdMgdwMw_u10K_P_muU",
  authDomain: "techville-433cd.firebaseapp.com",
  projectId: "techville-433cd",
  storageBucket: "techville-433cd.firebasestorage.app",
  messagingSenderId: "394088856344",
  appId: "1:394088856344:web:cebcd1daeea9ad0a05bc6d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// Get all elements. Some might be null if not present on the current page (e.g., username on login page).
const form = document.getElementById('form');
const usernameInput = document.getElementById('username'); // This will be null on login.html
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const password2Input = document.getElementById('password2'); // This will be null on login.html

// Helper functions (setError, setSuccess, isValidEmail) remain the same
const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
};

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

// Determine if this is a login form (based on presence of username/password2 inputs)
const isLoginForm = () => usernameInput === null && password2Input === null;

// Checks if all *visible* inputs have passed client-side validation
const isFormFullyValidated = () => {
    const inputControls = form.querySelectorAll('.input-control');
    let allValid = true;
    inputControls.forEach(control => {
        // Only check visible inputs for their status
        const inputElement = control.querySelector('input');
        if (inputElement && inputElement.offsetParent !== null) { // Check if input is rendered/visible
            if (control.classList.contains('error')) {
                allValid = false;
            }
            if (!control.classList.contains('success') && !control.classList.contains('error')) {
                // If it's visible but has no error/success, it hasn't been validated
                allValid = false;
            }
        }
    });
    return allValid;
};

// Modified validateInputs to work for both form types
const validateInputs = () => {
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    // Reset all errors and successes before re-validating
    [usernameInput, emailInput, passwordInput, password2Input].forEach(input => {
        if (input) setSuccess(input); // Only call setSuccess if input element exists
    });

    let allClientSideValid = true;

    // Email validation (common to both)
    if (emailValue === '') {
        setError(emailInput, 'Please provide your Email');
        allClientSideValid = false;
    } else if (!isValidEmail(emailValue)) {
        setError(emailInput, 'Provide a valid email address');
        allClientSideValid = false;
    } else {
        setSuccess(emailInput);
    }

    // Password validation (common to both, but length check might differ for login vs. signup)
    if (passwordValue === '') {
        setError(passwordInput, 'Please provide your Password');
        allClientSideValid = false;
    } else {
        setSuccess(passwordInput);
    }

    // Specific validation for Registration form
    if (!isLoginForm()) {
        const usernameValue = usernameInput.value.trim();
        const password2Value = password2Input.value.trim();

        if (usernameValue === '') {
            setError(usernameInput, 'Please provide your Name');
            allClientSideValid = false;
        } else {
            setSuccess(usernameInput);
        }

        if (passwordValue.length < 8) {
            setError(passwordInput, 'Password must be at least 8 characters.');
            allClientSideValid = false;
        }

        if (password2Value === '') {
            setError(password2Input, 'Please confirm your password');
            allClientSideValid = false;
        } else if (password2Value !== passwordValue) {
            setError(password2Input, 'Passwords do not match');
            allClientSideValid = false;
        } else {
            setSuccess(password2Input);
        }
    }

    return allClientSideValid; // Return client-side validation status
};

// Form submission handler
form.addEventListener('submit', async e => {
    e.preventDefault();

    // Perform client-side validation first
    const clientSideValid = validateInputs();

    // If client-side validation passes, proceed with Firebase operation
    if (clientSideValid) {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (isLoginForm()) {
            // Handle Firebase Login (modular API)
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                console.log('User signed in:', user);
                alert(`Welcome back, ${user.email}!`);
                // Redirect user after successful login
                // window.location.href = 'dashboard.html'; // Example redirect
            } catch (error) {
                console.error('Firebase login error:', error.code, error.message);
                // Display specific login errors to the user
                switch (error.code) {
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                        setError(emailInput, 'Invalid email or password.');
                        setError(passwordInput, 'Invalid email or password.');
                        break;
                    case 'auth/invalid-email':
                        setError(emailInput, 'The email address format is invalid.');
                        break;
                    default:
                        alert(`Login failed: ${error.message}`);
                        break;
                }
            }
        } else {
            // Handle Firebase Registration (from your previous setup)
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                console.log('User registered:', user);
                alert(`Registration successful! Welcome, ${user.email}`);
                // Redirect user after successful registration, perhaps to login or a dashboard
                // window.location.href = 'login.html'; // Example redirect
            } catch (error) {
                console.error('Firebase registration error:', error.code, error.message);
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        setError(emailInput, 'This email address is already registered.');
                        break;
                    case 'auth/invalid-email':
                        setError(emailInput, 'The email address format is invalid.');
                        break;
                    case 'auth/weak-password':
                        setError(passwordInput, 'Password is too weak. Please use at least 6 characters.');
                        break;
                    case 'auth/operation-not-allowed':
                        alert('Email/Password registration is not enabled for this project.');
                        break;
                    default:
                        alert(`An unexpected error occurred: ${error.message}`);
                        break;
                }
            }
        }
    } else {
        console.log('Client-side validation failed. Firebase operation aborted.');
    }
});

// Optional: Add an onAuthStateChanged listener to track user login/logout status (modular API)
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is currently signed in:', user.email);
        // You could update UI elements here, like showing a logout button
    } else {
        console.log('No user is signed in.');
        // You could update UI elements here, like showing login/register buttons
    }
});
