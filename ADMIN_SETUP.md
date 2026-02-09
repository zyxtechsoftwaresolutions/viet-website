# VIET Website Admin Panel Setup Guide

This guide will help you set up and use the admin panel for managing the VIET website content.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## Setup Instructions

### 1. Install Backend Dependencies

Navigate to the `server` directory and install dependencies:

```bash
cd server
npm install
```

### 2. Start the Backend Server

From the `server` directory, run:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3001`

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **Important:** Change the default password in production!

### 3. Install Frontend Dependencies (if not already done)

From the root directory:

```bash
npm install
```

### 4. Configure API URL (Optional)

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001/api
```

If not set, it defaults to `http://localhost:3001/api`

### 5. Start the Frontend Development Server

From the root directory:

```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

## Accessing the Admin Panel

1. Navigate to `http://localhost:5173/admin/login`
2. Login with the default credentials:
   - Username: `admin`
   - Password: `admin123`

## Admin Panel Features

The admin panel allows you to manage:

### 1. **Carousel Images**
- Upload, edit, and delete homepage carousel images
- Add titles and subtitles to images

### 2. **Announcements**
- Create, edit, and delete announcements
- Set announcement type (Result, Notification, Study Material)
- Add links to announcements

### 3. **News**
- Create, edit, and delete news articles
- Add descriptions and links

### 4. **Events**
- Create, edit, and delete events
- Set date, time, and location
- Add event descriptions and links

### 5. **Departments**
- Upload and manage department images
- Set department name, stream, and level

### 6. **Faculty**
- Add, edit, and delete faculty members
- Upload profile images and resumes
- Manage faculty information (name, designation, qualification, etc.)

### 7. **Gallery**
- Upload gallery images
- Organize images by department

### 8. **Recruiters**
- Add, edit, and delete recruiter companies
- Upload company logos
- Add company descriptions

## Data Storage

All data is stored in JSON files in the `server/data` directory:
- `announcements.json`
- `news.json`
- `events.json`
- `carousel.json`
- `departments.json`
- `faculty.json`
- `gallery.json`
- `recruiters.json`
- `users.json`

Uploaded files are stored in the `public/uploads` directory, organized by type:
- `public/uploads/carousel/`
- `public/uploads/departments/`
- `public/uploads/gallery/`
- `public/uploads/recruiters/`
- `public/uploads/faculty/`

## Security Notes

1. **Change Default Password:** Update the default admin password in production
2. **JWT Secret:** Change the JWT_SECRET in `server/server.js` for production
3. **Environment Variables:** Use environment variables for sensitive data
4. **HTTPS:** Use HTTPS in production
5. **Authentication:** The admin panel requires authentication for all operations

## Updating Frontend Components

To make the frontend components fetch data from the API instead of using hardcoded data, you'll need to:

1. Update components like `AnnouncementsNewsEventsSection.tsx`, `HeroSection.tsx`, etc. to fetch data from the API
2. Use the API functions from `src/lib/api.ts`
3. Handle loading and error states

Example:

```typescript
import { useEffect, useState } from 'react';
import { announcementsAPI } from '@/lib/api';

const AnnouncementsNewsEventsSection = () => {
  const [announcements, setAnnouncements] = useState([]);
  
  useEffect(() => {
    announcementsAPI.getAll().then(setAnnouncements);
  }, []);
  
  // Use announcements in your component
};
```

## Troubleshooting

1. **Server not starting:** Check if port 3001 is available
2. **CORS errors:** Ensure the backend CORS is configured correctly
3. **File upload fails:** Check file size limits (default: 10MB)
4. **Authentication fails:** Verify JWT token is being sent in headers

## Production Deployment

1. Build the frontend: `npm run build`
2. Set up environment variables
3. Use a production database (consider migrating from JSON files)
4. Set up proper file storage (consider cloud storage)
5. Configure HTTPS
6. Set up proper backup for data files

## Support

For issues or questions, please contact the development team.







