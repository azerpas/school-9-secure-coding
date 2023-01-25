import { server } from '@lib/fastify'
import { expect } from 'chai'
import { FastifyInstance } from 'fastify'

describe('Fastify general errors', () => {
    it('should fetch the error if statusCode >= 500 and dev mode', async () => {
        // add a route that throws an error to `server`
        const errorRoute = async (route: FastifyInstance) => {
            route.get('/error', () => {
                throw {
                    statusCode: 500,
                    message: 'MyCustomError',
                }
            })
        }

        await server.register(errorRoute)

        const response = await server.inject({
            url: '/error',
            method: 'GET',
        })
        expect(response.statusCode).equal(500)
        if (process.env.NODE_ENV === 'production') {
            expect(response.payload).equal('Internal Server Error')
        } else {
            expect(response.payload).equal('{"error":"MyCustomError"}')
        }
    })
})
