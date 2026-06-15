// ==========================================
// MASTER APP.JS - Padhai Pilot
// ==========================================

// 1. DARK MODE LOGIC
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const body = document.body;
const icon = darkModeToggle ? darkModeToggle.querySelector('i') : null;

if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-theme');
  if(icon) icon.classList.replace('fa-moon', 'fa-sun');
}

if(darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-theme');
      if (body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        if(icon) icon.classList.replace('fa-moon', 'fa-sun');
      } else {
        localStorage.setItem('theme', 'light');
        if(icon) icon.classList.replace('fa-sun', 'fa-moon');
      }
    });
}

// 2. MOBILE BOTTOM NAVIGATION LOGIC
const navItems = document.querySelectorAll('.bottom-nav .nav-item:not(.center-btn)');
navItems.forEach(item => {
  item.addEventListener('click', function(e) {
    navItems.forEach(nav => nav.classList.remove('active'));
    this.classList.add('active');
  });
});

// 3. LOGIN MODAL LOGIC
const loginBtn = document.querySelector('.login-btn');
const loginModal = document.getElementById('loginModal');
const closeModal = document.getElementById('closeModal');

if (loginBtn && loginModal && closeModal) {
    loginBtn.addEventListener('click', () => loginModal.classList.add('active'));
    closeModal.addEventListener('click', () => loginModal.classList.remove('active'));
    window.addEventListener('click', (e) => {
      if (e.target === loginModal) loginModal.classList.remove('active');
    });
}

// 4. FIREBASE OTP LOGIC
const firebaseConfig = {
  apiKey: "AIzaSyDHo4a317WqzvSFB31X9RdbBksUNb81fZM",
  authDomain: "padhaipilot-1dcae.firebaseapp.com",
  projectId: "padhaipilot-1dcae",
  storageBucket: "padhaipilot-1dcae.firebasestorage.app",
  messagingSenderId: "752062230479",
  appId: "1:752062230479:web:59680b96008a3aa052acba",
  measurementId: "G-7MTYEEHHMT"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

// Recaptcha setup
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
  'size': 'invisible'
});

const sendOtpBtn = document.getElementById('sendOtpBtn');
const verifyOtpBtn = document.getElementById('verifyOtpBtn');
const phoneInput = document.getElementById('phoneNumber');
const otpInput = document.getElementById('otpCode');

if(sendOtpBtn) {
    sendOtpBtn.addEventListener('click', () => {
        const phoneNumber = "+91" + phoneInput.value;
        if(phoneInput.value.length !== 10) { alert("Sahi Number Daalo!"); return; }
        
        sendOtpBtn.innerText = "Sending...";
        auth.signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
        .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            document.getElementById('phone-auth-container').style.display = "none";
            document.getElementById('otp-auth-container').style.display = "block";
            alert("OTP Sent!");
        }).catch((error) => {
            alert("Error: " + error.message);
            sendOtpBtn.innerText = "Get OTP";
        });
    });
}

if(verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', () => {
        window.confirmationResult.confirm(otpInput.value).then((result) => {
            alert("Login Success!");
            location.reload();
        }).catch((error) => {
            alert("Galat OTP!");
        });
    });
}
