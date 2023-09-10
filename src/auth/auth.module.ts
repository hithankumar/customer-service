import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/accessToken';
import { RefreshTokenStrategy } from './strategies/refreshToken';
import { CustomerService } from 'src/customer/customer.service';
import { CustomerModule } from 'src/customer/customer.module';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    CustomerModule,
    JwtModule.register({
    global: true,
    secret: process.env.JWT_ACCESS_SECRET,
    signOptions: { expiresIn: '60s' },
  })],
  controllers: [],
  providers: [AuthService, ConfigService, AccessTokenStrategy, RefreshTokenStrategy, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}