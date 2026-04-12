import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RunAnalysisDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  documentId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ enum: ['summary', 'keywords', 'topics', 'clauses', 'full'] })
  @IsString()
  @IsNotEmpty()
  type: string;
}
