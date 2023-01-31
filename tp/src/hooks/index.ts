import { EmailNotFound, IncorrectPassword, UserNotFound } from '@entities/user'
import { PasswordDoesNotMatch } from '@lib/password'
import { InvalidSessionError, SessionExpiredError, SessionNotFoundError } from '@lib/session'
import { ValidationError } from 'class-validator'
import {
    FastifyError,
    FastifyReply,
    FastifyRequest,
    RouteOptions,
} from 'fastify'
import { EntityNotFoundError } from 'typeorm'

export class MissingValidationSchemaError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'MissingValidationSchemaError'
    }
}

// Exercise 6
export async function checkSchemaBodyQueryParamsHook(
    routeOptions: RouteOptions
) {
    if (!routeOptions.schema)
        throw new MissingValidationSchemaError(
            `A validation schema is required for the route ${routeOptions.url}`
        )
}

export const errorHandler = (
    error: FastifyError,
    req: FastifyRequest,
    reply: FastifyReply
) => {
    if (error instanceof MissingValidationSchemaError) {
        void reply.status(400).send({ error: error.message })
    }
    if (error instanceof ValidationError) {
        void reply.status(400).send({ error: error.constraints })
    }
    if (
        error instanceof SessionNotFoundError ||
        error instanceof InvalidSessionError ||
        error instanceof SessionExpiredError
    ) {
        void reply.status(401).send({ error: error.message })
    }
    if (
        error instanceof IncorrectPassword ||
        error instanceof PasswordDoesNotMatch
    ) {
        void reply.status(403).send({ error: error.message })
    }
    if (
        error instanceof EntityNotFoundError ||
        error instanceof UserNotFound ||
        error instanceof EmailNotFound
    ) {
        void reply.status(404).send({ error: error.message })
    }
    if (process.env.NODE_ENV === 'production' && reply.statusCode >= 500) {
        void reply.status(500).send({ error: 'Internal Server Error' })
    } else if (reply.statusCode < 500) {
        console.log(error)
        void reply.send(error)
    } else {
        void reply.status(500).send({ error: error.message })
    }
}
