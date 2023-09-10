import { Field, ObjectType } from '@nestjs/graphql';
import { Base } from './base.entity';


@ObjectType()
export class Customer extends Base {
  @Field(() => String)
  email: string;

  @Field(() => String)
  userRole: string;  

  @Field(() => String)
  password: string;  

  @Field(() => String,  { nullable: true })
  refreshToken?: string;  

  @Field(() => String,  { nullable: true })
  accessToken?: string;  

  @Field(() => Boolean,  { nullable: true })
  isVerified?: boolean;  

  @Field(() => String,  { nullable: true })
  activationCode?: string;  
}

