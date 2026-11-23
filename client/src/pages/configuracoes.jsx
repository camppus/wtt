import { useState } from "react";
import Logo from "../img/wtt.png";

export default function Configuracoes() {
  const [notificacoes, setNotificacoes] = useState(true);
  const [temaClaro, setTemaClaro] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#1a1a2e] text-[#f0f0f0] p-4 sm:p-5">
      <img
        src={Logo}
        alt="Logo"
        style={{
          height: "100px",
          width: "auto",
          position: "absolute",
          top: 20,
          left: -50,
          margin: "10px"
        }}
      />

      <h1 className="text-[#e94560] text-3xl sm:text-4xl font-bold mb-8 sm:mb-10 text-center">
        Configurações da Casa de Apostas
      </h1>

      <div className="w-full max-w-[300px]">

        <div className="bg-[#1e2a47] p-5 sm:p-6 rounded-lg shadow-lg">

          <form className="flex flex-col gap-4">

            <h2 className="text-[#e94560] text-2xl font-semibold">
              Informações Gerais
            </h2>

            <label className="text-sm text-gray-300">
              Nome da Casa
            </label>
            <input
              type="text"
              placeholder="Ex: WTT"
              className="p-2 rounded-lg bg-[#16213e] text-white outline-none focus:bg-[#0f3460] w-full"
            />

            <label className="text-sm text-gray-300">
              Moeda Padrão
            </label>
            <select
              className="p-2 rounded-lg bg-[#16213e] text-white outline-none focus:bg-[#0f3460] w-full"
            >
              <option>Kwanza (Kz)</option>
              <option>Dólar (USD)</option>
              <option>Euro (EUR)</option>
            </select>

            <label className="text-sm text-gray-300">
              Aposta Mínima
            </label>
            <input
              type="number"
              placeholder="Ex: 100"
              className="p-2 rounded-lg bg-[#16213e] text-white outline-none focus:bg-[#0f3460] w-full"
            />

            <label className="text-sm text-gray-300">
              Aposta Máxima
            </label>
            <input
              type="number"
              placeholder="Ex: 50000"
              className="p-2 rounded-lg bg-[#16213e] text-white outline-none focus:bg-[#0f3460] w-full"
            />

            <h2 className="text-[#e94560] text-2xl font-semibold mt-4">
              Preferências
            </h2>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notificacoes}
                onChange={() => setNotificacoes(!notificacoes)}
              />
              <label className="text-gray-300">
                Ativar notificações
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={temaClaro}
                onChange={() => setTemaClaro(!temaClaro)}
              />
              <label className="text-gray-300">
                Tema Claro
              </label>
            </div>

            <button
              type="submit"
              className="mt-3 p-3 rounded-lg bg-[#e94560] text-white font-bold hover:bg-[#4caf50] transition w-full"
            >
              Salvar Alterações
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}