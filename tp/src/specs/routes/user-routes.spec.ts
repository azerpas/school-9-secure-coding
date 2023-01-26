// tp2 Exercice 2 test case
import { server } from '@lib/fastify'
import { User } from '@entities/user'
import { expect } from 'chai'
import { CreateUserRequestBody, CreateUserResponseBody } from '@schemas/types'
import { faker } from '@faker-js/faker'
import { getAppDataSourceInitialized } from '@lib/typeorm'
import { DataSource } from 'typeorm'
import * as chai from 'chai'

describe('Users (/users)', function () {
    describe('POST', function () {
        let datasource: DataSource

        before(async function () {
            datasource = await getAppDataSourceInitialized()
        })

        beforeEach(async function () {
            await datasource.getRepository(User).delete({})
        })

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
                    UniqueInColumnConstraint: 'User.email is not unique'
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
})
