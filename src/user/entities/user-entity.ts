import { Profile } from "src/profile/entitties/profile-entities";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: Number;

    @Column({ type: String })
    login: String;

    @Column({ type: String })
    mail: String;

    @Column({ type: String })
    password: String;

    @OneToOne(
        () => Profile,
        (profile) => profile.user,
    )
    profile: Profile;
} 