import { DataSource } from "typeorm";
import { User } from "@entities/index";
import 'dotenv/config'
import { UserSubscriber } from "subscribers";

/**
 * Caching the appDataSource value to avoid creating multiple connections to the database
 */
let appDataSource: DataSource | null = null

export const getAppDataSource = (): DataSource => {
    if (!process.env.POSTGRES_HOST) throw new Error("POSTGRES_HOST is not defined")
    if (!process.env.POSTGRES_PORT) throw new Error("POSTGRES_PORT is not defined")
    if (!process.env.POSTGRES_TEST_PORT) throw new Error("POSTGRES_TEST_PORT is not defined")
    if (!process.env.POSTGRES_USER) throw new Error("POSTGRES_USER is not defined")
    if (!process.env.POSTGRES_PASSWORD) throw new Error("POSTGRES_PASSWORD is not defined")
    if (!process.env.POSTGRES_DB) throw new Error("POSTGRES_DB is not defined")
    else {
        if (!appDataSource) {
            const port = process.env.NODE_ENV === "test" ? process.env.POSTGRES_TEST_PORT : process.env.POSTGRES_PORT
            appDataSource = new DataSource({
                type: "postgres",
                host: process.env.POSTGRES_HOST,
                port: parseInt(port),
                username: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                database: process.env.POSTGRES_DB,
                entities: [User],
                subscribers: [UserSubscriber],
                synchronize: true,
                logging: false
            })
        }
        return appDataSource
    }
}

export const getAppDataSourceInitialized = async (): Promise<DataSource> => {
    if (appDataSource?.isInitialized) return appDataSource
    else {
        const datasource: DataSource = getAppDataSource()
        return datasource.initialize()
    }
}
