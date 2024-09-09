import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { Schema as MongooSchema } from 'mongoose';
import * as Chance from 'chance';
import { CreateUserInput } from '../user/dto/create-user.input';
import { CommonService } from '../common/common.service';

const userId = new MongooSchema.Types.ObjectId('');
const chance = new Chance();

const signupUserInput: CreateUserInput = {
  username: chance.string({ length: 12 }),
  password: 'NewPassword2!',
};

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        CommonService,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(() => {
              // should return a user
              return {
                _id: userId,
                ...signupUserInput,
              };
            }),
            login: jest.fn(() => {
              return {
                user: {
                  _id: userId,
                  ...signupUserInput,
                },
                token: 'any-fake-token',
              };
            }),
            signup: jest.fn(() => {
              return {
                _id: userId,
                ...signupUserInput,
              };
            }),
            logout: jest.fn(() => {
              return {
                message: 'You were successfully logged out',
              };
            }),
          },
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('create a new user', async () => {
    const user = await resolver.signup(signupUserInput);

    expect(user.username).toBe(signupUserInput.username);
  });

  it('should log in an existing user', async () => {
    const user = resolver.login(
      {
        username: signupUserInput.username,
        password: signupUserInput.password,
      },
      // context
      {},
    );

    expect(user.user.username).toBe(signupUserInput.username);
  });

  it('should log out an existing user', async () => {
    const result = resolver.logout({
      req: { headers: { authorization: 'Bearer any-fake-token' } },
    });
    expect(result.message).toBe('You were successfully logged out');
  });
});
