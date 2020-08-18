import {
	Controller,
	Post,
	UseGuards,
	Body,
	Headers,
	InternalServerErrorException,
} from "@nestjs/common";
import { FontRepository } from "./db/font.repository";
import { HasValidTokenGuard } from "../guards/has-valid-token.guard";
import { SaveFontDto } from "./dto/save-font.dto";
import { decode } from "jsonwebtoken";
import { TokenPayload } from "../auth/token-payload.type";
import { Font } from "./db/font.entity";

@Controller()
export class FontController {
	constructor(private readonly fontRepository: FontRepository) {}

	@Post("font")
	@UseGuards(HasValidTokenGuard)
	async saveFont(
		@Body() saveFontDto: SaveFontDto,
		@Headers("authorization") authHeader: string
	) {
		const token = authHeader.split(" ")?.[1];

		if (token) {
				const userId = (decode(token) as TokenPayload).id;

				const font = { userId, ...saveFontDto } as Font;
				await this.fontRepository.saveFont(font);

				return {};
		}

		throw new InternalServerErrorException([
			"Something went wrong saving your font",
		]);
	}
}
