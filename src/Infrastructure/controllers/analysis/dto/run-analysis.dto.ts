import { ApiProperty } from '@nestjs/swagger';

export class RunAnalysisDto {
  @ApiProperty()
  documentId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: ['summary', 'keywords', 'topics', 'clauses', 'full'] })
  type: string;
}
