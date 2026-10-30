# College Link Finder – Deploy on Vercel
1. Push this folder to GitHub, then Vercel > Add New > Project > import it (Framework: Other).
2. Vercel project > Storage > add a **Neon Postgres** database (connect it to the project). This sets DATABASE_URL.
3. Project > Settings > Environment Variables, add: JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD (see .env.example).
4. Deploy. Login as admin, open "Manage Faculty", create faculty logins. Tables are created automatically.
