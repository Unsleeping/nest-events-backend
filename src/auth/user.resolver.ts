import { Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { User } from './user.entity';
import { CurrentUser } from './current-user.decorator';
import { AuthGuardJwtGql } from './auth-guard-jwt.gql';

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  @UseGuards(AuthGuardJwtGql)
  public async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
