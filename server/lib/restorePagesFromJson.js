/**
 * Restore CMS page rows from server/data/pages.json into the active database (Supabase or JSON).
 * Use when production DB has empty/placeholder rows but the local backup still has full content.
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import * as db from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKUP_PATH = path.join(__dirname, '../data/pages.json');

function contentSize(content) {
  try {
    return JSON.stringify(content || {}).length;
  } catch {
    return 0;
  }
}

export async function restorePagesFromJsonBackup({ force = false } = {}) {
  const raw = await fs.readFile(BACKUP_PATH, 'utf8');
  const backup = JSON.parse(raw);
  const pages = Array.isArray(backup?.pages) ? backup.pages : [];
  if (pages.length === 0) {
    return { restored: 0, skipped: 0, total: 0, message: 'No pages in backup file' };
  }

  let restored = 0;
  let skipped = 0;
  const details = [];

  for (const page of pages) {
    const slug = page.slug;
    if (!slug) continue;

    const existing = await db.getPageBySlug(slug).catch(() => null);
    const backupSize = contentSize(page.content);
    const existingSize = contentSize(existing?.content);

    if (existing && !force && existingSize >= backupSize) {
      skipped += 1;
      details.push({ slug, action: 'skipped', reason: 'database already has equal or more content' });
      continue;
    }

    const payload = {
      title: page.title,
      route: page.route,
      category: page.category,
      content: page.content || {},
    };

    await db.upsertPageBySlug(slug, payload);
    restored += 1;
    details.push({
      slug,
      action: existing ? 'updated' : 'created',
      backupChars: backupSize,
      previousChars: existingSize,
    });
    console.log(`[restore-pages] ${existing ? 'Updated' : 'Created'}: ${slug} (${backupSize} chars)`);
  }

  return { restored, skipped, total: pages.length, details };
}
