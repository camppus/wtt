import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import Logo from "../img/wtt.png";
import { 
  FaUser, FaUserCircle, FaHistory, FaChartLine, FaPlusCircle, FaMinusCircle, 
  FaExchangeAlt, FaCog, FaShieldAlt, FaWallet, FaTrophy, FaChartPie, FaCoins, 
  FaMoneyCheck, FaComments, FaGift, FaRocket, FaHome, FaBell, FaTimes, FaPaperPlane, FaBars
} from "react-icons/fa";

export default function MyAccount() {
  const navigate = useNavigate();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
const [profileOpen, setProfileOpen] = useState(false);
  const openFeedback = () => setFeedbackOpen(true);
  const closeFeedback = () => setFeedbackOpen(false);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    alert("Feedback enviado com sucesso! Entraremos em contato em breve.");
    setFeedbackOpen(false);
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-gray-100">
      <div className="grid md:grid-cols-[250px_1fr] gap-5 p-3 md:p-5">

        {/* Header */}
        <header className="md:col-span-2 flex justify-between items-center p-3 md:p-4 bg-[#16213e] rounded-lg shadow-lg mb-2 md:mb-5 animate-slideDown">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden text-xl"
              onClick={() => setMenuOpen(true)}
            >
              <FaBars />
            </button>

            <div className="flex items-center gap-2 text-2xl font-bold text-[#e94560]">
              <img src={Logo} alt="Logo" className="h-14 md:h-24 w-auto" />
            </div>
          </div>

          <div className="flex gap-2 md:gap-4">
            <button className="flex items-center gap-2 px-3 md:px-4 py-2 border border-[#e94560] rounded-full hover:bg-[#e94560] hover:text-white transition text-sm md:text-base">
              <FaBell /> <span className="hidden sm:inline">Notificações</span>
            </button>
            <button 
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-[#e94560] rounded-full hover:bg-[#ff2e4d] transition text-sm md:text-base"
              onClick={() => navigate("/")}
            >
              <FaHome /> <span className="hidden sm:inline">Início</span>
            </button>
          </div>
        </header>

        {/* Overlay mobile */}
        {menuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          bg-[#16213e] rounded-lg p-5 shadow-lg animate-slideLeft
          fixed md:static top-0 left-0 h-full md:h-auto w-64 z-50
          transform transition-transform duration-300
          ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}>
          
          <div className="flex justify-between items-center mb-4 md:hidden">
            <h2 className="flex items-center gap-2 text-lg">
              <FaUserCircle /> Conta
            </h2>
            <button onClick={() => setMenuOpen(false)}>
              <FaTimes />
            </button>
          </div>

          <h2 className="hidden md:flex items-center gap-2 text-lg mb-4 border-b border-[#0f3460] pb-2">
            <FaUserCircle /> Minha Conta
          </h2>

          <div className="mb-5">
            <div className="flex items-center gap-2 p-2 rounded hover:bg-[#0f3460] font-bold bg-[#0f3460] cursor-pointer" onClick={() => setProfileOpen(true)}>
              <FaUser /> Perfil
            </div>
            <div className="flex items-center gap-2 p-2 rounded hover:bg-[#0f3460] cursor-pointer" onClick={() => navigate("/historicoapostas")}>
              <FaHistory /> Histórico de Apostas
            </div>
            <div className="flex items-center gap-2 p-2 rounded hover:bg-[#0f3460] cursor-pointer" onClick={() => navigate("/estatisticas")}>
              <FaChartLine /> Estatísticas
            </div>
          </div>

          <div className="mb-5">
            <h3 className="text-gray-400 text-sm uppercase mb-2">Transações</h3>
            <div className="flex items-center gap-2 p-2 rounded hover:bg-[#0f3460] cursor-pointer" onClick={() => navigate("/deposito")}>
              <FaPlusCircle /> Depósito
            </div>
            <div className="flex items-center gap-2 p-2 rounded hover:bg-[#0f3460] cursor-pointer" onClick={() => navigate("/saque")}>
              <FaMinusCircle /> Saque
            </div>
            <div className="flex items-center gap-2 p-2 rounded hover:bg-[#0f3460] cursor-pointer" onClick={() => navigate("/transferencias")}>
              <FaExchangeAlt /> Transferências
            </div>
          </div>

          <div>
            <h3 className="text-gray-400 text-sm uppercase mb-2">Preferências</h3>
            <div className="flex items-center gap-2 p-2 rounded hover:bg-[#0f3460] cursor-pointer" onClick={() => navigate("/configuracoes")}>
              <FaCog /> Configurações
            </div>
            <div className="flex items-center gap-2 p-2 rounded hover:bg-[#0f3460] cursor-pointer" onClick={() => navigate("/privacidade")}>
              <FaShieldAlt /> Privacidade
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex flex-col gap-5">
          <div className="bg-[#16213e] rounded-lg p-4 md:p-6 shadow-lg animate-fadeIn">

            {/* Perfil */}
            <div className="flex md:flex-row flex-col items-center gap-5 mb-8 border-b border-[#0f3460] pb-5">
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-[#0f3460] to-[#e94560] flex items-center justify-center text-white text-4xl">
                <FaUser />
                <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-[#16213e] rounded-full"></span>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-xl md:text-2xl font-semibold">Utilizador</h2>
                <p className="text-gray-400 text-sm">Membro desde: Jan 2025</p>
                <p className="text-sm">Nível: <span className="text-[#e94560]">Ouro</span></p>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
              <div className="bg-[#1e2a47] rounded-lg p-6 text-center h-40 flex flex-col justify-center">
                <FaWallet className="text-[#e94560] text-4xl mb-3 mx-auto" />
                <div className="text-2xl font-bold text-green-500">kz 1.245,80</div>
                <div className="text-gray-400 text-sm">Saldo Disponível</div>
              </div>

              <div className="bg-[#1e2a47] rounded-lg p-6 text-center h-40 flex flex-col justify-center">
                <FaTrophy className="text-[#e94560] text-4xl mb-3 mx-auto" />
                <div className="text-2xl font-bold">27</div>
                <div className="text-gray-400 text-sm">Apostas Vencedoras</div>
              </div>

              <div className="bg-[#1e2a47] rounded-lg p-6 text-center h-40 flex flex-col justify-center">
                <FaChartPie className="text-[#e94560] text-4xl mb-3 mx-auto" />
                <div className="text-2xl font-bold">42%</div>
                <div className="text-gray-400 text-sm">Taxa de Acerto</div>
              </div>

              <div className="bg-[#1e2a47] rounded-lg p-6 text-center h-40 flex flex-col justify-center">
                <FaCoins className="text-[#e94560] text-4xl mb-3 mx-auto" />
                <div className="text-2xl font-bold">kz 3.720,50</div>
                <div className="text-gray-400 text-sm">Ganhos Totais</div>
              </div>
            </div>

            {/* Ações */}
            <h2 className="flex items-center gap-2 text-lg mb-4"><FaRocket /> Ações Rápidas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">

              <div className="bg-[#1e2a47] p-8 text-center rounded-lg cursor-pointer hover:bg-[#0f3460]" onClick={() => navigate("/saque")}>
                <FaMoneyCheck className="text-[#e94560] text-4xl mb-3 mx-auto" />
                <h3 className="mb-2 font-semibold text-lg">Solicitar Saque</h3>
                <p className="text-gray-400 text-sm">Transfira seu saldo</p>
              </div>

              <div className="bg-[#1e2a47] p-8 text-center rounded-lg cursor-pointer hover:bg-[#0f3460]" onClick={openFeedback}>
                <FaComments className="text-[#e94560] text-4xl mb-3 mx-auto" />
                <h3 className="mb-2 font-semibold text-lg">Feedback</h3>
                <p className="text-gray-400 text-sm">Envie uma mensagem</p>
              </div>

             

      

            </div>
          </div>
        </main>
      </div>

         {/* Modal Perfil */}
{profileOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6"
    onClick={(e) => {
      if (e.target === e.currentTarget) {
        setProfileOpen(false);
      }
    }}
  >
    <div
      className="
        relative w-full max-w-lg
        max-h-[92vh] overflow-y-auto
        rounded-2xl
        border border-white/10
        bg-[#16213e]
        shadow-2xl
        animate-[fadeIn_0.2s_ease-out]
      "
    >

      {/* Cabeçalho */}
      <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-[#0f3460] to-[#16213e] p-5 sm:p-6">

        {/* Decoração */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#e94560]/20 blur-2xl" />
        <div className="absolute -left-10 -bottom-10 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl" />

        <button
          type="button"
          onClick={() => setProfileOpen(false)}
          className="
            absolute right-4 top-4
            flex h-9 w-9 items-center justify-center
            rounded-full
            bg-white/10
            text-gray-300
            transition
            hover:bg-[#e94560]
            hover:text-white
          "
          aria-label="Fechar"
        >
          <FaTimes />
        </button>

        <div className="relative flex items-center gap-4">

          {/* Avatar */}
          <div
            className="
              flex h-16 w-16 shrink-0
              items-center justify-center
              rounded-full
              bg-gradient-to-br from-[#e94560] to-[#ff6b81]
              shadow-lg
            "
          >
            <FaUserCircle className="text-4xl text-white" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Minha conta
            </p>

            <h2 className="truncate text-xl font-bold text-white sm:text-2xl">
              Perfil de Usuário
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Gerencie os seus dados pessoais
            </p>
          </div>

        </div>
      </div>

      {/* Conteúdo */}
      <div className="space-y-6 p-4 sm:p-6">

        {/* Informações da conta */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <FaUserCircle className="text-[#e94560]" />
            <h3 className="font-semibold text-white">
              Informações da conta
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            {/* Nome */}
            <div className="rounded-xl border border-white/5 bg-[#1e2a47] p-4">
              <p className="mb-1 text-xs text-gray-400">
                Nome
              </p>

              <p className="truncate font-medium text-white">
                Utilizador
              </p>
            </div>

            {/* Telefone */}
            <div className="rounded-xl border border-white/5 bg-[#1e2a47] p-4">
              <p className="mb-1 text-xs text-gray-400">
                Telefone
              </p>

              <p className="truncate font-medium text-white">
                923 000 000
              </p>
            </div>

          </div>

          {/* Saldo */}
          <div className="mt-3 rounded-xl border border-green-500/10 bg-gradient-to-r from-green-500/10 to-transparent p-4">
            <div className="flex items-center justify-between gap-3">

              <div>
                <p className="text-xs text-gray-400">
                  Saldo disponível
                </p>

                <p className="mt-1 text-xl font-bold text-green-400 sm:text-2xl">
                  1.245,80 Kz
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-500/10">
                <FaWallet className="text-lg text-green-400" />
              </div>

            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="h-px bg-white/10" />

        {/* Atualizar dados */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">
              Atualizar os dados
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Altere as informações da sua conta abaixo.
            </p>
          </div>

          <div className="space-y-4">

            {/* Palavra-passe */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Palavra-passe
              </label>

              <input
                type="password"
                placeholder="Digite a nova palavra-passe"
                className="
                  w-full rounded-xl
                  border border-white/10
                  bg-[#1e2a47]
                  px-4 py-3
                  text-sm text-white
                  placeholder-gray-500
                  outline-none
                  transition
                  focus:border-[#e94560]
                  focus:ring-2
                  focus:ring-[#e94560]/20
                "
              />
            </div>

            {/* Novo nome */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Novo nome
              </label>

              <input
                type="text"
                placeholder="Digite o novo nome"
                className="
                  w-full rounded-xl
                  border border-white/10
                  bg-[#1e2a47]
                  px-4 py-3
                  text-sm text-white
                  placeholder-gray-500
                  outline-none
                  transition
                  focus:border-[#e94560]
                  focus:ring-2
                  focus:ring-[#e94560]/20
                "
              />
            </div>

            {/* Novo telefone */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Número de telefone
              </label>

              <input
                type="tel"
                placeholder="Digite o novo número"
                className="
                  w-full rounded-xl
                  border border-white/10
                  bg-[#1e2a47]
                  px-4 py-3
                  text-sm text-white
                  placeholder-gray-500
                  outline-none
                  transition
                  focus:border-[#e94560]
                  focus:ring-2
                  focus:ring-[#e94560]/20
                "
              />
            </div>

          </div>
        </div>

        {/* Botões */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() => setProfileOpen(false)}
            className="
              w-full rounded-xl
              border border-white/10
              bg-white/5
              px-5 py-3
              text-sm font-semibold text-gray-300
              transition
              hover:bg-white/10
              hover:text-white
              sm:w-auto
            "
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => {
              alert("Dados atualizados com sucesso!");
              setProfileOpen(false);
            }}
            className="
              w-full rounded-xl
              bg-gradient-to-r
              from-[#e94560]
              to-[#ff5c75]
              px-6 py-3
              text-sm font-bold text-white
              shadow-lg shadow-[#e94560]/20
              transition
              hover:scale-[1.02]
              hover:shadow-[#e94560]/30
              active:scale-[0.98]
              sm:w-auto
            "
          >
            Atualizar dados
          </button>

        </div>

      </div>
    </div>
  </div>
)}
    </div>
  );
}