import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { User } from '@entities/index'
import { getAppDataSource } from '@lib/typeorm'
import { DataSource, QueryFailedError } from 'typeorm'
import { expect } from 'chai'
import { ValidationError } from 'class-validator'

chai.use(chaiAsPromised)

describe('User', function () {
    let datasource: DataSource

    before(async function () {
        // TODO: initialise the datasource (database connection)
        datasource = await getAppDataSource().initialize()
    })

    beforeEach(async function () {
        await datasource.getRepository(User).clear()
    })

    const generateUser = (email?: string): User => {
        return datasource.getRepository(User).create({
            email,
            passwordHash: "", 
            firstName: "hello", 
            lastName: "world", 
            id: 0, 
            emanpm: 0
        })
    }

    describe('validations', function () {
        it('should create a new User in database', async () => {
            const newUser = generateUser("hello@world.com")
            await newUser.setPassword({password: "@di$cR#t#PPsW0Rd", passwordConfirmation: "@di$cR#t#PPsW0Rd"})
            await datasource
                .getRepository(User)
                .save(newUser)
            const user = await datasource.getRepository(User).findOne({where: {firstName: "hello"}})
            expect(user).to.not.be.null
            expect(user?.firstName).to.equal("hello")
        })

        it('should raise error if email is missing', async function () {
            // hint to check if a promise fails with chai + chai-as-promise:
            const user = generateUser(undefined)
            const promise = datasource.getRepository(User).save(user)
            await expect(promise).to.eventually.be.rejected.and.deep.include({
                target: user,
                property: 'email',
                constraints: { isNotEmpty: "User.email is undefined" }
            })
        })

        it('should raise error if email is not unique', async function () {
            const user = generateUser("salut@gmail.com")
            const user2 = generateUser("SALUT@gmail.com")
            await datasource.getRepository(User).save(user)
            const promise = datasource.getRepository(User).save(user2)
            //await expect(promise).to.eventually.be.rejectedWith(QueryFailedError, /duplicate key value violates unique constraint/)
            await expect(promise).to.eventually.be.rejected.and.deep.include({
                target: user2,
                property: 'email',
                constraints: { UniqueInColumnConstraint: "User.email is not unique" }
            })
        })
    })
})