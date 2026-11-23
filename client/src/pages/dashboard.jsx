import React, { useState } from "react";
import SidebarMenu from "../component/navbar/sidebarmenu";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-[#f0f0f0] lg:grid lg:grid-cols-[250px_1fr]">
      
      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-screen w-[250px] bg-[#16213e] shadow-lg z-50 transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="px-5 pb-5 border-b border-[#0f3460] mb-5">
          <div className="text-[22px] font-bold text-[#e94560] flex items-center gap-2">
            <i className="fas fa-dice"></i>
            <span>WTT Admin</span>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0f3460] to-[#e94560] flex items-center justify-center">
              <i className="fas fa-user-shield"></i>
            </div>

            <div>
              <div className="text-sm font-medium">Utilizador 1</div>
              <div className="text-xs text-gray-400">Administrador</div>
            </div>
          </div>
        </div>

        <SidebarMenu />
      </aside>

      {/* Conteúdo */}
      <main className="p-4 sm:p-5 w-full">
        
        {/* Header */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center justify-between p-4 bg-[#16213e] rounded-lg mb-5 shadow-lg">
          
          <div className="flex items-center gap-2">
            <button
              className="lg:hidden bg-[#e94560] text-white text-lg px-3 py-2 rounded-md"
              onClick={toggleMenu}
            >
              <i className="fas fa-bars"></i>
            </button>

            <i className="fas fa-home"></i>
            <h1 className="text-lg sm:text-xl font-semibold">
              Painel Administrativo
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-2 border border-[#e94560] text-[#e94560] px-3 sm:px-4 py-2 rounded-full hover:bg-[#e94560] hover:text-white transition">
              <i className="fas fa-bell"></i>
              Notificações
            </button>

            <button className="flex items-center gap-2 bg-[#e94560] px-3 sm:px-4 py-2 rounded-full font-bold hover:-translate-y-1 transition">
              <i className="fas fa-sync"></i>
              Atualizar
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          
          <div className="bg-[#16213e] rounded-lg p-4 sm:p-5 shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="text-xl sm:text-2xl font-bold">2,548</div>
                <div className="text-sm text-gray-400">
                  Usuários Cadastrados
                </div>
              </div>

              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-[#4fc3f733] text-[#4fc3f7]">
                <i className="fas fa-users"></i>
              </div>
            </div>

            <div className="text-xs text-green-500 flex items-center gap-1">
              <i className="fas fa-arrow-up"></i>
              124 novos hoje
            </div>
          </div>

          <div className="bg-[#16213e] rounded-lg p-4 sm:p-5 shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="text-xl sm:text-2xl font-bold">kz 86,540</div>
                <div className="text-sm text-gray-400">
                  Depósitos Pendentes
                </div>
              </div>

              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-[#4caf5033] text-[#4caf50]">
                <i className="fas fa-money-check"></i>
              </div>
            </div>
          </div>

          <div className="bg-[#16213e] rounded-lg p-4 sm:p-5 shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="text-xl sm:text-2xl font-bold">kz 42,380</div>
                <div className="text-sm text-gray-400">
                  Saques Pendentes
                </div>
              </div>

              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-[#ff980033] text-[#ff9800]">
                <i className="fas fa-hand-holding-usd"></i>
              </div>
            </div>
          </div>

          <div className="bg-[#16213e] rounded-lg p-4 sm:p-5 shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="text-xl sm:text-2xl font-bold">12,874</div>
                <div className="text-sm text-gray-400">
                  Apostas Hoje
                </div>
              </div>

              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-[#e9456033] text-[#e94560]">
                <i className="fas fa-ticket-alt"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-[#16213e] rounded-lg p-4 sm:p-6 shadow-lg overflow-hidden">
          <div className="flex justify-between items-center mb-5">
            <h2 className="flex items-center gap-2 text-sm sm:text-base">
              <i className="fas fa-money-check text-[#e94560]"></i>
              Depósitos Pendentes
            </h2>

            <a className="text-[#e94560] text-sm flex items-center gap-1">
              Ver todos
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="text-gray-400 text-sm">
                <tr>
                  <th className="p-3 text-left">Usuário</th>
                  <th className="p-3 text-left">Data</th>
                  <th className="p-3 text-left">Valor</th>
                  <th className="p-3 text-left">Método</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Ações</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-[#0f3460] hover:bg-[#1e2a47]">
                  <td className="p-3 flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0f3460] to-[#e94560] flex items-center justify-center text-sm">
                      MJ
                    </div>
                    Maria João
                  </td>

                  <td className="p-3">25/10/2023 14:32</td>
                  <td className="p-3">kz 250,00</td>
                  <td className="p-3">Transferência</td>

                  <td className="p-3">
                    <span className="px-3 py-1 rounded-full text-xs bg-[#ff980033] text-[#ff9800]">
                      Pendente
                    </span>
                  </td>

                  <td className="p-3">
                    <button className="mr-2 px-3 py-1 text-xs rounded bg-[#4caf5033] text-[#4caf50]">
                      Aprovar
                    </button>

                    <button className="px-3 py-1 text-xs rounded bg-[#e9456033] text-[#e94560]">
                      Recusar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}