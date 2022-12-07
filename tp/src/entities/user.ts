import { IsEmpty, IsNotEmpty } from "class-validator"
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    firstName!: string

    @Column()
    lastName!: string

    @Column()
    emanpm!: number

    @Column()
    @IsNotEmpty({ message: "User.email is undefined" })
    email!: string

    @Column()
    passwordHash!: string
}