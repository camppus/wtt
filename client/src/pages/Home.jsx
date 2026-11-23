import React from "react"; 
import card1 from "../img/card1.png";
import card2 from "../img/card2.png";
import card3 from "../img/card3.png";

import {
  Home as HomeIcon,
  Search,
  User,
  Tv,
  Trophy,
  Percent,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const jogosPopulares = [
    {
      liga: "Qualificação Liga dos Campeões da UEFA",
      t1: "Shakhtar",
      t2: "Fenerbahce",
      o1: "1.80",
      o2: "3.10",
      o3: "3.50",
    },
    {
      liga: "Amigáveis de Clubes",
      t1: "Milan",
      t2: "Barcelona",
      o1: "2.10",
      o2: "3.40",
      o3: "2.60",
    },
    {
      liga: "Copa da Rússia",
      t1: "CSKA",
      t2: "Spartak",
      o1: "1.95",
      o2: "3.00",
      o3: "3.80",
    },
  ];

  const apostasHoje = [
    { jogo: "Djoko vs Bensia", o1: "1.87", o2: "2.40" },
    { jogo: "Chelsea vs Arsenal", o1: "2.00", o2: "3.20" },
    { jogo: "Real Madrid vs PSG", o1: "1.75", o2: "2.90" },
  ];

  return (
    <div className="min-h-screen bg-[#0c1424] text-white">

      {/* HEADER */}
      <div className="bg-[#0a1120] px-3 sm:px-4 md:px-6 py-3 flex flex-col md:flex-row md:items-center gap-3 justify-between border-b border-[#1f2a44]">

        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <h1 className="text-blue-400 font-bold text-base sm:text-lg">WTT</h1>

          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-1 sm:gap-2 bg-blue-600 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm"
          >
            <HomeIcon size={16} />
            Home
          </button>

          <button className="flex items-center gap-1 sm:gap-2 bg-red-600 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm">
            <Tv size={16} />
            AO VIVO
          </button>
        </div>

        <div className="relative w-full md:w-1/3">
          <Search
            size={16}
            className="absolute left-3 top-2.5 text-gray-400"
          />
          <input
            type="text"
            placeholder="Pesquisar..."
            className="w-full bg-[#1a243b] pl-9 pr-4 py-2 rounded-full text-xs sm:text-sm outline-none"
          />
        </div>

        <div
          onClick={() => navigate("/Contas")}
          className="flex items-center gap-2 sm:gap-4 justify-end"
        >
          <button className="flex items-center gap-1 sm:gap-2 bg-[#1e293b] px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm">
            <Trophy size={16} />
            Esportes
          </button>

          <div
            onClick={() => navigate("/contas")}
            className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition"
          >
            <User size={16} />
          </div>
        </div>
      </div>

      {/* BANNER */}
      <div className="px-3 sm:px-4 md:px-6 mt-5">
        <div
          className="h-36 sm:h-40 md:h-52 rounded-xl bg-cover bg-center relative flex items-center justify-center px-4"
          style={{
            backgroundImage: "",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/60 rounded-xl"></div>

          <div className="relative text-center">
            <h2 className="text-lg sm:text-xl md:text-3xl font-semibold italic text-center leading-tight">
              Diminua na sorte e aumente na certeza
            </h2>

            <div className="mt-3 sm:mt-4 flex justify-center">
              <div className="bg-white text-blue-700 rounded-full p-3 sm:p-4 shadow-lg">
                <Percent size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 px-3 sm:px-4 md:px-6 mt-6">
        <div
          className="w-full h-24 sm:h-28 md:h-32 rounded-lg flex items-center justify-center text-lg font-semibold text-white bg-cover bg-center"
          style={{ backgroundImage: `url(${card1})` }}
        ></div>

        <div
          className="w-full h-24 sm:h-28 md:h-32 rounded-lg flex items-center justify-center text-lg font-semibold text-white bg-cover bg-center"
          style={{ backgroundImage: `url(${card1})` }}
        ></div>

        <div
          className="w-full h-24 sm:h-28 md:h-32 rounded-lg flex items-center justify-center text-lg font-semibold text-white bg-cover bg-center"
          style={{ backgroundImage: `url(${card2})` }}
        ></div>

        <div
          className="w-full h-24 sm:h-28 md:h-32 rounded-lg flex items-center justify-center text-lg font-semibold text-white bg-cover bg-center"
          style={{ backgroundImage: `url(${card3})` }}
        ></div>
      </div>

      {/* TABELAS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6 px-3 sm:px-4 md:px-6 mt-8 pb-10">

        {/* JOGOS POPULARES */}
        <div className="bg-[#101a2e] rounded-lg border border-[#1f2a44] overflow-hidden">
          <div className="bg-green-600 px-4 py-2 font-semibold text-sm sm:text-base">
            JOGOS POPULARES
          </div>

          {jogosPopulares.map((jogo, i) => (
            <div
              onClick={() => navigate("/apostas")}
              key={i}
              className="border-b border-[#1f2a44] p-3 hover:bg-[#16233d]"
            >
              <p className="text-[10px] sm:text-xs text-gray-400">
                {jogo.liga}
              </p>

              <div className="flex justify-between items-center mt-2 gap-2">
                <div className="text-xs sm:text-sm">
                  <p>{jogo.t1}</p>
                  <p>{jogo.t2}</p>
                </div>

                <div className="flex gap-1 sm:gap-2">
                  <button className="bg-[#203a63] px-2 sm:px-3 py-1 rounded text-[10px] sm:text-xs">
                    {jogo.o1}
                  </button>
                  <button className="bg-[#203a63] px-2 sm:px-3 py-1 rounded text-[10px] sm:text-xs">
                    {jogo.o2}
                  </button>
                  <button className="bg-[#203a63] px-2 sm:px-3 py-1 rounded text-[10px] sm:text-xs">
                    {jogo.o3}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* APOSTAS DE HOJE */}
        <div className="bg-[#101a2e] rounded-lg border border-[#1f2a44] overflow-hidden">
          <div className="bg-pink-600 px-4 py-2 font-semibold text-sm sm:text-base">
            APOSTAS DE HOJE
          </div>

          {apostasHoje.map((aposta, i) => (
            <div
              key={i}
              className="border-b border-[#1f2a44] p-3 flex justify-between items-center hover:bg-[#16233d]"
            >
              <p className="text-xs sm:text-sm md:text-base">
                {aposta.jogo}
              </p>

              <div className="flex gap-1 sm:gap-2">
                <button className="bg-[#2c5aa0] px-2 sm:px-3 py-1 rounded text-[10px] sm:text-xs">
                  {aposta.o1}
                </button>
                <button className="bg-[#2c5aa0] px-2 sm:px-3 py-1 rounded text-[10px] sm:text-xs">
                  {aposta.o2}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}