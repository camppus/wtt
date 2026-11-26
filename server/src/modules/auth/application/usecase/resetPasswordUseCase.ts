import Encript from '@/infra/security/encript';
import type UserRepo from '@/modules/users/domain/repositories/UserRepo';
import { Inject, Injectable } from '@nestjs/common';
import type ChallengeRepo from '../../domain/repositories/ChallengeRepo';
import { ChallengeContext } from '../../domain/entities/Challenge';
import Id from '@/shared/entities/Id';
import Password from '@/modules/users/domain/entities/Password';
import ConfirmPasswordResetDto from '../dto/ConfirmPasswordResetDto';
import { Hasher } from '@/infra/security/hasher';

@Injectable()
export default class VerifyRecoveryChallengeUseCase {
  constructor(
    private readonly encript: Encript,
    private readonly hasher: Hasher,
    @Inject('UserRepo')
    private readonly userRepo: UserRepo,
    @Inject('ChallengeRepo')
    private readonly challengeRepo: ChallengeRepo,
  ) {}

  async handle(dto: ConfirmPasswordResetDto) {
    const challenge = await this.challengeRepo.getById(new Id(dto.challengeId));
    const password = new Password(dto.newPassword);
    const passwordHash = this.hasher.hash(password);

    if (!challenge) {
      throw new Error('Challenge not found');
    }

    if (challenge.getContext() !== ChallengeContext.RECOVERY) {
      throw new Error('Invalid challenge context');
    }

    if (challenge.isUsed()) {
      throw new Error('Challenge has already been used');
    }

    if (challenge.isExpired()) {
      throw new Error('Challenge has expired');
    }

    if (!challenge.canAttempt()) {
      throw new Error('Maximum challenge attempts exceeded');
    }

    const user = await this.userRepo.getById(challenge.getUserId());

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.isActive) {
      throw new Error('User is not active');
    }

    const storedCode = this.encript.decrypt(challenge.getCode());

    if (storedCode !== dto.code) {
      challenge.registerFailedAttempt();
      await this.challengeRepo.save(challenge);
      throw new Error('Invalid challenge code');
    }

    challenge.markAsUsed();
    await this.challengeRepo.save(challenge);
    await this.userRepo.updatePassword(user.getId(), passwordHash);

    return {
      success: true,
      userId: user.getId().getValue(),
      challengeId: challenge.getId().getValue(),
    };
  }
}
