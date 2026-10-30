const { neon } = require('@neondatabase/serverless');
const jwt = require('jsonwebtoken');
const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING);
let ready;
function init() {
  if (!ready) ready = (async () => {
    await sql`CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY, username TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
      department TEXT, password_hash TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now())`;
    await sql`CREATE TABLE IF NOT EXISTS links(
      id SERIAL PRIMARY KEY, title TEXT NOT NULL, url TEXT NOT NULL, department TEXT,
      topic TEXT, description TEXT, created_by INT, creator_name TEXT,
      created_at TIMESTAMPTZ DEFAULT now())`;
  })();
  return ready;
}
function auth(req) {
  const t = (req.headers.authorization || '').replace('Bearer ', '');
  try { return jwt.verify(t, process.env.JWT_SECRET); } catch { return null; }
}
module.exports = { sql, init, auth, jwt };
