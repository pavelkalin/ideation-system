import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeMongoDBConnection,
  rootMongooseTestModule,
} from '../common/helpers/mongoose.helper';
import { CreateUserInput } from '../user/dto/create-user.input';
import { User, UserSchema } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import * as Chance from 'chance';
import { USER_ALREADY_EXIST_EXCEPTION } from '../common/exceptions/user.exceptions';
import {
  BlacklistedToken,
  BlacklistedTokenSchema,
} from './schemas/blacklisted-token.schema';

const chance = new Chance();
let user: User;

const signupUserInput: CreateUserInput = {
  username: chance.string({ length: 10 }),
  password: 'NewPassword2!',
};

describe('AuthService', () => {
  let service: AuthService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [AuthService, ConfigService, UserService, JwtService],
      imports: [
        UserModule,
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          {
            name: User.name,
            schema: UserSchema,
          },
          {
            name: BlacklistedToken.name,
            schema: BlacklistedTokenSchema,
          },
        ]),
        ConfigModule.forRoot(),
        JwtModule.register({
          secret: 'testSecret',
          signOptions: {
            expiresIn: '24h',
          },
        }),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeMongoDBConnection();
    }
  });

  it('should create a new user account', async () => {
    const user = await service.signup(signupUserInput);
    expect(user.password).not.toBe(signupUserInput.password);
    expect(user._id).toBeDefined();
    expect(user.username).toBe(signupUserInput.username);
  });

  // If the user already exists, should throw an error
  it('should throw an error if the user already exists', async () => {
    try {
      await service.signup(signupUserInput);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toBeDefined();
      expect(error.message).toBe(USER_ALREADY_EXIST_EXCEPTION);
    }
  });

  it('should validate an existing user', async () => {
    const user_ = await service.validateUser({
      username: signupUserInput.username,
      password: signupUserInput.password,
    });

    expect(user_).toBeDefined();
    expect(user_.username).toBe(signupUserInput.username);
    user = user_;
  });

  it('should return null if the user credentials are invalid', async () => {
    const user_ = await service.validateUser({
      username: signupUserInput.username,
      password: 'IncorrectPassword0!',
    });

    expect(user_).toBeNull();
  });

  it('should log in a validated user, and return a token', async () => {
    const response = service.login(user);

    expect(response).toBeDefined();
    expect(response.token).toBeDefined();
    expect(response.user.username).toBe(user.username);
    expect(response.user.role).toBe(user.role);
    expect(response.user._id).toBeDefined();
  });

  it('should log out user', async () => {
    // simulate logging in to generate a token
    const loginResponse = service.login(user);
    const token = loginResponse.token;

    const logoutResponse = await service.logout(token);

    // After logging out, the token should be blacklisted
    expect(logoutResponse).toEqual(true);
    const isBlacklisted = await service.isTokenBlacklisted(token);
    expect(isBlacklisted).toEqual(true);
  });

  it('should return an error on logout of logged out user', async () => {
    // simulate logging in to generate a token
    const loginResponse = service.login(user);
    const token = loginResponse.token;

    // perform a single logout
    await service.logout(token);

    // At this point, the same token has been blacklisted since user is logged out
    // Trying to logout again with the same token should throw an error
    try {
      await service.logout(token);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toBeDefined();
    }
  });
});
