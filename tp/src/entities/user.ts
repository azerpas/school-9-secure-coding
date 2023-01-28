/* eslint-disable indent */
import { IsNotEmpty } from 'class-validator'
import { UniqueInColumn } from 'decorators'
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    OneToMany,
} from 'typeorm'
import * as bcrypt from 'bcrypt'
import {
    PasswordDoesNotMatch,
    PasswordNotStrongEnough,
    validatePassword,
} from '@lib/password'
import { Session } from './session'

@Entity()
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ length: 64 })
    firstName!: string

    @Column({ length: 64 })
    lastName!: string

    @Column({
        transformer: {
            from: (value: string) => value.toLowerCase(),
            to: (value: unknown) => {
                if (typeof value === 'string') return value.toLowerCase()
                else return value
            },
        },
    })
    @UniqueInColumn({ message: 'User.email is not unique' })
    @IsNotEmpty({ message: 'User.email is undefined' })
    email!: string

    @Column({ length: 60 })
    passwordHash!: string

    @OneToMany(() => Session, (session) => session.user, { nullable: true })
    sessions?: Session[]

    async setPassword(params: SetPasswordDTO) {
        const { password, passwordConfirmation } = params
        if (password !== passwordConfirmation)
            throw new PasswordDoesNotMatch('Passwords do not match')
        else {
            if (!validatePassword(password).result)
                throw new PasswordNotStrongEnough(
                    'Password is not strong enough'
                )
            this.passwordHash = await bcrypt.hash(password, 10)
        }
    }

    async isPasswordValid(password: string) {
        return bcrypt.compare(password, this.passwordHash)
    }
    async isPasswordMatch(password: string, passwordConfirmation: string) {
        return password === passwordConfirmation
    }
}

export interface SetPasswordDTO {
    password: string
    passwordConfirmation: string
}

export class UserNotFound extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'UserNotFound'
    }
}
export class EmailNotFound extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'EmailNotFound'
    }
}

export class IncorrectPassword extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'IncorrectPassword'
    }
}
