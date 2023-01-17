import { User } from "@entities/user"
import { FastifyInstance } from "fastify"
import { getAppDataSourceInitialized } from "@lib/typeorm"
import { CreateUserRequestBody, CreateUserResponseBody, UserShowParams, UserShowResponse } from "@schemas/types"
import { createUserRequestBody, createUserResponseBody, userShowParams, userShowResponse } from "@schemas/json"

// eslint-disable-next-line @typescript-eslint/require-await
export async function userRoutes(fastify: FastifyInstance) {
    /*
    fastify.get<{ Params: UserShowParams }>('/:id', {
        schema: {
            params: userShowParams,
            response: { 200: userShowResponse }
        },
        handler: async function show(request): Promise<UserShowResponse> {
            const user =
                request.params.id === 'me'
                    ? (request.session?.user as User)
                    : await (await getAppDataSourceInitialized()).getRepository(User).findOneByOrFail({ id: request.params.id })

            await authorizeOfFail(canShowUser, request.session, user)
            return user
        }
    })
    */
    fastify.post<{ Body: CreateUserRequestBody }>('/', {
        schema: {
            body: createUserRequestBody,
            response: { 201: createUserResponseBody }
        },
        handler: async function create(request): Promise<CreateUserResponseBody> {
            const user = new User()
            user.firstName = request.body.firstname
            user.lastName = request.body.lastname
            user.email = request.body.email
            await user.setPassword({ password: request.body.password, passwordConfirmation: request.body.passwordConfirmation })
            await (await getAppDataSourceInitialized()).getRepository(User).save(user)
            return { ...user, firstname: user.firstName, lastname: user.lastName, id: user.id }
        }
    })
}