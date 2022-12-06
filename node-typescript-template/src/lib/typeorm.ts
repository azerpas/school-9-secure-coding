import { DataSource } from "typeorm";
import { User } from "@entities/index";
import 'dotenv/config'

export const getAppDataSource = (): DataSource => {
    if (!process.env.POSTGRES_HOST) throw new Error("POSTGRES_HOST is not defined")
    else if (!process.env.POSTGRES_PORT) throw new Error("POSTGRES_PORT is not defined")
    else if (!process.env.POSTGRES_USER) throw new Error("POSTGRES_USER is not defined")
    else if (!process.env.POSTGRES_PASSWORD) throw new Error("POSTGRES_PASSWORD is not defined")
    else if (!process.env.POSTGRES_DB) throw new Error("POSTGRES_DB is not defined")
    else return new DataSource({
        type: "postgres",
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.NODE_ENV === `test` ? `${process.env.POSTGRES_DB}-test` : process.env.POSTGRES_DB,
        synchronize: true,
        logging: true,
        entities: [User],
        subscribers: [],
        migrations: [],
    })
}
