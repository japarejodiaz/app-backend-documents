import { Module } from '@nestjs/common';
import { OpenAiAdapter } from './openai.adapter';
import { PersistenceModule } from '../persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  providers: [OpenAiAdapter],
  exports: [OpenAiAdapter],
})
export class AiModule {}
