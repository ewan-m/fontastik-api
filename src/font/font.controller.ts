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
import { HasValidTokenGuard } from "../guards/has-valid-token.guard";
import { SaveFontDataDto } from "./dto/save-font-data.dto";
import { GithubService } from "../services/github.service";
import { TokenParserService } from "../services/token-parser.service";
import { UserRepository } from "../auth/db/user.repository";

@Controller()
export class FontController {
	constructor(
		private readonly userRepository: UserRepository,
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
				await this.userRepository.markFontAsSaved(userId);
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

		const result = await this.userRepository.hasUserSavedFont(userId);

		return { hasSavedFont: result };
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
