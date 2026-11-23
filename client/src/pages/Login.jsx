import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../img/logo.png";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const numero = e.target.numero.value;
    const senha = e.target.senha.value;

    if (!numero || !senha) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    alert("Login efetuado com sucesso!");
    navigate("/Home"); // redireciona para Dashboard
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
          INICIAR SESSÃO
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="numero"
            placeholder="Número"
            required
            className="w-full p-3 rounded-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="senha"
            placeholder="Senha"
            required
            className="w-full p-3 rounded-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full p-3 rounded-md text-white text-sm bg-gradient-to-r from-[#0a1c3d] to-[#064a91] hover:opacity-90 transition duration-300"
          >
            ENTRAR
          </button>
        </form>

        <div className="flex justify-between items-center mt-3 text-xs text-gray-600">
          <label className="flex items-center cursor-pointer">
            <input type="checkbox" className="mr-1" />
            Lembrar senha
          </label>

          {/* Redirecionamento para Recuperação de Credenciais */}
          <button
            onClick={() => navigate("/Recuperacao")}
            className="text-blue-700 hover:underline"
          >
            Esqueceu a senha?
          </button>
        </div>
      </div>
    </div>
  );
}
