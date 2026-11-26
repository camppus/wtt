import Encript from '@/infra/security/encript';
import { Hasher } from '@/infra/security/hasher';
import type { SMSService } from '@/infra/SMS';
import type UserRepo from '@/modules/users/domain/repositories/UserRepo';
import { Inject, Injectable } from '@nestjs/common';
import type ChallengeRepo from '../../domain/repositories/ChallengeRepo';
import RequestLoginChallengeDto from '../dto/requestLoginChallenge.dto';
import { PhoneNumber } from '@/modules/users/domain/entities/PhoneNumber';
import Password from '@/modules/users/domain/entities/Password';
import Challenge, { ChallengeContext } from '../../domain/entities/Challenge';
import Id from '@/shared/entities/Id';

@Injectable()
export default class RequestLoginChallengeUseCase {
  constructor(
    private readonly encript: Encript,
    private readonly hasher: Hasher,
    @Inject('UserRepo')
    private readonly userRepo: UserRepo,
    @Inject('SMSService')
    private readonly smsService: SMSService,
    @Inject('ChallengeRepo')
    private readonly challengeRepo: ChallengeRepo,
  ) {}

  async handle(dto: RequestLoginChallengeDto) {
    const phone = new PhoneNumber(dto.phone);
    const password = dto.password;

    const user = await this.userRepo.getByPhone(phone);

    if (!user) {
      throw new Error('User not found');
    }
    if (!user.isActive) {
      throw new Error('User is not active');
    }

    const isPasswordValid = this.hasher.compare(
      password,
      new Password(user.getPassword()),
    );

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const code = Challenge.generateCode();
    const now = new Date();
    const challenge = new Challenge({
      attempts: 0,
      code: this.encript.encrypt(code),
      context: ChallengeContext.LOGIN,
      createdAt: now,
      expiresAt: now,
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
