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

    @Column()
    username: string;

    @Column()
    age: number;

    @Column({ unique: true })
    email: string;

    @UpdateDateColumn()
    lastupdatedat: Date;

    @CreateDateColumn()
    addedat: Date;

    //get legotheque
    @OneToMany(() => Legotheque, (legotheque) => legotheque.user)
    legotheque: User;
}
