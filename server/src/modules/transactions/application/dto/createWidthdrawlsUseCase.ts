import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { TransationsMehtod } from '../../domain/entities/TransationsMehtod';

export default class CreateWidthDralwsDto {
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({
    description: 'Amount',
  })
  amount!: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'coordnate',
  })
  coordnate!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'method',
    enum: TransationsMehtod,
  })
  @IsEnum(TransationsMehtod)
  method!: TransationsMehtod;
}
