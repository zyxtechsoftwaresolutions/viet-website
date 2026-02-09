# How to Start the Frontend Server

## The Error You're Seeing

`ERR_CONNECTION_REFUSED` means the frontend development server is not running.

## Solution: Start the Frontend Server

### Step 1: Open a Terminal/Command Prompt

- **Windows**: Press `Win + R`, type `cmd`, press Enter
- Or right-click in the project folder and select "Open in Terminal"

### Step 2: Navigate to Project Directory

```bash
cd "C:\Puneeth\VIET NEW WEBSITE\site-revive-nexus-main"
```

### Step 3: Start the Frontend Server

```bash
npm run dev
```

### Step 4: Wait for Server to Start

You should see output like:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 5: Open the Admin Panel

Once you see the "Local: http://localhost:5173/" message:
1. Open your browser
2. Go to: `http://localhost:5173/admin/login`

## Important: Keep the Terminal Open!

**DO NOT close the terminal window** - the server needs to keep running.

## If You Get Errors

### Error: "npm is not recognized"
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### Error: "Cannot find module"
Run:
```bash
npm install
```

### Port 5173 Already in Use
1. Close other applications using port 5173
2. Or kill the process:
   ```bash
   # Find the process
   netstat -ano | findstr :5173
   # Kill it (replace PID with the number from above)
   taskkill /PID <PID> /F
   ```

## Quick Start Script (Alternative)

You can also use the startup script:
- **Windows**: Double-click `start-admin.bat`
- This will start both backend and frontend servers

## Both Servers Must Be Running

1. **Backend Server** (port 3001) - for API
2. **Frontend Server** (port 5173) - for the website

Make sure BOTH are running before accessing the admin panel!







