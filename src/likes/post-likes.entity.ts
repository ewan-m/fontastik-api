import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../auth/user.entity";
import { Post } from "../posts/post.entity";

@Entity()
export class PostLikes {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne((type) => User, { nullable: false, eager: true })
	@JoinColumn()
	user: User;

	@ManyToOne((type) => Post, { nullable: false, eager: true })
	@JoinColumn()
	post: Post;
}
