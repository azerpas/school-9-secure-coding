import {
    IncorrectPassword,
    User,
    UserNotFound,
} from '@entities/index'
import { saveSession } from '@lib/session'
import { getAppDataSourceInitialized } from '@lib/typeorm'
import { createSessionRequestBody } from '@schemas/json'
import { CreateSessionRequestBody } from '@schemas/types'
import { FastifyInstance } from 'fastify'

export async function sessionRoutes(fastify: FastifyInstance) {
    fastify.post<{ Body: CreateSessionRequestBody }>('', {
        schema: {
            body: createSessionRequestBody,
        },
        handler: async function create(request, reply) {
            const datasource = await getAppDataSourceInitialized()
            const user = await datasource
                .getRepository(User)
                .findOneBy({ email: request.body.email  })
            if (!user) throw new UserNotFound('User could not be found')

            const isValidPassword = await user.isPasswordValid(
                request.body.password 
            )
            if (!isValidPassword)
                throw new IncorrectPassword('Password is incorrect')

            return saveSession(reply, user)
        },
    })
}
