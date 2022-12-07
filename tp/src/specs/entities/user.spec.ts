import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { User } from '@entities/index'
import { getAppDataSource } from '@lib/typeorm'
import { DataSource, QueryFailedError } from 'typeorm'
import { expect } from 'chai'

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

    describe('validations', function () {
        it('should create a new User in database', async () => {
            await datasource
                .getRepository(User)
                .save({
                    email: "",
                    passwordHash: "", 
                    firstName: "hello", 
                    lastName: "world", 
                    id: 0, 
                    emanpm: 0
                } as User)
            const user = await datasource.getRepository(User).findOne({where: {firstName: "hello"}})
            expect(user).to.not.be.null
            expect(user?.firstName).to.equal("hello")
        })

        it('should raise error if email is missing', async function () {
            // hint to check if a promise fails with chai + chai-as-promise:
            const promise = datasource.getRepository(User).save({
                email: undefined,
                passwordHash: "", 
                firstName: "hello", 
                lastName: "world", 
                id: 0, 
                emanpm: 0
            })
            await chai.expect(promise).to.eventually.be.rejectedWith(QueryFailedError, 'null value in column "email" of relation "user" violates not-null constraint')
        })
    })
})