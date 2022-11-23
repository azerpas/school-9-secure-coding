import { AppDataSource } from "@lib/typeorm"
import "reflect-metadata"
import { DataSource } from "typeorm"

void (async () => {
    console.log('hello world')
    const datasource: DataSource = await AppDataSource.initialize()
    console.log(datasource.driver.version)
})()
