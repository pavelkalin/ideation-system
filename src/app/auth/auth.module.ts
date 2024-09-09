import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../user/user.module';
import { JwtModule, JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import {
  BlacklistedToken,
  BlacklistedTokenSchema,
} from './schemas/blacklisted-token.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonService } from '../common/common.service';

@Module({
  providers: [
    AuthService,
    AuthResolver,
    JwtService,
    JwtStrategy,
    LocalStrategy,
    CommonService,
  ],
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: BlacklistedToken.name, schema: BlacklistedTokenSchema },
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const properties: JwtModuleOptions = {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: '24h',
          },
        };
        return properties;
      },
    }),
  ],
})
export class AuthModule {}
