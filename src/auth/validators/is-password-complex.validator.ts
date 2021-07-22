import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint()
export class IsPasswordComplexConstraint
	implements ValidatorConstraintInterface
{
	validate(password: string, args: ValidationArguments) {
		return password && password.length >= 8;
	}
}

export function IsPasswordComplex(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: {
				message: `${propertyName} must be at least 8 characters long.`,
				...validationOptions,
			},
			constraints: [],
			validator: IsPasswordComplexConstraint,
		});
	};
}
