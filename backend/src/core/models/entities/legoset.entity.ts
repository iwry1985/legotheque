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

@Entity({ name: 'legoset' })
@Unique('UQ_bricksetid', ['bricksetid'])
export class Legoset {
    @PrimaryGeneratedColumn()
    setid: number;

    @Column()
    reference: number;

    @Column({ nullable: true })
    variant?: number;

    @Column()
    bricksetid: string;

    @Column()
    name: string;

    @Column()
    year: number;

    @Column({ nullable: true })
    category?: string;

    @Column({ default: false })
    released: boolean;

    @Column()
    pieces: number;

    @Column({ nullable: true })
    launchdate?: Date;

    @Column({ nullable: true })
    thumbnail?: string;

    @Column({ nullable: true })
    retailprice?: number;

    @Column({ nullable: true })
    rating?: number;

    @Column({ nullable: true })
    minage?: number;

    @Column({ nullable: true })
    tags?: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ nullable: true })
    height?: number;

    @Column({ nullable: true })
    width?: number;

    @Column({ nullable: true })
    exitdate?: Date;

    @Column({ default: 0, nullable: true })
    minifigs?: number;

    @Column({ default: 0, nullable: true })
    reviewcount?: number;

    @Column()
    themeid: number;

    @Column({ default: false })
    fetch_brick_economy: boolean;

    @UpdateDateColumn({ default: new Date() })
    lastupdatedat: Date;

    //theme
    @ManyToOne(() => Theme)
    @JoinColumn({ name: 'themeid', referencedColumnName: 'themeid' })
    theme: Theme;
}
