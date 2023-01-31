import { FastifyReply, FastifyRequest } from 'fastify'
import { request } from 'http'
import { Session } from '../entities/session'
import { IncorrectPassword, User } from '../entities/user'
import { getAppDataSourceInitialized } from './typeorm'

declare module 'fastify' {
    interface FastifyRequest {
        session?: Session | null
        user?: User | null
    }
}


export async function saveSession(reply: FastifyReply, user: User) {
    const datasource = await getAppDataSourceInitialized()

    const session = datasource.getRepository(Session).create()
    session.user = user

    await datasource.getRepository(Session).save(session)

    return reply.setCookie('session', session.token, {
        path: '/',
        signed: true,
        domain: 'localhost',
        httpOnly: true,
    })
}

/**
 * The loadSession function is a preHandler hook that can be registered globally on a fastify instance. 
 * If you set it up as a global hook, it should do nothing if the session cookie is missing in request. 
 * Else, it will decorate the request object with additional user and session properties. 
 * For performances reasons, use decorateRequest.
 */
export async function loadSession(request: FastifyRequest) {
    // TODO: read the cookie from request.cookies[COOKIE_NAME].
    // TODO: unsign the cookie (or reject if invalid) and retreive the token.
    // TODO: load the sesion + user and assign it to ̀request.session` and `request.user`.
}