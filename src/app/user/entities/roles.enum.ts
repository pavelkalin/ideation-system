import { registerEnumType } from '@nestjs/graphql';

export enum RolesEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

registerEnumType(RolesEnum, {
  name: 'RolesEnum',
  description: 'The role of the user',
});
