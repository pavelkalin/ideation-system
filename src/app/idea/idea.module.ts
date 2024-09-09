import { Module } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaResolver } from './idea.resolver';

@Module({
  providers: [IdeaResolver, IdeaService],
})
export class IdeaModule {}
