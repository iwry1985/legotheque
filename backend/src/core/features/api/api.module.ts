import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Legoset } from 'src/core/models/entities/legoset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Legoset])],
  controllers: [ApiController],
  providers: [ApiService]
})
export class ApiModule {}
