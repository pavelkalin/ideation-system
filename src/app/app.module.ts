import { Logger, Module } from '@nestjs/common';
import { AppResolver } from './app.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
// import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { IdeaModule } from './idea/idea.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      //plugins: [ApolloServerPluginLandingPageLocalDefault() as any],
      introspection: true,
      formatError: (error) => {
        Logger.error(
          `Http Status: ${(error.extensions as any)?.originalError?.statusCode ?? 400}, Message: ${error.message}`,
          'ExceptionFilter',
        );
        return { message: error.message };
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const options: MongooseModuleOptions = {
          uri: configService.get<string>('DATABASE_URL'),
        };

        return options;
      },
    }),
    ConfigModule.forRoot({
      cache: true,
    }),
    UserModule,
    IdeaModule,
    AuthModule,
  ],
  controllers: [],
  providers: [AppResolver],
})
export class AppModule {}
