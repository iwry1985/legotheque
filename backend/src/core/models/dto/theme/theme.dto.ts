import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
}
