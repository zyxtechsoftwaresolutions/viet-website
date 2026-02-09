# Dashboard Blank Page - Troubleshooting

## If Dashboard is Completely Blank

### Step 1: Check Browser Console
1. Press **F12** to open Developer Tools
2. Go to the **Console** tab
3. Look for any **red error messages**
4. Share the error messages you see

### Step 2: Check Network Tab
1. In Developer Tools, go to **Network** tab
2. Refresh the page (F5)
3. Look for failed requests (red status codes)
4. Check if requests to `http://localhost:3001/api/...` are failing

### Step 3: Verify Backend Server is Running
The dashboard needs the backend server to be running!

1. Check if backend is running:
   - Open terminal where you started backend
   - Should see: `Server running on http://localhost:3001`

2. If not running:
   ```bash
   cd server
   npm start
   ```

### Step 4: Check Common Issues

#### Issue: CORS Errors
- **Error**: "CORS policy" or "Access-Control-Allow-Origin"
- **Fix**: Backend should handle CORS automatically, but verify `server/server.js` has `app.use(cors())`

#### Issue: 404 Errors
- **Error**: "Failed to fetch" or 404 status
- **Fix**: Make sure backend is running on port 3001

#### Issue: Authentication Errors
- **Error**: 401 or 403 status codes
- **Fix**: Try logging out and logging back in

#### Issue: JavaScript Errors
- **Error**: Any red errors in console
- **Fix**: Check the error message and fix accordingly

### Step 5: Quick Test

1. Open browser console (F12)
2. Type this and press Enter:
   ```javascript
   fetch('http://localhost:3001/api/announcements')
     .then(r => r.json())
     .then(console.log)
     .catch(console.error)
   ```

3. **If it works**: You should see an array (might be empty `[]`)
4. **If it fails**: Backend is not running or not accessible

### Step 6: Verify Files

Make sure these files exist:
- ✅ `src/pages/admin/Dashboard.tsx`
- ✅ `src/lib/api.ts`
- ✅ `server/server.js`

### Step 7: Clear Browser Cache

1. Press **Ctrl + Shift + Delete**
2. Clear cached images and files
3. Refresh the page (Ctrl + F5)

### Step 8: Check React DevTools

If you have React DevTools installed:
1. Check if components are rendering
2. Look for any component errors

## Still Not Working?

1. **Check terminal output** for any error messages
2. **Share the exact error** from browser console
3. **Verify both servers are running**:
   - Backend: `http://localhost:3001`
   - Frontend: `http://localhost:8081` (or 8082)

## Expected Behavior

When dashboard loads correctly, you should see:
- ✅ "Dashboard" heading
- ✅ 8 stat cards (Announcements, News, Events, etc.)
- ✅ "Quick Actions" section at bottom
- ✅ All cards showing count of 0 (if no data yet)

If you see a loading animation that never stops, the API calls are failing.







