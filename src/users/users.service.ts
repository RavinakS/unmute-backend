import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterDto } from '@/auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModule: Model<User>,
  ) {}

  async createUser(registerDto: RegisterDto) {
    const user = await this.userModule.create(registerDto);

    return user;
  }

  async findByEmail(email: string) {
    return this.userModule.findOne({ email }).select('+password');
  }

  async findById(id: string) {
    return this.userModule.findById(id);
  }
}
