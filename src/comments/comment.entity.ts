import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../auth/user.entity";
import { Font } from "../fonts/font.entity";
import { Post } from "../posts/post.entity";

@Entity()
export class Comment {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	dateCreated: string;

	@Column("varchar")
	content: string;

	@ManyToOne((type) => User, { nullable: false, eager: true })
	@JoinColumn()
	user: User;

	@ManyToOne((type) => Font, { nullable: false, eager: true })
	@JoinColumn()
	font: Font;

	@ManyToOne((type) => Post, { nullable: false, eager: true })
	@JoinColumn()
	post: Post;
}
