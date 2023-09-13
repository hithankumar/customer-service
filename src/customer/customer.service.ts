import { Injectable,  BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCustomerInput, GetCustomerInput, UpdateCustomerInput } from './dto/customer.input';
import { Customer } from 'src/lib/entities/customer.entity';

const ADMIN = 'ADMIN';
const USER = 'USER';
@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}


  async findById(id: string): Promise<Customer>{
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });
    if(!customer) {
      throw new BadRequestException(`Customer with id ${id} does not exist`);
    }
    return customer;
  }

  async findByEmail(email: string):Promise<Customer> {
    const customer = await this.prisma.customer.findUnique({
      where: { email },
    });
    
    if(!customer) {
      throw new BadRequestException(`Customer with email ${email} does not exist`);
    }
    return customer;
  }

  private async createCustomer(data: CreateCustomerInput) {
    data.userRole = USER;

    return this.prisma.customer.create({
      data: {
        ...data,
        refreshToken: null,
        accessToken: null,
        isVerified: false,
        activationCode: null,
      },
    });
  }

  async findAll(params: GetCustomerInput) {
    const { skip, take, cursor, where } = params;

    return this.prisma.customer.findMany({
      skip,
      take,
      cursor,
      where,
    });
  }

  async updateCustomer(id: string, data: UpdateCustomerInput) {
    await this.findById(id);
    return this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  //Only if userRole is ADMIN, execute the delete
  async deleteCustomer(id: string): Promise<Customer> {
    await this.findById(id);
    return this.prisma.customer.delete({
      where: { id },
    });
  }

  //Make a customer as ADMIN by adding userRole as ADMIN to it
  async makeAdmin(id: string) {
    await this.findById(id);

    return this.prisma.customer.update({
      where: { id },
      data: { userRole: ADMIN },
    });
  }

  //Make a customer as USER by adding userRole as USER to it
  async makeUser(id: string) {
    await this.findById(id);

    return this.prisma.customer.update({
        where: { id },
        data: { userRole: USER},
      });
  }

  //Check if user with input id if it is postfixed with 'admin'
  async isAdmin(email: string): Promise<boolean> {
    const customer = await this.findByEmail(email);
    return customer.userRole === ADMIN; 
  }

  async signUp(customerInfo: CreateCustomerInput): Promise<Customer> {
    // Check if customer already exists
    const customerEmail = await this.prisma.customer.findUnique({
      where: { email : customerInfo.email },
    });
    if (customerEmail) {
      throw new BadRequestException('Customer already exists');
    }
    return await this.createCustomer(customerInfo);;
  }

  async logout(userId: string): Promise<Boolean> {
      const customer = await this.findById(userId);
      customer.refreshToken = null;
      customer.accessToken = null;
      await this.updateCustomer(userId, customer);
      return true;
  }

  async isLoggedIn(userId: string): Promise<Boolean> {
      const customer = await this.findById(userId);
      return customer.refreshToken !== null;
  }
}
