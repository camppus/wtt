import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export default class CreatePaymentDto {
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({
    description: 'Amount',
  })
  amount!: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'key',
  })
  key!: string;
}
