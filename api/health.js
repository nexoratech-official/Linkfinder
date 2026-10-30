module.exports = (req, res) => res.json({
  DATABASE_URL: !!process.env.DATABASE_URL,
  JWT_SECRET: !!process.env.JWT_SECRET,
  ADMIN_USERNAME: !!process.env.ADMIN_USERNAME,
  ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
  usernameLength: (process.env.ADMIN_USERNAME || '').length,
  passwordLength: (process.env.ADMIN_PASSWORD || '').length
});