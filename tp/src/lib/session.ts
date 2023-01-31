import { FastifyReply, FastifyRequest } from 'fastify'
import { Session } from '../entities/session'
import { User } from '../entities/user'

declare module 'fastify' {
  interface FastifyRequest {
    session?: Session | null
    user?: User | null
  }
}

/**
 * The loadSession function is a preHandler hook that can be registered globally on a fastify instance. If you set it up as a global hook, it should do nothing if the session cookie is missing in request. Else, it will decorate the request object with additional user and session properties. For performances reasons, use decorateRequest.
 */
export async function saveSession(reply: FastifyReply, user: User) {
    // TODO: move here the code you already implemented
    // about session creation and cookie assignment.
}

export async function loadSession(request: FastifyRequest) {
    // TODO: read the cookie from request.cookies[COOKIE_NAME].
    // TODO: unsign the cookie (or reject if invalid) and retreive the token.
    // TODO: load the sesion + user and assign it to ̀request.session` and `request.user`.
}