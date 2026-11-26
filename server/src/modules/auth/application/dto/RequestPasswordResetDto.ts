import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

export default class RequestPasswordResetDto {
  @ApiProperty({
    description: 'Número de telefone associado à conta.',
    example: '+244923456789',
    type: String,
  })
  @IsString()
  @IsPhoneNumber('AO')
  phone!: string;
}
