import { Expose } from 'class-transformer';
import { getThemeLogo } from 'src/core/utils/theme.utils';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'theme' })
export class Theme {
    @Expose()
    @PrimaryGeneratedColumn()
    themeid: number;

    @Expose()
    @Column()
    name: string;

    @Expose()
    @Column()
    img_num: number;

    @Expose()
    get img_url(): string | undefined {
        if (this.img_num) return getThemeLogo(this.img_num);
    }
}
