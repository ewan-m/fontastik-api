import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth/auth.controller";
import { User } from "./auth/user.entity";
import { IsUniqueEmailConstraint } from "./auth/validators/is-unique-email.validator";
import { HasValidTokenGuard } from "./guards/has-valid-token.guard";
import { TokenIdMatchesRequestedIdGuard } from "./guards/token-id-matches-requested-id.guard";
import config from "./orm-config";

@Module({
	imports: [
		TypeOrmModule.forRoot(config),
		TypeOrmModule.forFeature([User]),
		MailerModule.forRoot({
			transport: {
				service: "gmail",
				auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
			},
		}),
	],
	controllers: [AuthController],
	providers: [
		HasValidTokenGuard,
		TokenIdMatchesRequestedIdGuard,
		IsUniqueEmailConstraint,
	],
})
export class AppModule {}
