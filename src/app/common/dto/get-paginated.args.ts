import { Field, ArgsType, Int } from '@nestjs/graphql';

@ArgsType()
export class GetPaginatedArgs {
  @Field(() => Int, {
    description: 'The maximum number of results to return',
    defaultValue: 10,
    nullable: true,
  })
  limit?: number;

  @Field(() => Int, {
    description:
      'The number of results to skip before starting to fetch results',
    defaultValue: 0,
    nullable: true,
  })
  skip?: number;
}
