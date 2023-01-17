import { User } from '@entities/user'
import { getAppDataSourceInitialized } from '@lib/typeorm'
import { registerDecorator, ValidationOptions, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

@ValidatorConstraint({ async: true })
export class UniqueInColumnConstraint implements ValidatorConstraintInterface {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async validate(value: string, _args: ValidationArguments) {
        return (await getAppDataSourceInitialized()).getRepository(User).findOneBy({ email: value }).then((user: User | null) => {
            if (user) return false
            else return true
        })
    }
}

export function UniqueInColumn(validationOptions?: ValidationOptions) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: UniqueInColumnConstraint
        })
    }
}