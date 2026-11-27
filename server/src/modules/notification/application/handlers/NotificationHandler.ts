import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import CreateNotification from '../usecases/createNotificationUseCase';
import {
  NotificationEvent,
  NotificationEvents,
} from '../../domain/events/NotificationEvent';
import { NotificationEventConfig } from '../../domain/configuration/NotificationEventConfig';
import { NotificationPayload } from '../dto/NotificationPayload';

@Injectable()
export default class NotificationHandler {
  constructor(private readonly createNotification: CreateNotification) {}

  @OnEvent(NotificationEvents.BET_CREATED)
  async handleBetCreated(payload: {
    userId: string;
    betId: string;
  }): Promise<void> {
    await this.create(payload, NotificationEvents.BET_CREATED);
  }

  @OnEvent(NotificationEvents.BET_WON)
  async handleBetWon(payload: {
    userId: string;
    betId: string;
    amount: number;
  }): Promise<void> {
    await this.create(payload, NotificationEvents.BET_WON);
  }

  @OnEvent(NotificationEvents.BET_LOST)
  async handleBetLost(payload: {
    userId: string;
    betId: string;
  }): Promise<void> {
    await this.create(payload, NotificationEvents.BET_LOST);
  }

  @OnEvent(NotificationEvents.BET_CANCELED)
  async handleBetCanceled(payload: {
    userId: string;
    betId: string;
  }): Promise<void> {
    await this.create(payload, NotificationEvents.BET_CANCELED);
  }

  @OnEvent(NotificationEvents.BET_REFUNDED)
  async handleBetRefunded(payload: {
    userId: string;
    betId: string;
    amount: number;
  }): Promise<void> {
    await this.create(payload, NotificationEvents.BET_REFUNDED);
  }

  @OnEvent(NotificationEvents.PAYMENT_PAID)
  async handlePaymentPaid(payload: {
    userId: string;
    paymentId: string;
    amount: number;
  }): Promise<void> {
    await this.create(payload, NotificationEvents.PAYMENT_PAID);
  }

  @OnEvent(NotificationEvents.PAYMENT_FAILED)
  async handlePaymentFailed(payload: {
    userId: string;
    paymentId: string;
  }): Promise<void> {
    await this.create(payload, NotificationEvents.PAYMENT_FAILED);
  }

  @OnEvent(NotificationEvents.PAYMENT_EXPIRED)
  async handlePaymentExpired(payload: {
    userId: string;
    paymentId: string;
  }): Promise<void> {
    await this.create(payload, NotificationEvents.PAYMENT_EXPIRED);
  }

  @OnEvent(NotificationEvents.WITHDRAWAL_CREATED)
  async handleWithdrawalCreated(payload: {
    userId: string;
    withdrawalId: string;
    amount: number;
  }): Promise<void> {
    await this.create(payload, NotificationEvents.WITHDRAWAL_CREATED);
  }

  @OnEvent(NotificationEvents.WITHDRAWAL_PAID)
  async handleWithdrawalPaid(payload: {
    userId: string;
    withdrawalId: string;
    amount: number;
  }): Promise<void> {
    await this.create(payload, NotificationEvents.WITHDRAWAL_PAID);
  }

  @OnEvent(NotificationEvents.WITHDRAWAL_FAILED)
  async handleWithdrawalFailed(payload: {
    userId: string;
    withdrawalId: string;
  }): Promise<void> {
    await this.create(payload, NotificationEvents.WITHDRAWAL_FAILED);
  }

  @OnEvent(NotificationEvents.WITHDRAWAL_CANCELED)
  async handleWithdrawalCanceled(payload: {
    userId: string;
    withdrawalId: string;
  }): Promise<void> {
    await this.create(payload, NotificationEvents.WITHDRAWAL_CANCELED);
  }

  @OnEvent(NotificationEvents.PROGRESSION_STARTED)
  async handleProgressionStarted(payload: {
    userId: string;
    progressionId: string;
  }): Promise<void> {
    await this.create(payload, NotificationEvents.PROGRESSION_STARTED);
  }

  @OnEvent(NotificationEvents.PROGRESSION_STEP_WON)
  async handleProgressionStepWon(payload: {
    userId: string;
    progressionId: string;
    stepId: string;
  }): Promise<void> {
    await this.create(payload, NotificationEvents.PROGRESSION_STEP_WON);
  }

  @OnEvent(NotificationEvents.PROGRESSION_STEP_LOST)
  async handleProgressionStepLost(payload: {
    userId: string;
    progressionId: string;
    stepId: string;
  }): Promise<void> {
    await this.create(payload, NotificationEvents.PROGRESSION_STEP_LOST);
  }

  @OnEvent(NotificationEvents.PROGRESSION_COMPLETED)
  async handleProgressionCompleted(payload: {
    userId: string;
    progressionId: string;
  }): Promise<void> {
    await this.create(payload, NotificationEvents.PROGRESSION_COMPLETED);
  }

  @OnEvent(NotificationEvents.PROGRESSION_FAILED)
  async handleProgressionFailed(payload: {
    userId: string;
    progressionId: string;
  }): Promise<void> {
    await this.create(payload, NotificationEvents.PROGRESSION_FAILED);
  }

  @OnEvent(NotificationEvents.NEW_LOGIN)
  async handleNewLogin(payload: { userId: string }): Promise<void> {
    await this.create(payload, NotificationEvents.NEW_LOGIN);
  }

  @OnEvent(NotificationEvents.PASSWORD_CHANGED)
  async handlePasswordChanged(payload: { userId: string }): Promise<void> {
    await this.create(payload, NotificationEvents.PASSWORD_CHANGED);
  }

  @OnEvent(NotificationEvents.ACCOUNT_BLOCKED)
  async handleAccountBlocked(payload: { userId: string }): Promise<void> {
    await this.create(payload, NotificationEvents.ACCOUNT_BLOCKED);
  }

  @OnEvent(NotificationEvents.NEW_MESSAGE)
  async handleNewMessage(payload: {
    userId: string;
    messageId: string;
    chatId: string;
  }): Promise<void> {
    await this.create(payload, NotificationEvents.NEW_MESSAGE);
  }

  @OnEvent(NotificationEvents.SYSTEM_ANNOUNCEMENT)
  async handleSystemAnnouncement(payload: { userId: string }): Promise<void> {
    await this.create(payload, NotificationEvents.SYSTEM_ANNOUNCEMENT);
  }

  private async create(
    payload: { userId: string },
    event: NotificationEvent,
  ): Promise<void> {
    const config = NotificationEventConfig[event];
    const input: NotificationPayload = {
      userId: payload.userId,
      type: config.type,
      title: config.title,
      message: config.message,
    };

    await this.createNotification.execute(input);
  }
}
