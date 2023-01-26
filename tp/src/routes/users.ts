import { User } from "@entities/user"
import { FastifyInstance } from "fastify"
import { getAppDataSourceInitialized } from "@lib/typeorm"
import { CreateUserRequestBody, CreateUserResponseBody, UserShowParams, UserShowResponse } from "@schemas/types"
import { createUserRequestBody, createUserResponseBody, userShowParams, userShowResponse } from "@schemas/json"
import { PasswordDoesNotMatch, PasswordNotStrongEnough } from "@lib/password"

export async function userRoutes(fastify: FastifyInstance) {
    fastify.post<{ Body: CreateUserRequestBody }>('/', {
        schema: {
            body: createUserRequestBody,
            response: { 201: createUserResponseBody }
            
        },
        handler: async function create(request, reply) {
            const user = new User()
            user.firstName = request.body.firstname
            user.lastName = request.body.lastname
            user.email = request.body.email
            try {
                await user.setPassword({ password: request.body.password, passwordConfirmation: request.body.passwordConfirmation })
            } catch (error) {
                if (error instanceof PasswordNotStrongEnough) {
                    return reply.status(400).send({ error: error.message })
                } else if (error instanceof PasswordDoesNotMatch) {
                    return reply.status(400).send({ error: error.message })
                } else {
                    console.error(error)
                    return reply.status(500).send({ error: "Internal server error"})
                }
            }
            await (await getAppDataSourceInitialized()).getRepository(User).save(user)
            return reply.status(201).send({ ...user, firstname: user.firstName, lastname: user.lastName, id: user.id })
        }
    })
}