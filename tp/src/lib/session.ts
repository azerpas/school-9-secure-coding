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

export class InvalidSessionError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'InvalidSessionError'
    }
}

export class SessionNotFoundError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'SessionNotFoundError'
    }
}

export class SessionExpiredError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'SessionExpiredError'
    }
}

export async function saveSession(reply: FastifyReply, user: User) {
    const datasource = await getAppDataSourceInitialized()

    const session = datasource.getRepository(Session).create()
    session.user = user

    await datasource.getRepository(Session).save(session)

    await reply
        .setCookie('session', session.token, {
            path: '/',
            signed: true,
            domain: 'localhost',
            httpOnly: true,
        })
        .status(201)
        .send('')
}

/**
 * The loadSession function is a preHandler hook that can be registered globally on a fastify instance.
 * If you set it up as a global hook, it should do nothing if the session cookie is missing in request.
 * Else, it will decorate the request object with additional user and session properties.
 * For performances reasons, use decorateRequest.
 */
export async function loadSession(request: FastifyRequest) {
    const cookie = request.cookies['session']
    if (!cookie) return
    const result = request.unsignCookie(cookie)
    if (!result.valid || !result.value)
        throw new InvalidSessionError('Invalid token')
    const token = result.value
    const datasource = await getAppDataSourceInitialized()
    const session = await datasource
        .getRepository(Session)
        .findOne({ where: { token }, relations: { user: true } })
    if (!session) throw new SessionNotFoundError('Session could not be found')
    if (session.expiresAt < new Date()) throw new SessionExpiredError('Session expired')
    request.session = session
    request.user = session.user
    console.log('Session loaded')
    console.log(request.session)
    console.log(request.user)
}
