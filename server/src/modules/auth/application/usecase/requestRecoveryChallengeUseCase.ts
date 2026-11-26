import Encript from '@/infra/security/encript';
import type { SMSService } from '@/infra/SMS';
import type UserRepo from '@/modules/users/domain/repositories/UserRepo';
import { Inject, Injectable } from '@nestjs/common';
import type ChallengeRepo from '../../domain/repositories/ChallengeRepo';
import { PhoneNumber } from '@/modules/users/domain/entities/PhoneNumber';
import Challenge, { ChallengeContext } from '../../domain/entities/Challenge';
import Id from '@/shared/entities/Id';
import RequestPasswordResetDto from '../dto/RequestPasswordResetDto';

@Injectable()
export default class RequestRecoveryChallengeUseCase {
  constructor(
    private readonly encript: Encript,
    @Inject('UserRepo')
    private readonly userRepo: UserRepo,
    @Inject('SMSService')
    private readonly smsService: SMSService,
    @Inject('ChallengeRepo')
    private readonly challengeRepo: ChallengeRepo,
  ) {}

  async handle(dto: RequestPasswordResetDto) {
    const phone = new PhoneNumber(dto.phone);
    const user = await this.userRepo.getByPhone(phone);
    if (!user) {
      throw new Error('User not found');
    }
    if (!user.isActive) {
      throw new Error('User is not active');
    }

    const code = Challenge.generateCode();
    const now = new Date();
    const challenge = new Challenge({
      attempts: 0,
      code: this.encript.encrypt(code),
      context: ChallengeContext.RECOVERY,
      createdAt: now,
      expiresAt: Challenge.nowPlusFiveMinutes(),
      id: Id.generate(),
      isUsed: false,
      maxAttempts: 5,
      updatedAt: now,
      userId: user.getId(),
    });
    await this.challengeRepo.save(challenge);

    const message = `WTT-OTP
    Seu código de verificação é ${code}
    `;
    await this.smsService.send(user.getPhone(), message);

    return {
      challengeId: challenge.getId().getValue(),
      sucess: true,
    };
  }
}
