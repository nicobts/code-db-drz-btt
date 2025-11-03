# 🔍 Authentication Debugging Guide

**Last Updated:** November 3, 2025
**Status:** All services verified running

---

## ✅ Current Status

### Services Running:
1. **PostgreSQL Database** ✅
   - Port: 5432
   - Process IDs: 39416, 5728
   - Status: RUNNING

2. **Drizzle Studio** ✅
   - URL: **http://localhost:4983**
   - Process ID: 29940
   - Status: RUNNING

3. **Next.js Dev Server** ✅
   - URL: **http://localhost:3000**
   - Process ID: 34488
   - Status: RUNNING

4. **Database Schema** ✅
   - Migrations: IN SYNC
   - Tables: All created
   - Status: READY

---

## 🌐 URLs to Access

| Service | URL | Purpose |
|---------|-----|---------|
| **App** | http://localhost:3000 | Main application |
| **Login** | http://localhost:3000/login | Login page |
| **Signup** | http://localhost:3000/signup | Signup page |
| **Dashboard** | http://localhost:3000/dashboard | Dashboard (auth required) |
| **Drizzle Studio** | http://localhost:4983 | Database viewer |

---

## 🔐 How to Test Authentication

### Test 1: Check Database Tables

1. Open Drizzle Studio: **http://localhost:4983**
2. Verify these tables exist:
   - ✅ `user` - User accounts
   - ✅ `session` - Active sessions
   - ✅ `account` - OAuth accounts
   - ✅ `verification` - Email verification tokens
   - ✅ `profiles` - User profiles
   - ✅ `workspaces` - Workspaces
   - ✅ `workspace_members` - Team members
   - ✅ `invitations` - Pending invitations

### Test 2: Sign Up a New User

1. Go to: http://localhost:3000/signup
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: Test1234!
   - Confirm Password: Test1234!
   - Accept Terms: ✓
3. Click "Sign up"
4. **Expected:** Redirected to `/dashboard`
5. **Verify in Drizzle Studio:**
   - Check `user` table for new record
   - Check `session` table for active session
   - Check `profiles` table for profile record

### Test 3: Sign In with Existing User

1. Go to: http://localhost:3000/login
2. Enter credentials:
   - Email: test@example.com
   - Password: Test1234!
3. Click "Sign in"
4. **Expected:** Redirected to `/dashboard`

### Test 4: Check Session Persistence

1. After logging in, refresh the page
2. **Expected:** Still logged in, not redirected
3. **Verify in Drizzle Studio:**
   - Check `session` table
   - Verify `expiresAt` is in the future
   - Check `token` exists

---

## 🐛 Common Issues & Solutions

### Issue 1: "Invalid email or password"

**Symptoms:**
- Login fails even with correct credentials
- Error appears immediately

**Diagnosis:**
1. Open Drizzle Studio: http://localhost:4983
2. Go to `user` table
3. Check if user exists with that email
4. Check `password` field in `account` table

**Solutions:**
- If user doesn't exist: Sign up first
- If password is wrong: Use password reset (if implemented) or recreate user
- Check browser console for detailed error

### Issue 2: "Session not persisting"

**Symptoms:**
- Login works but redirects back to login after refresh
- Session lost on page reload

**Diagnosis:**
1. Open Browser DevTools → Application → Cookies
2. Check for cookies from `localhost:3000`
3. Look for BetterAuth session cookie
4. In Drizzle Studio, check `session` table

**Solutions:**
- Clear cookies and try again
- Check if `expiresAt` in session table is in the past
- Verify `BETTER_AUTH_SECRET` in `.env.local` hasn't changed
- Check browser console for CORS or cookie errors

### Issue 3: "Cannot read properties of undefined"

**Symptoms:**
- Error in console about undefined properties
- App crashes on certain pages

**Diagnosis:**
1. Check browser console for full error stack
2. Check if it's related to `session` or `user` object
3. Verify session exists in database

**Solutions:**
- Add null checks: `session?.user?.id`
- Ensure components using `useSession()` have loading states
- Check if middleware is properly protecting routes

### Issue 4: "Database connection error"

**Symptoms:**
- 500 errors when trying to auth
- "Cannot connect to database" errors

**Diagnosis:**
1. Check if PostgreSQL is running:
   ```bash
   netstat -ano | findstr :5432
   ```
2. Verify `DATABASE_URL` in `.env.local`
3. Test connection with Drizzle Studio

**Solutions:**
- Restart PostgreSQL (if using Docker: `docker compose restart`)
- Verify connection string format:
  ```
  postgresql://postgres:postgres@localhost:5432/saas_db
  ```
- Check PostgreSQL logs for errors

---

## 🔍 Step-by-Step Debugging Process

### Step 1: Verify All Services Running

```bash
# Check PostgreSQL
netstat -ano | findstr :5432

# Check Next.js dev server
netstat -ano | findstr :3000

# Check Drizzle Studio
netstat -ano | findstr :4983
```

**Expected:** All three should show LISTENING status

### Step 2: Check Database Tables

1. Open http://localhost:4983
2. Expand database in left sidebar
3. Verify all tables exist
4. Click on `user` table - should see column structure

### Step 3: Test Signup Flow

1. Open browser DevTools (F12)
2. Go to Console tab
3. Go to http://localhost:3000/signup
4. Fill form and submit
5. Watch console for errors
6. Check Network tab for API calls
7. Look for POST to `/api/auth/signup` or similar

### Step 4: Inspect Network Requests

When signing up/in:
1. Open DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Look for auth-related requests
4. Check:
   - Request payload (credentials)
   - Response status (200 = success, 400/401 = error)
   - Response body (error messages)
   - Cookies set in response

### Step 5: Check Database After Auth Action

After signup/login:
1. Open Drizzle Studio
2. Refresh the view
3. Check `user` table - new record should appear
4. Check `session` table - active session should exist
5. Verify `userId` matches in both tables

### Step 6: Verify Session Cookies

1. DevTools → Application → Cookies → http://localhost:3000
2. Look for BetterAuth cookie (name varies)
3. Check:
   - Cookie exists
   - Has valid expiration
   - Is not marked as expired
   - Value is not empty

---

## 📊 Database Schema Check

### Expected Tables & Columns:

**user table:**
- id (text, PK)
- name (text)
- email (text, unique)
- emailVerified (boolean)
- image (text)
- createdAt (timestamp)
- updatedAt (timestamp)

**session table:**
- id (text, PK)
- expiresAt (timestamp)
- token (text, unique)
- createdAt (timestamp)
- updatedAt (timestamp)
- ipAddress (text)
- userAgent (text)
- userId (text, FK → user.id)

**account table:**
- id (text, PK)
- accountId (text)
- providerId (text)
- userId (text, FK → user.id)
- accessToken (text)
- refreshToken (text)
- password (text) - for email/password auth
- createdAt (timestamp)
- updatedAt (timestamp)

---

## 🛠️ Manual Testing Checklist

- [ ] Navigate to signup page (no errors in console)
- [ ] Fill signup form with valid data
- [ ] Submit form
- [ ] Check for network request in DevTools
- [ ] Verify redirect to dashboard
- [ ] Check user appears in Drizzle Studio `user` table
- [ ] Check session appears in `session` table
- [ ] Refresh page - still logged in
- [ ] Log out
- [ ] Verify session removed from database
- [ ] Try logging in with same credentials
- [ ] Verify login successful
- [ ] Check new session created

---

## 🔑 Environment Variables to Check

In `.env.local`:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/saas_db

# BetterAuth
BETTER_AUTH_SECRET=local-dev-secret-key-change-in-production-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Verify:**
- ✅ DATABASE_URL points to running PostgreSQL
- ✅ BETTER_AUTH_SECRET is at least 32 characters
- ✅ BETTER_AUTH_URL matches dev server URL
- ✅ NEXT_PUBLIC_APP_URL matches dev server URL

---

## 📝 Logging & Debugging Tips

### Add Console Logs to Login Page:

In `app/(auth)/login/page.tsx`, add logs in the `handleEmailLogin` function:

```typescript
console.log("Attempting login with:", email);
console.log("Auth response:", response); // Add after signIn call
```

### Check Server Logs:

In terminal where `npm run dev` is running:
- Look for auth-related errors
- Check database connection messages
- Watch for middleware errors

### Use React DevTools:

1. Install React DevTools extension
2. Inspect component state
3. Check `useSession()` hook values
4. Verify props being passed

---

## ✅ Success Indicators

**Authentication is working if:**
1. ✅ Signup creates user in `user` table
2. ✅ Login creates session in `session` table
3. ✅ Session cookie is set in browser
4. ✅ Dashboard page loads after login
5. ✅ Session persists after page refresh
6. ✅ User info available in `useSession()` hook
7. ✅ Logout removes session from database and browser

---

## 🚨 If Still Not Working

**Collect this information:**

1. **Browser Console Errors:**
   - Take screenshot or copy error messages
   - Include full stack trace

2. **Network Tab:**
   - Export HAR file of failed auth request
   - Check request/response details

3. **Database State:**
   - Screenshot of `user` table in Drizzle Studio
   - Screenshot of `session` table
   - Check if any data exists

4. **Environment:**
   - Confirm all URLs in `.env.local`
   - Verify all services are actually running
   - Check Node.js version: `node --version`

5. **Server Logs:**
   - Copy any errors from terminal where `npm run dev` is running
   - Look for database connection errors
   - Check for BetterAuth initialization errors

---

## 🎯 Quick Test Script

Open browser console and paste:

```javascript
// Test if auth client is loaded
console.log("Auth client available:", typeof signIn !== 'undefined');

// Test session
fetch('http://localhost:3000/api/auth/session')
  .then(r => r.json())
  .then(data => console.log('Session:', data))
  .catch(err => console.error('Session error:', err));

// Test database connection (indirect)
fetch('http://localhost:4983')
  .then(r => console.log('Drizzle Studio accessible:', r.ok))
  .catch(err => console.error('Drizzle Studio not accessible'));
```

---

**Ready to debug! Start with Test 1 and work through systematically.** 🔍
