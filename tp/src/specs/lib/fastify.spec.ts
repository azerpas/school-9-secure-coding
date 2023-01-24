import { assertsResponseSchemaPresenceHook, server } from '@lib/fastify'
import { expect } from 'chai'
import fastify from 'fastify'
describe('Fastify general errors', () => {
    it('Should throw an error when schema is missing', () => {
        const testServer = fastify()
        testServer.addHook('onRoute', assertsResponseSchemaPresenceHook)
        expect(() => {
            testServer.route({
                method: 'GET',
                url: '/',
                handler: () => {
                    return
                }
            })
        }).to.throw()
    })

    it('should fetch the error if statusCode >= 500 and dev mode', async () => {
        // add a route that throws an error to `server`
        server.route({
            method: 'GET',
            url: '/error',
            handler: () => {
                throw new Error('MyCustomError')
            }
        })
        const response = await server.inject({ url: '/error', method: 'GET' })
        expect(response.statusCode).to.equal(500)
        if (process.env.NODE_ENV === 'production') {
            expect(response.payload).to.equal('{"error":"Internal Server Error"}')
        } else {
            expect(response.payload).to.equal('{"error":"MyCustomError"}')
        }
    })
})