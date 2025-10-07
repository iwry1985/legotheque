import { Module } from '@nestjs/common';
import { LegothequeService } from './legotheque.service';
import { LegothequeController } from './legotheque.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Legotheque } from 'src/core/models/entities/legotheque.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Legotheque])],
    providers: [LegothequeService],
    controllers: [LegothequeController],
})
export class LegothequeModule {}
