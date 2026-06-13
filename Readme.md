# SecureLogin — Authentication App

A clean, simple login authentication app built with plain HTML, CSS, and JavaScript. No frameworks or build tools — deploy by uploading three files.

---

## Live Demo

> **Deployed:** https://csc-426-xi.vercel.app/  
> **GitHub:** https://github.com/akanni6767

---

## File Structure

```
login-auth-app/
├── index.html   # Markup and structure
├── style.css    # All styles
├── app.js       # Auth logic and validation
└── README.md    # This file
```

---

## Features

- Username or email login
- Show / hide password toggle
- Inline field validation (on blur, clears as you type)
- Toast notifications — error, info, success
- Remember me (7-day session via `localStorage`)
- Brute-force guard — locks after 5 failed attempts
- Forgot password simulation
- Post-login success screen with sign-out
- Auto-restores session on page reload
- Responsive layout (mobile-friendly)
- Keyboard accessible with ARIA attributes

---

## Demo Credentials

| Username | Password  |
|----------|-----------|
| `akeem`  | `$akeem__` |

---

## How It Works

### Auth flow

```
Submit form
  → Validate fields (username ≥ 3 chars, password ≥ 6 chars)
  → Look up username/email in localStorage
  → Check password match
  → Success → show success screen, save session if "Remember me"
  → Failure → show error, track attempts
  → 5 failures → lock form
```

### User data

Stored as JSON in `localStorage` under `securelogin_users`:

```json
{
  "akeem": {
    "password": "$akeem__",
    "email": "softdphejs@gmail.com",
    "name": "Admin User"
  }
}
```

> **Production note:** Never store plain-text passwords. Use bcrypt/argon2 server-side, HTTPS, and secure HTTP-only cookies.

---

### Vercel
```bash
npm i -g vercel
cd login-auth-app
vercel
```

## License

MIT