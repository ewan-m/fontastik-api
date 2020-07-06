import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
} from "typeorm";
import { User } from "../auth/user.entity";
import { Font } from "../fonts/font.entity";

@Entity()
export class Post {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	dateCreated: string;

	@Column({
		type: "geometry",
		nullable: true,
		spatialFeatureType: "Point",
		srid: 4326,
	})
	location?: string;

	@Column("varchar")
	content: string;

	@ManyToOne((type) => User, { nullable: false, eager: true })
	@JoinColumn()
	user: User;

	@ManyToOne((type) => Font, { nullable: false, eager: true })
	@JoinColumn()
	font: Font;
}
