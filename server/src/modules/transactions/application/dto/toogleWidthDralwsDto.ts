import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export default class ToogleWidthdralwsDto {
  @ApiProperty({
    description: 'fileUrl',
  })
  @IsOptional()
  @IsUrl()
  fileUrl?: string;

  @ApiProperty({
    description: 'note',
  })
  @IsOptional()
  @IsUrl()
  note?: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: 'status',
  })
  status!: string;
}
