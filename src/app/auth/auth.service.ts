import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserInput } from '../user/dto/create-user.input';
import { ConfigService } from '@nestjs/config';
import { LoginUserInput } from './dto/login-user.input';
import { Model } from 'mongoose';
import { BlacklistedToken } from './schemas/blacklisted-token.schema';
import { InjectModel } from '@nestjs/mongoose';

/**
 * AuthService is responsible for handling user authentication and authorization
 * including sign up, login, logout and validations.
 */
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(BlacklistedToken.name)
    private blacklistedTokenModel: Model<BlacklistedToken>,
  ) {}

  /**
   * Validate user credentials. If valid, return user.
   */
  async validateUser(loginUserInput: LoginUserInput) {
    const { username, password } = loginUserInput;
    const user = await this.userService.findUserByUsername(username);

    if (user && user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) return user;
    }

    return null;
  }

  /**
   * Login a user and return JWT token.
   */
  login(user: User) {
    return {
      user,
      token: this.jwtService.sign(
        {
          name: user.username,
          sub: user._id,
          role: user.role,
          userId: user._id,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      ),
    };
  }

  /**
   * Check if a token is blacklisted.
   */
  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await this.blacklistedTokenModel.findOne({
      token,
    });
    return !!blacklistedToken;
  }

  /**
   * Blacklist a token.
   */
  async blacklistToken(token: string) {
    const blacklistedToken = new this.blacklistedTokenModel({ token });
    await blacklistedToken.save();
    return true;
  }

  /**
   * Logout a user by blacklisting their token.
   */
  async logout(token: string) {
    return await this.blacklistToken(token);
  }

  /**
   * Sign up a new user. If the username already exists, throw an error.
   */
  async signup(payload: CreateUserInput) {
    const user = await this.userService.findUserByUsername(payload.username);

    if (user) throw new Error('User already exists, login instead');

    const hash = await bcrypt.hash(
      payload.password,
      Number(this.configService.get<string>('SALT_ROUND')),
    );

    return this.userService.createUser({ ...payload, password: hash });
  }
}
