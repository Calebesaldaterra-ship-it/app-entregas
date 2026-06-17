import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

export function useSocket() {
  const socketRef = useRef(null);
  const [conectado, setConectado] = useState(false);
  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    socketRef.current.on('connect', () => setConectado(true));
    socketRef.current.on('disconnect', () => setConectado(false));
    return () => socketRef.current?.disconnect();
  }, []);
  return { socket: socketRef.current, conectado };
}

export function useRastreamento(pedidoId) {
  const { socket } = useSocket();
  const [localizacao, setLocalizacao] = useState(null);
  const [statusAtual, setStatusAtual] = useState(null);
  const [chegando, setChegando] = useState(false);
  useEffect(() => {
    if (!socket || !pedidoId) return;
    socket.emit('cliente:watch', { pedidoId });
    socket.on('rastreamento:atualizacao', ({ lat, lng }) => setLocalizacao({ lat, lng }));
    socket.on('pedido:statusAtualizado', ({ status }) => { setStatusAtual(status); if (status === 'chegando') setChegando(true); });
    socket.on('notificacao:chegando', () => setChegando(true));
    return () => { socket.off('rastreamento:atualizacao'); socket.off('pedido:statusAtualizado'); socket.off('notificacao:chegando'); };
  }, [socket, pedidoId]);
  return { localizacao, statusAtual, chegando };
}

export function useEntregador(entregadorId) {
  const { socket } = useSocket();
  function entrarNaPedido(pedidoId) { socket?.emit('entregador:join', { pedidoId }); }
  function enviarLocalizacao(pedidoId, lat, lng) {
    socket?.emit('entregador:localizacao', { pedidoId, lat, lng });
    fetch(`${SOCKET_URL}/api/entregadores/${entregadorId}/localizacao`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lat, lng, pedidoId }) });
  }
  function avisarChegando(pedidoId) { socket?.emit('entregador:chegando', { pedidoId }); }
  return { entrarNaPedido, enviarLocalizacao, avisarChegando };
}