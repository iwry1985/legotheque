import { Module } from '@nestjs/common';
import { LegothequeService } from './legotheque.service';
import { LegothequeController } from './legotheque.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Legotheque } from 'src/core/models/entities/legotheque.entity';
import { Legoset } from 'src/core/models/entities/legoset.entity';
import { Wanted } from 'src/core/models/entities/wanted.entity';
import { WantedModule } from '../wanted/wanted.module';
import { DashboardService } from './dashboard.service';

@Module({
    imports: [TypeOrmModule.forFeature([Legotheque, Legoset]), WantedModule],
    providers: [LegothequeService, DashboardService],
    controllers: [LegothequeController],
})
export class LegothequeModule {}
