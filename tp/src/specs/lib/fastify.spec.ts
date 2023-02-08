import { checkSchemaBodyQueryParamsHook } from '@hooks/index'
import { expect } from 'chai'
import fastify, { FastifyInstance } from 'fastify'
describe('Fastify general errors', () => {
    let serverTestInstance: FastifyInstance

    beforeEach(async () => {
        serverTestInstance = fastify()
        serverTestInstance.route({
            method: 'GET',
            url: '/error',
            handler: () => {
                throw new Error('MyCustomError')
            },
        })
        serverTestInstance.addHook('onRoute', checkSchemaBodyQueryParamsHook)
        await serverTestInstance.listen({ port: 3005 })
    })

    afterEach(async () => {
        await serverTestInstance.close()
    })

    it('should fetch the error if statusCode >= 500 and dev mode', async () => {
        const response = await serverTestInstance.inject({
            url: '/error',
            method: 'GET',
        })
        expect(response.statusCode).equal(500)
        if (process.env.NODE_ENV === 'production') {
            expect(response.payload).equal('Internal Server Error')
        } else {
            expect(response.payload).equal(
                '{"statusCode":500,"error":"Internal Server Error","message":"MyCustomError"}'
            )
        }
    })
})
