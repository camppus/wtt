import { Body, Controller, Post, Put } from '@nestjs/common';
import RequestLoginChallengeDto from '../../application/dto/requestLoginChallenge.dto';
import RequestRecoveryChallengeUseCase from '../../application/usecase/requestRecoveryChallengeUseCase';
import VerifyLoginChallengeDto from '../../application/dto/VerifyLoginChallengeDto';
import VerifyRecoveryChallengeUseCase from '../../application/usecase/resetPasswordUseCase';
import RequestLoginChallengeUseCase from '../../application/usecase/requestLoginChallangeUseCase';
import VerifyLoginChallengeUseCase from '../../application/usecase/verifyLoginChallengeUsecase';
import { ApiOperation } from '@nestjs/swagger';
import RequestPasswordResetDto from '../../application/dto/RequestPasswordResetDto';
import ConfirmPasswordResetDto from '../../application/dto/ConfirmPasswordResetDto';
import CreateUserUseCase from '@/modules/users/application/usecases/createUserUseCase';
import { CreateUserDto } from '@/modules/users/application/dto/createUserDto';

@Controller('auth')
export default class AuthController {
  constructor(
    private readonly requestLoginUc: RequestLoginChallengeUseCase,
    private readonly requestRecoveryUc: RequestRecoveryChallengeUseCase,
    private readonly verifyloginChallengeUc: VerifyLoginChallengeUseCase,
    private readonly verifyRecoveryUc: VerifyRecoveryChallengeUseCase,
    private readonly registerUc: CreateUserUseCase,
  ) {}

  @ApiOperation({
    summary: 'Register',
  })
  @Post('register')
  public async register(@Body() dto: CreateUserDto) {
    const user = await this.registerUc.handle(dto);
    return {
      sucess: user.id ? true : false,
    };
  }

  @ApiOperation({
    summary: 'Request login',
  })
  @Post('request-login')
  public async requestLogin(@Body() dto: RequestLoginChallengeDto) {
    return await this.requestLoginUc.handle(dto);
  }

  @ApiOperation({
    summary: 'Verify login',
  })
  @Put('verify-login')
  public async verifyLoginChallenge(@Body() dto: VerifyLoginChallengeDto) {
    return await this.verifyloginChallengeUc.handle(dto);
  }

  @ApiOperation({
    summary: 'Request recovery',
  })
  @Post('request-recovery')
  public async requestRecovery(@Body() dto: RequestPasswordResetDto) {
    return await this.requestRecoveryUc.handle(dto);
  }

  @ApiOperation({
    summary: 'Verify recovery',
  })
  @Put('verify-recovery')
  public async verifyRecoveryChallenge(@Body() dto: ConfirmPasswordResetDto) {
    return await this.verifyRecoveryUc.handle(dto);
  }
}
