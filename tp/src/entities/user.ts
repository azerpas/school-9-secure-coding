import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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
	email!: string;

	@Column({ length: 60 })
	passwordHash!: string;
}
