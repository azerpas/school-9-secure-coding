// tp2 Exercice 2 test case
import { server } from '@lib/fastify'
import { User } from '@entities/user'
import { expect } from 'chai'
describe('/web-api/users', function () {
    describe('POST #create', function () {
        it('should register the user', async function () {
            const payload = {      
                email:"hello@world.com",
                passwordHash: "", 
                firstName: "hello", 
                lastName: "world", 
                id: 0, 
                emanpm: 0
            }
            const response = await server.inject({ url: '/web-api/users', method: 'POST', payload: payload })
            // TODO: complete this spec case
            expect(response.statusCode).to.equal(201)
            const user = JSON.parse(response.payload) as User
            expect(user.firstName).to.equal(payload.firstName)
            expect(user.lastName).to.equal(payload.lastName)
            expect(user.email).to.equal(payload.email)
        })
    })
})