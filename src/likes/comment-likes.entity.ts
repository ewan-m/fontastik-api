import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../auth/user.entity";
import { Comment } from "../comments/comment.entity";

@Entity()
export class CommentLikes {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne((type) => User, { nullable: false, eager: true })
	@JoinColumn()
	user: User;

	@ManyToOne((type) => Comment, { nullable: false, eager: true })
	@JoinColumn()
	comment: Comment;
}
