import {
    EmailNotFound,
    IncorrectPassword,
    Session,
    User,
    UserNotFound,
} from '@entities/index'
import { PasswordDoesNotMatch } from '@lib/password'
import { getAppDataSourceInitialized } from '@lib/typeorm'
import { createSessionRequestBody } from '@schemas/json'
import { CreateSessionRequestBody } from '@schemas/types'
import { FastifyInstance } from 'fastify'

export async function userRoutes(fastify: FastifyInstance) {
    fastify.post<{ Body: CreateSessionRequestBody }>('/', {
        schema: {
            body: createSessionRequestBody,
        },
        handler: async function create(request, reply) {
            const datasource = await getAppDataSourceInitialized()
            const user = await datasource
                .getRepository(User)
                .findOneBy({ email: request.body.email as string })
            if (!user) throw new UserNotFound('User could not be found')

            const regexEmail = (email: string) => {
                const re = /\S+@\S+\.\S+/
                return re.test(email)
            }
            if (!regexEmail(request.body.email as string))
                throw new EmailNotFound('Email not found')

            const isValidPassword = await user.isPasswordValid(
                request.body.password as string
            )

            const isPasswordMatch = await user.isPasswordMatch(
                request.body.password as string,
                user.passwordHash
            )

            if (!isValidPassword)
                throw new IncorrectPassword('Password is incorrect')

            if (!isPasswordMatch)
                throw new PasswordDoesNotMatch('Password does not match')

            const session = datasource.getRepository(Session).create()
            session.user = user

            await datasource.getRepository(Session).save(session)

            return reply.setCookie('session', session.token, {
                path: '/',
                signed: true,
                domain: 'localhost',
                httpOnly: true,
            })
        },
    })
}
