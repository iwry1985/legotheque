import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import { Legotheque } from './legotheque.entity';

@Entity({ name: 'users_dev' })
@Unique('UQ_email', ['email'])
export class User {
    @PrimaryGeneratedColumn()
    userid: number;

    @Column({ length: 150 })
    username: string;

    @Column()
    birthdate: Date;

    @Column({ unique: true })
    email: string;

    @Column()
    pwd: string;

    @UpdateDateColumn()
    lastupdatedat: Date;

    @CreateDateColumn()
    addedat: Date;

    //get legotheque
    @OneToMany(() => Legotheque, (legotheque) => legotheque.user)
    legotheque: User;
}
