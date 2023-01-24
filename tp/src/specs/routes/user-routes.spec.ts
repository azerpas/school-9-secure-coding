// tp2 Exercice 2 test case
import { server } from '@lib/fastify'
import { User } from '@entities/user'
import { expect } from 'chai'
import { CreateUserRequestBody, CreateUserResponseBody } from '@schemas/types'
import { faker } from '@faker-js/faker'
import { getAppDataSourceInitialized } from '@lib/typeorm'
import { DataSource } from 'typeorm'

describe('Users (/users)', function () {
    describe('POST', function () {
        let datasource: DataSource

        before(async function () {
            datasource = await getAppDataSourceInitialized()
        })

        beforeEach(async function () {
            await datasource.getRepository(User).clear()
        })

        it('should register the user', async function () {
            const password = faker.internet.password(20)
            const payload: CreateUserRequestBody = {
                email: "hello@world.com",
                password,
                firstname: "hello",
                lastname: "world",
                passwordConfirmation: password
            }
            const response = await server.inject({ url: '/users', method: 'POST', payload: payload })
            
            expect(response.statusCode).to.equal(201)
            const user = JSON.parse(response.payload) as CreateUserResponseBody
            expect(user.firstname).to.equal(payload.firstname)
            expect(user.lastname).to.equal(payload.lastname)
            expect(user.email).to.equal(payload.email)
        })
    })
})