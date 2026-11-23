
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../img/logo.png";

export default function Autenticacao() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const codigo = e.target.codigo.value;

    if (!codigo) {
      alert("Por favor, introduza o código do cadastro.");
      return;
    }

    alert("Código autenticado com sucesso!");
    navigate("/Home");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300 font-sans">
      <div className="relative bg-white w-[350px] p-10 rounded-xl shadow-lg box-border">

        {/* Logo */}
        <img
          src={logo}
          alt="WTT Bet Logo"
          className="absolute top-5 left-5 w-[70px]"
        />

        {/* Título */}
        <h2 className="text-center text-gray-500 text-lg mt-16 mb-6">
          AUTENTICAÇÃO
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="text"
            name="codigo"
            placeholder="Código do cadastro"
            required
            className="w-full p-3 rounded-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full p-3 rounded-md text-white text-sm bg-gradient-to-r from-[#0a1c3d] to-[#064a91] hover:opacity-90 transition duration-300"
          >
            AUTENTICAR
          </button>

        </form>

        {/* Endereço */}
        <div className="text-center mt-6 text-xs text-gray-500">
          <p>Endereço</p>
          <p className="mt-1">
            Luanda, Angola
          </p>
        </div>

      </div>
    </div>
  );
}

