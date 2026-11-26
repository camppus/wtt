import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length, Matches, MinLength } from 'class-validator';

export default class ConfirmPasswordResetDto {
  @ApiProperty({
    description: 'Identificador único do recovery challenge.',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID()
  challengeId!: string;

  @ApiProperty({
    description: 'Código de verificação enviado ao telefone.',
    example: '482193',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/)
  code!: string;

  @ApiProperty({
    description: 'Nova palavra-passe da conta.',
    example: 'MySecurePassword@2026',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  newPassword!: string;
}
