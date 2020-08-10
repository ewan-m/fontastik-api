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
SELECT name, passwordHash, passwordSalt, isBlocked
FROM user
WHERE email = $1;
		`,
				[email]
			)
		).rows[0];
	}

	public async updatePassword(user: User) {
		const { userId, passwordHash, passwordSalt } = user;
		return await this.db.query(
			`
UPDATE user
SET passwordHash = $1, passwordSalt = $2
WHERE userId = $3;
`,
			[passwordHash, passwordSalt, userId]
		);
	}

	public async createUser(user: User) {
		const { name, email, passwordHash, passwordSalt } = user;
		return await this.db.query(
			`
INSERT INTO user (name, email, password_hash, password_salt)
VALUES ($1, $2, $3, $4);`,
			[name, email, passwordHash, passwordSalt]
		);
	}
}
