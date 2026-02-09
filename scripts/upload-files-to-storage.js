#!/usr/bin/env node
/**
 * Upload existing files from public/uploads to Supabase Storage
 * Run after migrate-to-supabase.js and after creating the 'uploads' bucket in Supabase
 * Usage: node scripts/upload-files-to-storage.js
 */
import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, '../public/uploads');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET = 'uploads';

async function getAllFiles(dir, base = '') {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const rel = path.join(base, e.name);
    if (e.isDirectory()) {
      files.push(...await getAllFiles(path.join(dir, e.name), rel));
    } else {
      files.push(rel);
    }
  }
  return files;
}

async function main() {
  try {
    const exists = await fs.access(UPLOADS_DIR).then(() => true).catch(() => false);
    if (!exists) {
      console.log('No public/uploads directory found. Skipping.');
      return;
    }

    const files = await getAllFiles(UPLOADS_DIR);
    if (files.length === 0) {
      console.log('No files to upload.');
      return;
    }

    console.log(`Uploading ${files.length} files to Supabase Storage...`);

    for (const rel of files) {
      const fullPath = path.join(UPLOADS_DIR, rel);
      const buffer = await fs.readFile(fullPath);
      const ext = path.extname(rel).slice(1) || 'bin';
      const contentType = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        webp: 'image/webp',
        svg: 'image/svg+xml',
        pdf: 'application/pdf',
        mp4: 'video/mp4',
        webm: 'video/webm',
      }[ext.toLowerCase()] || 'application/octet-stream';

      const { error } = await supabase.storage.from(BUCKET).upload(rel, buffer, {
        contentType,
        upsert: true,
      });

      if (error) {
        console.warn(`  ✗ ${rel}: ${error.message}`);
      } else {
        console.log(`  ✓ ${rel}`);
      }
    }

    console.log('\nDone. Note: Existing DB records still point to /uploads/... paths.');
    console.log('New uploads will use Supabase URLs. For old content, either re-upload via admin or run a DB update script.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
