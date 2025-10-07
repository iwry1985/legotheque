import { Module } from '@nestjs/common';
import { LegosetService } from './legoset.service';
import { LegosetController } from './legoset.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Legoset } from 'src/core/models/entities/legoset.entity';
import { Theme } from 'src/core/models/entities/theme.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Theme, Legoset])],
    providers: [LegosetService],
    controllers: [LegosetController],
})
export class LegosetModule {}
