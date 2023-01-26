import { User } from '@entities/index'
import { faker } from '@faker-js/faker'
import { getAppDataSourceInitialized } from '@lib/typeorm'

type UserFixtureOptions = Partial<Pick<User, 'firstName' | 'lastName' | 'email'>>

export function buildUserFixture(opts: UserFixtureOptions = {}) {
    const user = new User()
    user.firstName = opts.firstName ?? faker.name.firstName()
    user.lastName = opts.lastName ?? faker.name.lastName()
    user.email = opts.email ?? faker.internet.email()

    // that hash matches password 'changethat', hardcoded so we save CPU hasing time
    user.passwordHash = '$2a$12$dm2t30Y07Mt9TklkLOuy.efFIJ69WTW3f7NmwH8uioX9R6NHMQSXO'

    return user
}

export async function createUserFixture(opts: UserFixtureOptions = {}) {
    return (await getAppDataSourceInitialized()).getRepository(User).save(buildUserFixture(opts))
}