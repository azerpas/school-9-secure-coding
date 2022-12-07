import { IsEmpty, IsNotEmpty } from "class-validator"
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"


@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ length: 64 })
	firstName!: string;

	@Column({ length: 64 })
	lastName!: string;

	@Column()
	emanpm!: number;


  @Column()
  @IsNotEmpty({ message: "User.email is undefined" })
  email!: string;


	@Column({ length: 60 })
	passwordHash!: string;
}
