import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsValidEmail(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'Please provide a valid email address',
        ...validationOptions,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          // RFC 5322 compliant email regex
          const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          return typeof value === 'string' && emailRegex.test(value);
        },
      },
    });
  };
} 