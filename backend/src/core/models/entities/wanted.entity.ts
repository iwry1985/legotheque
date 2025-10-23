import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Legoset } from './legoset.entity';

@Entity({ name: 'wanted' })
export class Wanted {
    @PrimaryGeneratedColumn()
    wantedid: number;

    @Column()
    setid: number;

    @Column()
    userid: number;

    @Column({ nullable: true })
    priority?: string;

    @Column({ nullable: true })
    note?: string;

    @Column()
    wantedat: Date;

    @Column({ nullable: true })
    boughtat?: Date;

    //legoset
    @ManyToOne(() => Legoset)
    @JoinColumn({ name: 'setid', referencedColumnName: 'setid' })
    set: Legoset;
}
