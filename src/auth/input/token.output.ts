import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class TokenOutput {
  @Field()
  token: string;

  constructor(partial?: Partial<TokenOutput>) {
    Object.assign(this, partial);
  }
}
