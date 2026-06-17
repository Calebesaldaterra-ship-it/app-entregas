const router = require('express').Router();
const { Pedido } = require('../models');

router.get('/:codigo', async (req, res) => {
  try {
    const pedido = await Pedido.findOne({ linkRastreamento: { $regex: req.params.codigo, $options: 'i' } }).populate('entregador', 'nome localizacaoAtual');
    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });
    res.json({ numero: pedido.numero, status: pedido.status, cliente: pedido.cliente.nome, endereco: pedido.cliente.endereco, entregador: pedido.entregador?.nome || 'A definir', localizacao: pedido.entregador?.localizacaoAtual || null, valorTotal: pedido.valorTotal, formaPagamento: pedido.formaPagamento, statusPagamento: pedido.statusPagamento, pedidoId: pedido._id, notificacoes: pedido.notificacoes.slice(-3) });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

module.exports = router;