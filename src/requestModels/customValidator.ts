import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'startsWithPlus234', async: false })
export class StartsWithPlus234Constraint implements ValidatorConstraintInterface {
  validate(value: string, _args: ValidationArguments) {
    return value.startsWith('+234');
  }

  defaultMessage(_args: ValidationArguments) {
    return 'The value must start with +234';
  }
}