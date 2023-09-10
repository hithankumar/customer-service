
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Token {
  @Field(() => String)
  refreshToken: string;

  @Field(() => String)
  accessToken: string;  
}

