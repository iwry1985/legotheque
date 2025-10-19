import { Module } from '@nestjs/common';
import { ThemeController } from './theme.controller';
import { ThemeService } from './theme.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Theme } from 'src/core/models/entities/theme.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Theme])],
    controllers: [ThemeController],
    providers: [ThemeService],
})
export class ThemeModule {}
