import { ApiProperty } from '@nestjs/swagger';

export class DocumentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  mimetype: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  storagePath: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  userId?: string;

  @ApiProperty({ required: false, description: 'Texto extraído del documento' })
  text?: string;

  @ApiProperty({ enum: ['PENDING', 'OK', 'NOK'] })
  status: 'PENDING' | 'OK' | 'NOK';
}
