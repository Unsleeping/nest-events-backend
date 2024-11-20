import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local')) // name 'local' is fallback from local.strategy.ts, PassportStrategy(Strategy, name?)
  async login(@Request() request) {
    return {
      userId: request.user.id, // request will be populated with user from local.strategy.ts after successful validate() method
      // if validation is failed, UseGuards will not call this code
      token: this.authService.getTokenForUser(request.user),
    };
  }

  @Post('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() request) {
    return request.user; // request will be populated with user from jwt.strategy.ts after successful validate() method
  }
}
