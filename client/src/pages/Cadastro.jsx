import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../img/logo.png";

export default function Cadastro() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const nome = e.target.Nome.value;
    const telefone = e.target.Telefone.value;
    const senha = e.target.senha.value;
    const confirmaSenha = e.target.confirmaSenha.value;

    if (!nome || !telefone || !senha || !confirmaSenha) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (senha !== confirmaSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    alert("Cadastro realizado com sucesso!");
    navigate("/login");
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

        <h2 className="text-center text-gray-500 text-lg mt-16 mb-6">
          CRIAR CONTA
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nome completo"
            id="Nome"
            name="Nome"
            required
            className="w-full p-3 rounded-md border border-gray-300 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Número de Telefone"
            id="Telefone"
            name="Telefone" 
            maxLength={9} 
            minLength={9}
            required
            className="w-full p-3 rounded-md border border-gray-300 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Senha"
            id="senha"
            name="senha"
            required
            className="w-full p-3 rounded-md border border-gray-300 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Confirmar senha"
            id="confirmaSenha"
            name="confirmaSenha"
            required
            className="w-full p-3 rounded-md border border-gray-300 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full p-3 rounded-md text-white text-sm bg-gradient-to-r from-[#0a1c3d] to-[#064a91] hover:opacity-90 transition duration-300"
          >
            CADASTRAR
          </button>
        </form>

        <p className="mt-3 text-center text-xs text-gray-600 leading-relaxed">
          Ao se cadastrar, você concorda com os{" "}
          <a href="#" className="text-blue-700 font-bold hover:underline">Termos e Condições</a> e nossa{" "}
          <a href="#" className="text-blue-700 font-bold hover:underline">Política de Privacidade</a>.
        </p>
      </div>
    </div>
  );
}
