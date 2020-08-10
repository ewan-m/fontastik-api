import { MailerService } from "@nestjs-modules/mailer";
import {
	Body,
	Controller,
	Headers,
	HttpCode,
	InternalServerErrorException,
	Post,
	UnauthorizedException,
	UseGuards,
} from "@nestjs/common";
import { pbkdf2Sync, randomBytes } from "crypto";
import { decode, sign } from "jsonwebtoken";
import { HasValidTokenGuard } from "../guards/has-valid-token.guard";
import { MagicLinkDto } from "./dto/magic-link.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { getEmailBody } from "./helpers/get-email-body";
import { TokenPayload } from "./token-payload.type";
import { UserRepository } from "./db/user.repository";
import { User } from "./db/user.entity";

@Controller()
export class AuthController {
	constructor(
		private readonly mail: MailerService,
		private readonly userRepository: UserRepository
	) {}

	@Post("/sign-in")
	@HttpCode(200)
	async signIn(@Body() signInDto: SignInDto) {
		try {
			const user = await this.userRepository.getUserByEmail(signInDto.email);

			const isPasswordCorrect =
				this.getPasswordHash(signInDto.password, user.passwordSalt) ===
				user.passwordHash;

			if (isPasswordCorrect && !user.isBlocked) {
				return {
					token: this.getUserToken(user),
				};
			} else {
				throw Error();
			}
		} catch (error) {
			throw new UnauthorizedException([
				"There was an error logging in - either your password was incorrect or you need to sign up.",
			]);
		}
	}

	@Post("/magic-link")
	@HttpCode(200)
	async sendMagicEmailLink(@Body() magicLinkDto: MagicLinkDto) {
		try {
			const user = await this.userRepository.getUserByEmail(magicLinkDto.email);

			if (user) {
				const token = this.getUserToken(user);

				await this.mail.sendMail({
					from: `'Ewan from Fontastik' <${process.env.EMAIL_USER}>`,
					to: magicLinkDto.email,
					subject: "Fontastik Sign In Link",
					html: getEmailBody(user.name, token),
				});
			}
		} catch (error) {}

		return {
			message:
				"If a matching account was found then an email with a sign in link will be sent to your inbox.",
		};
	}

	@Post("/reset-password")
	@UseGuards(HasValidTokenGuard)
	async resetPassword(
		@Body() resetPasswordDto: ResetPasswordDto,
		@Headers("authorization") authHeader: string
	) {
		const token = authHeader.split(" ")?.[1];

		if (token) {
			try {
				const userId = (decode(token) as TokenPayload).id;

				const user = { userId } as User;
				const passwordSalt = this.getSalt();
				user.passwordSalt = passwordSalt;
				user.passwordHash = this.getPasswordHash(
					resetPasswordDto.password,
					passwordSalt
				);
				await this.userRepository.updatePassword(user);

				return {};
			} catch (error) {}
		}

		throw new InternalServerErrorException([
			"Something went wrong updating your password",
		]);
	}

	@Post("/sign-up")
	async signUp(@Body() signUpDto: SignUpDto) {
		const user = new User();

		const passwordSalt = this.getSalt();
		const passwordHash = this.getPasswordHash(signUpDto.password, passwordSalt);

		user.passwordHash = passwordHash;
		user.passwordSalt = passwordSalt;
		user.email = signUpDto.email;
		user.name = signUpDto.name;

		await this.userRepository.createUser(user);

		return { token: this.getUserToken(user) };
	}

	private getUserToken(user: User) {
		return sign(
			{
				email: user.email,
				name: user.name,
				id: user.userId,
			} as TokenPayload,
			process.env.JWT_SECRET,
			{ expiresIn: "1d" }
		);
	}

	private getPasswordHash(password, salt) {
		return pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("base64");
	}

	private getSalt() {
		return randomBytes(64).toString("base64");
	}
}
