import { RouteOptions } from "fastify"

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