import { Module } from '@nestjs/common';
import { WantedService } from './wanted.service';
import { WantedController } from './wanted.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wanted } from 'src/core/models/entities/wanted.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Wanted])],
    providers: [WantedService],
    controllers: [WantedController],
    exports: [TypeOrmModule],
})
export class WantedModule {}
