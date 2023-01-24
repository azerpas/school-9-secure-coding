import fastify, { RouteOptions } from 'fastify'
import cookie, { FastifyCookieOptions } from '@fastify/cookie'
// import { createSessionRequestBody, createUserRequestBody, createUserResponseBody } from '@schemas/json'
import { userRoutes } from '@routes/users'

export const server = fastify(
    {
        logger: true,
        ajv: {
            customOptions: {
                removeAdditional: false,
                useDefaults: false
            },
        }
    }
)    // TODO: replace with a real secret dotenv variable
    .register(cookie, {secret: 'my-secret'} as FastifyCookieOptions)
    .register(userRoutes, { prefix: '/users' })
    .decorateRequest('session', null)
    // .addHook('preHandler', loadSession)

server.get('/ping', async (request, reply) => {
    return 'pong\n'
})

server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})

export function assertsResponseSchemaPresenceHook(routeOptions: RouteOptions) {
    if (!routeOptions.schema) {
        throw new Error('Missing schema for this route')
    }
}