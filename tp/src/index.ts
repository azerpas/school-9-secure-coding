import { getAppDataSource } from "@lib/typeorm"
import "reflect-metadata"
import { DataSource } from "typeorm"
import { server } from "@lib/fastify"
import 'dotenv/config'

void (async () => {
    console.log('hello world')
    if (!process.env.FASTIFY_PORT || process.env.FASTIFY_PORT === '') throw new Error('FASTIFY_PORT is not defined')
    const FASTIFY_PORT = parseInt(process.env.FASTIFY_PORT)
    const datasource: DataSource = await getAppDataSource().initialize()
    await server.listen({ port: FASTIFY_PORT })
    console.log(datasource.driver.version)
})()
