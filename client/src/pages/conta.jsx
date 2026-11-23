import React, { useState } from 'react';
import "../style/contas.css";
import { FaUser, FaBell, FaHome, FaUserCircle, FaHistory, FaChartLine, FaPlusCircle, FaMinusCircle, FaExchangeAlt, FaCog, FaShieldAlt, FaWallet, FaTrophy, FaChartPie, FaCoins, FaMoneyCheck, FaComments, FaGift, FaRocket, FaTimes } from 'react-icons/fa';

function Header() {
  return (
    <header>
      <div className="logo">
        <img src="wtt.png" alt="WTT" />
        <span></span>
      </div>
      <div className="user-actions">
        <button className="btn btn-outline">
          <FaBell /> Notificações
        </button>
        <button className="btn btn-primary">
          <FaHome /> Voltar ao Início
        </button>
      </div>
    </header>
  );
}

function Sidebar({ openProfile }) {
  return (
    <aside className="filters">
      <h2>
        <FaUserCircle /> Minha Conta
      </h2>

      <div className="filter-group">

        <div
          className="filter-option active"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openProfile();
          }}
          style={{ cursor: "pointer" }}
        >
          <FaUser /> Perfil
        </div>

        <div className="filter-option">
          <FaHistory /> Histórico de Apostas
        </div>

        <div className="filter-option">
          <FaChartLine /> Estatísticas
        </div>

      </div>

      <div className="filter-group">
        <h3>Transações</h3>

        <div className="filter-option">
          <FaPlusCircle /> Depósito
        </div>

        <div className="filter-option">
          <FaMinusCircle /> Saque
        </div>

        <div className="filter-option">
          <FaExchangeAlt /> Transferências
        </div>
      </div>

      <div className="filter-group">
        <h3>Preferências</h3>

        <div className="filter-option">
          <FaCog /> Configurações
        </div>

        <div className="filter-option">
          <FaShieldAlt /> Privacidade
        </div>
      </div>
    </aside>
  );
}

function Account({ openFeedback }) {
  return (
    <main className="main-content">
      <div className="account-container">
        {/* Perfil do usuário */}
        <div className="user-profile">
          <div className="avatar online"><FaUser /></div>
          <div className="user-info">
            <h2>Utilizador</h2>
            <p>Membro desde: Jan 2025</p>
            <p>Nível: <span style={{ color: '#e94560' }}>Ouro</span></p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="account-stats">
          <div className="stat-card"><FaWallet /><div className="stat-value balance">kz 1.245,80</div><div className="stat-label">Saldo Disponível</div></div>
          <div className="stat-card"><FaTrophy /><div className="stat-value">27</div><div className="stat-label">Apostas Vencedoras</div></div>
          <div className="stat-card"><FaChartPie /><div className="stat-value">42%</div><div className="stat-label">Taxa de Acerto</div></div>
          <div className="stat-card"><FaCoins /><div className="stat-value">kz 3.720,50</div><div className="stat-label">Ganhos Totais</div></div>
        </div>

        {/* Ações Rápidas */}
        <h2 className="section-title"><FaRocket /> Ações Rápidas</h2>
        <div className="account-actions">
          <div className="action-card" onClick={() => alert('Redirecionando para a tela de saque...')}>
            <FaMoneyCheck /><h3>Solicitar Saque</h3><p>Transfira seu saldo para sua conta bancária</p>
          </div>
          <div className="action-card" onClick={openFeedback}>
            <FaComments /><h3>Feedback</h3><p>Envie uma mensagem para nosso administrador</p>
          </div>
          <div className="action-card"><FaGift /><h3>Bônus</h3><p>Verifique seus bônus disponíveis</p></div>
          <div className="action-card"><FaShieldAlt /><h3>Segurança</h3><p>Gerencie suas configurações de segurança</p></div>
        </div>

        {/* Atividade Recente */}
        <h2 className="section-title"><FaHistory /> Atividade Recente</h2>
        <div className="recent-activity">
          <ul className="activity-list">
            <li className="activity-item"><div className="activity-icon"><FaPlusCircle /></div><div className="activity-details"><div className="activity-title">Depósito realizado</div><div className="activity-time">Hoje, 14:32</div></div><div className="activity-amount positive">+ kz 100,00</div></li>
            <li className="activity-item"><div className="activity-icon"><FaTrophy /></div><div className="activity-details"><div className="activity-title">Aposta vencedora - Bayern Munich vs PSG</div><div className="activity-time">Ontem, 21:15</div></div><div className="activity-amount positive">+ kz 45,50</div></li>
            <li className="activity-item"><div className="activity-icon"><FaTimes /></div><div className="activity-details"><div className="activity-title">Aposta perdida - Barcelona vs Real Madrid</div><div className="activity-time">Ontem, 19:40</div></div><div className="activity-amount negative">- kz 20,00</div></li>
            <li className="activity-item"><div className="activity-icon"><FaMinusCircle /></div><div className="activity-details"><div className="activity-title">Saque processado</div><div className="activity-time">25 Out, 09:15</div></div><div className="activity-amount negative">- kz 200,00</div></li>
          </ul>
        </div>
      </div>
    </main>
  );
}

function FeedbackModal({ isOpen, closeModal }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [urgency, setUrgency] = useState('medium');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert('Feedback enviado com sucesso! Entraremos em contato em breve.');
      setLoading(false);
      setSubject('');
      setMessage('');
      setUrgency('medium');
      closeModal();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="modal" onClick={e => e.target === e.currentTarget && closeModal()}>
      <div className="modal-content">
        <button className="modal-close" onClick={closeModal}><FaTimes /></button>
        <h2 className="modal-title"><FaComments /> Enviar Feedback</h2>
        <form className="feedback-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="subject">Assunto</label>
            <select id="subject" className="form-input" value={subject} onChange={e => setSubject(e.target.value)} required>
              <option value="">Selecione um assunto</option>
              <option value="problem">Problema técnico</option>
              <option value="suggestion">Sugestão</option>
              <option value="complaint">Reclamação</option>
              <option value="praise">Elogio</option>
              <option value="other">Outro</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="message">Mensagem</label>
            <textarea id="message" className="form-textarea" value={message} onChange={e => setMessage(e.target.value)} placeholder="Descreva seu feedback em detalhes..." required />
          </div>
          <div className="form-group">
            <label>Urgência</label>
            <div style={{ display: 'flex', gap: '15px' }}>
              <label><input type="radio" name="urgency" value="low" checked={urgency==='low'} onChange={e => setUrgency(e.target.value)} /> Baixa</label>
              <label><input type="radio" name="urgency" value="medium" checked={urgency==='medium'} onChange={e => setUrgency(e.target.value)} /> Média</label>
              <label><input type="radio" name="urgency" value="high" checked={urgency==='high'} onChange={e => setUrgency(e.target.value)} /> Alta</label>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [isFeedbackOpen, setFeedbackOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);

  return (
    <div className="container">
      <Header />

      <Sidebar
        openProfile={() => setProfileOpen(true)}
      />

      <Account
        openFeedback={() => setFeedbackOpen(true)}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        closeModal={() => setFeedbackOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        closeModal={() => setProfileOpen(false)}
      />
    </div>
  );
}