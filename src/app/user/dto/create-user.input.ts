import { InputType, Field } from '@nestjs/graphql';
import { RolesEnum } from '../entities/roles.enum';
import { IsStrongPassword, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'The username of the user.' })
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @Field(() => String, { description: 'The password of the user.' })
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  @Field(() => RolesEnum, {
    defaultValue: RolesEnum.USER,
    description: 'The role of the user. Defaults to "USER".',
  })
  role?: RolesEnum;
}
