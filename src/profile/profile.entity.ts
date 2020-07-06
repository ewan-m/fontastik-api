import {
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../auth/user.entity";

@Entity()
export class Profile {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne((type) => User, { nullable: false, eager: true })
	@JoinColumn()
	user: User;

	@Column("varchar")
	profilePictureUrl: string;

	@Column("date")
	birthday: string;
}
