import { ConnectionOptions } from "typeorm";
import { User } from "./auth/user.entity";
import { Comment } from "./comments/comment.entity";
import { Font } from "./fonts/font.entity";
import { CommentLikes } from "./likes/comment-likes.entity";
import { PostLikes } from "./likes/post-likes.entity";
import { Post } from "./posts/post.entity";
import { Profile } from "./profile/profile.entity";

const config: ConnectionOptions = {
	type: "postgres",
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	host: process.env.DB_HOST,
	synchronize: false,
	migrationsRun: true,
	migrations: [],
	entities: [User, Post, Comment, Font, Profile, PostLikes, CommentLikes],
	port: Number(process.env.DB_PORT),
};

export = config;
