import * as chai from 'chai'
import { server, assertsResponseSchemaPresenceHook } from '@lib/fastify'
import { expect } from 'chai'
import fastify, { RouteOptions } from 'fastify'
describe('assertsResponseSchemaPresenceHook', () => {
    it('Should throw an error when schema is missing', () => {
        const testServer = fastify()
        testServer.addHook('onRoute', assertsResponseSchemaPresenceHook)
        expect(() => {
            testServer.route({
                method: 'GET',
                url: '/',
                handler: () => {}
            })
        }).to.throw()
    })
})