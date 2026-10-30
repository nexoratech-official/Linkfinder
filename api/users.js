const bcrypt = require('bcryptjs');
const { sql, init, auth } = require('./_lib');
module.exports = async (req, res) => {
  const me = auth(req);
  if (!me || me.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  try {
    await init();
    if (req.method === 'GET')
      return res.json(await sql`SELECT id,username,name,department,created_at FROM users ORDER BY name`);
    const b = req.body || {};
    if (req.method === 'POST') {
      const username = (b.username || '').trim().toLowerCase();
      if (!username || !b.name || !b.password || b.password.length < 6)
        return res.status(400).json({ error: 'Username, name and password (min 6 chars) required' });
      const hash = await bcrypt.hash(b.password, 10);
      try {
        const r = await sql`INSERT INTO users(username,name,department,password_hash)
          VALUES(${username},${b.name.trim()},${(b.department||'').trim()},${hash})
          RETURNING id,username,name,department`;
        return res.json(r[0]);
      } catch { return res.status(400).json({ error: 'Username already exists' }); }
    }
    if (req.method === 'PUT') {
      if (!b.password || b.password.length < 6) return res.status(400).json({ error: 'Min 6 chars' });
      await sql`UPDATE users SET password_hash=${await bcrypt.hash(b.password, 10)} WHERE id=${Number(b.id)}`;
      return res.json({ ok: true });
    }
    if (req.method === 'DELETE') {
      await sql`DELETE FROM users WHERE id=${Number(req.query.id)}`;
      return res.json({ ok: true });
    }
    res.status(405).end();
  } catch (e) { res.status(500).json({ error: e.message }); }
};
