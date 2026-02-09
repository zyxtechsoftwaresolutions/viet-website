# Fix Port 3001 Already in Use Error

## The Problem
```
Error: listen EADDRINUSE: address already in use :::3001
```

This means another process is already using port 3001.

## Solution 1: Kill the Process (Recommended)

### Step 1: Find the Process
```bash
netstat -ano | findstr :3001
```

You'll see output like:
```
TCP    0.0.0.0:3001           0.0.0.0:0              LISTENING       4628
```

The last number (4628) is the Process ID (PID).

### Step 2: Kill the Process
```bash
taskkill /PID 4628 /F
```

Replace `4628` with the actual PID from Step 1.

### Step 3: Start Backend Again
```bash
cd server
npm start
```

## Solution 2: Use a Different Port

If you want to keep the existing process running, change the backend port:

1. Edit `server/server.js`
2. Find: `const PORT = process.env.PORT || 3001;`
3. Change to: `const PORT = process.env.PORT || 3002;`
4. Update `src/lib/api.ts`:
   - Change: `const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';`
   - To: `const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';`

## Quick Fix Script

Run this in PowerShell:
```powershell
# Find and kill process on port 3001
$port = 3001
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($process) {
    $pid = $process.OwningProcess
    Stop-Process -Id $pid -Force
    Write-Host "Killed process $pid on port $port"
} else {
    Write-Host "No process found on port $port"
}
```

## Why This Happens

- You might have started the backend server before and didn't close it
- Another application is using port 3001
- The previous server instance crashed but didn't release the port

## Prevention

Always stop the server properly:
- Press `Ctrl + C` in the terminal where the server is running
- Or close the terminal window

