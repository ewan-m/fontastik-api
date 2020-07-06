import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { User } from "../auth/user.entity";

@Entity()
export class Font {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("varchar")
	name: string;

	@ManyToOne((type) => User, { nullable: false, eager: true })
	@JoinColumn()
	user: User;

	@Column("bytea")
	fontTTF: Uint8Array;

	@Column("jsonb", { select: false })
	fontCharacters: { [char: string]: string };
}
