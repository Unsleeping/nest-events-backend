import { Controller, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { User } from './user.entity';
import { AuthGuardLocal } from './auth-guard.local';
import { AuthGuardJwt } from './auth-guard.jwt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuardLocal) // name 'local' is fallback from local.strategy.ts, PassportStrategy(Strategy, name?)
  async login(@CurrentUser() user: User) {
    return {
      userId: user.id, // request will be populated with user from local.strategy.ts after successful validate() method
      // if validation is failed, UseGuards will not call this code
      token: this.authService.getTokenForUser(user),
    };
  }

  @Post('profile')
  @UseGuards(AuthGuardJwt)
  async getProfile(@CurrentUser() user: User) {
    return user; // request will be populated with user from jwt.strategy.ts after successful validate() method
  }
}
