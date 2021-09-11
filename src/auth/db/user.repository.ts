import { Injectable, Inject } from "@nestjs/common";
import { Pool } from "pg";
import type { User } from "./user.entity";
import { PG_CONNECTION } from "../../db/database.module";
import { QueryUtilsService } from "../../services/query-utils.service";

@Injectable()
export class UserRepository {
	constructor(
		@Inject(PG_CONNECTION) private readonly db: Pool,
		private readonly queryUtils: QueryUtilsService
	) {}

	public async getUserByEmail(email: string): Promise<User | undefined> {
		return (
			await this.db.query<User>(
				...this.queryUtils.select("user_identity", { email: email.toLowerCase() }, [
					"user_id",
					"email",
					"name",
					"password_hash",
					"password_salt",
					"is_blocked",
				])
			)
		).rows[0];
	}

	public async getUserById(user_id: number): Promise<User> {
		return (
			await this.db.query<User>(
				...this.queryUtils.select("user_identity", { user_id }, [
					"user_id",
					"email",
					"name",
					"password_hash",
					"password_salt",
					"is_blocked",
				])
			)
		).rows[0];
	}

	public async updatePassword(user: User) {
		const { user_id, password_hash, password_salt } = user;
		return await this.db.query(
			...this.queryUtils.update(
				"user_identity",
				{ user_id },
				{ password_hash, password_salt }
			)
		);
	}

	public async updateEmail(user: User) {
		const { user_id, email } = user;

		return await this.db.query(
			...this.queryUtils.update("user_identity", { user_id }, { email })
		);
	}

	public async updateName(user: User) {
		const { user_id, name } = user;
		return await this.db.query(
			...this.queryUtils.update("user_identity", { user_id }, { name })
		);
	}

	public async createUser(user: User) {
		const { name, email, password_hash, password_salt } = user;
		return await this.db.query(
			...this.queryUtils.insert(
				"user_identity",
				{ name, email, password_salt, password_hash },
				["user_id"]
			)
		);
	}

	public async deleteUser(user_id: number) {
		await this.db.query(...this.queryUtils.delete("post_like", { user_id }));
		await this.db.query(...this.queryUtils.delete("post", { user_id }));

		return await this.db.query(
			...this.queryUtils.delete("user_identity", { user_id })
		);
	}

	public async hasUserSavedFont(user_id: number) {
		const result = await this.db.query<User>(
			...this.queryUtils.select("user_identity", { user_id }, ["has_saved_font"])
		);

		return result.rows?.[0]?.has_saved_font === true;
	}

	public async markFontAsSaved(user_id: number) {
		return await this.db.query(
			...this.queryUtils.update(
				"user_identity",
				{ user_id },
				{ has_saved_font: true }
			)
		);
	}
}
