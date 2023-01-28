import fastify, { RouteOptions } from 'fastify'
import cookie, { FastifyCookieOptions } from '@fastify/cookie'
import { userRoutes } from '@routes/users'
import { checkSchemaBodyQueryParamsHook, errorHandler } from '@hooks/index'
import { sessionRoutes } from '@routes/sessions'

if (!process.env.COOKIE_SECRET)
    throw new Error('Missing COOKIE_SECRET env variable')

export const server = fastify({
    logger: true,
    ajv: {
        customOptions: {
            removeAdditional: false,
            useDefaults: false,
        },
    },
}) // TODO: replace with a real secret dotenv variable
    .register(cookie, {
        secret: process.env.COOKIE_SECRET,
    } as FastifyCookieOptions)
    .register(userRoutes, { prefix: '/users' })
    .register(sessionRoutes, { prefix: '/sessions' })
    .decorateRequest('session', null)
    .addHook('onRoute', checkSchemaBodyQueryParamsHook)
    // .addHook('onRoute', assertsResponseSchemaPresenceHook)
    .setErrorHandler(errorHandler)

// Code Legacy used for Exercise 4 reference
export function assertsResponseSchemaPresenceHook(routeOptions: RouteOptions) {
    if (!routeOptions.schema) {
        throw new Error(`Missing schema for this route ${routeOptions.url}`)
    }
}
