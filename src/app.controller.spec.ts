import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { CustomerService } from './customer/customer.service';
import { AuthService } from './auth/auth.service';

describe('AppController', () => {
  let appController: AppController;
  let customerService: CustomerService;
  let authService: AuthService

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CustomerModule, AuthModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();
 
    customerService = app.get<CustomerService>(CustomerService);
    authService = app.get<AuthService>(AuthService);
    //@ts-ignore
    customerService.prisma =  app.get<PrismaService>(PrismaService);
    appController = app.get<AppController>(AppController);
  });

  describe('Testing methods', () => {
    const customer = {
      name: 'test',
      email: 'test@gmail.com',
      password : '123456',
      userRole: 'USER'
    }
    const id = 'customer_1';
    const tokens = {
      refreshToken: 'refreshToken',
      accessToken: 'accessToken'
    };

    describe('CRUD operations', () => {
      it('should return a customer for a valid id', async() => {
        //@ts-ignore
        customerService.prisma.customer.findUnique = jest.fn().mockReturnValueOnce({
          ...customer,
          id
        });
        expect(await appController.getCustomerByID(id)).toEqual({
          ...customer,
          id
        });
      });
      it('should throw correct exception for invalid id', async() => {
        //@ts-ignore
        customerService.prisma.customer.findUnique = jest.fn().mockReturnValueOnce(null);
        await expect(appController.getCustomerByID(id)).rejects.toEqual(new BadRequestException(`Customer with id ${id} does not exist`));
      });
      it('should return a customer for a valid email', async() => {
        //@ts-ignore
        customerService.prisma.customer.findUnique = jest.fn().mockReturnValueOnce({
          ...customer,
          id
        });
        expect(await appController.getCustomerByEmail(customer.email)).toEqual({
          ...customer,
          id
        });
      });
      it('should throw correct exception for invalid email', async() => {
        //@ts-ignore
        customerService.prisma.customer.findUnique = jest.fn().mockReturnValueOnce(null);
        await expect(appController.getCustomerByEmail(customer.email)).rejects.toEqual(new BadRequestException(`Customer with email ${customer.email} does not exist`));
      });
      it('should return a customer for a valid update', async() => {
        //@ts-ignore
        customerService.prisma.customer.findUnique = jest.fn().mockReturnValueOnce({
          ...customer,
        });

        //@ts-ignore
        customerService.prisma.customer.update = jest.fn().mockReturnValueOnce({
          ...customer,
          id
        });
        expect(await appController.updateCustomer({
          ...customer,
          id,
          createdAt: new Date(),
          updatedAt: new Date()
        })).toEqual({
          ...customer,
          id
        });
      });
      it('should throw correct exception for invalid update', async() => {
        //@ts-ignore
        customerService.prisma.customer.findUnique = jest.fn().mockReturnValueOnce(null);
        await expect(appController.updateCustomer({
          ...customer,
          id,
          createdAt: new Date(),
          updatedAt: new Date()

        })).rejects.toEqual(new BadRequestException(`Customer with id ${id} does not exist`));
      });
      it('should return a customer for a valid delete', async() => {
        //@ts-ignore
        customerService.prisma.customer.findUnique = jest.fn().mockReturnValueOnce({
          ...customer,
          id
        });

        //@ts-ignore
        customerService.prisma.customer.delete = jest.fn().mockReturnValueOnce({
          ...customer,
          id
        });
        expect(await appController.deleteCustomer(id)).toEqual({
          ...customer,
          id
        });
      });
      it('should throw correct exception for invalid delete', async() => {
        //@ts-ignore
        customerService.prisma.customer.findUnique = jest.fn().mockReturnValueOnce(null);
        await expect(appController.deleteCustomer(id)).rejects.toEqual(new BadRequestException(`Customer with id ${id} does not exist`));
      });
    });


    describe('signIn', () => {
      it('should return true for a valid Sign in', async() => {
        //@ts-ignore
        customerService.findByEmail = jest.fn().mockReturnValueOnce({
          ...customer,
          id
        });
        //@ts-ignore
        authService.getTokens = jest.fn().mockReturnValueOnce(tokens);
        //@ts-ignore
        customerService.updateCustomer = jest.fn().mockReturnValueOnce(customer);
        expect(await appController.signIn(customer)).toEqual(tokens);
      });
      it('should throw correct exception for wrong password', async() => {
        //@ts-ignore
        customerService.prisma.customer.findUnique = jest.fn().mockReturnValueOnce({
          ...customer,
          password: 'wrongPassword',
          id
        });
        await expect(appController.signIn(customer)).rejects.toEqual(new UnauthorizedException('Wrong password'));
      });
      it('should throw correct exception if user does not exist', async() => {
        //@ts-ignore
        customerService.prisma.customer.findUnique = jest.fn().mockReturnValueOnce(null);
        await expect(appController.signIn(customer)).rejects.toEqual(new BadRequestException('Customer with email test@gmail.com does not exist'));
       });
    });

    describe('signUp', () => {
      it('should return a customer for a valid Sign up', async() => {
        //@ts-ignore
        customerService.prisma.customer.findUnique = jest.fn().mockReturnValueOnce(null);
        //@ts-ignore
        customerService.createCustomer = jest.fn().mockReturnValueOnce({
          ...customer,
          id,
        });
        expect(await appController.signUp(customer)).toEqual({
          name: 'test',
          email: 'test@gmail.com',
          userRole: 'USER',
          id: 'customer_1',
          password: '123456'
        });
      });
      it('should throw correct exception if user already exists', async() => {
        //@ts-ignore
        customerService.prisma.customer.findUnique = jest.fn().mockReturnValueOnce({
          ...customer,
          id
        });
        await expect(appController.signUp(customer)).rejects.toEqual(new BadRequestException('Customer already exists'));
      });
    });

    describe('isAdmin', () => {
      it('should return true for a valid admin', async() => {
        //@ts-ignore
        customerService.prisma.customer.findUnique = jest.fn().mockReturnValueOnce({
          ...customer,
          id,
          userRole: 'ADMIN'
        });
        expect(await appController.isAdmin(id)).toBe(true);
      });
      it('should return false for a valid user', async() => {
        //@ts-ignore
        customerService.prisma.customer.findUnique = jest.fn().mockReturnValueOnce({
          ...customer,
          id,
          userRole: 'USER'
        });
        expect(await appController.isAdmin(customer.email)).toBe(false);
      });
      it('should throw correct exception if user does not exist', async() => {
        //@ts-ignore
        customerService.prisma.customer.findUnique = jest.fn().mockReturnValueOnce(null);
        await expect(appController.isAdmin(customer.email)).rejects.toEqual(new BadRequestException(`Customer with email test@gmail.com does not exist`));
      });
    });

    describe('isLoggedIn', () => {
      it('should return true for a valid logged in user', async() => {
        //@ts-ignore
        customerService.prisma.customer.findUnique = jest.fn().mockReturnValueOnce({
          ...customer,
          id,
          refreshTooken: 'refreshToken'
        });
        expect(await appController.isLoggedIn(id)).toBe(true);
      });

      it('should return false for a valid logged out user', async() => {
        //@ts-ignore
        customerService.prisma.customer.findUnique = jest.fn().mockReturnValueOnce({
          ...customer,
          id,
          refreshToken: null
        });
        await expect(appController.isLoggedIn(id)).resolves.toBe(false);
      });
    });

  })
});
