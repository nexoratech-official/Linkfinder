const bcrypt = require('bcryptjs');
const { sql, init, jwt } = require('./_lib');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { username = '', password = '' } = req.body || {};
    const sign = (p) => jwt.sign(p, process.env.JWT_SECRET, { expiresIn: '12h' });
    const au = (process.env.ADMIN_USERNAME || '').trim();
    const ap = (process.env.ADMIN_PASSWORD || '').trim();
    if (au && username.trim() === au && password === ap) {
      const user = { role: 'admin', name: 'Admin', username: au };
      return res.json({ token: sign(user), user });
    }
    await init();
    const rows = await sql`SELECT * FROM users WHERE username = ${username.trim().toLowerCase()}`;
    const u = rows[0];
    if (!u || !(await bcrypt.compare(password, u.password_hash)))
      return res.status(401).json({ error: 'Wrong username or password' });
    const user = { role: 'faculty', id: u.id, name: u.name, department: u.department, username: u.username };
    res.json({ token: sign(user), user });
  } catch (e) { res.status(500).json({ error: e.message }); }
};