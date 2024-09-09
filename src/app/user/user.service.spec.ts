/* eslint-disable prefer-const */
import { User, UserSchema } from './entities/user.entity';
import {
  closeMongoDBConnection,
  rootMongooseTestModule,
} from '../common/helpers/mongoose.helper';
import { UserService } from './user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Chance from 'chance';
import { CreateUserInput } from './dto/create-user.input';
import { RolesEnum } from './entities/roles.enum';

const chance = new Chance();
let userId = '';

export const createUserInput: CreateUserInput = {
  username: chance.name(),
  password: 'FakePassword1?',
};

export const createUserInputAdmin: CreateUserInput = {
  username: chance.name(),
  password: 'FakePassword1?',
  role: RolesEnum.ADMIN,
};

describe('UserService', () => {
  let service: UserService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        ConfigModule.forRoot(),
        MongooseModule.forFeature([
          {
            name: User.name,
            schema: UserSchema,
          },
        ]),
      ],
      providers: [UserService, ConfigService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeMongoDBConnection();
    }
  });

  it('should create a user with createUserInput and default role USER', async () => {
    const user = await service.createUser(createUserInput);
    expect(user.id).toBeDefined();
    expect(user.username).toBe(createUserInput.username);
    expect(user.role).toBe(RolesEnum.USER);
    expect(user.password).not.toBeNull();
    userId = user.id;
  });

  it('should create a user with createUserInputAdmin and role Admin', async () => {
    const user = await service.createUser(createUserInputAdmin);
    expect(user.id).toBeDefined();
    expect(user.username).toBe(createUserInputAdmin.username);
    expect(user.role).toBe(RolesEnum.ADMIN);
    expect(user.password).not.toBeNull();
  });

  it('should get the user by username', async () => {
    const user = await service.findUserByUsername(createUserInput.username);
    expect(user.id).toBe(userId);
  });
});
