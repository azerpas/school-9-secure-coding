import { assertsResponseSchemaPresenceHook } from '@lib/fastify'
import { expect } from 'chai'
import fastify from 'fastify'
describe('assertsResponseSchemaPresenceHook', () => {
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
})