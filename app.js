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
    e.preventDefault();
    navItems.forEach(nav => nav.classList.remove('active'));
    this.classList.add('active');
  });
});

// 3. LOGIN MODAL LOGIC (Open / Close)
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

// ==========================================
// 4. FIREBASE EMAIL & FIRESTORE DATABASE LOGIC
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyDHo4a317WqzvSFB31X9RdbBksUNb81fZM",
  authDomain: "padhaipilot-1dcae.firebaseapp.com",
  projectId: "padhaipilot-1dcae",
  storageBucket: "padhaipilot-1dcae.firebasestorage.app",
  messagingSenderId: "752062230479",
  appId: "1:752062230479:web:59680b96008a3aa052acba",
  measurementId: "G-7MTYEEHHMT"
};

// Firebase aur Database ko Start karna
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// Button aur Inputs ko pakadna
const registerBtn = document.getElementById('registerBtn');
const regName = document.getElementById('regName');
const regPhone = document.getElementById('regPhone');
const regEmail = document.getElementById('regEmail');
const regPass = document.getElementById('regPass');

if(registerBtn) {
    registerBtn.addEventListener('click', () => {
        const nameVal = regName.value.trim();
        const phoneVal = regPhone.value.trim();
        const emailVal = regEmail.value.trim();
        const passVal = regPass.value.trim();

        // Check 1: Koi dabba khali toh nahi?
        if(!nameVal || !phoneVal || !emailVal || !passVal) {
            alert("Bhai, saari details bharna zaroori hai!");
            return;
        }

        // Check 2: Password lamba hona chahiye
        if(passVal.length < 6) {
            alert("Password kam se kam 6 akshar ka hona chahiye!");
            return;
        }

        registerBtn.innerText = "Processing...";

        // Step 1: Naya Account Create Karne ki Koshish
        auth.createUserWithEmailAndPassword(emailVal, passVal)
        .then((userCredential) => {
            const userId = userCredential.user.uid;
            
            // Step 2: Name aur Phone ko naye Database (Firestore) mein save karna
            db.collection("users").doc(userId).set({
                name: nameVal,
                phone: phoneVal,
                email: emailVal,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                alert("Registration Successful! Swagat hai Padhai Pilot mein.");
                loginModal.classList.remove('active');
                registerBtn.innerText = "Register / Login";
                // Login hone ke baad button ka text change kar do
                if(loginBtn) loginBtn.innerHTML = '<i class="fa-solid fa-user-check"></i> My Profile';
            });
        })
        .catch((error) => {
            // Agar Email pehle se register hai, toh seedha Login kara do
            if(error.code === 'auth/email-already-in-use') {
                auth.signInWithEmailAndPassword(emailVal, passVal)
                .then(() => {
                    alert("Welcome Back! Login Successful.");
                    loginModal.classList.remove('active');
                    registerBtn.innerText = "Register / Login";
                    if(loginBtn) loginBtn.innerHTML = '<i class="fa-solid fa-user-check"></i> My Profile';
                })
                .catch((loginError) => {
                    alert("Galat Password! Kripya sahi password daalein.");
                    registerBtn.innerText = "Register / Login";
                });
            } else {
                alert("Error: " + error.message);
                registerBtn.innerText = "Register / Login";
            }
        });
    });
}
