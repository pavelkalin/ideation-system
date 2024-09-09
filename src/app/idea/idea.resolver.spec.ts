import { Test, TestingModule } from '@nestjs/testing';
import { IdeaResolver } from './idea.resolver';
import { IdeaService } from './idea.service';
import { CreateIdeaInput } from './dto/create-idea.input';
import { UpdateIdeaInput } from './dto/update-idea.input';
import { Schema as MongooSchema } from 'mongoose';
import * as Chance from 'chance';
import { createUserInput } from '../user/user.service.spec';
import { Idea } from './entities/idea.entity';
import { User } from '../user/entities/user.entity';
import { IDEA_NOT_FOUND } from './exceptions/idea.messages';

const chance = new Chance();
let ideaId = new MongooSchema.Types.ObjectId('');

const TITLE_LENGTH = 10;
const UPDATED_TITLE_LENGTH = 20;
const DESCRIPTION_LENGTH = 100;

const createIdeaInput: CreateIdeaInput = {
  title: chance.string({ length: TITLE_LENGTH }),
  description: chance.string({ length: DESCRIPTION_LENGTH }),
};

const updateIdeaInput: UpdateIdeaInput = {
  _id: new MongooSchema.Types.ObjectId(''),
  title: chance.string({ length: UPDATED_TITLE_LENGTH }),
};

const user: Partial<User> = {
  ...createUserInput,
  _id: new MongooSchema.Types.ObjectId(''),
};

const context = { req: { user } };

describe('IdeaResolver', () => {
  let resolver: IdeaResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IdeaResolver,
        {
          provide: IdeaService,
          useValue: {
            createIdea: jest.fn(() => {
              return {
                _id: ideaId,
                ...createIdeaInput,
              };
            }),
            findAllIdeas: jest.fn(() => {
              return {
                ideas: [
                  {
                    ...createIdeaInput,
                    _id: ideaId,
                  },
                ],
                ideasCount: 1,
              };
            }),
            getIdeaById: jest.fn(() => {
              return {
                ...createIdeaInput,
                _id: ideaId,
              };
            }),
            updateIdea: jest.fn(() => {
              return {
                _id: ideaId,
                ...createIdeaInput,
                ...updateIdeaInput,
              };
            }),
            removeIdea: jest.fn(() => {
              return {};
            }),
          },
        },
      ],
    }).compile();

    resolver = module.get<IdeaResolver>(IdeaResolver);
  });

  it('should be able to create a idea', async () => {
    const idea = await resolver.createIdea(createIdeaInput, context);

    expect(idea).toBeDefined();
    expect(idea.title).toBe(createIdeaInput.title);
    expect(idea.description.length).toBe(DESCRIPTION_LENGTH);

    ideaId = idea._id;
    updateIdeaInput._id = idea._id;
  });

  it('should get a list of ideas, paginated', async () => {
    const ideas = await resolver.findAllIdeas({ limit: 10, skip: 0 }, context);

    expect(ideas.ideasCount).toBe(1);
    expect(ideas.ideas[0].title).toBe(createIdeaInput.title);
    expect(ideas.ideas[0].description).toBe(createIdeaInput.description);
  });

  it('should get a idea by its id', async () => {
    const idea = (await resolver.findOne(
      { skip: 0, limit: 10, _id: updateIdeaInput._id },
      context,
    )) as Idea;

    expect(idea.title).toBe(createIdeaInput.title);
    expect(idea.description).toBe(createIdeaInput.description);
  });

  it('should be able to update a idea', async () => {
    const updatedIdea = await resolver.updateIdea(updateIdeaInput, context);

    expect(updatedIdea.title).not.toBe(createIdeaInput.title);
    expect(updatedIdea.title.length).not.toBe(TITLE_LENGTH);
    expect(updatedIdea.title.length).toBe(UPDATED_TITLE_LENGTH);

    // the rest of the idea details remain the same
    expect(updatedIdea.description).toBe(createIdeaInput.description);
  });

  it('should remove the idea', async () => {
    const removedIdea = await resolver.removeIdea(ideaId, context);
    expect(removedIdea).toBeDefined();
  });

  it('should throw an error when getting a removed idea', async () => {
    try {
      await resolver.findOne({ skip: 0, limit: 10, _id: ideaId }, context);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.response).toBeDefined();
      expect(error.message).toBe(IDEA_NOT_FOUND);
    }
  });
});
