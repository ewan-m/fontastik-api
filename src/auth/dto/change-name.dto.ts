import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class ChangeNameDto {
	@IsNotEmpty()
	@IsString()
	@MaxLength(100)
	name: string;
}
