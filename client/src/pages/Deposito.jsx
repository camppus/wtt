import { useState } from "react";
import "../style/deposito.css";
import { FaUser, FaLock, FaCcPaypal } from "react-icons/fa"; 
import Logo from "../img/wtt.png";
import MulticaixaExpress from "../img/express.jpg";

export default function Deposit() {
  const [activeMethod, setActiveMethod] = useState(null);

  const paymentMethods = [
    { id: 1, name: "MulticaixaExpress", img: MulticaixaExpress },
    { id: 3, name: "Multicaixa", img: require("../img/multicaixa-seeklogo.png") }
  ];

  return (
    <>
      <header>
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <img src={Logo} alt="Logo" style={{ height: "100px", width: "auto" }} />
            </div>

            <div className="user-info">
              <div className="balance">Saldo: kz 150,00</div>
              <button className="btn-profile"> 
                <FaUser />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="main-content">
          {/* DEPÓSITO */}
          <div className="deposit-section">
            <h2 className="section-title">Realizar Depósito</h2>

            <div className="payment-methods">
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  className={`payment-method ${activeMethod === method.id ? "active" : ""}`}
                  onClick={() => setActiveMethod(method.id)}
                >
                  {method.img ? (
                    <img src={method.img} alt={method.name} />
                  ) : (
                    method.icon
                  )}
                  <span>{method.name}</span>
                </div>
              ))}
            </div>

            <div className="form-group">
              <label>Valor do Depósito (kz)</label>
              <input type="number" placeholder="0,00" />
            </div>

            <button className="btn-deposit">Depositar Agora</button>
          </div>

          {/* BÔNUS */}
          <div className="bonus-section">
            

            <div className="bonus-card">
            
              <p className="bonus-description">
                
              </p>
            </div>

            <div className="bonus-card">
              
              <p className="bonus-description">
              </p>
            </div>

            <div className="transaction-history">
              <h2 className="section-title">Últimos Depósitos</h2>

              <div className="transaction-item">
                <span>20/06/2023</span>
                <span>kz 100,00</span>
                <span className="completed">Concluído</span>
              </div>

              <div className="transaction-item">
                <span>18/06/2023</span>
                <span>kz 50,00</span>
                <span className="completed">Concluído</span>
              </div>

              <div className="transaction-item">
                <span>15/06/2023</span>
                <span>kz 200,00</span>
                <span className="completed">Concluído</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <div className="container">
          <p>WTT © 2025 - Todos os direitos reservados.</p>
          <div className="security-note">
            <FaLock />
            <span>Transações seguras e criptografadas</span>
          </div>
        </div>
      </footer>
    </>
  );
}
