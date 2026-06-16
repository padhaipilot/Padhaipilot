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

// ==========================================
// 3. FIREBASE CONFIGURATION & LOGIC
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

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// UI Elements Get Karna
const headerLoginBtn = document.getElementById('headerLoginBtn');
const loginModal = document.getElementById('loginModal');
const closeModal = document.getElementById('closeModal');
const profileModal = document.getElementById('profileModal');
const closeProfileModal = document.getElementById('closeProfileModal');

const registerBtn = document.getElementById('registerBtn');
const regName = document.getElementById('regName');
const regPhone = document.getElementById('regPhone');
const regEmail = document.getElementById('regEmail');
const regPass = document.getElementById('regPass');

const logoutBtn = document.getElementById('logoutBtn');
const forgotPassLink = document.getElementById('forgotPassLink');
const displayUserName = document.getElementById('displayUserName');
const displayUserEmail = document.getElementById('displayUserEmail');

// Modals Close Logic
if(closeModal) closeModal.addEventListener('click', () => loginModal.classList.remove('active'));
if(closeProfileModal) closeProfileModal.addEventListener('click', () => profileModal.classList.remove('active'));
window.addEventListener('click', (e) => {
    if (e.target === loginModal) loginModal.classList.remove('active');
    if (e.target === profileModal) profileModal.classList.remove('active');
});

// ==========================================
// AUTO-LOGIN CHECKER (Bahut Zaroori)
// ==========================================
auth.onAuthStateChanged((user) => {
    if (user) {
        // Agar user pehle se login hai
        if(headerLoginBtn) {
headerLoginBtn.innerHTML = '<i class="fa-solid fa-table-columns"></i> Dashboard';
headerLoginBtn.onclick = () => {
    window.location.href = "profile.html";
};
        }
        
        // Database se naam nikal kar Dashboard mein dikhana
        db.collection("users").doc(user.uid).get().then((doc) => {
            if (doc.exists) {
                displayUserName.innerText = "Hi, " + doc.data().name;
                displayUserEmail.innerText = doc.data().email;
            } else {
                displayUserName.innerText = "Student";
                displayUserEmail.innerText = user.email;
            }
        }).catch((error) => console.log("Data fetch error: ", error));

    } else {
        // Agar user login nahi hai
        if(headerLoginBtn) {
            headerLoginBtn.innerHTML = '<i class="fa-regular fa-user"></i> Login';
            headerLoginBtn.onclick = () => loginModal.classList.add('active'); // Login box khulega
        }
    }
});

// ==========================================
// REGISTER / LOGIN ACTION
// ==========================================
if(registerBtn) {
    registerBtn.addEventListener('click', () => {
        const nameVal = regName.value.trim();
        const phoneVal = regPhone.value.trim();
        const emailVal = regEmail.value.trim();
        const passVal = regPass.value.trim();

        if(!emailVal || !passVal) { alert("Email aur Password daalna zaroori hai!"); return; }
        
        registerBtn.innerText = "Processing...";

        // 1. Naya account banana ki koshish
        auth.createUserWithEmailAndPassword(emailVal, passVal)
        .then((userCredential) => {
            const userId = userCredential.user.uid;
            db.collection("users").doc(userId).set({
                name: nameVal || "Student",
                phone: phoneVal || "",
                email: emailVal,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                loginModal.classList.remove('active');
                registerBtn.innerText = "Register / Login";
                alert("Welcome to Padhai Pilot!");
            });
        })
        .catch((error) => {
            // 2. Agar account hai, toh Login karo
            if(error.code === 'auth/email-already-in-use') {
                auth.signInWithEmailAndPassword(emailVal, passVal)
                .then(() => {
                    loginModal.classList.remove('active');
                    registerBtn.innerText = "Register / Login";
                    alert("Welcome Back!");
                })
                .catch((loginError) => {
                    alert("Galat Password!");
                    registerBtn.innerText = "Register / Login";
                });
            } else {
                alert(error.message);
                registerBtn.innerText = "Register / Login";
            }
        });
    });
}

// ==========================================
// FORGOT PASSWORD ACTION
// ==========================================
if(forgotPassLink) {
    forgotPassLink.addEventListener('click', (e) => {
        e.preventDefault();
        const emailVal = regEmail.value.trim();
        
        if(!emailVal) {
            alert("Bhai, pehle Email ID wale box mein apna email daaliye, phir Forgot Password par click kijiye!");
            return;
        }

        auth.sendPasswordResetEmail(emailVal)
        .then(() => alert("Password reset link aapki Email par bhej diya gaya hai!"))
        .catch((error) => alert("Error: " + error.message));
    });
}

// ==========================================
// LOGOUT ACTION
// ==========================================
if(logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        auth.signOut().then(() => {
            profileModal.classList.remove('active');
            alert("Aap successfully Logout ho gaye hain.");
            location.reload();
        }).catch((error) => alert("Logout failed: " + error.message));
    });
}
