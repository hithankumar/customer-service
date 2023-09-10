import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CustomerService } from './customer.service';
import { CreateCustomerInput, GetCustomerInput, UpdateCustomerInput } from './dto/customer.input';
import { Customer } from 'src/lib/entities/customer.entity';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query(() => [Customer])
  async customers(@Args('data') { skip, take, where }: GetCustomerInput) {
    return this.customerService.findAll({ skip, take, where });
  }
  

  @Mutation(() => Customer)
  async updateCustomer(@Args('id') id: string, @Args('customerData') customerData: UpdateCustomerInput): Promise<Customer> {
    return this.customerService.updateCustomer(id, customerData);
  }

  @Mutation(() => Customer)
  async deleteCustomer(@Args('id') id: string): Promise<Customer> {
    return this.customerService.deleteCustomer(id);
  }

  @Mutation(() => Boolean)
  async isAdmin(@Args('email') email: string): Promise<boolean> {
    return this.customerService.isAdmin(email);
  }

  @Mutation(() => Customer)
  async makeAdmin(@Args('id') id: string): Promise<Customer> {
    return this.customerService.makeAdmin(id);
  }

  @Mutation(() => Customer)
  async makeUser(@Args('id') id: string): Promise<Customer> {
    return this.customerService.makeUser(id);
  }

  @Mutation(() => Boolean)
  async logout(@Args('id') id: string): Promise<Boolean> {
    return this.customerService.logout(id);
  }

  @Mutation(() => Customer)
  async signUp(@Args('customerData') customerData: CreateCustomerInput): Promise<Customer> {
    return this.customerService.signUp(customerData);
  }
}
