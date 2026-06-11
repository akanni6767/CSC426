/* ── Storage keys ── */
const USERS_KEY   = 'securelogin_users';
const SESSION_KEY = 'securelogin_session';

/* ── Helpers: user store ── */
function getUsers() {
  try { 
    // console.log(localStorage.getItem(USERS_KEY));
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; }
  catch { return {}; }
}

function initUsers() {
  const users = getUsers();
  if (!users['akeem']) {
    users['akeem'] = { password: '$akeem__', email: 'softdephjs@gmail.com', name: 'Admin User' };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}

/* ── DOM refs ── */
const form        = document.getElementById('login-form');
const usernameEl  = document.getElementById('username');
const passwordEl  = document.getElementById('password');
const submitBtn   = document.getElementById('submit-btn');
const btnLabel    = document.getElementById('btn-label');
const btnSpinner  = document.getElementById('btn-spinner');
const resetBtn    = document.getElementById('reset-btn');
const forgotBtn   = document.getElementById('forgot-btn');
const togglePwBtn = document.getElementById('toggle-pw');
const eyeShow     = document.getElementById('eye-show');
const eyeHide     = document.getElementById('eye-hide');
const loginView   = document.getElementById('login-view');
const successView = document.getElementById('success-view');
const logoutBtn   = document.getElementById('logout-btn');
const loggedUser  = document.getElementById('logged-user');
const userInitials= document.getElementById('user-initials');
const toast       = document.getElementById('toast');

let pwVisible  = false;
let failCount  = 0;

/* ── Toast ── */
function showToast(msg, type = 'error') {
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
}
function hideToast() {
  toast.className = 'toast';
}

/* ── Field helpers ── */
function setFieldError(id, errId, msg) {
  const el  = document.getElementById(id);
  const err = document.getElementById(errId);
  el.classList.add('is-invalid');
  el.classList.remove('is-valid');
  el.setAttribute('aria-invalid', 'true');
  err.textContent = msg;
  err.classList.add('show');
}

function clearFieldError(id, errId) {
  const el  = document.getElementById(id);
  const err = document.getElementById(errId);
  el.classList.remove('is-invalid');
  el.removeAttribute('aria-invalid');
  err.classList.remove('show');
}

function markValid(id) {
  document.getElementById(id).classList.add('is-valid');
}

/* ── Validation rules ── */
function validateUsername(v) {
  if (!v.trim())        return 'Username or email is required.';
  if (v.trim().length < 3) return 'Must be at least 3 characters.';
  return null;
}

function validatePassword(v) {
  if (!v)        return 'Password is required.';
  if (v.length < 6) return 'Must be at least 6 characters.';
  return null;
}

/* ── Live validation on blur ── */
usernameEl.addEventListener('blur', () => {
  const err = validateUsername(usernameEl.value);
  if (err) setFieldError('username', 'username-error', err);
  else { clearFieldError('username', 'username-error'); markValid('username'); }
});

usernameEl.addEventListener('input', () => {
  if (usernameEl.classList.contains('is-invalid')) {
    if (!validateUsername(usernameEl.value)) clearFieldError('username', 'username-error');
  }
});

passwordEl.addEventListener('blur', () => {
  const err = validatePassword(passwordEl.value);
  if (err) setFieldError('password', 'password-error', err);
  else { clearFieldError('password', 'password-error'); markValid('password'); }
});

passwordEl.addEventListener('input', () => {
  if (passwordEl.classList.contains('is-invalid')) {
    if (!validatePassword(passwordEl.value)) clearFieldError('password', 'password-error');
  }
});

/* ── Toggle password visibility ── */
togglePwBtn.addEventListener('click', () => {
  pwVisible = !pwVisible;
  passwordEl.type = pwVisible ? 'text' : 'password';
  eyeShow.style.display = pwVisible ? 'none' : '';
  eyeHide.style.display = pwVisible ? '' : 'none';
  togglePwBtn.setAttribute('aria-label', pwVisible ? 'Hide password' : 'Show password');
  passwordEl.focus();
});

/* ── Form submit ── */
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideToast();

  const user = usernameEl.value.trim();
  const pass = passwordEl.value;

  const uErr = validateUsername(user);
  const pErr = validatePassword(pass);

  if (uErr) setFieldError('username', 'username-error', uErr);
  else { clearFieldError('username', 'username-error'); markValid('username'); }

  if (pErr) setFieldError('password', 'password-error', pErr);
  else { clearFieldError('password', 'password-error'); markValid('password'); }

  if (uErr || pErr) return;

  if (failCount >= 5) {
    showToast('Too many failed attempts. Reset the form or contact support.');
    return;
  }

  /* Loading state */
  btnLabel.textContent  = 'Signing in…';
  btnSpinner.style.display = 'block';
  submitBtn.disabled    = true;

  await new Promise(r => setTimeout(r, 800));

  /* Credential check */
  const users    = getUsers();
  const matchKey = Object.keys(users).find(k =>
    k === user.toLowerCase() || users[k].email === user.toLowerCase()
  );

  if (matchKey && users[matchKey].password === pass) {
    failCount = 0;
    if (document.getElementById('remember-me').checked) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ user: matchKey, time: Date.now() }));
    }
    showSuccessScreen(matchKey, users[matchKey]);
  } else {
    failCount++;
    const left = 5 - failCount;
    let msg = 'Incorrect username or password.';
    if (left > 0 && left < 4) msg += ` ${left} attempt${left !== 1 ? 's' : ''} remaining.`;
    showToast(msg);
    setFieldError('username', 'username-error', ' ');
    setFieldError('password', 'password-error', ' ');
    btnLabel.textContent     = 'Sign in';
    btnSpinner.style.display = 'none';
    submitBtn.disabled       = false;
  }
});

/* ── Reset ── */
resetBtn.addEventListener('click', () => {
  form.reset();
  hideToast();
  ['username', 'password'].forEach(id => {
    const el = document.getElementById(id);
    el.classList.remove('is-invalid', 'is-valid');
    el.removeAttribute('aria-invalid');
  });
  document.getElementById('username-error').classList.remove('show');
  document.getElementById('password-error').classList.remove('show');
  if (pwVisible) {
    pwVisible = false;
    passwordEl.type = 'password';
    eyeShow.style.display = '';
    eyeHide.style.display = 'none';
  }
  btnLabel.textContent     = 'Sign in';
  btnSpinner.style.display = 'none';
  submitBtn.disabled       = false;
  failCount = 0;
  showToast('Form cleared.', 'info');
  usernameEl.focus();
});

/* ── Forgot password ── */
forgotBtn.addEventListener('click', () => {
  const user = usernameEl.value.trim();
  if (!user) {
    setFieldError('username', 'username-error', 'Enter your username or email first.');
    usernameEl.focus();
    return;
  }
  const users    = getUsers();
  const matchKey = Object.keys(users).find(k =>
    k === user.toLowerCase() || users[k].email === user.toLowerCase()
  );
  const msg = matchKey
    ? `Reset link sent to ${users[matchKey].email}.`
    : `No account found for "${user}".`;
  showToast(msg, matchKey ? 'info' : 'error');
});

/* ── Success screen ── */
function showSuccessScreen(username, userData) {
  loginView.style.display = 'none';
  successView.classList.add('show');
  const name   = userData.name || username;
  const parts  = name.split(/[\s._-]+/);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
  loggedUser.textContent   = name;
  userInitials.textContent = initials;
}

/* ── Logout ── */
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem(SESSION_KEY);
  successView.classList.remove('show');
  loginView.style.display = '';
  form.reset();
  ['username', 'password'].forEach(id =>
    document.getElementById(id).classList.remove('is-invalid', 'is-valid')
  );
  hideToast();
  failCount                = 0;
  btnLabel.textContent     = 'Sign in';
  btnSpinner.style.display = 'none';
  submitBtn.disabled       = false;
  usernameEl.focus();
});

/* ── Session restore ── */
(function checkSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return;
    const { user, time } = JSON.parse(raw);
    if (Date.now() - time > 7 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(SESSION_KEY);
      return;
    }
    const users = getUsers();
    if (users[user]) showSuccessScreen(user, users[user]);
  } catch { /* ignore */ }
})();

/* ── Init ── */
initUsers();