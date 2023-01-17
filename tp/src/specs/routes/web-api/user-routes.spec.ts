import { server } from '@lib/fastify'

describe('/web-api/users', function () {
    describe('POST #create', function () {
        it('should register the user', async function () {
            const response = await server.inject({ url: '/web-api/users', method: 'POST', payload: {} })
            // TODO: complete this spec case
        })
    })
})