import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ThemeDto } from 'src/core/models/dto/theme/theme.dto';
import { Theme } from 'src/core/models/entities/theme.entity';
import { ArrayContains, In, Repository } from 'typeorm';

@Injectable()
export class ThemeService {
    constructor(
        @InjectRepository(Theme)
        private readonly _themeRepository: Repository<Theme>
    ) {}

    getThemes = async (ids?: string): Promise<ThemeDto[]> => {
        console.log('[THEME SERVICE] Get themes', ids);
        let where = {};

        if (ids) {
            const param = ids.split(',').map(Number);
            console.log('param', param);
            where = { themeid: In(param) };
        }

        console.log('where', where);

        return this._themeRepository.find({
            where,
        });
    };
}
