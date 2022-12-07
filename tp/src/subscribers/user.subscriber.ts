import { validate } from "class-validator"
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm"
import { User } from "../entities"

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    /**
     * Indicates that this subscriber only listen to User events.
     */
    listenTo() {
        return User
    }

    async validate(entity: User) {
        const errors = await validate(entity)
        if (errors.length > 0)
            throw errors[0]
    }

    /**
     * Called before User insertion.
     */
    async beforeInsert(event: InsertEvent<User>) {
        console.log(`BEFORE POST INSERTED: `, event.entity)
        this.validate(event.entity)
    }

    /**
     * Called before User update.
     */
    async beforeUpdate(event: UpdateEvent<User>) {
        console.log(`BEFORE POST UPDATED: `, event.entity)
        this.validate(event.databaseEntity)
    }
}