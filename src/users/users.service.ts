import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModule: Model<User>,
  ) {}

  async testInsert() {
    return this.userModule.create({
      name: 'Ravina',
      email: 'ravina@gmail.com',
    });
  }
}
