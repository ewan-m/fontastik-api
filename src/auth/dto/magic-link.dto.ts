import { IsNotEmpty, IsEmail, IsString } from "class-validator";

export class MagicLinkDto {
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string;
}
