import { Controller, Get, Header, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateCustomerInput } from './customer/dto/customer.input';
import { Customer } from 'src/lib/entities/customer.entity';
import { Token } from './auth/types/token';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('signIn')
  signIn(customer: CreateCustomerInput): Promise<Token> {
    return this.appService.signIn(customer);
  }

  @Post('signUp')
  signUp(customer: CreateCustomerInput): Promise<Customer> {
    return this.appService.signUp(customer);
  }
  
  @Get('isAdmin')
  isAdmin(id: string): Promise<Boolean> {
    return this.appService.isAdmin(id);
  }

  @Get('isLoggedIn')
  isLoggedIn(id: string): Promise<Boolean> {
    return this.appService.isLoggedIn(id);
  }

  @Get('logout')
  logout(id: string): Promise<Boolean> {
    return this.appService.logout(id);
  }

  @Get('getCustomerByID')
  getCustomerByID(id: string): Promise<Customer> {
    return this.appService.getCustomerByID(id);
  }

  @Get('getCustomerByEmail')
  getCustomerByEmail(email: string): Promise<Customer> {
    return this.appService.getCustomerByEmail(email);
  }

  @Post('updateCustomer')
  updateCustomer(customer: Customer): Promise<Customer> {
    return this.appService.updateCustomer(customer);
  }

  @Post('deleteCustomer')
  deleteCustomer(id: string): Promise<Customer> {
    return this.appService.deleteCustomer(id);
  }

}
