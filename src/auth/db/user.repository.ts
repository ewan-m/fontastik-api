import { Injectable } from "@nestjs/common";
import { Pool } from "pg";
import { User } from "./user.entity";

@Injectable()
export class UserRepository {
	tableName: string = "user";

	constructor(private readonly pool: Pool) {}

	public async getUserByEmail(email: string): Promise<User | undefined> {
		return (
			await this.pool.query<User>(`
SELECT *
FROM user
WHERE email = ?'${email}';
		`)
		).rows[0];
	}

	public async updatePassword(user: User) {
		const { userId, passwordHash, passwordSalt } = user;
		return await this.pool.query(`
UPDATE user
SET passwordHash = ?'${passwordHash}', passwordSalt = ?'${passwordSalt}'
WHERE userId = ?'${userId}';
`);
	}

	public async createUser(user: User) {
		const { name, email, passwordHash, passwordSalt } = user;
		return await this.pool.query(`
INSERT INTO user (name, email, password_hash, password_salt)
VALUES (? ${[name, email, passwordHash, passwordSalt].join(", ")});
`);
	}
}
