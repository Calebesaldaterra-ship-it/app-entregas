const router = require('express').Router();
const { Entregador, Pedido } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try { res.json(await Entregador.find({ ativo: true })); } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try { const ent = new Entregador(req.body); await ent.save(); res.status(201).json(ent); } catch (err) { res.status(400).json({ erro: err.message }); }
});

router.patch('/:id/localizacao', async (req, res) => {
  try {
    const { lat, lng, pedidoId } = req.body;
    await Entregador.findByIdAndUpdate(req.params.id, { localizacaoAtual: { lat, lng, atualizadoEm: new Date() } });
    if (pedidoId) req.app.get('io').to(`pedido:${pedidoId}`).emit('rastreamento:atualizacao', { lat, lng });
    res.json({ ok: true });
  } catch (err) { res.status(400).json({ erro: err.message }); }
});

router.get('/:id/pedidos', auth, async (req, res) => {
  try { res.json(await Pedido.find({ entregador: req.params.id, status: { $nin: ['entregue', 'cancelado'] } }).sort({ ordemEntrega: 1 })); } catch (err) { res.status(500).json({ erro: err.message }); }
});

module.exports = router;