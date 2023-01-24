import fastify, { RouteOptions } from 'fastify'
import cookie, { FastifyCookieOptions } from '@fastify/cookie'
// import { createSessionRequestBody, createUserRequestBody, createUserResponseBody } from '@schemas/json'
import { userRoutes } from '@routes/users'
import { checkSchemaBodyQueryParamsHook, MissingValidationSchemaError } from '@hooks/index'

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
    .register(cookie, { secret: 'my-secret' } as FastifyCookieOptions)
    .register(userRoutes, { prefix: '/users' })
    .decorateRequest('session', null)
    .addHook('onRoute', checkSchemaBodyQueryParamsHook)
    .setErrorHandler((error, request, reply) => {
        if (error instanceof MissingValidationSchemaError) {
            void reply.status(400).send({ error: error.message })
        }
        if (process.env.NODE_ENV === 'production' && reply.statusCode >= 500) {
            void reply.status(500).send({ error: 'Internal Server Error' })
        } else {
            void reply.status(500).send({ error: error.message })
        }
    })

// Code Legacy used for Exercise 4 reference
export function assertsResponseSchemaPresenceHook(routeOptions: RouteOptions) {
    if (!routeOptions.schema) {
        throw new Error('Missing schema for this route')
    }
}