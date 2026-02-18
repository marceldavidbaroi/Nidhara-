import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

function isStrongPassword(value: string): boolean {
  // adjust rules to your needs
  if (typeof value !== 'string') return false;
  if (value.length < 8) return false;
  if (!/[A-Z]/.test(value)) return false;
  if (!/[a-z]/.test(value)) return false;
  if (!/[0-9]/.test(value)) return false;
  return true;
}

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsStrongPassword',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return isStrongPassword(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be at least 8 chars and contain uppercase, lowercase, and a number`;
        },
      },
    });
  };
}
