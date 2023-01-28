import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from './'
import * as crypto from 'crypto'
import { IsNotEmpty } from 'class-validator'

@Entity()
export class Session {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ length: 384 })
    token!: string

    @ManyToOne(() => User, (user) => user.sessions, { nullable: false })
    @IsNotEmpty({ message: "Session canno't be created without a user id" })
    user!: User

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date

    @Column()
    expiresAt!: Date

    @Column({ nullable: true })
    revokedAt?: Date

    @BeforeInsert()
    init() {
        this.setToken()
        this.setExpiresAt()
    }

    setToken() {
        this.token = crypto.randomBytes(48).toString('base64')
    }

    setExpiresAt() {
        this.expiresAt = new Date()
        this.expiresAt.setDate(this.expiresAt.getDay() + 1)
    }
}
