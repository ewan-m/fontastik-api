import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class CreatePostDto {
	@IsNotEmpty()
	@IsString()
	content: string;

	@IsNotEmpty()
	@IsNumber()
	latitude: number;

	@IsNotEmpty()
	@IsNumber()
	longitude: number;
}
