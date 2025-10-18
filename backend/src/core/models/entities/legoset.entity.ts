import {
    Column,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import { Theme } from './theme.entity';
import { Expose } from 'class-transformer';

@Entity({ name: 'legoset' })
@Unique('UQ_bricksetid', ['bricksetid'])
export class Legoset {
    @Expose()
    @PrimaryGeneratedColumn()
    setid: number;

    @Expose()
    @Column()
    reference: number;

    @Expose()
    @Column({ nullable: true })
    variant?: number;

    @Expose()
    @Column()
    bricksetid: string;

    @Expose()
    @Column()
    name: string;

    @Expose()
    @Column()
    year: number;

    @Expose()
    @Column({ nullable: true })
    category?: string;

    @Expose()
    @Column({ default: false })
    released: boolean;

    @Expose()
    @Column()
    pieces: number;

    @Expose()
    @Column({ nullable: true })
    launchdate?: Date;

    @Expose()
    @Column({ nullable: true })
    thumbnail?: string;

    @Expose()
    @Column({ nullable: true, type: 'decimal' })
    retailprice?: number;

    @Expose()
    @Column({ nullable: true, type: 'decimal' })
    rating?: number;

    @Expose()
    @Column({ nullable: true })
    minage?: number;

    @Column({ nullable: true })
    tags?: string;

    @Expose()
    @Column({ nullable: true })
    description?: string;

    @Expose()
    @Column({ nullable: true, type: 'decimal' })
    height?: number;

    @Expose()
    @Column({ nullable: true, type: 'decimal' })
    width?: number;

    @Expose()
    @Column({ nullable: true })
    exitdate?: Date;

    @Expose()
    @Column({ default: 0, nullable: true })
    minifigs?: number;

    @Expose()
    @Column({ default: 0, nullable: true })
    reviewcount?: number;

    @Expose()
    @Column()
    themeid: number;

    @Expose()
    @Column({ default: false })
    fetch_bricklink: boolean;

    @Expose()
    @UpdateDateColumn({ default: new Date() })
    lastupdatedat: Date;

    //theme
    @Expose()
    @ManyToOne(() => Theme)
    @JoinColumn({ name: 'themeid' })
    theme: Theme;

    @Expose()
    get retired(): boolean {
        if (this.exitdate) return new Date(this.exitdate) < new Date();

        const currentYear = new Date().getFullYear();
        if (this.year) return currentYear - this.year > 4; //retired après 4 ans

        return true; //si pas d'année => old = retired
    }
}
