import { IsNotEmpty, IsEmail, IsString } from "class-validator";
import { IsPasswordComplex } from "../validators/is-password-complex.validator";

export class SignInDto {
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	@IsPasswordComplex()
	password: string;
}
