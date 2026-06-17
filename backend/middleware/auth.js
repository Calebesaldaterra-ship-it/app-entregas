// ── middleware/auth.js ────────────────────────────────────────
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ erro: 'Token não informado' });
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET || 'segredo');
    next();
  } catch {
    res.status(401).json({ erro: 'Token inválido' });
  }
};
