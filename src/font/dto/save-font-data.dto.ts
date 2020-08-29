import { IsArray, ArrayMaxSize } from "class-validator";

export class SaveFontDataDto {
	@IsArray()
	@ArrayMaxSize(100_000)
	fontData: number[];
}
