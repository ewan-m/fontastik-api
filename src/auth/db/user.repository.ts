import { Injectable, Inject } from "@nestjs/common";
import { Pool } from "pg";
import { User } from "./user.entity";
import { PG_CONNECTION } from "../../db/database.module";

@Injectable()
export class UserRepository {
	constructor(@Inject(PG_CONNECTION) private readonly db: Pool) {}

	public async getUserByEmail(email: string): Promise<User | undefined> {
		return (
			await this.db.query<User>(
				`SELECT user_id, email, name, password_hash, password_salt, is_blocked
FROM user_identity
WHERE LOWER(email) = LOWER($1);`,
				[email.toLowerCase()]
			)
		).rows[0];
	}

	public async getUserById(userId: number): Promise<User> {
		return (
			await this.db.query<User>(
				`SELECT user_id, email, name, password_hash, password_salt, is_blocked
FROM user_identity
WHERE user_id = $1;`,
				[userId]
			)
		).rows[0];
	}

	public async updatePassword(user: User) {
		const { user_id, password_hash, password_salt } = user;
		return await this.db.query(
			`UPDATE user_identity
SET password_hash = $1, password_salt = $2
WHERE user_id = $3;`,
			[password_hash, password_salt, user_id]
		);
	}

	public async updateEmail(user: User) {
		const { user_id, email } = user;
		return await this.db.query(
			`UPDATE user_identity
SET email = $1
WHERE user_id = $2;`,
			[email.toLowerCase(), user_id]
		);
	}

	public async updateName(user: User) {
		const { user_id, name } = user;
		return await this.db.query(
			`UPDATE user_identity
SET name = $1
WHERE user_id = $2;`,
			[name, user_id]
		);
	}

	public async createUser(user: User) {
		const { name, email, password_hash, password_salt } = user;
		return await this.db.query(
			`INSERT INTO user_identity (name, email, password_hash, password_salt)
VALUES ($1, $2, $3, $4)
RETURNING user_id;`,
			[name, email.toLowerCase(), password_hash, password_salt]
		);
	}

	public async deleteUser(userId: number) {
		await this.db.query(`DELETE FROM font WHERE user_id = $1`, [userId]);
		await this.db.query(`DELETE FROM post_like WHERE user_id = $1`, [userId]);
		await this.db.query(`DELETE FROM post WHERE user_id = $1`, [userId]);

		return await this.db.query(`DELETE FROM user_identity WHERE user_id = $1;`, [
			userId,
		]);
	}
}
