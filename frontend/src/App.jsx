import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pedidos from './pages/Pedidos';
import Entregadores from './pages/Entregadores';
import Rastreamento from './pages/Rastreamento';
import Pagamentos from './pages/Pagamentos';
import RastreioCliente from './pages/RastreioCliente';
import EntregadorMobile from './pages/EntregadorMobile';
import Layout from './components/Layout';

function Privada({ children }) {
  const { usuario, carregando } = useAuth();
  if (carregando) return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: 14, color: '#888'}}>Carregando...</div>;
  return usuario ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/rastreio/:codigo" element={<RastreioCliente />} />
          <Route path="/entregador/:id" element={<EntregadorMobile />} />
          <Route path="/" element={<Privada><Layout /></Privada>}>
            <Route index element={<Dashboard />} />
            <Route path="pedidos" element={<Pedidos />} />
            <Route path="entregadores" element={<Entregadores />} />
            <Route path="rastreamento" element={<Rastreamento />} />
            <Route path="pagamentos" element={<Pagamentos />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}