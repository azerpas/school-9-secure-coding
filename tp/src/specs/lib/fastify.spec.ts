import { server } from '@lib/fastify'
import { expect } from 'chai'
import { FastifyInstance } from 'fastify'

describe('Fastify general errors', () => {
    it('should fetch the error if statusCode >= 500 and dev mode', async () => {
        server.route({
            method: 'GET',
            url: '/error',
            handler: () => {
                throw new Error('MyCustomError')
            }
        })

        const response = await server.inject({
            url: '/error',
            method: 'GET',
        })
        expect(response.statusCode).equal(500)
        if (process.env.NODE_ENV === 'production') {
            expect(response.payload).equal('Internal Server Error')
        } else {
            expect(response.payload).equal('{"statusCode":500,"error":"Internal Server Error","message":"MyCustomError"}')
        }
    })
})
