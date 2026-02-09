# Quick Start Guide - Admin Panel

## Prerequisites
- Node.js installed (v16 or higher)
- npm installed

## Step-by-Step Setup

### 1. Install Backend Dependencies

Open a terminal and run:

```bash
cd server
npm install
```

### 2. Install Frontend Dependencies (if not already done)

In the root directory:

```bash
npm install
```

### 3. Start the Backend Server

In the `server` directory:

```bash
npm start
```

You should see:
```
Server running on http://localhost:3001
Default admin credentials: username: admin, password: admin123
```

**Keep this terminal window open!**

### 4. Start the Frontend Server

Open a **NEW** terminal window, go to the root directory, and run:

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 5. Access the Admin Panel

1. Open your browser
2. Go to: `http://localhost:5173/admin/login`
3. Login with:
   - **Username:** `admin`
   - **Password:** `admin123`

### 6. You're Ready!

Once logged in, you'll see the admin dashboard where you can:
- Manage carousel images
- Add/edit announcements
- Post news articles
- Create events
- Update department images
- Manage faculty
- Upload gallery images
- Add recruiters

## Using the Startup Scripts (Optional)

### Windows:
Double-click `start-admin.bat` to start both servers automatically.

### Mac/Linux:
```bash
chmod +x start-admin.sh
./start-admin.sh
```

## Troubleshooting

### "Cannot connect to server" error
- Make sure the backend server is running on port 3001
- Check the terminal for any error messages
- Try restarting the backend server

### "Page not found" or blank page
- Make sure both servers are running
- Check browser console (F12) for errors
- Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Port already in use
- Close other applications using ports 3001 or 5173
- Or change the ports in the configuration files

## Need Help?

See `TROUBLESHOOTING.md` for detailed troubleshooting steps.







