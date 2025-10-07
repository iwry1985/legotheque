import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Legoset } from 'src/core/models/entities/legoset.entity';
import { Theme } from 'src/core/models/entities/theme.entity';
import { BricksetCollection } from 'src/core/models/entities/brickset-collection.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Legoset, Theme, BricksetCollection])],
    controllers: [ApiController],
    providers: [ApiService],
})
export class ApiModule {}
