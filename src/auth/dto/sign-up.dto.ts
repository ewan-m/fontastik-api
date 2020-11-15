import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { IsPasswordComplex } from "../validators/is-password-complex.validator";

export class SignUpDto {
	@IsNotEmpty()
	@IsString()
	@MaxLength(100)
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
