# Supabase Setup Guide

This project uses **Supabase** as the database backend. When configured, all admin data (announcements, news, events, faculty, pages, etc.) is stored in Supabase instead of JSON files.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project
3. Wait for the project to be ready

## 2. Run the Database Migration

1. In Supabase Dashboard → **SQL Editor**, run the schema from:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
2. This creates all required tables (users, announcements, news, events, carousel, departments, faculty, pages, etc.)

## 3. Create the Storage Bucket

1. In Supabase Dashboard → **Storage**, create a new bucket
2. Name: `uploads`
3. Set it as **Public** (so image/video URLs work on the frontend)

Or run in SQL Editor:
```sql
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;
```

## 4. Configure Environment Variables

1. Copy `.env.example` to `.env` (if you haven't already)
2. Add your Supabase credentials to `.env`:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Find these in Supabase Dashboard → **Project Settings** → **API**:
- **Project URL** → `SUPABASE_URL`
- **service_role** key (under "Project API keys") → `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ **Never expose the service role key client-side.** It bypasses Row Level Security.

## 5. Migrate Existing Data (Optional)

If you have existing data in `server/data/*.json`:

```bash
npm run migrate:supabase
```

This imports all JSON data into Supabase.

## 6. Upload Existing Files to Storage (Optional)

If you have files in `public/uploads/` that you want in Supabase Storage:

```bash
node scripts/upload-files-to-storage.js
```

Note: After upload, existing database records still reference `/uploads/...` paths. New uploads via the admin panel will use Supabase Storage URLs. For old content, you may need to re-upload images through the admin UI, or update the database manually to use the new Storage URLs.

## 7. Run the Application

```bash
# Install dependencies (includes dotenv for migration)
npm install

# Start the dev server (API + frontend)
npm run dev
npm run server
```

When `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set, the server uses Supabase. If they're missing, it falls back to JSON files.

## Default Admin Login

- **Username:** admin  
- **Password:** admin123  

(Created automatically on first run if no users exist.)
