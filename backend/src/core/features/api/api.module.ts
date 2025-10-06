import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Legoset } from 'src/core/models/entities/legoset.entity';
import { Theme } from 'src/core/models/entities/theme.entity';
import { BricketCollection } from 'src/core/models/entities/bricksetCollection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Legoset,
    Theme,
    BricketCollection
  ])],
  controllers: [ApiController],
  providers: [ApiService]
})
export class ApiModule {}
