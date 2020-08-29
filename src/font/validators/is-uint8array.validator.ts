import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint()
export class IsUint8ArrayConstraint implements ValidatorConstraintInterface {
	validate(value: Uint8Array, args: ValidationArguments) {
		return value.toString() === "[object Uint8Array]";
	}
}

export function IsUint8Array(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: {
				message: `${propertyName} should be in the Uint8Array format.`,
				...validationOptions,
			},
			constraints: [],
			validator: IsUint8ArrayConstraint,
		});
	};
}
