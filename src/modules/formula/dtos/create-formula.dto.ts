import {
  IsNotEmpty,
  IsOptional,
  IsString,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { evaluate, MathNode, parse } from 'mathjs';
import { ALLOWED_VARIABLES } from 'src/common/constants/constants';

export function IsValidFormula(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidFormula',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          try {
            if (typeof value !== 'string' || !value) return false;

            const node = parse(value);
            const variables = new Set<string>();

            node.traverse((child: MathNode) => {
              if (child.type === 'SymbolNode') {
                variables.add((child as any).name);
              }
            });

            const invalidVars = Array.from(variables).filter(
              (v) => !ALLOWED_VARIABLES.includes(v),
            );

            if (invalidVars.length > 0) return false;

            const scope = { PRICE: 1, PROFIT_MARGIN: 1 };
            const result = evaluate(value, scope);

            return typeof result === 'number' && isFinite(result);
          } catch (err) {
            console.error('Formula validation error:', err);
            return false;
          }
        },

        defaultMessage(_args: ValidationArguments) {
          return 'Formula is invalid or contains unsupported variables';
        },
      },
    });
  };
}

export class CreateFormulaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty({ message: 'Formula is required' })
  @IsValidFormula({
    message: 'Formula must be valid and use only allowed variables.',
  })
  formula: string;
}
