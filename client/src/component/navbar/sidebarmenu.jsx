// src/components/SidebarMenu.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const SidebarMenu = () => {
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", icon: "fas fa-home", path: "/" },
    { label: "Utilizadores", icon: "fas fa-users", path: "/usuarios" },
    { label: "Deposito", icon: "fas fa-money-check", path: "/deposito" },
    { label: "Saques", icon: "fas fa-hand-holding-usd", path: "/historicosaque" },
    { label: "Apostas", icon: "fas fa-ticket-alt", path: "/contas" },
    { label: "Configurações", icon: "fas fa-cog", path: "/configuracoes" },
    { label: "Sair", icon: "fas fa-sign-out-alt", path: "/logout" },
  ];

  return (
    <ul className="list-none">
      {menuItems.map((item, index) => {
        const active = location.pathname === item.path;

        return (
          <li key={index}>
            <Link
              to={item.path}
              className={`group relative flex items-center gap-3 px-5 py-3 text-[#f0f0f0]
              transition-all duration-300
              hover:bg-[#0f3460]
              ${active ? "bg-[#0f3460]" : ""}`}
            >
              {/* Barra vermelha animada */}
              <span
                className={`absolute left-0 top-0 h-full bg-[#e94560] transition-all duration-300
                ${active ? "w-1" : "w-0 group-hover:w-1"}`}
              ></span>

              <i className={`${item.icon} w-8 text-center`}></i>
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarMenu;