import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './core/features/api/api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './core/features/user/user.module';
import { LegosetModule } from './core/features/legoset/legoset.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
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
        ApiModule,
        UserModule,
        LegosetModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
