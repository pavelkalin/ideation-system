import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooSchema } from 'mongoose';
import { CreateIdeaInput } from './dto/create-idea.input';
import { UpdateIdeaInput } from './dto/update-idea.input';
import { Idea, IdeaDocument } from './entities/idea.entity';
import {
  IDEA_NOT_FOUND,
  IDEA_UPDATE_EXCEPTION,
} from './exceptions/idea.messages';
import {
  IDEA_DELETE_EXCEPTION,
  IDEA_DELETE_MESSAGE,
} from './exceptions/idea.messages';

@Injectable()
export class IdeaService {
  constructor(
    @InjectModel(Idea.name)
    private ideaModel: Model<IdeaDocument>,
  ) {}

  createIdea(createIdeaInput: CreateIdeaInput, userId: string) {
    const createdIdea = new this.ideaModel({
      ...createIdeaInput,
      user: userId,
    });
    return createdIdea.save();
  }

  async findAllIdeas(
    userId: string,
    limit: number,
    skip: number,
    isAdmin: boolean = false,
  ) {
    if (isAdmin) {
      const ideasCount = await this.ideaModel.countDocuments();
      const ideas = await this.ideaModel
        .find()
        .populate('user')
        .skip(skip)
        .limit(limit);

      return {
        ideas,
        ideasCount,
        message: 'Admin view - All ideas retrieved successfully',
      };
    }

    const ideasCount = await this.ideaModel
      .find({ user: userId })
      .countDocuments();
    const ideas = await this.ideaModel
      .find({ user: userId })
      .populate('user')
      .skip(skip)
      .limit(limit);

    return {
      ideas,
      ideasCount,
      message: `${ideas.length} ideas are shown`,
    };
  }

  async getIdeaById(
    id: MongooSchema.Types.ObjectId,
    userId: string,
    isAdmin: boolean = false,
  ) {
    if (isAdmin) return this.ideaModel.findById(id).populate('user');
    const idea = await this.ideaModel
      .findOne({ _id: id, user: userId })
      .populate('user');
    if (!idea) return new Error(IDEA_NOT_FOUND);
    return idea;
  }

  async updateIdea(
    id: MongooSchema.Types.ObjectId,
    updateIdeaInput: UpdateIdeaInput,
    userId: string,
    isAdmin: boolean = false,
  ) {
    let updatedIdea;
    try {
      if (isAdmin) {
        updatedIdea = await this.ideaModel.findByIdAndUpdate(
          id,
          updateIdeaInput,
          {
            new: true,
          },
        );
        if (!updatedIdea) return new Error(IDEA_UPDATE_EXCEPTION);
        return updatedIdea;
      }

      updatedIdea = await this.ideaModel.findOneAndUpdate(
        { _id: id, user: userId },
        updateIdeaInput,
        { new: true },
      );
      if (!updatedIdea) return new Error(IDEA_UPDATE_EXCEPTION);
      return updatedIdea;
    } catch (err) {
      return new Error(IDEA_UPDATE_EXCEPTION);
    }
  }

  async removeIdea(
    id: MongooSchema.Types.ObjectId,
    userId: string,
    isAdmin: boolean = false,
  ) {
    let deletedIdea;
    try {
      if (isAdmin) {
        deletedIdea = await this.ideaModel.findOneAndDelete({ _id: id });
        if (!deletedIdea) return new Error(IDEA_DELETE_EXCEPTION);
        return IDEA_DELETE_MESSAGE;
      }
      deletedIdea = await this.ideaModel.findOneAndDelete({
        _id: id,
        user: userId,
      });
      if (!deletedIdea) return new Error(IDEA_DELETE_EXCEPTION);
      return IDEA_DELETE_MESSAGE;
    } catch (err) {
      return new Error(IDEA_DELETE_EXCEPTION);
    }
  }
}
