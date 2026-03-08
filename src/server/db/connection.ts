import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Determine if we're in production (running from dist/) or development
const isProduction = __dirname.includes('/dist/') || __dirname.includes('\\dist\\');

// Database path: in production it's at project root/data/, in dev it's relative to current dir
const dbPath = isProduction
  ? path.join(__dirname, '../../data/purplematch.db')
  : path.join(__dirname, '../../data/purplematch.db');

// Create data directory if it doesn't exist
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db: SqlJsDatabase | null = null;

export async function initDb(): Promise<SqlJsDatabase> {
  if (db) return db;
  
  const SQL = await initSqlJs();
  
  // Load existing database if it exists
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }
  
  return db;
}

export function getDb(): SqlJsDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return db;
}

export function saveDb(): void {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

export default db;
