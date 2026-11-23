import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Recuperacao() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Máscara de telefone
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length <= 11) {
      if (value.length <= 2) {
        value = value.replace(/^(\d{0,2})/, "($1");
      } else if (value.length <= 6) {
        value = value.replace(/^(\d{2})(\d{0,4})/, "($1) $2");
      } else if (value.length <= 10) {
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
      } else {
        value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
      }
    }

    setPhone(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      setError("Por favor, insira um número de telefone válido");
      return;
    }

    setLoading(true);

    // Simula envio de código
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);

      // Redireciona para login após 2s
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        {/* Logo / Título */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Recuperar Acesso</h1>
        </div>

        <p className="text-center text-gray-500 text-sm mb-6">
          Digite seu número de telefone cadastrado para receber instruções de recuperação de senha.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="phone" className="text-gray-700 font-medium mb-1">
              Número de Telefone
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                +244
              </div>
              <input
                type="tel"
                id="phone"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={handlePhoneChange}
                required
                className={`w-full p-3 pl-14 border rounded-md text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            {error && <span className="text-red-600 text-xs mt-1">{error}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-md text-white font-semibold text-sm bg-blue-800 hover:bg-blue-700 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Enviando..." : "Enviar Código"}
          </button>
        </form>

        {success && (
          <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md text-sm text-center">
            Um código de verificação foi enviado para seu telefone. Redirecionando para login...
          </div>
        )}

        <div className="text-center mt-4 text-sm">
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline"
          >
            Voltar para o login
          </button>
        </div>
      </div>
    </div>
  );
}
