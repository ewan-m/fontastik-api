import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { IsPasswordComplex } from "../validators/is-password-complex.validator";

export class SignUpDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	@IsPasswordComplex()
	password: string;
}
