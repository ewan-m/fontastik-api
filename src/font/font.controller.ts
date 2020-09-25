import {
	Controller,
	Post,
	UseGuards,
	Body,
	Headers,
	InternalServerErrorException,
	BadGatewayException,
	Get,
	HttpCode,
} from "@nestjs/common";
import { FontRepository } from "./db/font.repository";
import { HasValidTokenGuard } from "../guards/has-valid-token.guard";
import { SaveFontCharactersDto } from "./dto/save-font-characters.dto";
import { SaveFontDataDto } from "./dto/save-font-data.dto";
import { GithubService } from "../services/github.service";
import { TokenParserService } from "../services/token-parser.service";

@Controller()
export class FontController {
	constructor(
		private readonly fontRepository: FontRepository,
		private readonly github: GithubService,
		private readonly tokenParser: TokenParserService
	) {}

	@Post("font-data")
	@UseGuards(HasValidTokenGuard)
	public async saveFontStyle(
		@Body() saveFontDataDto: SaveFontDataDto,
		@Headers("authorization") authHeader: string
	) {
		const userId = this.tokenParser.getUserId(authHeader);

		const res = await this.github.postFile(
			`UserFont-${userId}.css`,
			this.buildFontCssFile(saveFontDataDto.fontData, userId),
			`Add font style for user with id ${userId}`
		);

		if (res.status >= 400) {
			throw new BadGatewayException(["Something went wrong saving your font"]);
		} else {
			try {
				await this.fontRepository.markFontAsSaved(userId);
				return {};
			} catch (error) {
				throw new InternalServerErrorException([
					"Something went wrong saving your font",
				]);
			}
		}
	}

	@Get("has-saved-font")
	@HttpCode(200)
	@UseGuards(HasValidTokenGuard)
	public async hasSavedFont(@Headers("authorization") authHeader: string) {
		const userId = this.tokenParser.getUserId(authHeader);

		const result = await this.fontRepository.hasUserSavedFont(userId);

		return { hasSavedFont: result };
	}

	@Post("font-characters")
	@UseGuards(HasValidTokenGuard)
	public async saveFont(
		@Body() saveFontDto: SaveFontCharactersDto,
		@Headers("authorization") authHeader: string
	) {
		const user_id = this.tokenParser.getUserId(authHeader);

		try {
			await this.fontRepository.saveProgress({
				user_id,
				font_characters: saveFontDto.fontCharacters,
			});

			return {};
		} catch (error) {
			throw new InternalServerErrorException([
				"Something went wrong saving your font",
			]);
		}
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
