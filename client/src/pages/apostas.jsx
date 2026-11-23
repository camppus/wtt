import React, { useState } from "react";
import logo from "../img/logo.png";
import {
  FaUser,
  FaPlus,
  FaFilter,
  FaFutbol,
  FaTrophy,
  FaPlayCircle,
  FaClock,
  FaFire,
  FaTicketAlt,
  FaHistory,
} from "react-icons/fa";

export default function App() {
  const colors = {
    primary: "bg-[#1a1a2e]",
    secondary: "bg-[#16213e]",
    accent: "bg-[#0f3460]",
    highlight: "bg-[#e94560]",
    text: "text-[#f0f0f0]",
    cardBg: "bg-[#1e2a47]",
    live: "bg-[#ff5252]",
  };

  const matches = {
    featured: [
      {
        id: 1,
        league: "Premier League",
        time: "Hoje, 20:00",
        team1: "Manchester City",
        team2: "Liverpool",
        odds1: 2.1,
        oddsDraw: 3.5,
        odds2: 3.2,
        live: false,
      },
      {
        id: 2,
        league: "La Liga",
        time: "Hoje, 21:00",
        team1: "Barcelona",
        team2: "Real Madrid",
        odds1: 2.5,
        oddsDraw: 3.4,
        odds2: 2.8,
        live: true,
      },
      {
        id: 3,
        league: "Serie A",
        time: "Amanhã, 19:45",
        team1: "Juventus",
        team2: "Inter Milano",
        odds1: 2.3,
        oddsDraw: 3.2,
        odds2: 3.1,
        live: false,
      },
    ],
    live: [
      {
        id: 4,
        league: "Liga Portuguesa",
        time: "45'",
        team1: "Benfica",
        team2: "Porto",
        odds1: 2.2,
        oddsDraw: 3.3,
        odds2: 3.0,
        score: "1-0",
        live: true,
      },
      {
        id: 5,
        league: "Champions League",
        time: "32'",
        team1: "Bayern Munich",
        team2: "PSG",
        odds1: 1.9,
        oddsDraw: 3.6,
        odds2: 3.5,
        score: "2-1",
        live: true,
      },
      {
        id: 6,
        league: "Premier League",
        time: "67'",
        team1: "Arsenal",
        team2: "Chelsea",
        odds1: 2.1,
        oddsDraw: 3.4,
        odds2: 3.2,
        score: "0-0",
        live: true,
      },
    ],
    upcoming: [
      {
        id: 7,
        league: "Bundesliga",
        time: "Amanhã, 17:30",
        team1: "Borussia Dortmund",
        team2: "Bayer Leverkusen",
        odds1: 2.4,
        oddsDraw: 3.5,
        odds2: 2.7,
        live: false,
      },
      {
        id: 8,
        league: "Ligue 1",
        time: "Amanhã, 20:00",
        team1: "PSG",
        team2: "Marseille",
        odds1: 1.7,
        oddsDraw: 3.8,
        odds2: 4.0,
        live: false,
      },
      {
        id: 9,
        league: "Premier League",
        time: "26 Out, 16:00",
        team1: "Manchester United",
        team2: "Tottenham",
        odds1: 2.3,
        oddsDraw: 3.4,
        odds2: 2.9,
        live: false,
      },
    ],
  };

  const [selectedMatch, setSelectedMatch] = useState(matches.featured[0]);
  const [selectedOdd, setSelectedOdd] = useState(matches.featured[0].odds1);
 const [betAmount, setBetAmount] = useState(1000);
const [betError, setBetError] = useState("");

  const potentialWin = (betAmount * selectedOdd).toFixed(2);

  const MatchCard = ({ match }) => (
    <div
      className={`relative ${colors.cardBg} rounded-lg p-4 cursor-pointer transition transform hover:-translate-y-1 hover:shadow-lg`}
      onClick={() => {
        setSelectedMatch(match);
        setSelectedOdd(match.odds1);
      }}
    >
      {match.live && (
        <div
          className={`absolute top-0 right-0 px-2 py-1 text-xs font-bold text-white rounded-bl-lg ${colors.live}`}
        >
          AO VIVO
        </div>
      )}

      <div className="flex justify-between text-gray-400 text-xs mb-3">
        <span>{match.league}</span>
        <span>{match.time}</span>
      </div>

      <div className="flex justify-between items-center mb-3">
        <div className="flex flex-col items-center w-2/5">
          <div className="w-10 h-10 bg-[#1a1a2e] rounded-full flex items-center justify-center mb-1 font-bold">
            {match.team1.substring(0, 3)}
          </div>
          <div className="text-sm font-bold text-center">{match.team1}</div>
        </div>

        <div className="text-gray-400">
          {match.live && match.score ? match.score : "VS"}
        </div>

        <div className="flex flex-col items-center w-2/5">
          <div className="w-10 h-10 bg-[#1a1a2e] rounded-full flex items-center justify-center mb-1 font-bold">
            {match.team2.substring(0, 3)}
          </div>
          <div className="text-sm font-bold text-center">{match.team2}</div>
        </div>
      </div>

      <div className="flex justify-around">
        <div
          className={`${colors.accent} px-3 py-1 rounded font-bold text-center hover:${colors.highlight} transition`}
        >
          {match.odds1}
        </div>
        <div
          className={`${colors.accent} px-3 py-1 rounded font-bold text-center hover:${colors.highlight} transition`}
        >
          {match.oddsDraw}
        </div>
        <div
          className={`${colors.accent} px-3 py-1 rounded font-bold text-center hover:${colors.highlight} transition`}
        >
          {match.odds2}
        </div>
      </div>
    </div>
  );

  const BetOption = ({ optionName, oddValue }) => (
    <div
      className={`flex justify-between items-center px-3 py-2 mb-2 rounded cursor-pointer transition ${
        selectedOdd === oddValue ? colors.highlight : colors.accent
      }`}
      onClick={() => setSelectedOdd(oddValue)}
    >
      <span>{optionName}</span>
      <span>{oddValue}</span>
    </div>
  );

  return (
    <div className={`${colors.primary} min-h-screen text-[#f0f0f0] p-3 md:p-5`}>
      {/* Header */}
      <header
        className={`${colors.secondary} rounded-lg p-3 md:p-4 mb-5 flex flex-col md:flex-row gap-3 md:gap-0 justify-between items-center shadow`}
      >
        <div className="flex items-center gap-2 text-2xl font-bold text-[#e94560]">
          <img src={logo} alt="Logo da Empresa" className="h-12 md:h-16 w-auto" />
        </div>

        <div className="flex gap-2 md:gap-3 w-full md:w-auto justify-end">
          <button className="flex items-center gap-2 border border-[#e94560] rounded-full px-3 md:px-4 py-2 text-[#e94560] hover:text-white transition">
            <FaUser /> Entrar
          </button>

          <button
            className={`flex items-center gap-2 ${colors.highlight} rounded-full px-3 md:px-4 py-2 hover:bg-[#ff2e4d] transition`}
          >
            <FaPlus /> Depositar
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr_350px] gap-5">
        {/* Filtros */}
        <aside className={`${colors.secondary} p-4 md:p-5 rounded-lg shadow lg:sticky lg:top-5`}>
          <h2 className="flex items-center gap-2 mb-4 text-lg font-bold border-b border-[#0f3460] pb-2">
            <FaFilter /> Filtros
          </h2>

          <div className="mb-5">
            <h3 className="text-xs uppercase text-gray-400 mb-2">Desportos</h3>
            <div className={`flex items-center gap-2 p-2 ${colors.accent} rounded`}>
              <FaFutbol /> Futebol
            </div>
          </div>

          <div className="mb-5">
            <h3 className="text-xs uppercase text-gray-400 mb-2">Ligas</h3>
            {["Premier League", "La Liga", "Serie A", "Bundesliga", "Liga Portuguesa"].map(
              (league) => (
                <div
                  key={league}
                  className={`flex items-center gap-2 p-2 rounded hover:${colors.accent} cursor-pointer`}
                >
                  <FaTrophy /> {league}
                </div>
              )
            )}
          </div>

          <div>
            <h3 className="text-xs uppercase text-gray-400 mb-2">Tempo</h3>
            {["Ao Vivo", "Hoje", "Próximos Dias"].map((time) => (
              <div
                key={time}
                className={`flex items-center gap-2 p-2 rounded hover:${colors.accent} cursor-pointer`}
              >
                {time === "Ao Vivo" ? <FaPlayCircle /> : <FaClock />} {time}
              </div>
            ))}
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <main className="flex flex-col gap-5">
          {["featured", "live", "upcoming"].map((section) => (
            <div key={section} className={`${colors.secondary} p-4 md:p-5 rounded-lg shadow`}>
              <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
                {section === "featured" && <FaFire className="text-[#e94560]" />}
                {section === "live" && <FaPlayCircle className="text-[#e94560]" />}
                {section === "upcoming" && <FaClock className="text-[#e94560]" />}
                {section === "featured"
                  ? "Jogos em Destaque"
                  : section === "live"
                  ? "Jogos ao Vivo"
                  : "Próximos Jogos"}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matches[section].map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          ))}
        </main>

        {/* Detalhes da Aposta */}
        <aside className={`${colors.secondary} p-4 md:p-5 rounded-lg shadow lg:sticky lg:top-5`}>
          <h2 className="flex items-center gap-2 mb-4 text-lg font-bold">
            <FaTicketAlt /> Detalhes da Aposta
          </h2>

          <div className={`${colors.cardBg} p-4 rounded mb-4`}>
            <div className="flex justify-between text-gray-400 text-xs mb-3">
              <span>{selectedMatch.league}</span>
              <span>{selectedMatch.time}</span>
            </div>

            <div className="flex justify-between items-center mb-3">
              <div className="flex flex-col items-center w-2/5">
                <div className="w-10 h-10 bg-[#1a1a2e] rounded-full flex items-center justify-center mb-1 font-bold">
                  {selectedMatch.team1.substring(0, 3)}
                </div>
                <div className="text-sm font-bold text-center">
                  {selectedMatch.team1}
                </div>
              </div>

              <div className="text-gray-400">VS</div>

              <div className="flex flex-col items-center w-2/5">
                <div className="w-10 h-10 bg-[#1a1a2e] rounded-full flex items-center justify-center mb-1 font-bold">
                  {selectedMatch.team2.substring(0, 3)}
                </div>
                <div className="text-sm font-bold text-center">
                  {selectedMatch.team2}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <BetOption optionName={selectedMatch.team1} oddValue={selectedMatch.odds1} />
            <BetOption optionName="Empate" oddValue={selectedMatch.oddsDraw} />
            <BetOption optionName={selectedMatch.team2} oddValue={selectedMatch.odds2} />
          </div>



<div className="flex flex-col gap-3 mb-4"> 
  <label className="text-sm text-gray-400"> 
    Valor da Aposta (kz) 
  </label> 
 
  <input 
    type="number" 
    className={`p-2 rounded bg-[#1e2a47] text-[#f0f0f0] border ${
      betError 
        ? "border-red-500" 
        : "border-[#0f3460]" 
    }`} 
    value={betAmount} 
    min={1000} 
    step={0.5} 
    onChange={(e) => { 
      const value = e.target.value; 
 
      setBetAmount(value); 
 
      if (value !== "" && Number(value) < 1000) { 
        setBetError("O valor mínimo é 1.000 Kz"); 
      } else { 
        setBetError(""); 
      } 
    }} 
  /> 
 
  {betError && ( 
    <span className="text-red-400 text-xs"> 
      {betError} 
    </span> 
  )} 
</div> 
{/* BOTÃO DE APOSTAR */}

          <div className={`${colors.accent} p-3 rounded mb-4 text-center`}>
            <div>Ganho Potencial</div>
            <div className="font-bold text-lg">{potentialWin} kz</div>
          </div>

         
<button
  disabled={Number(betAmount) < 1000}
  onClick={() => {
    if (Number(betAmount) < 1000) {
      setBetError("O valor mínimo é 1.000 Kz");
      return;
    }

    // COLOQUE AQUI O CÓDIGO/FUNÇÃO QUE JÁ CONFIRMA A APOSTA
    // Exemplo: handleConfirmBet();
  }}
  className={`flex items-center gap-2 ${colors.highlight} w-full justify-center py-2 rounded hover:bg-[#ff2e4d] transition ${
    Number(betAmount) < 1000
      ? "opacity-50 cursor-not-allowed"
      : ""
  }`}
>
  <FaPlus /> Confirmar Aposta
</button>



          <div className="mt-5">
            <h3 className="flex items-center gap-2 mb-2 text-gray-400">
              <FaHistory /> Histórico de Apostas
            </h3>

            {[
              { match: "Man City vs Liverpool", result: "+21.00kz", color: "text-green-500" },
              { match: "Barcelona vs Real Madrid", result: "-10.00kz", color: "text-red-500" },
              { match: "Bayern vs Dortmund", result: "+15.50kz", color: "text-green-500" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between border-b border-[#0f3460] py-2 text-sm"
              >
                <span>{item.match}</span>
                <span className={item.color}>{item.result}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}