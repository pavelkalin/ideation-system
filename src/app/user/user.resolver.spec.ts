import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

describe('UserResolver', () => {
  let resolver: UserResolver;

  const mockUserService = {
    createUser: jest.fn(),
    findUserByUsername: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // include both UserResolver and UserService
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
