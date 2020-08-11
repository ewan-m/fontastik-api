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
WITH matching_font_id AS (
	SELECT font_id FROM font WHERE user_id = $1;
);
INSERT INTO post (user_id, font_id, content, location)
VALUES ($1, matching_font_id, $2, point($3, $4));
            `,
			[userId, content, location.x, location.y]
		);
	}

	public async likePost(postId, userId) {
		return this.db.query(
			`
INSERT INTO post_like (post_id, user_id)
VALUES ($1, $2);
		`,
			[postId, userId]
		);
	}

	public async unlikePost(postId, userId) {
		return this.db.query(
			`
DELETE FROM post_like
WHERE post_id = $1 AND user_id = $2;
			`,
			[postId, userId]
		);
	}

	public async getNewPosts() {
		return this.db.query(
			`
SELECT post.post_id, post.content, post.created, font.font_ttf, user_identity.name, user_identity.profile_picture_url
FROM post 
JOIN font ON post.font_id = font.font_id 
JOIN user_identity ON post.user_id = user_identity.user_id
ORDER BY post.created ASC
LIMIT 20;
			`
		);
	}
}
