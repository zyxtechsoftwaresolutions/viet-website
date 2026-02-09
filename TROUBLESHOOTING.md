# Admin Panel Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: Admin Panel Not Loading / Blank Page

**Possible Causes:**
1. Backend server is not running
2. CORS errors
3. Missing dependencies
4. Route configuration issues

**Solutions:**

#### Step 1: Check if Backend Server is Running

1. Open a new terminal
2. Navigate to the `server` directory:
   ```bash
   cd server
   ```
3. Install dependencies (if not done):
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
   You should see: `Server running on http://localhost:3001`

#### Step 2: Check Frontend Console for Errors

1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Look for any red error messages
4. Common errors:
   - `Failed to fetch` - Backend server not running
   - `CORS error` - Backend CORS not configured
   - `404 Not Found` - Route not found

#### Step 3: Verify Routes are Accessible

Try accessing these URLs directly:
- `http://localhost:5173/admin/login` - Should show login page
- `http://localhost:5173/admin/dashboard` - Should redirect to login if not authenticated

#### Step 4: Check Network Tab

1. Open Developer Tools → Network tab
2. Try to access `/admin/login`
3. Check if any requests are failing (red status codes)
4. Check if API calls to `http://localhost:3001` are being made

### Issue 2: Login Page Shows but Login Fails

**Possible Causes:**
1. Backend server not running
2. Wrong API URL
3. Backend not initialized

**Solutions:**

1. **Verify Backend is Running:**
   ```bash
   # In server directory
   npm start
   ```

2. **Check API URL:**
   - Open browser console
   - Check if requests are going to `http://localhost:3001/api/auth/login`
   - If not, create a `.env` file in root with:
     ```
     VITE_API_URL=http://localhost:3001/api
     ```
   - Restart the frontend dev server

3. **Verify Backend Initialization:**
   - Check if `server/data` directory exists
   - Check if `server/data/users.json` exists
   - Default admin should be created automatically

### Issue 3: "Cannot GET /admin" or Route Not Found

**Possible Causes:**
1. React Router not configured correctly
2. Missing route definitions

**Solutions:**

1. **Check App.tsx:**
   - Verify admin routes are included
   - Routes should be:
     ```tsx
     <Route path="/admin/login" element={<AdminLogin />} />
     <Route path="/admin" element={<AdminLayout />}>
       <Route path="dashboard" element={<Dashboard />} />
       ...
     </Route>
     ```

2. **Clear Browser Cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear browser cache

### Issue 4: Components Not Found / Import Errors

**Possible Causes:**
1. Missing admin page files
2. Incorrect import paths

**Solutions:**

1. **Verify all admin pages exist:**
   - `src/pages/admin/Dashboard.tsx`
   - `src/pages/admin/Announcements.tsx`
   - `src/pages/admin/News.tsx`
   - `src/pages/admin/Events.tsx`
   - `src/pages/admin/Carousel.tsx`
   - `src/pages/admin/Departments.tsx`
   - `src/pages/admin/Faculty.tsx`
   - `src/pages/admin/Gallery.tsx`
   - `src/pages/admin/Recruiters.tsx`

2. **Check imports in App.tsx:**
   - All imports should be correct
   - No TypeScript errors

### Issue 5: Backend Server Won't Start

**Possible Causes:**
1. Port 3001 already in use
2. Missing dependencies
3. Node.js version incompatible

**Solutions:**

1. **Check if port is in use:**
   ```bash
   # Windows
   netstat -ano | findstr :3001
   
   # Mac/Linux
   lsof -i :3001
   ```
   Kill the process if needed

2. **Reinstall dependencies:**
   ```bash
   cd server
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check Node.js version:**
   ```bash
   node --version
   ```
   Should be v16 or higher

### Quick Diagnostic Checklist

- [ ] Backend server is running on port 3001
- [ ] Frontend dev server is running on port 5173
- [ ] No console errors in browser
- [ ] Network requests to backend are successful
- [ ] All admin page files exist
- [ ] Routes are correctly configured in App.tsx
- [ ] Dependencies are installed (both frontend and backend)

### Testing the Setup

1. **Test Backend:**
   ```bash
   # In server directory
   npm start
   # Should see: "Server running on http://localhost:3001"
   ```

2. **Test Frontend:**
   ```bash
   # In root directory
   npm run dev
   # Should see: "Local: http://localhost:5173"
   ```

3. **Test Login:**
   - Go to `http://localhost:5173/admin/login`
   - Use credentials: `admin` / `admin123`
   - Should redirect to dashboard

### Still Not Working?

1. **Check browser console for specific errors**
2. **Check terminal/console for backend errors**
3. **Verify file structure matches expected layout**
4. **Try restarting both servers**

### Getting Help

If you're still having issues:
1. Copy the exact error message from browser console
2. Check the Network tab for failed requests
3. Verify both servers are running
4. Check that all files are in the correct locations







