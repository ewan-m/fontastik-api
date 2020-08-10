import { IsJSON, IsDataURI } from "class-validator";

export class SaveFontDto {
	@IsDataURI()
	fontTtf: Uint8Array;

	@IsJSON()
	fontCharacters: object;
}
