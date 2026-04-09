let slideIndex = 0;

function showSlides() {
  const slides = document.querySelectorAll('.slide');
  slides.forEach(slide => slide.classList.remove('active'));
  
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  
  slides[slideIndex - 1].classList.add('active');
  setTimeout(showSlides, 4000);
}

document.addEventListener('DOMContentLoaded', showSlides);

function predict() {
  let country = document.getElementById("country").value.trim();
  let budget = parseInt(document.getElementById("budget").value);
  let resultsDiv = document.getElementById("results");

  resultsDiv.innerHTML = "";

  if (isNaN(budget) || country === "") {
    resultsDiv.innerHTML = "<p>Please enter both country and a valid budget.</p>";
    return;
  }

  let destinations = [
    { place: "Maasai Mara, Kenya", cost: 500 },
    { place: "Kampala, Uganda", cost: 400 },
    { place: "Zanzibar, Tanzania", cost: 600 },
    { place: "Cape Town, South Africa", cost: 900 },
    { place: "Dubai, UAE", cost: 1500 },
    { place: "Paris, France", cost: 2500 }
  ];

  let filtered = destinations.filter(d => d.cost <= budget);

  if (filtered.length === 0) {
    resultsDiv.innerHTML = "<p>No destinations found within your budget.</p>";
    return;
  }

  filtered.forEach(d => {
    let card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <strong>${d.place}</strong><br>
      Estimated Cost: $${d.cost}<br>
      Suitable from: ${country}<br>
      <a class="booking-link" href="${getBookingUrl(d.place)}" target="_blank" rel="noopener noreferrer">Book this destination</a>
    `;

    resultsDiv.appendChild(card);
  });
}

function getBookingUrl(place) {
  return `https://www.google.com/search?q=${encodeURIComponent(place + " travel booking")}`;
}

// Authentication functionality
let currentUser = null;

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', function() {
  showSlides();
  checkLoginStatus();
});

// Modal handling
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const aboutModal = document.getElementById('aboutModal');
const loginBtn = document.querySelector('.auth-icon[title="Login"]');
const registerBtn = document.querySelector('.auth-icon[title="Register"]');
const aboutBtn = document.getElementById('aboutBtn');
const closeBtns = document.querySelectorAll('.close');

// Open modals
loginBtn.onclick = function() {
  loginModal.style.display = 'block';
}

registerBtn.onclick = function() {
  registerModal.style.display = 'block';
}

aboutBtn.onclick = function() {
  aboutModal.style.display = 'block';
}

// Close modals
closeBtns.forEach(btn => {
  btn.onclick = function() {
    loginModal.style.display = 'none';
    registerModal.style.display = 'none';
    aboutModal.style.display = 'none';
  }
});

// Close modal when clicking outside
window.onclick = function(event) {
  if (event.target == loginModal) {
    loginModal.style.display = 'none';
  }
  if (event.target == registerModal) {
    registerModal.style.display = 'none';
  }
  if (event.target == aboutModal) {
    aboutModal.style.display = 'none';
  }
}

// Login form handling
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const messageDiv = document.getElementById('loginMessage');
  
  const users = JSON.parse(localStorage.getItem('tps_users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    currentUser = user;
    localStorage.setItem('tps_currentUser', JSON.stringify(user));
    messageDiv.style.color = 'green';
    messageDiv.textContent = 'Login successful!';
    updateAuthUI();
    setTimeout(() => {
      loginModal.style.display = 'none';
      messageDiv.textContent = '';
    }, 2000);
  } else {
    messageDiv.style.color = 'red';
    messageDiv.textContent = 'Invalid email or password';
  }
});

// Register form handling
document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirmPassword').value;
  const messageDiv = document.getElementById('registerMessage');
  
  if (password !== confirmPassword) {
    messageDiv.style.color = 'red';
    messageDiv.textContent = 'Passwords do not match';
    return;
  }
  
  const users = JSON.parse(localStorage.getItem('tps_users') || '[]');
  const existingUser = users.find(u => u.email === email);
  
  if (existingUser) {
    messageDiv.style.color = 'red';
    messageDiv.textContent = 'Email already registered';
    return;
  }
  
  const newUser = { name, email, password };
  users.push(newUser);
  localStorage.setItem('tps_users', JSON.stringify(users));
  
  messageDiv.style.color = 'green';
  messageDiv.textContent = 'Registration successful!';
  
  setTimeout(() => {
    registerModal.style.display = 'none';
    messageDiv.textContent = '';
    // Clear form
    document.getElementById('registerForm').reset();
  }, 2000);
});

// Check login status
function checkLoginStatus() {
  const user = localStorage.getItem('tps_currentUser');
  if (user) {
    currentUser = JSON.parse(user);
    updateAuthUI();
  }
}

// Google button handlers (login and register)
function handleGoogleLogin() {
  const authMessage = 'Google login is currently running in demo mode and will sign you in as a Google user.';
  const fakeGoogleUser = {
    name: 'Google User',
    email: 'user@gmail.com',
    provider: 'google'
  };

  currentUser = fakeGoogleUser;
  localStorage.setItem('tps_currentUser', JSON.stringify(fakeGoogleUser));
  updateAuthUI();

  document.getElementById('loginMessage').style.color = 'green';
  document.getElementById('loginMessage').textContent = authMessage;
  document.getElementById('registerMessage').style.color = 'green';
  document.getElementById('registerMessage').textContent = authMessage;

  setTimeout(() => {
    loginModal.style.display = 'none';
    registerModal.style.display = 'none';
    document.getElementById('loginMessage').textContent = '';
    document.getElementById('registerMessage').textContent = '';
  }, 1800);

  // Optional: if you have real OAuth credentials, uncomment below and set client_id/redirect_uri
  // const clientId = 'YOUR_GOOGLE_CLIENT_ID';
  // const redirectUri = 'YOUR_REDIRECT_URI';
  // const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token%20id_token&scope=openid%20email%20profile&prompt=select_account`;
  // window.open(oauthUrl, '_blank', 'width=500,height=600');
}

// Attach Google buttons after DOM ready
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.google-btn').forEach(button => {
    button.disabled = false;
    button.addEventListener('click', (e) => {
      e.preventDefault();
      handleGoogleLogin();
    });
  });
});

// Update authentication UI
function updateAuthUI() {
  const authIcons = document.querySelector('.auth-icons');
  
  if (currentUser) {
    authIcons.innerHTML = `
      <span class="user-info">Welcome, ${currentUser.name}!</span>
      <span class="auth-icon logout" title="Logout">🚪 Logout</span>
    `;
    
    // Add logout functionality
    document.querySelector('.logout').onclick = function() {
      currentUser = null;
      localStorage.removeItem('tps_currentUser');
      location.reload();
    };
  }
}
