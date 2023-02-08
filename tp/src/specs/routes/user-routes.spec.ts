// tp2 Exercice 2 test case
import { server } from '@lib/fastify'
import { expect } from 'chai'
import { CreateUserRequestBody, CreateUserResponseBody } from '@schemas/types'
import { faker } from '@faker-js/faker'
import { getAppDataSourceInitialized } from '@lib/typeorm'
import { DataSource } from 'typeorm'
import * as chai from 'chai'
import { deleteAllTables } from 'specs/entities'
import { buildUserFixture, createUserFixture } from '../fixtures/users-fixtures'
import { createSessionFixture, loginAs } from '../fixtures/sessions-fixtures'
import { sign } from '@fastify/cookie'
import { Session, User } from '@entities/index'

describe('Users (/users)', function () {
    let datasource: DataSource
    let mockUser: User

    before(async function () {
        datasource = await getAppDataSourceInitialized()
    })

    beforeEach(async function () {
        await deleteAllTables(datasource)
        mockUser = buildUserFixture()
        await datasource.getRepository(User).save(mockUser)
    })

    after(async function () {
        await deleteAllTables(datasource)
    })

    describe('POST', function () {
        it('should register the user', async function () {
            const password = faker.internet.password(20)
            const payload: CreateUserRequestBody = {
                email: 'hello@world.com',
                password,
                firstname: 'hello',
                lastname: 'world',
                passwordConfirmation: password,
            }
            const response = await server.inject({
                url: '/users',
                method: 'POST',
                payload: payload,
            })

            expect(response.statusCode).to.equal(201)
            const user = JSON.parse(response.payload) as CreateUserResponseBody
            expect(user.firstname).to.equal(payload.firstname)
            expect(user.lastname).to.equal(payload.lastname)
            expect(user.email).to.equal(payload.email)
        })

        it('should throw an error when register with an email taken', async () => {
            const password = faker.internet.password(20)
            const userBody = {
                firstname: faker.name.firstName(),
                lastname: faker.name.lastName(),
                email: faker.internet.email(),
                password,
                passwordConfirmation: password,
            }

            let response = await server.inject({
                url: '/users',
                method: 'POST',
                payload: userBody,
            })
            chai.expect(response.statusCode).equal(201)

            response = await server.inject({
                url: '/users',
                method: 'POST',
                payload: userBody,
            })
            chai.expect(response.statusCode).equal(400)
            chai.expect(JSON.parse(response.payload)).deep.equal({
                error: {
                    UniqueInColumnConstraint: 'User.email is not unique',
                },
            })
        })
    })

    describe('Custom error handler', function () {
        it('request by id', async function () {
            const id = 'e6859e48-9c08-11ed-a8fc-0242ac120002'
            const response = await server.inject({
                method: 'GET',
                url: `/users/${id}`,
            })
            expect(response.statusCode).to.equal(404)
        })

        it('should throw Validation Error when required fields are missing', async function () {
            const userBody = {
                firstname: faker.name.firstName(),
                lastname: faker.name.lastName(),
                email: faker.internet.email(),
                password: null,
                passwordConfirmation: null,
            }
            const response = await server.inject({
                url: '/users',
                method: 'POST',
                payload: { userBody },
            })
            expect(response.statusCode).equal(400)
        })
    })

    describe('User session context cookie', function () {
        const createUserAndSessionFixture = async () => {
            const mockUser = await createUserFixture()
            const session = await createSessionFixture({
                user: mockUser,
            })
            return { mockUser, session }
        }

        it('should respond with the current user identity', async () => {
            const { mockUser, session } = await createUserAndSessionFixture()
            const response = await server.inject({
                url: '/users/me',
                method: 'GET',
                cookies: loginAs(session),
            })

            expect(response.statusCode).to.equal(200)
            const user = JSON.parse(response.payload) as User
            expect(user.id).to.equal(mockUser.id)
            expect(response.json()).to.not.haveOwnProperty('token')
        })

        it('should respond with 401 if user is not logged in', async () => {
            const response = await server.inject({
                url: '/users/me',
                method: 'GET',
            })
            expect(response.statusCode).to.equal(401)
        })

        it('should respond with 401 if unsigned cookie', async () => {
            const { session } = await createUserAndSessionFixture()
            const response = await server.inject({
                url: '/users/me',
                method: 'GET',
                cookies: {
                    session: session.token,
                },
            })
            expect(response.statusCode).to.equal(401)
        })

        it('should respond with 401 if cookie signature with a wrong key', async () => {
            const { session } = await createUserAndSessionFixture()
            const response = await server.inject({
                url: '/users/me',
                method: 'GET',
                cookies: {
                    session: sign(session.token, 'wrong-key'),
                },
            })
            expect(response.statusCode).to.equal(401)
        })

        it('should respond with 401 if session has expired', async () => {
            const { session } = await createUserAndSessionFixture()
            // Mock expired session
            const expiredSession = await datasource
                .getRepository(Session)
                .save({ ...session, expiresAt: new Date(Date.now() - 10000) })
            const response = await server.inject({
                url: '/users/me',
                method: 'GET',
                cookies: loginAs(expiredSession),
            })
            expect(response.statusCode).to.equal(401)
        })

        it('should respond with 401 if session has been revoked', async () => {
            const { session } = await createUserAndSessionFixture()
            // Mock revoked session
            const revokedSession = await datasource
                .getRepository(Session)
                .save({ ...session, revokedAt: new Date() })
            const response = await server.inject({
                url: '/users/me',
                method: 'GET',
                cookies: loginAs(revokedSession),
            })
            expect(response.statusCode).to.equal(401)
        })
    })
})
