const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

router.post('/registro', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ erro: 'Email já cadastrado' });
    const hash = await bcrypt.hash(senha, 10);
    const usuario = new Usuario({ nome, email, senha: hash });
    await usuario.save();
    const token = jwt.sign({ id: usuario._id, role: usuario.role }, process.env.JWT_SECRET || 'segredo', { expiresIn: '7d' });
    res.status(201).json({ token, usuario: { id: usuario._id, nome, email, role: usuario.role } });
  } catch (err) { res.status(400).json({ erro: err.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(401).json({ erro: 'Credenciais inválidas' });
    const ok = await bcrypt.compare(senha, usuario.senha);
    if (!ok) return res.status(401).json({ erro: 'Credenciais inválidas' });
    const token = jwt.sign({ id: usuario._id, role: usuario.role }, process.env.JWT_SECRET || 'segredo', { expiresIn: '7d' });
    res.json({ token, usuario: { id: usuario._id, nome: usuario.nome, email, role: usuario.role } });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

module.exports = router;