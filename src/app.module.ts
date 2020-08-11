import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth/auth.controller";
import { IsUniqueEmailConstraint } from "./auth/validators/is-unique-email.validator";
import { HasValidTokenGuard } from "./guards/has-valid-token.guard";
import { TokenIdMatchesRequestedIdGuard } from "./guards/token-id-matches-requested-id.guard";
import { FontController } from "./font/font.controller";
import { PostController } from "./post/post.controller";
import { PostRepository } from "./post/db/post.repository";
import { FontRepository } from "./font/db/font.repository";
import { DatabaseModule } from "./db/database.module";
import { UserRepository } from "./auth/db/user.repository";

@Module({
	imports: [
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
		IsUniqueEmailConstraint,
		PostRepository,
		FontRepository,
		UserRepository,
	],
})
export class AppModule {}
