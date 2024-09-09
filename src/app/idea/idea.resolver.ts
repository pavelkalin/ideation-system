import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { IdeaService } from './idea.service';
import { Idea, GetIdeasPaginatedResponse } from './entities/idea.entity';
import { CreateIdeaInput } from './dto/create-idea.input';
import { UpdateIdeaInput } from './dto/update-idea.input';
import { GetPaginatedArgs } from '../common/dto/get-paginated.args';
import { GetPaginatedSubDocumentsArgs } from '../common/dto/get-paginated-sub-document.args';
import { Schema as MongooSchema } from 'mongoose';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserContext } from '../auth/dto/user-context';
import { RolesEnum } from '../user/entities/roles.enum';

/**
 * Resolver for Idea GraphQL requests
 */
@Resolver(() => Idea)
export class IdeaResolver {
  constructor(private readonly ideaService: IdeaService) {}

  private getUserAndRole(context: any) {
    const user: UserContext = context.req.user;
    const isAdmin = user.role === RolesEnum.ADMIN;

    return { user, isAdmin };
  }

  /**
   * Mutation to create an idea
   */
  @Mutation(() => Idea, { description: 'Create an Idea.' })
  @UseGuards(JwtAuthGuard)
  createIdea(
    @Args('createIdeaInput') createIdeaInput: CreateIdeaInput,
    @Context() context: any,
  ) {
    const user: UserContext = context.req.user;
    return this.ideaService.createIdea(createIdeaInput, user.userId);
  }

  /**
   * Query to get all ideas
   */
  @Query(() => GetIdeasPaginatedResponse, {
    name: 'ideas',
    description: 'Fetch all ideas.',
  })
  @UseGuards(JwtAuthGuard)
  findAllIdeas(@Args() args: GetPaginatedArgs, @Context() context: any) {
    const { user, isAdmin } = this.getUserAndRole(context);

    return this.ideaService.findAllIdeas(
      user.userId,
      args.limit,
      args.skip,
      isAdmin,
    );
  }

  /**
   * Query to get an idea by ID
   */
  @Query(() => Idea, {
    name: 'idea',
    description: 'Fetch an Idea by its ID.',
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Args() args: GetPaginatedSubDocumentsArgs, @Context() context: any) {
    const { user, isAdmin } = this.getUserAndRole(context);
    return this.ideaService.getIdeaById(args._id, user.userId, isAdmin);
  }

  /**
   * Mutation to update an idea by its ID
   */
  @Mutation(() => Idea, {
    description: 'Update an Idea by its ID.',
  })
  @UseGuards(JwtAuthGuard)
  async updateIdea(
    @Args('updateIdeaInput') updateIdeaInput: UpdateIdeaInput,
    @Context() context: any,
  ) {
    const { user, isAdmin } = this.getUserAndRole(context);

    return await this.ideaService.updateIdea(
      updateIdeaInput._id,
      updateIdeaInput,
      user.userId,
      isAdmin,
    );
  }

  /**
   * Mutation to delete an idea by its ID
   */
  @Mutation(() => String, {
    description: 'Delete an Idea by its ID.',
  })
  @UseGuards(JwtAuthGuard)
  async removeIdea(
    @Args('id', { type: () => String }) id: MongooSchema.Types.ObjectId,
    @Context() context: any,
  ) {
    const { user, isAdmin } = this.getUserAndRole(context);
    return await this.ideaService.removeIdea(id, user.userId, isAdmin);
  }
}
