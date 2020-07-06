import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { IsPasswordComplex } from "../validators/is-password-complex.validator";
import { IsRole } from "../validators/is-role.validator";
import { IsUniqueEmail } from "../validators/is-unique-email.validator";
import { Role } from "../roles.type";

export class SignUpDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsString()
	@IsEmail()
	@IsUniqueEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	@IsPasswordComplex()
	password: string;

	@IsNotEmpty()
	@IsString()
	@IsRole()
	role: Role;
}
