import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot(),
        //jwt
        JwtModule.register({
            secret: process.env.JWT_secret,
            signOptions: {
                expiresIn: '20m', //durée de vie
            },
        }),
    ],
    exports: [JwtModule, ConfigModule],
})
export class SharedModule {}
