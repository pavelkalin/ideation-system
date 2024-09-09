import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeMongoDBConnection,
  rootMongooseTestModule,
} from '../common/helpers/mongoose.helper';
import { IdeaService } from './idea.service';
import { Idea, IdeaSchema } from './entities/idea.entity';
import * as Chance from 'chance';
import { CreateIdeaInput } from './dto/create-idea.input';
import { Schema as MongooSchema } from 'mongoose';
import { UpdateIdeaInput } from './dto/update-idea.input';
import { GetPaginatedArgs } from '../common/dto/get-paginated.args';
import { User, UserSchema } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import {
  createUserInput,
  createUserInputAdmin,
} from '../user/user.service.spec';
import { JwtModule } from '@nestjs/jwt';
import {
  IDEA_DELETE_EXCEPTION,
  IDEA_NOT_FOUND,
  IDEA_UPDATE_EXCEPTION,
} from './exceptions/idea.messages';
type UserWithId = User & { id?: string };

const chance = new Chance();

const TITLE_LENGTH = 10;
const UPDATED_TITLE_LENGTH = 20;
const DESCRIPTION_LENGTH = 100;
const UPDATED_DESCRIPTION_LENGTH = 200;

const createIdeaInput: CreateIdeaInput = {
  title: chance.string({ length: TITLE_LENGTH }),
  description: chance.string({ length: DESCRIPTION_LENGTH }),
};

const updateIdeaInput: UpdateIdeaInput = {
  _id: new MongooSchema.Types.ObjectId(''),
  title: chance.string({ length: UPDATED_TITLE_LENGTH }),
  description: chance.string({ length: UPDATED_DESCRIPTION_LENGTH }),
};

describe('IdeaService', () => {
  let service: IdeaService;
  let userService: UserService;
  let module: TestingModule;
  let user1: UserWithId, user2: UserWithId, userAdmin: UserWithId;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [IdeaService],
      imports: [
        rootMongooseTestModule(),
        ConfigModule.forRoot(),
        UserModule,
        JwtModule.register({
          secret: 'testSecret',
          signOptions: {
            expiresIn: '24h',
          },
        }),
        MongooseModule.forFeature([
          {
            name: Idea.name,
            schema: IdeaSchema,
          },
          {
            name: User.name,
            schema: UserSchema,
          },
        ]),
      ],
    }).compile();

    service = module.get<IdeaService>(IdeaService);
    userService = module.get<UserService>(UserService);

    user1 = await userService.createUser(createUserInput);
    user1.id = String(user1._id);
    user2 = await userService.createUser(createUserInput);
    user2.id = String(user2._id);
    userAdmin = await userService.createUser(createUserInputAdmin);
    userAdmin.id = String(userAdmin._id);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeMongoDBConnection();
    }
  });

  it('user should create a new idea', async () => {
    const idea = await service.createIdea(createIdeaInput, user1.id);

    expect(idea).toBeDefined();
    expect(idea.title).toBe(createIdeaInput.title);
    expect(idea.description).toBe(createIdeaInput.description);
    expect(idea.title.length).toBe(TITLE_LENGTH);
    expect(idea.description.length).toBe(DESCRIPTION_LENGTH);
    updateIdeaInput._id = idea._id;
  });

  it('should get the list of ideas paginated with user populated', async () => {
    const paginationQuery: GetPaginatedArgs = { skip: 0, limit: 10 };
    const { limit, skip } = paginationQuery;
    const response = await service.findAllIdeas(String(user1._id), limit, skip);

    // ideasCount field
    expect(response.ideasCount).toBeLessThanOrEqual(limit);
    expect(response.ideasCount).toBe(1);

    // ideas fields
    expect(response.ideas.length).toBeLessThanOrEqual(limit);
    expect(response.ideas.length).toBe(1);
    expect(response.ideas[0].user).toBeDefined();
    expect(response.ideas[0].title).toBe(createIdeaInput.title);
    expect(response.ideas[0].description).toBe(createIdeaInput.description);

    expect(response.ideas[0].user._id).toStrictEqual(user1._id);
  });

  it('user should get his idea by its id', async () => {
    const idea = (await service.getIdeaById(
      updateIdeaInput._id,
      user1.id,
    )) as Idea;
    expect(idea.title).toBe(createIdeaInput.title);
    expect(idea.description).toBe(createIdeaInput.description);
    expect(idea.user._id).toStrictEqual(user1._id);
  });

  it('user of role USER should not get other user idea by its id', async () => {
    try {
      await service.getIdeaById(updateIdeaInput._id, user2.id);
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.response).toBeDefined();
      expect(err.message).toBe(IDEA_NOT_FOUND);
    }
  });

  it('admin user should get user1 idea by its id', async () => {
    const idea = (await service.getIdeaById(
      updateIdeaInput._id,
      userAdmin.id,
      true,
    )) as Idea;
    expect(idea.title).toBe(createIdeaInput.title);
    expect(idea.description).toBe(createIdeaInput.description);
    expect(idea.user._id).toStrictEqual(user1._id);
  });

  it('user should update his idea by the updateIdeaInput', async () => {
    const updatedIdea = (await service.updateIdea(
      updateIdeaInput._id,
      updateIdeaInput,
      user1.id,
    )) as Idea;

    expect(updatedIdea.title).not.toBe(createIdeaInput.title);
    expect(updatedIdea.title.length).toBe(UPDATED_TITLE_LENGTH);
    expect(updatedIdea.description).not.toBe(createIdeaInput.description);
    expect(updatedIdea.description.length).toBe(UPDATED_DESCRIPTION_LENGTH);
  });

  it('user of role USER should not update not his idea by the updateIdeaInput', async () => {
    try {
      await service.updateIdea(updateIdeaInput._id, updateIdeaInput, user2.id);
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.response).toBeDefined();
      expect(err.message).toBe(IDEA_UPDATE_EXCEPTION);
    }
  });

  it('admin user should update any user idea by the updateIdeaInput', async () => {
    const updatedIdea = (await service.updateIdea(
      updateIdeaInput._id,
      updateIdeaInput,
      userAdmin.id,
      true,
    )) as Idea;

    expect(updatedIdea.title).not.toBe(createIdeaInput.title);
    expect(updatedIdea.title.length).toBe(UPDATED_TITLE_LENGTH);
    expect(updatedIdea.description).not.toBe(createIdeaInput.description);
    expect(updatedIdea.description.length).toBe(UPDATED_DESCRIPTION_LENGTH);
  });

  it('user should remove his idea', async () => {
    const deleted = await service.removeIdea(updateIdeaInput._id, user1.id);
    expect(deleted).toBeDefined();
  });

  it('user should not remove not his idea', async () => {
    const deleted = await service.removeIdea(updateIdeaInput._id, user1.id);
    expect(deleted).toBeDefined();

    try {
      await service.removeIdea(updateIdeaInput._id, user2.id);
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.response).toBeDefined();
      expect(err.message).toBe(IDEA_DELETE_EXCEPTION);
    }
  });

  it('admin user should remove any idea', async () => {
    const deleted = await service.removeIdea(
      updateIdeaInput._id,
      userAdmin.id,
      true,
    );
    expect(deleted).toBeDefined();
  });
});
