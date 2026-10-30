// Local runner only (Vercel ignores this file). Use: node server.js
const http = require('http'), fs = require('fs'), path = require('path');
try { process.loadEnvFile('.env'); } catch {}
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname.startsWith('/api/')) {
    const name = url.pathname.slice(5);
    const file = path.join(__dirname, 'api', name + '.js');
    if (name.startsWith('_') || !fs.existsSync(file)) { res.statusCode = 404; return res.end('{}'); }
    let body = ''; for await (const c of req) body += c;
    try { req.body = body ? JSON.parse(body) : {}; } catch { req.body = {}; }
    req.query = Object.fromEntries(url.searchParams);
    res.status = c => { res.statusCode = c; return res; };
    res.json = d => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(d)); };
    return require(file)(req, res);
  }
  const pub = path.join(__dirname, 'public');
  const f = path.join(pub, url.pathname === '/' ? 'index.html' : url.pathname);
  if (!f.startsWith(pub) || !fs.existsSync(f)) { res.statusCode = 404; return res.end('Not found'); }
  res.setHeader('Content-Type', types[path.extname(f)] || 'application/octet-stream');
  fs.createReadStream(f).pipe(res);
}).listen(3000, () => console.log('Running on http://localhost:3000'));
