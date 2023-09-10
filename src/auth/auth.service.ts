import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CustomerService } from 'src/customer/customer.service';


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private customerService: CustomerService,
        private configService: ConfigService,
    ) {}

    async signIn(email:string, password: string) {
        const customer = await this.customerService.findByEmail(email);
        if (customer?.password !== password) {
            throw new UnauthorizedException('Wrong password');
        }
        const {accessToken, refreshToken} = await this.getTokens(customer.id, customer.email);
        //Update refreshToken in customer row
        this.customerService.updateCustomer(customer.id, {refreshToken, accessToken});
        return {
            accessToken,
            refreshToken,
        }
    }

    async validateAccessToken(token: string) {
        try {
            const { sub: userId, email } = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            });
            return { userId, email };
        } catch (error) {
            throw new UnauthorizedException('Wrong token');
        }
    }

    async validateRefreshToken(token: string) {
        try {
            const { sub: userId, email } = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            });
            return { userId, email };
        } catch (error) {
            throw new UnauthorizedException('Wrong token');
        }
    }

    async getTokens(userId: string, email: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                },
                {
                    secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                    expiresIn: '15m',
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                },
                {
                    secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                    expiresIn: '7d',
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    //compare the auth token recieved with the customer's auth token to set isAuthorised as true
    async isAuthorised(userId: string, authToken: string): Promise<boolean> {
        const customer = await this.customerService.findById(userId);
        return customer.isVerified = (customer.activationCode === authToken);
    }

}