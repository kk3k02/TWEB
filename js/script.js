// Initialize demo user
if (!localStorage.getItem('conferenceUsers')) {
  const demoUser = {
    fullName: 'Demo User',
    email: 'demo@example.com',
    password: 'demo123',
    affiliation: 'Demo University',
    country: 'USA'
  };
  // Store the initial demo user array in localStorage
  localStorage.setItem('conferenceUsers', JSON.stringify([demoUser]));
}

// Check if user is logged in on page load
window.onload = function () {
  const loggedInUser = localStorage.getItem('loggedInUser');
  if (loggedInUser) {
    const user = JSON.parse(loggedInUser);
    // Update the header UI to show user info and Logout button
    updateAuthUI(true, user.name);
  }
};

// ====================================================================
// SECTION NAVIGATION & MOBILE MENU
// ====================================================================

// Function to switch visible sections (used by navigation)
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  // Show the target section
  document.getElementById(sectionId).classList.add('active');

  // Update navigation button active state (Note: This is partially handled by DOMContentLoaded logic now)
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  // Check if the function was triggered by a navigation element
  if (typeof event !== 'undefined' && event.target) event.target.classList.add('active');

  // Close mobile menu after navigation
  document.getElementById('mainNav').classList.remove('active');
  // Scroll to the top of the page
  window.scrollTo(0, 0);
}

// Toggles the mobile navigation visibility
function toggleMobileMenu() {
  document.getElementById('mainNav').classList.toggle('active');
}

// ====================================================================
// TOAST NOTIFICATION
// ====================================================================

// Displays a temporary toast notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  // Apply 'show' and the specific type class (success/error)
  toast.className = 'toast show ' + type;
  // Hide the toast after 3 seconds
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ====================================================================
// CONTACT FORM
// ====================================================================

// Toggles the visibility of the "other topic" input field
function toggleOtherTopic() {
  const reason = document.getElementById('contactReason').value;
  const otherGroup = document.getElementById('otherTopicGroup');
  const otherInput = document.getElementById('otherTopic');
  
  if (reason === 'other') {
    otherGroup.style.display = 'block';
    otherInput.required = true;
  } else {
    otherGroup.style.display = 'none';
    otherInput.required = false;
  }
}

// Handles the contact form submission
function handleContactSubmit(event) {
  event.preventDefault();
  const reason = document.getElementById('contactReason').value;
  const otherTopic = document.getElementById('otherTopic').value;
  
  // Validation for "other" reason
  if (reason === 'other' && !otherTopic) {
    showToast('Please specify the topic for your question', 'error');
    return;
  }
  
  showToast('Your message has been submitted successfully! We will contact you soon.', 'success');
  // Reset form and hide conditional input
  document.getElementById('contactForm').reset();
  document.getElementById('otherTopicGroup').style.display = 'none';
}

// ====================================================================
// SLIDESHOW
// ====================================================================

let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');

// Shows a specific slide by index
function showSlide(n) {
  // Ensure we have slides before proceeding
  if (slides.length === 0) return;
  
  // Remove 'active' class from all slides and indicators
  slides.forEach(s => s.classList.remove('active'));
  indicators.forEach(i => i.classList.remove('active'));
  
  // Calculate new slide index (wraps around using modulo)
  currentSlide = (n + slides.length) % slides.length;
  
  // Set the new slide and indicator as active
  slides[currentSlide].classList.add('active');
  indicators[currentSlide].classList.add('active');
}

// Changes slide by direction (1 for next, -1 for previous)
function changeSlide(direction) { 
  showSlide(currentSlide + direction); 
}

// Sets the slide based on indicator click
function setSlide(n) { 
  showSlide(n); 
}

// Auto-advance slideshow every 5 seconds
setInterval(() => changeSlide(1), 5000);

// ====================================================================
// AUTHENTICATION (Login, Registration, Logout)
// ====================================================================

// Switches between the Login and Register tabs on the membership page
function switchAuthTab(tab) {
  const tabs = document.querySelectorAll('.auth-tab');
  const contents = document.querySelectorAll('.form-tab-content');
  
  tabs.forEach(t => t.classList.remove('active'));
  contents.forEach(c => c.classList.remove('active'));
  
  if (tab === 'login') {
    tabs[0].classList.add('active');
    document.getElementById('loginForm').classList.add('active');
  } else {
    tabs[1].classList.add('active');
    document.getElementById('registerForm').classList.add('active');
  }
}

// Handles user login submission
function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  // Retrieve user data from localStorage
  const users = JSON.parse(localStorage.getItem('conferenceUsers') || '[]');
  
  // Find matching user
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Store logged-in user session data
    localStorage.setItem('loggedInUser', JSON.stringify({ email: user.email, name: user.fullName }));
    updateAuthUI(true, user.fullName);
    showToast('Welcome back, ' + user.fullName + '!', 'success');
    // Redirect to the main conference section
    showSection('conference');
  } else {
    showToast('Invalid email or password', 'error');
  }
}

// Handles new user registration submission
function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const affiliation = document.getElementById('registerAffiliation').value;
  const country = document.getElementById('registerCountry').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirmPassword').value;

  if (password !== confirmPassword) {
    showToast('Passwords do not match', 'error'); return;
  }
  
  // Check if email already exists
  const users = JSON.parse(localStorage.getItem('conferenceUsers') || '[]');
  if (users.find(u => u.email === email)) {
    showToast('An account with this email already exists', 'error'); return;
  }
  
  // Add new user to the array and update localStorage
  users.push({ fullName: name, email, password, affiliation, country });
  localStorage.setItem('conferenceUsers', JSON.stringify(users));
  
  showToast('Registration successful! You can now login.', 'success');
  // Switch to login tab and reset form
  switchAuthTab('login');
  document.getElementById('registerForm').querySelector('form').reset();
}

// Handles Login/Logout button click (state change)
function handleAuth() {
  const loggedInUser = localStorage.getItem('loggedInUser');
  if (loggedInUser) {
    // If logged in, log out
    localStorage.removeItem('loggedInUser');
    updateAuthUI(false, '');
    showToast('You have been logged out', 'success');
    showSection('conference');
  } else {
    // If logged out, navigate to membership section
    showSection('membership');
  }
}

// Updates the visible elements in the header (Login/Logout/Welcome message)
function updateAuthUI(isLoggedIn, userName) {
  const userInfo = document.getElementById('userInfo');
  const authBtn = document.getElementById('authBtn');
  if (isLoggedIn) {
    userInfo.textContent = 'Welcome, ' + userName;
    userInfo.style.display = 'inline';
    authBtn.textContent = 'Logout';
  } else {
    userInfo.style.display = 'none';
    authBtn.textContent = 'Login';
  }
}

// ====================================================================
// ACTIVE NAVIGATION LINK LOGIC
// ====================================================================

document.addEventListener('DOMContentLoaded', function() {
  // Retrieve all navigation links
  const navLinks = document.querySelectorAll('#mainNav .nav-link');
  
  // Get the path of the current URL (e.g., "/html/program.html")
  const currentPath = window.location.pathname;

  navLinks.forEach(link => {
    // Ensure active classes and attributes are removed first
    link.classList.remove('active');
    link.removeAttribute('aria-current');

    // Get the target path from the link's href attribute
    const linkPath = link.getAttribute('href');

    /**
     * Check if the current URL ends with the link's path.
     * Handles relative paths (e.g., current path '/html/program.html' matches 'program.html').
     * Also handles the root path '/' matching 'index.html'.
     */
    const isRootIndex = currentPath === '/' && linkPath === 'index.html';
    const isMatchingPage = currentPath.endsWith(linkPath);

    if (isMatchingPage || isRootIndex) {
      // Set the matching link as active and update ARIA attribute
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
});