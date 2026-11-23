
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import Autenticacao from "./pages/Autenticacao";
import Recuperacao from "./pages/Recuperacao";

import Contas from "./pages/contas";
import Dashboard from "./pages/dashboard";
import Usuarios from "./pages/usuarios";
import HistoricoSaque from "./pages/Historicosaque";
import Configuracoes from "./pages/configuracoes";
import Deposito from "./pages/Deposito";
import Apostas from "./pages/apostas";
import HistoricoApostas from "./pages/historicoapostas";
import Saque from "./pages/saque";
import Home from "./pages/Home";

import "@fortawesome/fontawesome-free/css/all.min.css";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* Página inicial: Cadastro */}
        <Route path="/" element={<Cadastro />} />

        {/* Autenticação do código do cadastro */}
        <Route path="/autenticacao" element={<Autenticacao />} />

        {/* Home */}
        <Route path="/home" element={<Home />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Recuperação */}
        <Route path="/recuperacao" element={<Recuperacao />} />

        {/* Demais páginas */}
        <Route path="/contas" element={<Contas />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/historicosaque" element={<HistoricoSaque />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/deposito" element={<Deposito />} />
        <Route path="/apostas" element={<Apostas />} />
        <Route path="/historicoapostas" element={<HistoricoApostas />} />
        <Route path="/saque" element={<Saque />} />

        {/* Redirecionamento */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

