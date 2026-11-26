import Encript from '@/infra/security/encript';
import type UserRepo from '@/modules/users/domain/repositories/UserRepo';
import { Inject, Injectable } from '@nestjs/common';
import type ChallengeRepo from '../../domain/repositories/ChallengeRepo';
import { ChallengeContext } from '../../domain/entities/Challenge';
import VerifyLoginChallengeDto from '../dto/VerifyLoginChallengeDto';
import Id from '@/shared/entities/Id';
import Token from '@/infra/security/token';

@Injectable()
export default class VerifyLoginChallengeUseCase {
  constructor(
    private readonly encript: Encript,
    private readonly tokenService: Token,
    @Inject('UserRepo')
    private readonly userRepo: UserRepo,

    @Inject('ChallengeRepo')
    private readonly challengeRepo: ChallengeRepo,
  ) {}

  async handle(dto: VerifyLoginChallengeDto) {
    const challenge = await this.challengeRepo.getById(new Id(dto.challengeId));

    if (!challenge) {
      throw new Error('Challenge not found');
    }

    if (challenge.getContext() !== ChallengeContext.LOGIN) {
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

    const session = this.tokenService.generate(
      {
        sub: user.getStringfiedId(),
      },
      '30d',
    );
    return {
      success: true,
      userId: user.getId().getValue(),
      challengeId: challenge.getId().getValue(),
      session,
    };
  }
}
