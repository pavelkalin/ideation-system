import { Injectable, Req, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class CommonService {
  extractJwtTokenFromRequest(@Req() req): string {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader.split(' ')[0] !== 'Bearer') {
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }
    return authHeader.split(' ')[1];
  }
}
