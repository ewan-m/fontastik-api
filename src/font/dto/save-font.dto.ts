import { IsJSON, IsDataURI } from "class-validator";

export class SaveFontDto {
	@IsJSON()
	fontTtf: Uint8Array;

	@IsJSON()
	fontCharacters: object;
}
