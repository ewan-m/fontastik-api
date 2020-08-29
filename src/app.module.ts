import { MailerModule } from "@nestjs-modules/mailer";
import { Module, HttpModule } from "@nestjs/common";
import { AuthController } from "./auth/auth.controller";
import { HasValidTokenGuard } from "./guards/has-valid-token.guard";
import { TokenIdMatchesRequestedIdGuard } from "./guards/token-id-matches-requested-id.guard";
import { FontController } from "./font/font.controller";
import { PostController } from "./post/post.controller";
import { PostRepository } from "./post/db/post.repository";
import { FontRepository } from "./font/db/font.repository";
import { DatabaseModule } from "./db/database.module";
import { UserRepository } from "./auth/db/user.repository";
import { GithubService } from "./services/github.service";

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
		FontRepository,
		UserRepository,
		GithubService,
	],
})
export class AppModule {}
