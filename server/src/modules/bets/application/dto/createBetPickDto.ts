import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { OddType } from '@/modules/games/domain/entities/Game';

export default class CreateBetPickDto {
  @ApiProperty({
    description: 'ID da partida',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  matchId!: string;

  @ApiProperty({
    description: 'Tipo de odd escolhido',
    enum: OddType,
    example: OddType.HOME_WIN,
  })
  @IsEnum(OddType)
  @IsNotEmpty()
  oddType!: OddType;
}
