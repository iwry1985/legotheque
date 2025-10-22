import { Module } from '@nestjs/common';
import { LegosetService } from './legoset.service';
import { LegosetController } from './legoset.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Legoset } from 'src/core/models/entities/legoset.entity';
import { Theme } from 'src/core/models/entities/theme.entity';
import { SecondaryMarket } from 'src/core/models/entities/secondary-market.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Theme, Legoset, SecondaryMarket])],
    providers: [LegosetService],
    controllers: [LegosetController],
})
export class LegosetModule {}
