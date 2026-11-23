import React, { useState } from "react";

export default function HistoricoAposta() {
  const [status, setStatus] = useState("aberto");
  const [filter, setFilter] = useState("24h");

  const renderTexto = () => {
    if (filter === "intervalo") {
      return `Mostrando apostas ${status} por intervalo de datas`;
    }

    return `Mostrando apostas ${status} - ${
      filter === "24h" ? "Últimas 24 Horas" : "Últimas 48 Horas"
    }`;
  };

  return (
    <div className="min-h-screen bg-[#0f1629] text-white flex flex-col items-center">
      {/* Header fixo no topo */}
      <header className="w-full bg-[#111a33] text-[#e94560] font-bold text-xl md:text-2xl text-center py-4">
        HISTÓRICO DE APOSTA
      </header>

      {/* Container centralizado */}
      <div className="bg-[#182038] w-[95%] max-w-xl mt-16 p-6 md:p-8 rounded-xl shadow-lg">
        {/* Botões de status */}
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={() => setStatus("aberto")}
            className={`flex-1 min-w-[120px] py-2 rounded-lg font-semibold transition-colors ${
              status === "aberto"
                ? "bg-[#e94560] text-white"
                : "bg-[#16213e] text-white hover:bg-[#e94560]"
            }`}
          >
            ABERTO
          </button>

          <button
            onClick={() => setStatus("fechado")}
            className={`flex-1 min-w-[120px] py-2 rounded-lg font-semibold transition-colors ${
              status === "fechado"
                ? "bg-[#e94560] text-white"
                : "bg-[#16213e] text-white hover:bg-[#e94560]"
            }`}
          >
            FECHADO
          </button>
        </div>

        {/* Filtros de tempo */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setFilter("24h")}
            className={`flex-1 min-w-[100px] py-2 rounded-lg font-medium transition-colors ${
              filter === "24h"
                ? "bg-[#e94560] text-white"
                : "bg-[#16213e] text-white hover:bg-[#e94560]"
            }`}
          >
            Últimas 24 Horas
          </button>

          <button
            onClick={() => setFilter("48h")}
            className={`flex-1 min-w-[100px] py-2 rounded-lg font-medium transition-colors ${
              filter === "48h"
                ? "bg-[#e94560] text-white"
                : "bg-[#16213e] text-white hover:bg-[#e94560]"
            }`}
          >
            Últimas 48 h
          </button>

          <button
            onClick={() => setFilter("intervalo")}
            className={`flex-1 min-w-[100px] py-2 rounded-lg font-medium transition-colors ${
              filter === "intervalo"
                ? "bg-[#e94560] text-white"
                : "bg-[#16213e] text-white hover:bg-[#e94560]"
            }`}
          >
            Intervalo de datas
          </button>
        </div>

        {/* Caixa de resultado */}
        <div className="bg-white text-black rounded-lg h-48 flex items-center justify-center font-medium text-center p-4">
          {renderTexto()}
        </div>
      </div>
    </div>
  );
}
