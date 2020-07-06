import { IsString, IsNotEmpty } from "class-validator";
import { IsPasswordComplex } from "../validators/is-password-complex.validator";

export class ResetPasswordDto {
	@IsNotEmpty()
	@IsString()
	@IsPasswordComplex()
	password: string;
}
