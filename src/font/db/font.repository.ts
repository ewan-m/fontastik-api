import { Injectable, Inject } from "@nestjs/common";
import { Pool } from "pg";
import { Font } from "./font.entity";
import { PG_CONNECTION } from "../../db/database.module";

@Injectable()
export class FontRepository {
	constructor(@Inject(PG_CONNECTION) private readonly db: Pool) {}

	public async saveProgress(font: Font) {
		const { font_characters, user_id } = font;

		return await this.db.query(
			`INSERT INTO font (user_id, font_characters) VALUES ($1, $2)
ON CONFLICT (user_id)
DO UPDATE SET font_characters = $2 WHERE font.user_id = $1;`,
			[user_id, font_characters]
		);
	}

	public async hasUserSavedFont(userId: number) {
		const result = await this.db.query(
			"SELECT has_saved_font FROM font WHERE user_id = $1",
			[userId]
		);

		return result.rows;
	}

	public async markFontAsSaved(userId: number) {
		return await this.db.query(
			`INSERT INTO font (user_id, has_saved_font) VALUES ($1, $2)
ON CONFLICT (user_id)
DO UPDATE SET has_saved_font = $2 WHERE font.user_id = $1;`,
			[userId, true]
		);
	}
}
