#!/usr/bin/env node
/**
 * CLI: node server/scripts/restore-pages-from-json.js [--force]
 * Restores page content from server/data/pages.json into Supabase (or local JSON DB).
 */
import 'dotenv/config';
import { restorePagesFromJsonBackup } from '../lib/restorePagesFromJson.js';

const force = process.argv.includes('--force');

restorePagesFromJsonBackup({ force })
  .then((result) => {
    console.log('\nRestore complete:', result);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Restore failed:', err);
    process.exit(1);
  });
