import { QueryUtilsService } from "./query-utils.service";

describe("QueryUtilsService", () => {
	const utils = new QueryUtilsService();

	[
		{
			testName: "getUsersByEmail",
			input: utils.select("user_identity", { email: "email@email.com" }, [
				"user_id",
				"email",
				"name",
				"password_hash",
				"password_salt",
				"is_blocked",
			]),
			expectedQuery:
				"SELECT user_id, email, name, password_hash, password_salt, is_blocked FROM user_identity WHERE email = $1;",
			expectedVariables: ["email@email.com"],
		},
		{
			testName: "updatePassword",
			input: utils.update(
				"user_identity",
				{ user_id: 1 },
				{ password_hash: "hash", password_salt: "salt" }
			),
			expectedQuery:
				"UPDATE user_identity SET password_hash = $1, password_salt = $2 WHERE user_id = $3;",
			expectedVariables: ["hash", "salt", 1],
		},
		{
			testName: "updateEmail",
			input: utils.update(
				"user_identity",
				{ user_id: 1 },
				{ email: "email@email.com" }
			),
			expectedQuery: "UPDATE user_identity SET email = $1 WHERE user_id = $2;",
			expectedVariables: ["email@email.com", 1],
		},
		{
			testName: "createUser",
			input: utils.insert(
				"user_identity",
				{
					name: "name",
					email: "email",
					password_hash: "hash",
					password_salt: "salt",
				},
				["user_id"]
			),
			expectedQuery:
				"INSERT INTO user_identity (name, email, password_hash, password_salt) VALUES ($1, $2, $3, $4) RETURNING user_id;",
			expectedVariables: ["name", "email", "hash", "salt"],
		},
		{
			testName: "deleteUser",
			input: utils.delete("user_identity", { user_id: 1 }),
			expectedQuery: "DELETE FROM user_identity WHERE user_id = $1;",
			expectedVariables: [1],
		},
		{
			testName: "likePost",
			input: utils.insert("post_like", { post_id: 1, user_id: 2 }),
			expectedQuery: "INSERT INTO post_like (post_id, user_id) VALUES ($1, $2);",
			expectedVariables: [1, 2],
		},
		{
			testName: "unlikePost",
			input: utils.delete("post_like", { user_id: 4, post_id: 5 }),
			expectedQuery: "DELETE FROM post_like WHERE user_id = $1 AND post_id = $2;",
			expectedVariables: [4, 5],
		},
	].forEach(({ testName, input, expectedQuery, expectedVariables }) =>
		it(testName, () => {
			const [query, variables] = input;

			expect(query).toBe(expectedQuery);
			expect(variables).toEqual(expectedVariables);
		})
	);
});
