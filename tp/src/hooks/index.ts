import { ValidationError } from "class-validator"
import { FastifyError, FastifyReply, FastifyRequest, RouteOptions } from "fastify"
import { EntityNotFoundError } from "typeorm"

export class MissingValidationSchemaError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'MissingValidationSchemaError'
    }
}

const sendMissingValidationSchemaError = (name: string, routeOptions: RouteOptions) => {
    console.error(`Missing validation schema(s) for route ${routeOptions.url}: ${name}`)
    throw new MissingValidationSchemaError(`A ${name} validation schema is required for the route ${routeOptions.url}`)
}

// Exercise 6
export async function checkSchemaBodyQueryParamsHook(routeOptions: RouteOptions) {
    const missingSchemas: string[] = []
    if (!routeOptions.schema)
        sendMissingValidationSchemaError('', routeOptions)
    if (!routeOptions.schema?.body)
        missingSchemas.push('body')
    if (!routeOptions.schema?.querystring)
        missingSchemas.push('query')
    if (!routeOptions.schema?.params)
        missingSchemas.push('params')
    if (missingSchemas.length > 0)
        sendMissingValidationSchemaError(missingSchemas.join(', '), routeOptions)
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
    if (error instanceof EntityNotFoundError) {
        void reply.status(404).send({ error: error.message })
    }
    if (process.env.NODE_ENV === 'production' && reply.statusCode >= 500) {
        void reply.status(500).send({ error: 'Internal Server Error' })
    } else {
        void reply.status(500).send({ error: error.message })
    }
}