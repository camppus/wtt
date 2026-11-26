import { Global, Module } from '@nestjs/common';
import AuthController from './infra/http/authController';
import RequestLoginChallengeUseCase from './application/usecase/requestLoginChallangeUseCase';
import RequestRecoveryChallengeUseCase from './application/usecase/requestRecoveryChallengeUseCase';
import VerifyLoginChallengeUseCase from './application/usecase/verifyLoginChallengeUsecase';
import VerifyRecoveryChallengeUseCase from './application/usecase/resetPasswordUseCase';
import SecurityModule from '@/infra/security';
import UserModule from '../users/infra/http/userModule';
import SMSModule from '@/infra/SMS';
import PrismaChallengeRepo from './infra/persistence/PrismaChallengeRepo';

@Global()
@Module({
  providers: [
    RequestLoginChallengeUseCase,
    RequestRecoveryChallengeUseCase,
    VerifyLoginChallengeUseCase,
    VerifyRecoveryChallengeUseCase,
    {
      provide: 'ChallengeRepo',
      useClass: PrismaChallengeRepo,
    },
  ],
  controllers: [AuthController],
  exports: ['ChallengeRepo'],
  imports: [SecurityModule, UserModule, SMSModule],
})
export default class AuthModule {}
