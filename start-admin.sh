#!/bin/bash

echo "Starting VIET Admin Panel..."
echo ""

echo "Step 1: Starting Backend Server..."
cd server
npm start &
BACKEND_PID=$!
sleep 3

echo ""
echo "Step 2: Starting Frontend Server..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "Admin Panel Starting..."
echo "========================================"
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:5173"
echo "Admin Login: http://localhost:5173/admin/login"
echo ""
echo "Default Credentials:"
echo "Username: admin"
echo "Password: admin123"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait







