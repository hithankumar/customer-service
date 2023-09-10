import { AuthService } from 'src/auth/auth.service';
import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { PrismaService } from 'src/prisma.service';
import { CustomerResolver } from './customer.resolver';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [],
  controllers: [],
  providers: [CustomerService, PrismaService, CustomerResolver],
  exports: [CustomerService, PrismaService],
})
export class CustomerModule {}
