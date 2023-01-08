import { User } from '@entities/user';
import { getAppDataSource } from '@lib/typeorm';
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function UniqueInColumn(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return getAppDataSource().getRepository(User).findOneBy({ email: value }).then((user: User | null) => {
                        if (user) return false;
                        else return true;
                    })
                },
            },
        });
    }
}