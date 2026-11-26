import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

export default class RequestLoginChallengeDto {
  @ApiProperty({
    description: 'Número de telefone associado à conta',
    example: '+244923456789',
    type: String,
  })
  @IsString()
  @IsPhoneNumber('AO', {
    message: 'Phone must be a valid Angolan mobile number',
  })
  phone!: string;

  @ApiProperty({
    description: 'Senha da conta',
    example: 'MinhaSenha@123',
    minLength: 8,
    type: String,
  })
  @IsString()
  password!: string;
}
