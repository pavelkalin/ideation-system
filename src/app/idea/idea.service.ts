import { Injectable } from '@nestjs/common';
import { CreateIdeaInput } from './dto/create-idea.input';
import { UpdateIdeaInput } from './dto/update-idea.input';

@Injectable()
export class IdeaService {
  create(createIdeaInput: CreateIdeaInput) {
    return 'This action adds a new idea';
  }

  findAll() {
    return `This action returns all idea`;
  }

  findOne(id: number) {
    return `This action returns a #${id} idea`;
  }

  update(id: number, updateIdeaInput: UpdateIdeaInput) {
    return `This action updates a #${id} idea`;
  }

  remove(id: number) {
    return `This action removes a #${id} idea`;
  }
}
