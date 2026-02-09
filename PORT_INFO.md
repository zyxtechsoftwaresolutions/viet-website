# Port Information

## Your Frontend is Running On:
- **Port 8081** or **Port 8082** (check your terminal output)

## Access the Admin Panel:

### If running on port 8081:
```
http://localhost:8081/admin/login
```

### If running on port 8082:
```
http://localhost:8082/admin/login
```

## How to Find Your Port:

1. Look at the terminal where you ran `npm run dev`
2. You should see something like:
   ```
   ➜  Local:   http://localhost:8081/
   ```
3. Use that port number in the URL

## Why Different Ports?

- Vite is configured to use port 8080
- If 8080 is busy, it automatically tries 8081, then 8082, etc.
- This is normal behavior

## To Use a Specific Port:

Edit `vite.config.ts` and change:
```typescript
port: 8080,  // Change to your preferred port
```

## Quick Access:

Just check your terminal output and use the port number shown there!







