export const NotificationEvents = {
  // BET
  BET_CREATED: 'bet.created',
  BET_WON: 'bet.won',
  BET_LOST: 'bet.lost',
  BET_CANCELED: 'bet.canceled',
  BET_REFUNDED: 'bet.refunded',

  // PAYMENT
  PAYMENT_PAID: 'payment.paid',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_EXPIRED: 'payment.expired',

  // WITHDRAWAL
  WITHDRAWAL_CREATED: 'withdrawal.created',
  WITHDRAWAL_PAID: 'withdrawal.paid',
  WITHDRAWAL_FAILED: 'withdrawal.failed',
  WITHDRAWAL_CANCELED: 'withdrawal.canceled',

  // PROGRESSION
  PROGRESSION_STARTED: 'progression.started',
  PROGRESSION_STEP_WON: 'progression.step.won',
  PROGRESSION_STEP_LOST: 'progression.step.lost',
  PROGRESSION_COMPLETED: 'progression.completed',
  PROGRESSION_FAILED: 'progression.failed',

  // SECURITY
  NEW_LOGIN: 'security.new_login',
  PASSWORD_CHANGED: 'security.password_changed',
  ACCOUNT_BLOCKED: 'security.account_blocked',

  // MESSAGE
  NEW_MESSAGE: 'message.new',

  // SYSTEM
  SYSTEM_ANNOUNCEMENT: 'system.announcement',
} as const;

export type NotificationEvent =
  (typeof NotificationEvents)[keyof typeof NotificationEvents];
