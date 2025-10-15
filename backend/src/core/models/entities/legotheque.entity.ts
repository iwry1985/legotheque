import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Legoset } from './legoset.entity';
import { User } from './user.entity';

@Entity({ name: 'legotheque_dev' })
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

    @Column({ nullable: true })
    fav?: boolean;

    @UpdateDateColumn()
    lastupdatedat: Date;

    @CreateDateColumn()
    addedat: Date;

    //legoset
    @ManyToOne(() => Legoset)
    @JoinColumn({ name: 'setid', referencedColumnName: 'setid' })
    set: Legoset;

    //user
    @ManyToOne(() => User, (user) => user.legotheque)
    @JoinColumn({ name: 'userid' }) //name => column from this table, referencedColumnName => column in joined table
    user: User;
}
