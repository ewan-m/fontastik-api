import { Injectable } from "@nestjs/common";
import type { PostLike } from "../post/db/post-like.entity";
import type { User } from "../auth/db/user.entity";
import type { Post } from "../post/db/post.entity";

type Entity = {
	user_identity: User;
	post: Post;
	post_like: PostLike;
};
type Table = keyof Entity;
type Column<T extends Table> = keyof Entity[T];

@Injectable()
export class QueryUtilsService {
	public delete<T extends Table>(table: T, entity: Entity[T]): [string, any[]] {
		return [
			`DELETE FROM ${table} WHERE ${Object.keys(entity)
				.map((column, index) => `${column} = $${index + 1}`)
				.join(" AND ")};`,
			Object.values(entity),
		];
	}

	public insert<T extends Table>(
		table: T,
		entity: Entity[T],
		returning?: Array<Column<T>>
	): [string, any[]] {
		const values = Object.values(entity);
		const names = Object.keys(entity);

		return [
			`INSERT INTO ${table} (${names.join(", ")}) VALUES (${names
				.map((_, index) => `$${index + 1}`)
				.join(", ")})${returning ? ` RETURNING ${returning.join(", ")}` : ""};`,
			values,
		];
	}

	public select<T extends Table>(
		table: T,
		matching: Entity[T],
		select: Array<Column<T>> | "*"
	): [string, any[]] {
		let index = 0;
		const selectFields = select === "*" ? "*" : select.join(", ");

		const matchQueryPart = Object.keys(matching)
			.map((key) => {
				index += 1;
				return `${key} = $${index}`;
			})
			.join(" AND ");
		const queryVariables = Object.values(matching);

		return [
			`SELECT ${selectFields} FROM ${table} WHERE ${matchQueryPart};`,
			queryVariables,
		];
	}

	public update<T extends Table>(
		table: T,
		matching: Entity[T],
		update: Entity[T]
	): [string, any[]] {
		let index = 0;
		const setQueryPart = Object.keys(update)
			.map((key) => {
				index += 1;
				return `${key} = $${index}`;
			})
			.join(", ");
		const matchQueryPart = Object.keys(matching)
			.map((key) => {
				index += 1;
				return `${key} = $${index}`;
			})
			.join(" AND ");
		const queryVariables = [...Object.values(update), ...Object.values(matching)];

		return [
			`UPDATE ${table} SET ${setQueryPart} WHERE ${matchQueryPart};`,
			queryVariables,
		];
	}
}
