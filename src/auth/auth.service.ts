import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public getTokenForUser(user: User): string {
    return this.jwtService.sign({
      username: user.username,
      sub: user.id,
    });
  }

  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      this.logger.debug(`User not found: ${username}`);
      throw new UnauthorizedException();
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      this.logger.debug(`Invalid password for user: ${username}`);
      throw new UnauthorizedException();
    }

    return user;
  }
}
