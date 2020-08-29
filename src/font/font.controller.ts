import {
	Controller,
	Post,
	UseGuards,
	Body,
	Headers,
	InternalServerErrorException,
	BadGatewayException,
} from "@nestjs/common";
import { decode } from "jsonwebtoken";
import { FontRepository } from "./db/font.repository";
import { HasValidTokenGuard } from "../guards/has-valid-token.guard";
import { SaveFontCharactersDto } from "./dto/save-font-characters.dto";
import { TokenPayload } from "../auth/token-payload.type";
import { SaveFontDataDto } from "./dto/save-font-data.dto";
import { GithubService } from "src/services/github.service";

@Controller()
export class FontController {
	constructor(
		private readonly fontRepository: FontRepository,
		private readonly github: GithubService
	) {}

	@Post("font-data")
	@UseGuards(HasValidTokenGuard)
	public async saveFontStyle(
		@Body() saveFontDataDto: SaveFontDataDto,
		@Headers("authorization") authHeader: string
	) {
		const token = authHeader.split(" ")?.[1];

		if (token) {
			const userId = (decode(token) as TokenPayload).id;

			const res = await this.github.postFile(
				`UserFont-${userId}.css`,
				this.buildFontCssFile(saveFontDataDto.fontData, userId),
				`Add font style for user with id ${userId}`
			);

			if (res.status >= 400) {
				throw new BadGatewayException(["Something went wrong saving your font"]);
			} else {
				await this.fontRepository.markFontAsSaved(userId);
			}

			return {};
		}

		throw new InternalServerErrorException([
			"Something went wrong saving your font",
		]);
	}

	@Post("font-characters")
	@UseGuards(HasValidTokenGuard)
	public async saveFont(
		@Body() saveFontDto: SaveFontCharactersDto,
		@Headers("authorization") authHeader: string
	) {
		const token = authHeader.split(" ")?.[1];

		if (token) {
			const user_id = (decode(token) as TokenPayload).id;

			await this.fontRepository.saveProgress({
				user_id,
				font_characters: saveFontDto.fontCharacters,
			});

			return {};
		}

		throw new InternalServerErrorException([
			"Something went wrong saving your font",
		]);
	}

	private buildFontCssFile(fontData: any, userId: number): string {
		return Buffer.from(
			`@font-face {
	font-family: "UserFont-${userId}";
	src: url(data:application/font-ttf;charset=utf-8;base64,${Buffer.from(
		Uint8Array.from(fontData)
	).toString("base64")}) format("truetype");
	font-weight: 400;
	font-style: normal;
}`
		).toString("base64");
	}
}
