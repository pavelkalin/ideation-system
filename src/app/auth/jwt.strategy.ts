import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { CommonService } from '../common/common.service';

/**
 * JWT Strategy for user authentication.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructor for JwtStrategy class
   * @param _configService - ConfigService instance
   * @param authService - AuthService instance
   * @param commonService - CommonService instance
   */
  constructor(
    private readonly _configService: ConfigService,
    private authService: AuthService,
    private commonService: CommonService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT token from request header
      ignoreExpiration: false,
      secretOrKey: _configService.get<string>('JWT_SECRET'), // JWT Secret key
      passReqToCallback: true, // Pass request object to validate method
    });
  }

  /**
   * Validate the request with the JWT token.
   * @param req - Request object
   * @param payload - JWT payload data
   * @returns - User's properties if token is valid, else throw an exception
   */
  async validate(req: Request, payload: any) {
    const token = this.commonService.extractJwtTokenFromRequest(req); // Extract JWT token from request
    if (await this.authService.isTokenBlacklisted(token)) {
      // Check if token is blacklisted
      throw new UnauthorizedException(
        'Your token has expired, please obtain new token',
      );
    }

    // Return user data if token is valid
    return {
      _id: payload.sub,
      name: payload.name,
      role: payload.role,
      userId: payload.userId,
    };
  }
}
