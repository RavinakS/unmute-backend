import { UsersService } from '@/users/users.service';

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

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

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid Emaill or Password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Email or Password');
    }

    const payload = { sub: user._id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    const { password, ...userWithoutPassword } = user.toObject();

    return {
      message: 'Login successfully',
      accessToken,
      user: userWithoutPassword,
    };
  }
}
