import { Injectable, Inject } from "@nestjs/common";
import { Pool } from "pg";
import { Post } from "./post.entity";
import { PG_CONNECTION } from "../../db/database.module";

@Injectable()
export class PostRepository {
	constructor(@Inject(PG_CONNECTION) private readonly db: Pool) {}

	public async savePost(post: Post) {
		const { userId, content, location } = post;

		return await this.db.query(
			`
WITH matchingFontId AS (
	SELECT fontId FROM font WHERE userId = $1;
);
INSERT INTO post (userId, fontId, content, location)
VALUES ($1, matchingFontId, $2, point($3, $4));
            `,
			[userId, content, location.x, location.y]
		);
	}

	public async likePost(postId, userId) {
		return this.db.query(
			`
INSERT INTO postLike (postId, userId)
VALUES ($1, $2);
		`,
			[postId, userId]
		);
	}

	public async unlikePost(postId, userId) {
		return this.db.query(
			`
DELETE FROM postLike
WHERE postId = $1 AND userId = $2;
			`,
			[postId, userId]
		);
	}

	public async getNewPosts() {
		return this.db.query(
			`
SELECT post.postId, post.content, post.created, font.fontTtf, user.name, user.profilePictureUrl
FROM post 
JOIN font ON post.fontId = font.fontId 
JOIN user ON post.userId = user.userId
ORDER BY post.created ASC
LIMIT 20;
			`
		);
	}
}
