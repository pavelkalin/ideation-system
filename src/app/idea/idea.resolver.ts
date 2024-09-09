import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { IdeaService } from './idea.service';
import { Idea } from './entities/idea.entity';
import { CreateIdeaInput } from './dto/create-idea.input';
import { UpdateIdeaInput } from './dto/update-idea.input';

@Resolver(() => Idea)
export class IdeaResolver {
  constructor(private readonly ideaService: IdeaService) {}

  @Mutation(() => Idea)
  createIdea(@Args('createIdeaInput') createIdeaInput: CreateIdeaInput) {
    return this.ideaService.create(createIdeaInput);
  }

  @Query(() => [Idea], { name: 'idea' })
  findAll() {
    return this.ideaService.findAll();
  }

  @Query(() => Idea, { name: 'idea' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.ideaService.findOne(id);
  }

  @Mutation(() => Idea)
  updateIdea(@Args('updateIdeaInput') updateIdeaInput: UpdateIdeaInput) {
    return this.ideaService.update(updateIdeaInput.id, updateIdeaInput);
  }

  @Mutation(() => Idea)
  removeIdea(@Args('id', { type: () => Int }) id: number) {
    return this.ideaService.remove(id);
  }
}
