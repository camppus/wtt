import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length, Matches } from 'class-validator';

export default class VerifyLoginChallengeDto {
  @ApiProperty({
    description: 'ID do challenge recebido ao solicitar o código de login',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsString()
  @IsUUID()
  challengeId!: string;

  @ApiProperty({
    description: 'Código de 6 dígitos enviado por SMS',
    example: '583214',
    minLength: 6,
    maxLength: 6,
    pattern: '^\\d{6}$',
  })
  @IsString()
  @Length(6, 6, {
    message: 'Code must contain exactly 6 digits',
  })
  @Matches(/^\d{6}$/, {
    message: 'Code must contain only numbers',
  })
  code!: string;
}
