import { Module } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaResolver } from './idea.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Idea, IdeaSchema } from './entities/idea.entity';

@Module({
  providers: [IdeaResolver, IdeaService],
  imports: [
    MongooseModule.forFeature([{ name: Idea.name, schema: IdeaSchema }]),
  ],
})
export class IdeaModule {}
