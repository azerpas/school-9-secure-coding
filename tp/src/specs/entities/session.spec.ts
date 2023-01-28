import * as chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { Session, User } from '@entities/index'
import { getAppDataSourceInitialized } from '@lib/typeorm'
import { DataSource, QueryFailedError } from 'typeorm'
import { expect } from 'chai'
import { buildUserFixture } from 'specs/fixtures/users-fixtures'
import { deleteAllTables } from '.'
import { server } from '@lib/fastify'
import { faker } from '@faker-js/faker'

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
            const session = await datasource
                .getRepository(Session)
                .save(newSession)
            expect(session.createdAt.getDay()).to.equal(new Date().getDay())
            expect(session.expiresAt.getDate()).to.equal(
                new Date().getDay() + 1
            )
            expect(session.token.length).to.equal(64)
            expect(session.user.firstName).to.equal(user.firstName)
        })

        it('should raise error if missing user in session', async () => {
            const newSession = datasource.getRepository(Session).create()
            await expect(
                datasource.getRepository(Session).save(newSession)
            ).to.be.rejectedWith(
                QueryFailedError,
                'null value in column "userId" of relation "session" violates not-null constraint'
            )
        })

        it('should create a session after lowering email', async () => {
            const newSession = datasource.getRepository(Session).create()
            newSession.user = user
            const session = await datasource
                .getRepository(Session)
                .save(newSession)
            expect(session.user.email).to.equal(user.email.toLowerCase())
        })

        it('should reject with 404 if email not found', async () => {
            const newSession = datasource.getRepository(Session).create()
            user.email = ''
            newSession.user = user
            console.log(newSession.user)
            const response = await server.inject({
                url: '/sessions',
                method: 'POST',
                payload: {
                    email: newSession.user.email,
                    password: newSession.user.passwordHash,
                },
            })
            expect(response.statusCode).to.equal(404)
        })

        it('should reject with 403 if password does not match', async () => {
            const newSession = datasource.getRepository(Session).create()
            newSession.user = user

            newSession.user.passwordHash = faker.internet.password(20)
            const response = await server.inject({
                url: '/sessions',
                method: 'POST',
                payload: {
                    email: newSession.user.email,
                    password: 'password',
                },
            })

            expect(response.statusCode).to.equal(403)
        })
    })
})
