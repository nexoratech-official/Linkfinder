const { sql, init, auth } = require('./_lib');
module.exports = async (req, res) => {
  const me = auth(req);
  if (!me) return res.status(401).json({ error: 'Please login' });
  try {
    await init();
    if (req.method === 'GET') {
      return res.json(await sql`SELECT * FROM links ORDER BY created_at DESC`);
    }
    if (req.method === 'POST') {
      const b = req.body || {};
      const title = (b.title || '').trim(), url = (b.url || '').trim();
      if (!title || !/^https?:\/\//i.test(url))
        return res.status(400).json({ error: 'Name and a valid link (http/https) are required' });
      const r = await sql`INSERT INTO links(title,url,department,topic,description,created_by,creator_name)
        VALUES(${title},${url},${(b.department||'').trim()},${(b.topic||'').trim()},${(b.description||'').trim()},
        ${me.id || null},${me.name}) RETURNING *`;
      return res.json(r[0]);
    }
    if (req.method === 'DELETE') {
      const id = Number(req.query.id);
      if (me.role === 'admin') await sql`DELETE FROM links WHERE id=${id}`;
      else await sql`DELETE FROM links WHERE id=${id} AND created_by=${me.id}`;
      return res.json({ ok: true });
    }
    res.status(405).end();
  } catch (e) { res.status(500).json({ error: e.message }); }
};
