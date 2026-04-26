import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let _db: any = null;

function getDbInstance() {
  if (!_db) {
    const isProduction = process.env.NODE_ENV === 'production' || process.env.K_SERVICE || process.env.CLOUD_RUN_JOB;
    const dbPath = isProduction 
      ? '/tmp/karnierp.db' 
      : path.join(process.cwd(), 'karnierp.db');
    
    console.log(`[Database] Initializing at ${dbPath} (Mode: ${isProduction ? 'Production' : 'Development'})`);
    _db = new Database(dbPath);
  }
  return _db;
}

// Proxy to allow using `db.prepare` etc. without changing calling code
const db: any = new Proxy({}, {
  get(target, prop) {
    const instance = getDbInstance();
    const value = instance[prop];
    return typeof value === 'function' ? value.bind(instance) : value;
  }
});

// Initialize Schema
export function initDb() {
  const instance = getDbInstance();
  
  // Users Table
  instance.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'User',
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // Designs Table
  instance.prepare(`
    CREATE TABLE IF NOT EXISTS designs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      design_no TEXT UNIQUE NOT NULL,
      prompt TEXT,
      image_url TEXT,
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // Lots Table
  instance.prepare(`
    CREATE TABLE IF NOT EXISTS lots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lot_no TEXT UNIQUE NOT NULL,
      design_id INTEGER,
      qty INTEGER DEFAULT 0,
      current_stage TEXT DEFAULT 'Created',
      priority TEXT DEFAULT 'Medium',
      status TEXT DEFAULT 'In Progress',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (design_id) REFERENCES designs(id)
    )
  `).run();

  // Inventory Table
  instance.prepare(`
    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_code TEXT UNIQUE NOT NULL,
      item_name TEXT NOT NULL,
      category TEXT,
      qty DECIMAL(10,2) DEFAULT 0,
      uom TEXT,
      min_stock DECIMAL(10,2) DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // Seed Admin User
  const admin = instance.prepare('SELECT * FROM users WHERE username = ?').get('admin');
  if (!admin) {
    instance.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)')
      .run('admin', '$2a$10$Xm7A8L.qFBy7vV/7Bf5YIu8y1V.n5j7qS7G8a9B0C1D2E3F4G5H6', 'Admin'); 
  }
}

export default db;
