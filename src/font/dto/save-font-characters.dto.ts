import { IsJSON } from "class-validator";

export class SaveFontCharactersDto {
	@IsJSON()
	fontCharacters: object;
}
