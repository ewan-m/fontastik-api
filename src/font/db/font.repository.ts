import { Injectable, Inject } from "@nestjs/common";
import { Pool } from "pg";
import { Font } from "./font.entity";
import { PG_CONNECTION } from "../../db/database.module";

@Injectable()
export class FontRepository {
	constructor(@Inject(PG_CONNECTION) private readonly db: Pool) {}

	public async saveFont(font: Font) {
		const { fontTtf, fontCharacters, userId } = font;

		return await this.db.query(
			`
INSERT INTO font (user_id, font_ttf, font_characters) VALUES ($3, $1, $2)
ON CONFLICT (user_id)
DO UPDATE SET font_ttf = $1, font_characters = $2 WHERE font.user_id = $3;
`,
			[fontTtf, fontCharacters, userId]
		);
	}
}
