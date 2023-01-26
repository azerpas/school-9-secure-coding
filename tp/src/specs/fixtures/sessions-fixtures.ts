import { Session, User } from '@entities/index'
import { buildUserFixture } from './users-fixtures.js'
import { getAppDataSourceInitialized } from '@lib/typeorm'

type SessionFixtureOptions = { user?: User }

export function buildSessionFixture(opts: SessionFixtureOptions = {}) {
    const session = new Session()
    session.user = opts.user ?? buildUserFixture()
    return session
}

export async function createSessionFixture(opts: SessionFixtureOptions = {}) {
    return (await getAppDataSourceInitialized()).getRepository(Session).save(buildSessionFixture(opts))
}