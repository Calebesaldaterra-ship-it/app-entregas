require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] }
});

app.use(cors());
app.use(express.json());
app.set('io', io);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/entregas')
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro MongoDB:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/entregadores', require('./routes/entregadores'));
app.use('/api/pagamentos', require('./routes/pagamentos'));
app.use('/api/rastreamento', require('./routes/rastreamento'));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

io.on('connection', (socket) => {
  socket.on('entregador:join', ({ pedidoId }) => socket.join(`pedido:${pedidoId}`));
  socket.on('entregador:localizacao', ({ pedidoId, lat, lng }) => io.to(`pedido:${pedidoId}`).emit('rastreamento:atualizacao', { lat, lng, pedidoId }));
  socket.on('entregador:chegando', ({ pedidoId }) => io.to(`pedido:${pedidoId}`).emit('notificacao:chegando', { mensagem: 'Seu entregador está chegando!', pedidoId }));
  socket.on('cliente:watch', ({ pedidoId }) => socket.join(`pedido:${pedidoId}`));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));