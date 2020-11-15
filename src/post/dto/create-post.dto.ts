import {
	IsString,
	IsNotEmpty,
	IsNumber,
	MaxLength,
	Max,
	Min,
} from "class-validator";

export class CreatePostDto {
	@IsNotEmpty()
	@IsString()
	@MaxLength(420)
	content: string;

	@IsNotEmpty()
	@IsNumber({ maxDecimalPlaces: 2 })
	@Max(90)
	@Min(-90)
	x: number;

	@IsNotEmpty()
	@IsNumber({ maxDecimalPlaces: 2 })
	@Max(180)
	@Min(-180)
	y: number;
}
