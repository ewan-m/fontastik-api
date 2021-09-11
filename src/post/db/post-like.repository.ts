import { Injectable, Inject } from "@nestjs/common";
import { Pool } from "pg";
import { Post } from "./post.entity";
import { PG_CONNECTION } from "../../db/database.module";
import { QueryUtilsService } from "src/services/query-utils.service";

@Injectable()
export class PostLikeRepository {
	constructor(
		@Inject(PG_CONNECTION) private readonly db: Pool,
		private readonly queryUtils: QueryUtilsService
	) {}

	public async likePost(post_id: number, user_id: number) {
		return await this.db.query(
			...this.queryUtils.insert("post_like", { post_id, user_id })
		);
	}

	public async unlikePost(post_id: number, user_id: number) {
		return await this.db.query(
			...this.queryUtils.delete("post_like", { post_id, user_id })
		);
	}

	public async getPostLikes(user_id: number) {
		return (
			await this.db.query(
				...this.queryUtils.select("post_like", { user_id }, ["post_id"])
			)
		).rows;
	}
}
