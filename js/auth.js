// js/auth.js

const DEFAULT_USERS = [
  { username: 'bob', email: 'bob@mail.com', password: 'bobpass' }
];

function seedDefaultUsers() {
  const stored = localStorage.getItem('dw_users');
  if (!stored) {
    localStorage.setItem('dw_users', JSON.stringify(DEFAULT_USERS));
  }
}

function getUsers() {
  seedDefaultUsers();
  const raw = localStorage.getItem('dw_users');
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users) {
  localStorage.setItem('dw_users', JSON.stringify(users));
}

function login(usernameOrEmail, password) {
  const users = getUsers();

  const user = users.find(function (u) {
    return (
      (u.username === usernameOrEmail || u.email === usernameOrEmail) &&
      u.password === password
    );
  });

  if (user) {
    localStorage.setItem(
      'loggedInUser',
      JSON.stringify({
        username: user.username,
        email: user.email
      })
    );

    return { success: true, message: 'Login successful.' };
  }

  return { success: false, message: 'Invalid username/email or password.' };
}

function signup(username, email, password) {
  const users = getUsers();

  if (!username || !email || !password) {
    return { success: false, message: 'All fields are required.' };
  }

  if (password.length < 4) {
    return { success: false, message: 'Password must be at least 4 characters.' };
  }

  const usernameTaken = users.some(function (u) {
    return u.username.toLowerCase() === username.toLowerCase();
  });

  if (usernameTaken) {
    return { success: false, message: 'That username is already taken.' };
  }

  const emailTaken = users.some(function (u) {
    return u.email.toLowerCase() === email.toLowerCase();
  });

  if (emailTaken) {
    return { success: false, message: 'That email is already registered.' };
  }

  const newUser = {
    username: username,
    email: email,
    password: password
  };

  users.push(newUser);
  saveUsers(users);

  localStorage.setItem(
    'loggedInUser',
    JSON.stringify({
      username: newUser.username,
      email: newUser.email
    })
  );

  return { success: true, message: 'Account created successfully.' };
}

function logout() {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'index.html';
}

function getLoggedInUser() {
  const data = localStorage.getItem('loggedInUser');
  return data ? JSON.parse(data) : null;
}

function requireLogin() {
  if (!getLoggedInUser()) {
    window.location.href = 'login.html';
  }
}

function updateNavbar() {
  const user = getLoggedInUser();
  const loginLink = document.getElementById('loginLink');
  const dashboardLink = document.getElementById('dashboardLink');

  if (!loginLink) return;

  if (user) {
    loginLink.textContent = '👤 Logout (' + user.username + ')';
    loginLink.href = '#';
    loginLink.onclick = function (e) {
      e.preventDefault();
      logout();
    };

    if (dashboardLink) {
      dashboardLink.classList.remove('d-none');
    }
  } else {
    loginLink.textContent = '🔐 Login / Sign Up';
    loginLink.href = 'login.html';
    loginLink.onclick = null;

    if (dashboardLink) {
      dashboardLink.classList.add('d-none');
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  seedDefaultUsers();
  updateNavbar();
});