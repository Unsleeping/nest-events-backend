import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './user.entity';

@Injectable()
export class LocalStategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStategy.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  public async validate(username: string, password: string): Promise<any> {
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
