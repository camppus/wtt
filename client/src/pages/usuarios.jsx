import React, { useEffect } from "react";
import "../style/usuarios.css"; 
import Logo from "../img/wtt.png";


export default function App() {
  useEffect(() => {
    // Filtros interativos
    const filterBtn = document.querySelector(".btn-filter");
    if (filterBtn) {
      filterBtn.addEventListener("click", () => {
        alert("Filtros aplicados!");
      });
    }

    // Botão de novo usuário
    const newUserBtn = document.querySelector(".btn-new-user");
    if (newUserBtn) {
      newUserBtn.addEventListener("click", () => {
        alert("Abrir modal de novo usuário");
      });
    }

    // Ações dos botões na tabela
    const actionButtons = document.querySelectorAll(".action-btn");
    actionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const type = button.classList[1]; // view-btn, edit-btn ou delete-btn

        if (type === "view-btn") {
          alert("Visualizando usuário");
        } else if (type === "edit-btn") {
          alert("Editando usuário");
        } else if (type === "delete-btn") {
          if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
            alert("Usuário excluído com sucesso!");
          }
        }
      });
    });

    // Paginação
    const paginationButtons = document.querySelectorAll(".pagination button");
    paginationButtons.forEach((button) => {
      button.addEventListener("click", () => {
        paginationButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        alert("Carregando página " + button.textContent);
      });
    });
  }, []);

  return (
    <div>
      <header>
        <div className="container">
          <div className="header-content">
            <div className="logo">
            <img src={Logo} alt="Logo" style={{ height: "100px", width: "auto" }} />

            </div>
            <div className="user-info">
              <div className="balance">Admin: Utilizador 1</div>
              <button className="btn-profile">
                <i className="fas fa-cog"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="admin-nav">
          <ul>
            <li>
              <a href="#" className="active">
                <i className="fas fa-users"></i> Usuários
              </a>
            </li>
          </ul>
        </div>

        <div className="dashboard-cards">
          <div className="stat-card">
            <i className="fas fa-users"></i>
            <h3>2,548</h3>
            <p>Total de Usuários</p>
          </div>
          <div className="stat-card">
            <i className="fas fa-user-check"></i>
            <h3>1,927</h3>
            <p>Usuários Ativos</p>
          </div>
          <div className="stat-card">
            <i className="fas fa-money-bill-wave"></i>
            <h3>Kz 84,250</h3>
            <p>Depósitos (30 dias)</p>
          </div>
          <div className="stat-card">
            <i className="fas fa-chart-line"></i>
            <h3>+124</h3>
            <p>Novos usuários (7 dias)</p>
          </div>
        </div>

        <div className="main-content">
          {/* Painel de Filtros */}
          <div className="filters-panel">
            <h2>Filtros</h2>
            <div className="filter-group">
              <label htmlFor="status">Status</label>
              <select id="status">
                <option value="">Todos</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="pending">Pendente</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="registration">Data de Cadastro</label>
              <input type="date" id="registration" />
            </div>

            <div className="filter-group">
              <label htmlFor="balance">Saldo Mínimo</label>
              <input type="number" id="balance" placeholder="kz 0,00" />
            </div>

            <div className="filter-group">
              <label htmlFor="bets">Apostas Realizadas</label>
              <select id="bets">
                <option value="">Qualquer quantidade</option>
                <option value="10+">10+ apostas</option>
                <option value="50+">50+ apostas</option>
                <option value="100+">100+ apostas</option>
              </select>
            </div>

            <button className="btn-filter">Aplicar Filtros</button>
          </div>

          {/* Tabela de Usuários */}
          <div className="users-table-container">
            <div className="table-header">
              <h2>Lista de Usuários</h2>
              <div className="search-box">
                <input type="text" placeholder="Buscar usuário..." />
                             </div><button className="btn-new-user">
                  <i className="fas fa-plus"></i> Novo Usuário
                </button> 
                

            </div>

            <table>
  <thead>
    <tr>
      <th>Usuário</th>
      <th>Cadastro</th>
      <th>Saldo</th>
      <th>Desativar</th>
      <th>Apostas</th>
      <th>Status</th>
      <th>Ações</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      {/* USUÁRIO */}
      <td>
        <div className="user-cell">
          <img
            src="https://ui-avatars.com/api/?name=João+Silva&background=0f3460&color=fff"
            alt="João Silva"
          />

          <div>
            <div className="user-name">João Silva</div>
            <div className="user-email">
              joao.silva@email.com
            </div>
          </div>
        </div>
      </td>

      {/* CADASTRO */}
      <td>15/05/2023</td>

      {/* SALDO */}
      <td>kz 350,00</td>

      {/* DESATIVAR */}
      <td>
        <button
          type="button"
          className="action-btn deactivate-btn"
          title="Desativar usuário"
          onClick={() => {
            if (
              window.confirm(
                "Tem certeza que deseja desativar este usuário?"
              )
            ) {
              alert("Usuário desativado com sucesso!");
            }
          }}
        >
          <i className="fas fa-lock"></i>
        </button>
      </td>

      {/* APOSTAS */}
      <td>42</td>

      {/* STATUS */}
      <td>
        <span className="user-status status-active">
          Ativo
        </span>
      </td>

      {/* AÇÕES */}
      <td>
        <button
          type="button"
          className="action-btn view-btn"
          title="Visualizar usuário"
          onClick={() => alert("Visualizando João Silva")}
        >
          <i className="fas fa-eye"></i>
        </button>

        <button
          type="button"
          className="action-btn edit-btn"
          title="Editar usuário"
          onClick={() => alert("Editando João Silva")}
        >
          <i className="fas fa-edit"></i>
        </button>

        <button
          type="button"
          className="action-btn delete-btn"
          title="Excluir usuário"
          onClick={() => {
            if (
              window.confirm(
                "Tem certeza que deseja excluir este usuário?"
              )
            ) {
              alert("Usuário excluído com sucesso!");
            }
          }}
        >
          <i className="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  </tbody>
</table>

            <div className="pagination">
              <button className="active">1</button>
              <button>2</button>
              <button>3</button>
              <button>4</button>
              <button>5</button>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <div className="container">
          <p>WTT &copy; 2025 - Todos os direitos reservados.</p>
          <div className="security-note">
            <i className="fas fa-lock"></i>
            <span>Sistema seguro e criptografado</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
