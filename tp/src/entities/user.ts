import { IsNotEmpty } from "class-validator"
import { UniqueInColumn } from "decorators";
import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm"
import * as bcrypt from "bcrypt"


@Entity()
@Unique(["email"])
export class User {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ length: 64 })
	firstName!: string;

	@Column({ length: 64 })
	lastName!: string;

	@Column()
	emanpm!: number;

    @Column({
        transformer: {
            from: (value: string) => value.toLowerCase(),
            to: (value: unknown) => {
                if (typeof value === "string") return value.toLowerCase()
                else return value
            }
        }
    })
    @UniqueInColumn({ message: "User.email is not unique" })
    @IsNotEmpty({ message: "User.email is undefined" })
    email!: string;


	@Column({ length: 60 })
	passwordHash!: string;

    async setPassword(password: string, passwordConfirmation: string) {
        if (password !== passwordConfirmation) throw new Error("Passwords do not match")
        else {
            this.passwordHash = await bcrypt.hash(password, 10)
        }
    }
}
