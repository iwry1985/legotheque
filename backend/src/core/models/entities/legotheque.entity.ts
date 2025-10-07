import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Legoset } from './legoset.entity';

export class Legotheque {
    @PrimaryGeneratedColumn()
    legothequeid: number;

    @Column()
    userid: number;

    @Column()
    setid: number;

    @Column({ nullable: true })
    owned?: boolean;

    @Column({ nullable: true })
    wanted?: boolean;

    @Column({ nullable: true })
    built?: boolean;

    @Column({ nullable: true })
    ownedat?: Date;

    @Column({ nullable: true })
    wantedat?: Date;

    @Column({ nullable: true })
    builtat?: Date;

    @Column({ nullable: true })
    builtbeginat?: Date;

    @Column({ nullable: true })
    gift?: boolean;

    @Column({ nullable: true })
    purchaseprice?: number;

    @Column()
    lastupdatedat: Date;

    @Column()
    addedat: Date;

    //legoset
    @ManyToOne(() => Legoset)
    @JoinColumn({ name: 'setid', referencedColumnName: 'setid' })
    set: Legoset;
}
