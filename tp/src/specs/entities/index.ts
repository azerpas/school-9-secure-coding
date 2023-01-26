import { User, Session } from "@entities/index"
import { DataSource } from "typeorm"

export async function deleteAllTables(datasource: DataSource) {
    await datasource.getRepository(Session).delete({})
    await datasource.getRepository(User).delete({})
}