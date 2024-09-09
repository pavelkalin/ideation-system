import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';

/**
 * LocalStrategy service that extends PassportStrategy for local authentication.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * Creates LocalStrategy instance
   * @param {AuthService} authService - The injected AuthService
   */
  constructor(private authService: AuthService) {
    super();
  }

  /**
   * Validate the username and password. Return the user if the credentials are valid.
   * Throw an UnauthorizedException if the user does not exist.
   *
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @returns {Promise<User>} A Promise that resolves to an authenticated User.
   */
  async validate(username: string, password: string): Promise<User> {
    const user = await this.authService.validateUser({ username, password });
    this.ensureUserExists(user);
    console.log('USER from validate', user);
    return user;
  }

  /**
   * Checks if a user exists, if not, throws UnauthorizedException.
   *
   * @param {User} user - The User to ensure its existence.
   * @throws {UnauthorizedException} Throws UnauthorizedException if there is no user.
   */
  private ensureUserExists(user: User): void {
    if (!user) throw new UnauthorizedException();
  }
}
