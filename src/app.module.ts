import { MailerModule } from "@nestjs-modules/mailer";
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth/auth.controller";
import { HasValidTokenGuard } from "./guards/has-valid-token.guard";
import { TokenIdMatchesRequestedIdGuard } from "./guards/token-id-matches-requested-id.guard";
import { FontController } from "./font/font.controller";
import { PostController } from "./post/post.controller";
import { PostRepository } from "./post/db/post.repository";
import { DatabaseModule } from "./db/database.module";
import { UserRepository } from "./auth/db/user.repository";
import { GithubService } from "./services/github.service";
import { TokenParserService } from "./services/token-parser.service";
import { PostLikeRepository } from "./post/db/post-like.repository";
import { QueryUtilsService } from "./services/query-utils.service";

@Module({
	imports: [
		HttpModule,
		DatabaseModule,
		MailerModule.forRoot({
			transport: {
				service: "gmail",
				auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
			},
		}),
	],
	controllers: [AuthController, FontController, PostController],
	providers: [
		HasValidTokenGuard,
		TokenIdMatchesRequestedIdGuard,
		PostRepository,
		PostLikeRepository,
		UserRepository,
		GithubService,
		TokenParserService,
		QueryUtilsService,
	],
})
export class AppModule {}
