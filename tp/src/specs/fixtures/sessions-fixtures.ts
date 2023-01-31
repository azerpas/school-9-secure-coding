import { Session, User } from '@entities/index'
import { buildUserFixture } from './users-fixtures'
import { getAppDataSourceInitialized } from '@lib/typeorm'
import { sign } from '@fastify/cookie'

type SessionFixtureOptions = { user?: User }

export function buildSessionFixture(opts: SessionFixtureOptions = {}) {
    const session = new Session()
    session.user = opts.user ?? buildUserFixture()
    return session
}

export async function createSessionFixture(opts: SessionFixtureOptions = {}) {
    return (await getAppDataSourceInitialized())
        .getRepository(Session)
        .save(buildSessionFixture(opts))
}

export function loginAs(session: Session) {
    return {
        ['session']: sign(
            session.token,
            process.env.COOKIE_SECRET ? process.env.COOKIE_SECRET : 'my-secret'
        ),
    }
}
