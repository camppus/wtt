import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import CreateBetPickDto from './createBetPickDto';

export default class CreateBetSlipDto {
  @ApiProperty({
    description: 'Valor da aposta',
    example: 1000,
    minimum: 1,
  })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  @IsNotEmpty()
  amount!: number;

  @ApiProperty({
    description: 'Lista de seleções da aposta',
    type: [CreateBetPickDto],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateBetPickDto)
  picks!: CreateBetPickDto[];
}
