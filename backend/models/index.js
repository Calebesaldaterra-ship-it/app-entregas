const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  role: { type: String, enum: ['admin', 'operador'], default: 'operador' }
}, { timestamps: true });

const entregadorSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  telefone: String,
  ativo: { type: Boolean, default: true },
  localizacaoAtual: { lat: Number, lng: Number, atualizadoEm: Date },
  pedidosHoje: { type: Number, default: 0 },
  kmPercorrido: { type: Number, default: 0 }
}, { timestamps: true });

const pedidoSchema = new mongoose.Schema({
  numero: { type: Number, unique: true },
  cliente: { nome: { type: String, required: true }, telefone: String, endereco: { type: String, required: true }, lat: Number, lng: Number },
  entregador: { type: mongoose.Schema.Types.ObjectId, ref: 'Entregador' },
  itens: [{ descricao: String, quantidade: Number, valor: Number }],
  valorTotal: { type: Number, required: true },
  taxaEntrega: { type: Number, default: 5 },
  formaPagamento: { type: String, enum: ['pix', 'cartao', 'dinheiro'], required: true },
  statusPagamento: { type: String, enum: ['pendente', 'pago', 'falhou'], default: 'pendente' },
  status: { type: String, enum: ['aguardando', 'despachado', 'a_caminho', 'chegando', 'entregue', 'cancelado'], default: 'aguardando' },
  linkRastreamento: String,
  ordemEntrega: { type: Number, default: 0 },
  notificacoes: [{ mensagem: String, tipo: { type: String, enum: ['info', 'sucesso', 'aviso',] }, enviadoEm: { type: Date, default: Date.now } }],
  entregueEm: Date
}, { timestamps: true });

pedidoSchema.pre('save', async function(next) {
  if (this.isNew) {
    const ultimo = await this.constructor.findOne({}, {}, { sort: { numero: -1 } });
    this.numero = ultimo ? ultimo.numero + 1 : 2001;
    this.linkRastreamento = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/rastreio/${this.numero}-${this.cliente.nome.split(' ')[0].toLowerCase()}`;
  }
  next();
});

module.exports = {
  Usuario: mongoose.model('Usuario', usuarioSchema),
  Entregador: mongoose.model('Entregador', entregadorSchema),
  Pedido: mongoose.model('Pedido', pedidoSchema)
};