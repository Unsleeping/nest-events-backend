import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { TokenOutput } from './input/token.output';
import { AuthService } from './auth.service';
import { LoginInput } from './input/login.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  // https://stackoverflow.com/a/64106012/17703165
  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation(() => TokenOutput, { name: 'login' })
  public async login(
    @Args('input', { type: () => LoginInput })
    input: LoginInput,
  ): Promise<TokenOutput> {
    return new TokenOutput({
      token: this.authService.getTokenForUser(
        await this.authService.validateUser(input.username, input.password),
      ),
    });
  }
}
