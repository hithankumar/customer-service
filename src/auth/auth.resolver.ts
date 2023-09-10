

import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Token as TokenEntity } from 'src/lib/entities/token.entity';
import { Token } from './types/token';


@Resolver(() => TokenEntity)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Mutation(() => TokenEntity)
  async signIn(@Args('email') email: string, @Args('password') password: string): Promise<Token> {
    return this.authService.signIn(email, password);
  }  
}
