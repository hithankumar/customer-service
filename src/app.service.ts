import { Injectable } from '@nestjs/common';
import { CustomerService } from './customer/customer.service';
import { CreateCustomerInput } from './customer/dto/customer.input';
import { Customer } from 'src/lib/entities/customer.entity';
import { AuthService } from './auth/auth.service';
import { Token } from './auth/types/token';

@Injectable()
export class AppService {
  constructor(private customer: CustomerService, private authService: AuthService) {}
  getHello(): string {
    return 'Hello World!';
  }

  //CRUD Operations
  async getCustomerByID(id: string): Promise<Customer> {
    return await this.customer.findById(id);
  }

  async getCustomerByEmail(email: string): Promise<Customer> {
    return await this.customer.findByEmail(email);
  }

  async updateCustomer(customer: Customer): Promise<Customer> {
    return await this.customer.updateCustomer(customer.id, customer);
  }

  async deleteCustomer(id: string): Promise<Customer> {
    return await this.customer.deleteCustomer(id);
  }

  //Restrict access to customer operations from unuthenticated users - Login required
  async signIn(customer: CreateCustomerInput): Promise<Token> {
    return this.authService.signIn(customer.email, customer.password);
  }

  //Signup
  async signUp(customer: CreateCustomerInput): Promise<Customer> {
    return await this.customer.signUp(customer);
  }

  //Is Admin
  async isAdmin(id: string): Promise<Boolean> {
    return await this.customer.isAdmin(id);
  }

  async isLoggedIn(id: string): Promise<Boolean> {
    return await this.customer.isLoggedIn(id);
  }

  async logout(id: string): Promise<Boolean> {
    return await this.customer.logout(id);
  }

  

}
