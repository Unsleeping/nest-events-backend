import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { User } from './user.entity';
import { LocalStategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersController } from './users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // To inject the user repository
    JwtModule.registerAsync({
      // register async to get env, with static object, it's being resolved the moment the object is defined
      useFactory: () => ({
        secret: process.env.AUTH_SECRET,
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [LocalStategy, AuthService, JwtStrategy], // any class with @Injectable() should be registered in providers
  controllers: [AuthController, UsersController],
})
export class AuthModule {}
