import { Inject, Injectable } from '@nestjs/common';
import Id from '@/shared/entities/Id';
import Money from '@/shared/entities/Money';
import BettingProgression from '../entities/BettingProgression';
import BettingProgressionStep from '../entities/BettingProgressionStep';
import type BettingProgressionRepository from '../repositories/BettingProgressionRepository';

@Injectable()
export default class BetProgressService {
  constructor(
    @Inject('BettingProgressionRepository')
    private readonly repo: BettingProgressionRepository,
  ) {}

  public async registerUserBetProgression(userId: Id) {
    await this.repo.cancelAll(userId);
    const progression = BettingProgression.create({
      id: Id.generate(),
      userId,
      startedAt: new Date(),
    });
    await this.repo.save(progression);
    return progression;
  }

  public async registerBetStepProgression(dto: {
    progression: BettingProgression;
    step: {
      stakeAmount: Money;
      betId: Id;
    };
  }) {
    const { progression, step } = dto;
    const progressionStep = BettingProgressionStep.create({
      id: Id.generate(),
      progressionId: progression.getId(),
      stakeAmount: step.stakeAmount,
      stepNumber: progression.getNextStep(),
      betId: step.betId,
    });
    await this.repo.saveBettingStep(progressionStep);
    return progressionStep;
  }
}
