import React, { useState } from "react"; 
import Logo from "../img/wtt.png";
import { 
  FaUser, FaHome, FaMoneyBillWave, FaWallet, FaTrophy, FaSearch, 
  FaDownload, FaLock, FaFileInvoiceDollar, FaClock, FaCheckCircle 
} from "react-icons/fa";

const withdrawalsData = [
  { date: "20/08/2023 14:30", user: "João Silva", initials: "JS", value: 850, method: "PIX", status: "Concluído" },
  { date: "19/08/2023 10:15", user: "Maria Santos", initials: "MS", value: 1250, method: "TED", status: "Processando" },
  { date: "18/08/2023 16:45", user: "Pedro Costa", initials: "PC", value: 500, method: "PIX", status: "Concluído" },
  { date: "17/08/2023 09:20", user: "Ana Oliveira", initials: "AO", value: 2000, method: "Criptomoeda", status: "Falhou" },
  { date: "16/08/2023 14:30", user: "Carlos Souza", initials: "CS", value: 350, method: "PIX", status: "Pendente" },
  { date: "15/08/2023 11:20", user: "Ricardo Mendes", initials: "RM", value: 1500, method: "TED", status: "Concluído" },
  { date: "14/08/2023 16:40", user: "Fernanda Alves", initials: "FA", value: 750, method: "PIX", status: "Concluído" },
];

const statusStyles = {
  Concluído: "bg-green-100 text-[#4caf50]",
  Processando: "bg-blue-100 text-[#2196f3]",
  Pendente: "bg-yellow-100 text-[#ffc107]",
  Falhou: "bg-red-100 text-[#ff5252]",
};

export default function Historicosaque() {
  const [activeTab, setActiveTab] = useState("Saques");
  const [statusFilter, setStatusFilter] = useState("Todos os status");
  const [methodFilter, setMethodFilter] = useState("Todos os métodos");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = withdrawalsData.filter((w) => {
    const statusMatch = statusFilter === "Todos os status" || w.status === statusFilter;
    const methodMatch = methodFilter === "Todos os métodos" || w.method === methodFilter;
    const searchMatch = w.user.toLowerCase().includes(search.toLowerCase());
    return statusMatch && methodMatch && searchMatch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a2e] text-[#f0f0f0]">
      
      {/* Header */}
      <header className="bg-[#16213e] shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
          <img src={Logo} alt="Logo" className="h-16 sm:h-24 w-auto" />

          <div className="flex items-center gap-4">
            <div className="bg-[#0f3460] px-4 py-2 rounded-full font-bold text-sm sm:text-base">
              Saldo: kz 2.450,00
            </div>
            <button className="bg-[#0f3460] w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#e94560] transition">
              <FaUser />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="max-w-6xl mx-auto flex-1 p-3 sm:p-4 w-full">

        {/* Tabs */}
        <div className="flex overflow-x-auto bg-[#16213e] rounded-lg mb-6">
          {["Início", "Depósitos", "Saques", "Apostas"].map((tab) => {
            const icons = { Início: <FaHome />, Depósitos: <FaMoneyBillWave />, Saques: <FaWallet />, Apostas: <FaTrophy /> };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`min-w-[120px] sm:min-w-[140px] flex-1 text-center py-3 transition border-b-4 text-sm sm:text-base ${
                  activeTab === tab
                    ? "border-[#e94560] text-[#e94560]"
                    : "border-transparent hover:bg-[#0f3460]"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  {icons[tab]} {tab}
                </span>
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-[#1e2a47] p-6 rounded-lg flex flex-col items-center shadow">
            <FaFileInvoiceDollar className="text-[#e94560] text-3xl mb-3" />
            <h3 className="text-xl sm:text-2xl mb-1">kz 8.240,00</h3>
            <p className="text-gray-400 text-sm">Total Sacado (30 dias)</p>
          </div>

          <div className="bg-[#1e2a47] p-6 rounded-lg flex flex-col items-center shadow">
            <FaClock className="text-[#e94560] text-3xl mb-3" />
            <h3 className="text-xl sm:text-2xl mb-1">3</h3>
            <p className="text-gray-400 text-sm">Saques Pendentes</p>
          </div>

          <div className="bg-[#1e2a47] p-6 rounded-lg flex flex-col items-center shadow">
            <FaCheckCircle className="text-[#e94560] text-3xl mb-3" />
            <h3 className="text-xl sm:text-2xl mb-1">27</h3>
            <p className="text-gray-400 text-sm">Saques Realizados (30 dias)</p>
          </div>
        </div>

        {/* Withdrawals */}
        <div className="bg-[#1e2a47] p-4 sm:p-6 rounded-lg shadow">
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
            <h2 className="text-lg sm:text-xl text-[#e94560] font-semibold">
              Histórico de Saques
            </h2>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full lg:w-auto">
              
              <select
                className="bg-[#0f3460] px-3 py-2 rounded w-full sm:w-auto text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>Todos os status</option>
                <option>Concluído</option>
                <option>Processando</option>
                <option>Pendente</option>
                <option>Falhou</option>
              </select>

              <select
                className="bg-[#0f3460] px-3 py-2 rounded w-full sm:w-auto text-sm"
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
              >
                <option>Todos os métodos</option>
                <option>PIX</option>
                <option>TED</option>
                <option>Criptomoeda</option>
              </select>

              <div className="flex bg-[#0f3460] rounded overflow-hidden w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Buscar saque..."
                  className="px-3 py-2 bg-transparent outline-none flex-1 min-w-[150px] text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="px-3 bg-[#e94560] hover:bg-[#d32f44] transition">
                  <FaSearch />
                </button>
              </div>

            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[650px]">
              <thead>
                <tr>
                  {["Data", "Usuário", "Valor", "Método", "Status"].map((th) => (
                    <th
                      key={th}
                      className="text-left px-4 py-2 cursor-pointer text-[#e94560] font-semibold hover:text-[#f0f0f0] text-sm"
                    >
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredData.map((w, idx) => (
                  <tr key={idx} className="hover:bg-[#0f346060]">
                    <td className="px-4 py-2 text-sm whitespace-nowrap">{w.date}</td>

                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-[#0f3460] flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {w.initials}
                        </div>
                        <span className="whitespace-nowrap text-sm">{w.user}</span>
                      </div>
                    </td>

                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      kz {w.value.toLocaleString()}
                    </td>

                    <td className="px-4 py-2 text-sm whitespace-nowrap">{w.method}</td>

                    <td className="px-4 py-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${statusStyles[w.status]}`}
                      >
                        {w.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`w-9 h-9 rounded text-sm ${
                  currentPage === page ? "bg-[#e94560]" : "bg-[#0f3460]"
                } transition`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Export */}
          <button className="flex items-center justify-center gap-2 mt-4 w-full sm:w-auto bg-[#4caf50] px-4 py-2 rounded hover:bg-[#3d8b40] transition text-sm">
            <FaDownload /> Exportar Relatório
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#16213e] mt-auto p-4 text-center text-sm sm:text-base">
        <p>WTT &copy; 2023 - Todos os direitos reservados. Jogue com responsabilidade.</p>
        <div className="flex justify-center items-center gap-2 mt-2 text-gray-400 text-sm">
          <FaLock /> <span>Transações seguras e criptografadas</span>
        </div>
      </footer>
    </div>
  );
}