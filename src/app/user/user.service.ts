import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserInput } from './dto/create-user.input';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async createUser(createUserInput: CreateUserInput) {
    const createdUser = new this.userModel(createUserInput);

    return createdUser.save();
  }

  findUserByUsername(username: string) {
    return this.userModel.findOne({ username });
  }
}
