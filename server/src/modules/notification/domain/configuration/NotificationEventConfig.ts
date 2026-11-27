import { NotificationType } from '../entities/Notification';
import { NotificationEvents } from '../events/NotificationEvent';

export const NotificationEventConfig = {
  [NotificationEvents.BET_CREATED]: {
    type: NotificationType.BET,
    title: 'Aposta criada',
    message: 'A tua aposta foi criada com sucesso.',
  },

  [NotificationEvents.BET_WON]: {
    type: NotificationType.BET,
    title: 'Aposta ganha',
    message: 'Parabéns! A tua aposta foi ganha.',
  },

  [NotificationEvents.BET_LOST]: {
    type: NotificationType.BET,
    title: 'Aposta perdida',
    message: 'A tua aposta não foi vencedora.',
  },

  [NotificationEvents.BET_CANCELED]: {
    type: NotificationType.BET,
    title: 'Aposta cancelada',
    message: 'A tua aposta foi cancelada.',
  },

  [NotificationEvents.BET_REFUNDED]: {
    type: NotificationType.BET,
    title: 'Aposta reembolsada',
    message: 'O valor da tua aposta foi devolvido.',
  },

  [NotificationEvents.PAYMENT_PAID]: {
    type: NotificationType.PAYMENT,
    title: 'Pagamento confirmado',
    message: 'O teu pagamento foi confirmado com sucesso.',
  },

  [NotificationEvents.PAYMENT_FAILED]: {
    type: NotificationType.PAYMENT,
    title: 'Pagamento falhou',
    message: 'Não foi possível processar o teu pagamento.',
  },

  [NotificationEvents.PAYMENT_EXPIRED]: {
    type: NotificationType.PAYMENT,
    title: 'Pagamento expirado',
    message: 'O prazo para concluir o pagamento expirou.',
  },

  [NotificationEvents.WITHDRAWAL_CREATED]: {
    type: NotificationType.WITHDRAWAL,
    title: 'Levantamento solicitado',
    message: 'O teu pedido de levantamento foi recebido.',
  },

  [NotificationEvents.WITHDRAWAL_PAID]: {
    type: NotificationType.WITHDRAWAL,
    title: 'Levantamento concluído',
    message: 'O teu levantamento foi processado com sucesso.',
  },

  [NotificationEvents.WITHDRAWAL_FAILED]: {
    type: NotificationType.WITHDRAWAL,
    title: 'Levantamento falhou',
    message: 'Não foi possível processar o teu levantamento.',
  },

  [NotificationEvents.WITHDRAWAL_CANCELED]: {
    type: NotificationType.WITHDRAWAL,
    title: 'Levantamento cancelado',
    message: 'O teu pedido de levantamento foi cancelado.',
  },

  [NotificationEvents.PROGRESSION_STARTED]: {
    type: NotificationType.PROGRESSION,
    title: 'Progressão iniciada',
    message: 'A tua progressão de apostas foi iniciada.',
  },

  [NotificationEvents.PROGRESSION_STEP_WON]: {
    type: NotificationType.PROGRESSION,
    title: 'Etapa concluída',
    message: 'Parabéns! A etapa da tua progressão foi concluída.',
  },

  [NotificationEvents.PROGRESSION_STEP_LOST]: {
    type: NotificationType.PROGRESSION,
    title: 'Etapa perdida',
    message: 'A tua progressão falhou nesta etapa.',
  },

  [NotificationEvents.PROGRESSION_COMPLETED]: {
    type: NotificationType.PROGRESSION,
    title: 'Progressão concluída',
    message: 'Parabéns! Completaste a tua progressão.',
  },

  [NotificationEvents.PROGRESSION_FAILED]: {
    type: NotificationType.PROGRESSION,
    title: 'Progressão falhou',
    message: 'A tua progressão foi encerrada após uma aposta perdida.',
  },

  [NotificationEvents.NEW_LOGIN]: {
    type: NotificationType.SECURITY,
    title: 'Novo login',
    message: 'Foi realizado um novo login na tua conta.',
  },

  [NotificationEvents.PASSWORD_CHANGED]: {
    type: NotificationType.SECURITY,
    title: 'Palavra-passe alterada',
    message: 'A palavra-passe da tua conta foi alterada.',
  },

  [NotificationEvents.ACCOUNT_BLOCKED]: {
    type: NotificationType.SECURITY,
    title: 'Conta bloqueada',
    message: 'A tua conta foi bloqueada.',
  },

  [NotificationEvents.NEW_MESSAGE]: {
    type: NotificationType.MESSAGE,
    title: 'Nova mensagem',
    message: 'Recebeste uma nova mensagem.',
  },

  [NotificationEvents.SYSTEM_ANNOUNCEMENT]: {
    type: NotificationType.SYSTEM,
    title: 'Aviso do sistema',
    message: 'Tens um novo aviso do sistema.',
  },
} as const;
