import { ApiProperty } from '@nestjs/swagger';

export class AnalysisResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  documentId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  result: any;

  @ApiProperty()
  createdAt: Date;
}