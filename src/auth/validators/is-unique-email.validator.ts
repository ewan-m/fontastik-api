import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from "class-validator";
import { Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueEmailConstraint implements ValidatorConstraintInterface {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>
	) {}

	async validate(email: any, args: ValidationArguments) {
		return !(await this.userRepository.findOne({ email: email }));
	}
}

export function IsUniqueEmail(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: {
				message: `${propertyName} already exists in our system.`,
				...validationOptions,
			},
			constraints: [],
			validator: IsUniqueEmailConstraint,
		});
	};
}
