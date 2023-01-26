import * as chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { Session, User } from '@entities/index'
import { getAppDataSourceInitialized } from '@lib/typeorm'
import { DataSource, QueryFailedError } from 'typeorm'
import { expect } from 'chai'
import { buildUserFixture } from 'specs/fixtures/users-fixtures'
import { deleteAllTables } from '.'

chai.use(chaiAsPromised)

describe('Session', function () {
    let datasource: DataSource
    let user: User

    before(async function () {
        datasource = await getAppDataSourceInitialized()
    })

    beforeEach(async function () {
        await deleteAllTables(datasource)
        user = buildUserFixture()
        await datasource.getRepository(User).save(user)
    })

    after(async function () {
        await deleteAllTables(datasource)
    })

    describe('validations', function () {
        it('should create a new Session in database', async () => {
            const newSession = datasource.getRepository(Session).create()
            newSession.user = user
            const session = await datasource.getRepository(Session).save(newSession)
            expect(session.createdAt.getDay()).to.equal(new Date().getDay())
            expect(session.expiresAt.getDay()).to.equal(new Date().getDay() + 1)
            expect(session.token.length).to.equal(64)
            expect(session.user.firstName).to.equal(user.firstName)
        })

        it('should raise error if missing user in session', async () => {
            const newSession = datasource.getRepository(Session).create()
            await expect(datasource.getRepository(Session).save(newSession)).to.be.rejectedWith(QueryFailedError, 'null value in column "userId" of relation "session" violates not-null constraint')
        })
    })


})