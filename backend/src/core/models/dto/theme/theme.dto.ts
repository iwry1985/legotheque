import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { getThemeLogo } from 'src/core/utils/theme.utils';

export class ThemeDto {
    @Expose()
    @IsNotEmpty()
    @IsInt()
    @ApiProperty()
    themeid: number;

    @Expose()
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name: string;

    @Expose()
    @IsOptional()
    @IsInt()
    @ApiProperty()
    img_num: number;

    @Expose()
    @IsOptional()
    @IsString()
    @ApiProperty()
    get img_url(): string | undefined {
        if (this.img_num) return getThemeLogo(this.img_num);
    }
}
