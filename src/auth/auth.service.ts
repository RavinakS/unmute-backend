import { UsersService } from '@/users/users.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException('Email Already Exists');
    }

    const hasheedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.createUser({
      ...registerDto,
      password: hasheedPassword,
    });
    const { password, ...userWithoutPassword } = user.toObject();

    return {
      message: 'User registered successfully.',
      user: userWithoutPassword,
    };
  }
}
