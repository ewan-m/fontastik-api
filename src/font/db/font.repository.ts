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
BEGIN
	LOOP
		UPDATE font
			SET font_ttf = $1, font_characters = $2
			WHERE user_id = $3;
		IF found THEN
			RETURN;
		END IF;
		BEGIN
			INSERT INTO font (user_id, font_ttf, font_characters)
				VALUES ($3, $1, $2);
			RETURN;
		END;
	END LOOP;
END;`,
			[fontTtf, fontCharacters, userId]
		);
	}
}
