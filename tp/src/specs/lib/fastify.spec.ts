import {
    assertsResponseSchemaPresenceHook,
    server,
    errorHandlerHook,
} from '@lib/fastify'
import { expect } from 'chai'
import fastify, { FastifyInstance } from 'fastify'

describe('Fastify general errors', () => {
    it('Should throw an error when response schema is missing', () => {
        const unsafeRoute = async (route: FastifyInstance) => {
            route.post(
                '/un-safe',
                {
                    schema: {
                        body: {
                            properties: {
                                foo: 'bar',
                            },
                        },
                    },
                },
                () => true
            )
            const testServer = fastify()
                .setErrorHandler(errorHandlerHook)
                .addHook('onRoute', assertsResponseSchemaPresenceHook)
                .register(unsafeRoute)
            await expect(testServer).to.eventually.be.rejected.and.deep.include(
                {
                    statusCode: 500,
                    name: 'Internal Server Error',
                    message: 'Response schema not found for route /un-safe',
                }
            )
        }
    })

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

        const testServer = fastify()
            .setErrorHandler(errorHandlerHook)
            .register(errorRoute)

        const response = await testServer.inject({
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
