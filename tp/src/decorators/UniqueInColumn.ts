import { User } from '@entities/user';
import { getAppDataSourceInitialized } from '@lib/typeorm';
import { registerDecorator, ValidationOptions, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: true })
export class UniqueInColumnConstraint implements ValidatorConstraintInterface {
    async validate(value: any, args: ValidationArguments) {
        return (await getAppDataSourceInitialized()).getRepository(User).findOneBy({ email: value }).then((user: User | null) => {
            if (user) return false;
            else return true;
        })
    }
}

export function UniqueInColumn(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: UniqueInColumnConstraint
        });
    }
}