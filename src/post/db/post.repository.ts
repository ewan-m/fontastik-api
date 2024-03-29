import { Injectable, Inject } from "@nestjs/common";
import { Pool } from "pg";
import type { Post } from "./post.entity";
import { PG_CONNECTION } from "../../db/database.module";

@Injectable()
export class PostRepository {
	private readonly mainSelect =
		"SELECT post.post_id, post.content, post.created, post.location, user_identity.name, user_identity.user_id,";
	private readonly likesSelect =
		"(SELECT COUNT(post_like) FROM post_like WHERE post_like.post_id = post.post_id) as post_likes";

	private readonly selectPosts = `${this.mainSelect} ${this.likesSelect}
FROM post
JOIN user_identity ON post.user_id = user_identity.user_id`;

	constructor(@Inject(PG_CONNECTION) private readonly db: Pool) {}

	public async savePost(post: Post) {
		const { user_id, content, location } = post;

		return await this.db.query(
			`INSERT INTO post (user_id, content, location)
VALUES ($1, $2, point($3, $4));`,
			[user_id, content, location.x, location.y]
		);
	}

	public async getNewPosts(offset: number) {
		return (
			await this.db.query(
				`${this.selectPosts}
ORDER BY post.created DESC
OFFSET $1 LIMIT 20;`,
				[offset]
			)
		).rows;
	}

	public async getLocalPosts(x: number, y: number, offset: number) {
		return (
			await this.db.query(
				`${this.mainSelect} post.location <@> point($1,$2) as distance, ${this.likesSelect}
FROM post
JOIN user_identity ON post.user_id = user_identity.user_id
WHERE post.location != point(0,0)
ORDER BY distance ASC
OFFSET $3 LIMIT 20;`,
				[x, y, offset]
			)
		).rows;
	}

	public async getPopularPosts(offset: number) {
		return (
			await this.db.query(
				`${this.selectPosts}
ORDER BY post_likes DESC
OFFSET $1 LIMIT 20;`,
				[offset]
			)
		).rows;
	}

	public async getPostsForUser(userId: number, offset: number) {
		return (
			await this.db.query(
				`${this.selectPosts}
WHERE post.user_id = $1
ORDER BY post.created DESC
OFFSET $2 LIMIT 20;`,
				[userId, offset]
			)
		).rows;
	}
}
