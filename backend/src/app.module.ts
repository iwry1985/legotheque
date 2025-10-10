import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './core/features/api/api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './core/features/user/user.module';
import { LegosetModule } from './core/features/legoset/legoset.module';
import { LegothequeModule } from './core/features/legotheque/legotheque.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { hostname } from 'os';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './core/features/auth/auth.module';
import { SharedModule } from './core/features/shared/shared.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT!,
            database: process.env.DB_NAME,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            synchronize: false,
            autoLoadEntities: true,
        }),
        //config pour envoi de mails
        MailerModule.forRoot({
            transport: {
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_HOST,
                secure: false, //secure false en tls
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PWD,
                },
            },
        }),

        //core modules
        ApiModule,
        UserModule,
        LegosetModule,
        LegothequeModule,
        AuthModule,
        SharedModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
