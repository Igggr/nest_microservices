import { User } from "src/user/entities/user-entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id: Number;

    @Column({ type: String })
    name: String;

    @Column({ type: String })
    surname: String;

    @Column({ type: String })
    phone: String;

    @JoinColumn()
    @OneToOne(
        () => User,
        (user) => user.profile,
        { cascade: true }
    )
    user: User;
} 