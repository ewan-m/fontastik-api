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
				`
SELECT name, password_hash, password_salt, is_blocked
FROM user_identity
WHERE email = $1;
		`,
				[email]
			)
		).rows[0];
	}

	public async updatePassword(user: User) {
		const { user_id, password_hash, password_salt } = user;
		return await this.db.query(
			`
UPDATE user_identity
SET password_hash = $1, password_salt = $2
WHERE user_id = $3;
`,
			[password_hash, password_salt, user_id]
		);
	}

	public async createUser(user: User) {
		const { name, email, password_hash, password_salt } = user;
		return await this.db.query(
			`
INSERT INTO user_identity (name, email, password_hash, password_salt)
VALUES ($1, $2, $3, $4)
RETURNING user_id;`,
			[name, email, password_hash, password_salt]
		);
	}
}
