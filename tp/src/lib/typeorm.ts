import { DataSource } from "typeorm";
import { User } from "@entities/index";
import 'dotenv/config'
import { UserSubscriber } from "subscribers";

export const getAppDataSource = (): DataSource => {
    if (!process.env.POSTGRES_HOST) throw new Error("POSTGRES_HOST is not defined")
    if (!process.env.POSTGRES_PORT) throw new Error("POSTGRES_PORT is not defined")
    if (!process.env.POSTGRES_TEST_PORT) throw new Error("POSTGRES_TEST_PORT is not defined")
    if (!process.env.POSTGRES_USER) throw new Error("POSTGRES_USER is not defined")
    if (!process.env.POSTGRES_PASSWORD) throw new Error("POSTGRES_PASSWORD is not defined")
    if (!process.env.POSTGRES_DB) throw new Error("POSTGRES_DB is not defined")
    else return new DataSource({
        type: "postgres",
        host: process.env.POSTGRES_HOST,
        port: process.env.NODE_ENV === `test` ?  parseInt(process.env.POSTGRES_TEST_PORT) : parseInt(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        synchronize: true,
        logging: false,
        entities: [User],
        subscribers: [UserSubscriber],
        migrations: [],
    })
}

export const getAppDataSourceInitialized = async (): Promise<DataSource> => {
    const datasource: DataSource = getAppDataSource()
    return datasource.initialize()
}
