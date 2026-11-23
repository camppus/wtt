
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaDice,
  FaUser,
  FaHome,
  FaWallet,
  FaHistory,
  FaPlusCircle,
  FaMinusCircle,
  FaMoneyCheckAlt,
  FaUniversity,
  FaFileInvoice,
  FaPaperPlane,
  FaShieldAlt,
  FaSpinner,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function SaquePage() {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    setTimeout(() => {
      alert(
        "Solicitação de saque enviada com sucesso! O valor será transferido em até 3 dias úteis."
      );

      setAmount("");
      setBankName("");
      setAccount("");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-[#f0f0f0]">

      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-[#16213e] rounded-lg shadow-md mb-5 animate-slideDown">

        <div className="flex items-center gap-2 text-2xl font-bold text-[#e94560]">
          
          <span>WTT</span>
        </div>

        {/* Botão hamburguer mobile */}
        <button
          className="lg:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Botões desktop */}
        <div className="hidden lg:flex gap-4">

          <button
            onClick={() => navigate("/contas")}
            className="flex items-center gap-2 px-4 py-2 border border-[#e94560] rounded-full text-[#e94560] hover:bg-[#e94560] hover:text-white transition"
          >
            <FaUser />
            Perfil
          </button>

          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#e94560] hover:bg-[#ff2e4d] transition"
          >
            <FaHome />
            Voltar ao Início
          </button>

        </div>
      </header>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5 px-4">

        {/* Sidebar */}
        <aside
          className={`bg-[#16213e] p-5 rounded-lg shadow-md sticky top-5 animate-slideLeft
          ${menuOpen ? "block" : "hidden"} lg:block`}
        >

          <h2 className="flex items-center gap-2 mb-4 pb-2 border-b border-[#0f3460] text-xl">
            <FaWallet />
            Minha Conta
          </h2>

          {/* Navegação */}
          <div className="mb-6">

            <div
              onClick={() => navigate("/home")}
              className="flex items-center gap-2 p-2 rounded hover:bg-[#0f3460] cursor-pointer"
            >
              <FaHome />
              Painel Principal
            </div>

            <div
              onClick={() => navigate("/historicoapostas")}
              className="flex items-center gap-2 p-2 rounded hover:bg-[#0f3460] cursor-pointer"
            >
              <FaHistory />
              Histórico de Apostas
            </div>

          </div>

          {/* Transações */}
          <div className="mb-6">

            <h3 className="text-gray-400 uppercase text-sm mb-2">
              Transações
            </h3>

            <div
              onClick={() => navigate("/deposito")}
              className="flex items-center gap-2 p-2 rounded hover:bg-[#0f3460] cursor-pointer"
            >
              <FaPlusCircle />
              Depósito
            </div>

            {/* Saque ativo */}
            <div
              className="flex items-center gap-2 p-2 rounded bg-[#0f3460] font-bold cursor-pointer"
            >
              <FaMinusCircle />
              Saque
            </div>

          </div>

          {/* Botões visíveis no mobile */}
          <div className="flex flex-col gap-2 mt-4 lg:hidden">

            <button
              onClick={() => navigate("/perfil")}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-[#e94560] rounded-full text-[#e94560] hover:bg-[#e94560] hover:text-white transition"
            >
              <FaUser />
              Perfil
            </button>

            <button
              onClick={() => navigate("/home")}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#e94560] hover:bg-[#ff2e4d] transition"
            >
              <FaHome />
              Voltar ao Início
            </button>

          </div>

        </aside>

        {/* Main Content */}
        <main className="flex flex-col gap-5">

          <div className="bg-[#16213e] p-6 rounded-lg shadow-md animate-fadeIn">

            <h2 className="flex items-center gap-2 text-xl mb-4">
              <FaMoneyCheckAlt />
              Solicitar Saque
            </h2>

            {/* Saldo */}
            <div className="bg-[#1e2a47] rounded-lg p-5 mb-6 text-center">

              <p>Saldo Disponível para Saque</p>

              <div className="text-[#4caf50] font-bold text-3xl my-2">
                Kz 1.245,80
              </div>

              <p>
                O valor será transferido em até 3 dias úteis
              </p>

            </div>

            {/* Formulário */}
            <form
              onSubmit={handleSubmit}
              className="grid lg:grid-cols-2 gap-5"
            >

              {/* Valor */}
              <div className="lg:col-span-2">

                <label className="block mb-2 font-medium">
                  Valor do Saque (kz)
                </label>

                <input
                  type="number"
                  min="10"
                  step="0.01"
                  required
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#0f3460] bg-[#1e2a47] focus:outline-none focus:ring-2 focus:ring-[#e94560] transition"
                />

                <p className="text-gray-400 text-sm mt-1">
                  Valor mínimo: Kz 10,00
                </p>

              </div>

              {/* Banco */}
              <div>

                <label className="block mb-2 font-medium">
                  Banco
                </label>

                <div className="relative">

                  <FaUniversity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    required
                    placeholder="Nome do Banco"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#0f3460] bg-[#1e2a47] focus:outline-none focus:ring-2 focus:ring-[#e94560] transition"
                  />

                </div>

              </div>

              {/* IBAN */}
              <div>

                <label className="block mb-2 font-medium">
                  IBAN
                </label>

                <div className="relative">

                  <FaFileInvoice className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    required
                    placeholder="Número da Conta / IBAN"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#0f3460] bg-[#1e2a47] focus:outline-none focus:ring-2 focus:ring-[#e94560] transition"
                  />

                </div>

              </div>

              {/* Botão */}
              <div className="lg:col-span-2 text-center mt-5 pt-5 border-t border-[#0f3460]">

                <button
                  type="submit"
                  disabled={loading}
                  className="mx-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#e94560] hover:bg-[#ff2e4d] transition text-white text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >

                  {loading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaPaperPlane />
                  )}

                  {loading
                    ? "Processando..."
                    : "Solicitar Saque"}

                </button>

                <div className="flex items-center justify-center gap-2 mt-3 text-gray-400 text-sm">
                  <FaShieldAlt />
                  Todas as transações são criptografadas e seguras
                </div>

              </div>

            </form>

          </div>

        </main>

      </div>

      {/* Animações */}
      <style>{`

        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }

          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.5s ease;
        }

        @keyframes slideLeft {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }

          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slideLeft {
          animation: slideLeft 0.5s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.7s ease;
        }

      `}</style>

    </div>
  );
}
