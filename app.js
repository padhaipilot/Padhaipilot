// ==================================
// 1. DARK MODE LOGIC
// ==================================
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const body = document.body;
const icon = darkModeToggle.querySelector('i');

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

// ==================================
// 2. MOBILE BOTTOM NAVIGATION LOGIC
// ==================================
const navItems = document.querySelectorAll('.bottom-nav .nav-item:not(.center-btn)');

navItems.forEach(item => {
  item.addEventListener('click', function(e) {
    e.preventDefault(); 
    navItems.forEach(nav => nav.classList.remove('active'));
    this.classList.add('active');
  });
});

// ==================================
// 3. LOGIN MODAL LOGIC
// ==================================
const loginBtn = document.querySelector('.login-btn');
const loginModal = document.getElementById('loginModal');
const closeModal = document.getElementById('closeModal');

// Agar button aur modal mil gaye hain, tabhi click event lagao
if (loginBtn && loginModal && closeModal) {
    
    // Login button dabane par kholo
    loginBtn.addEventListener('click', () => {
      loginModal.classList.add('active');
    });

    // X dabane par band karo
    closeModal.addEventListener('click', () => {
      loginModal.classList.remove('active');
    });

    // Bahar click karne par band karo
    window.addEventListener('click', (e) => {
      if (e.target === loginModal) {
        loginModal.classList.remove('active');
      }
    });
} else {
    console.log("Login modal HTML mein nahi mila. Kripya check karein ki HTML code sahi se paste hua hai.");
}


// ==================================
// 4. FIREBASE OTP LOGIN SYSTEM
// ==================================

// Aapka Firebase Config jo aapne diya tha
const firebaseConfig = {
  apiKey: "AIzaSyDHo4a317WqzvSFB31X9RdbBksUNb81fZM",
  authDomain: "padhaipilot-1dcae.firebaseapp.com",
  projectId: "padhaipilot-1dcae",
  storageBucket: "padhaipilot-1dcae.firebasestorage.app",
  messagingSenderId: "752062230479",
  appId: "1:752062230479:web:59680b96008a3aa052acba",
  measurementId: "G-7MTYEEHHMT"
};

// Firebase ko chalayein
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Variables banayein
let confirmationResult;
const sendOtpBtn = document.getElementById('sendOtpBtn');
const verifyOtpBtn = document.getElementById('verifyOtpBtn');
const phoneContainer = document.getElementById('phone-auth-container');
const otpContainer = document.getElementById('otp-auth-container');
const phoneInput = document.getElementById('phoneNumber');
const otpInput = document.getElementById('otpCode');

// ReCaptcha Setup (Spam rokne ke liye zaroori hai)
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
  'size': 'invisible'
});

// "Get OTP" Button click karne par
if(sendOtpBtn) {
  sendOtpBtn.addEventListener('click', () => {
    const number = phoneInput.value;
    
    // Check karein ki number 10 digit ka hai ya nahi
    if (number.length !== 10) {
      alert("Bhai, sahi 10-digit mobile number daalo!");
      return;
    }

    const phoneNumber = "+91" + number; // India ka code add kiya
    sendOtpBtn.innerText = "Sending OTP..."; // Button ka text change kiya

    // Firebase ko OTP bhejne ka command
    auth.signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
      .then((result) => {
        confirmationResult = result;
        phoneContainer.style.display = "none"; // Phone box chhupao
        otpContainer.style.display = "block";  // OTP box dikhao
        alert("OTP bhej diya gaya hai!");
      }).catch((error) => {
        console.error("OTP Error:", error);
        alert("OTP bhejne mein dikkat aayi. Console check karein.");
        sendOtpBtn.innerText = "Get OTP";
        window.recaptchaVerifier.render().then(function(widgetId) {
          grecaptcha.reset(widgetId);
        });
      });
  });
}

// "Verify & Login" Button click karne par
if(verifyOtpBtn) {
  verifyOtpBtn.addEventListener('click', () => {
    const code = otpInput.value;
    
    if (code.length !== 6) {
      alert("6-digit ka OTP daaliye!");
      return;
    }

    verifyOtpBtn.innerText = "Verifying...";

    // OTP Check karein
    confirmationResult.confirm(code).then((result) => {
      const user = result.user;
      alert("Login Successful! Swagat hai Padhai Pilot mein, " + user.phoneNumber);
      loginModal.classList.remove('active'); // Popup band karein
      
      // Login Button ka text change karke "My Profile" kar dein
      const loginBtnText = document.querySelector('.login-btn');
      if(loginBtnText) {
          loginBtnText.innerHTML = '<i class="fa-solid fa-user-check"></i> My Profile';
      }
      
    }).catch((error) => {
      alert("Galat OTP! Wapas try karein.");
      verifyOtpBtn.innerText = "Verify & Login";
    });
  });
}