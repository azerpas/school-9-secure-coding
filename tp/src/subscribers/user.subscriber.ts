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
        await this.validate(event.entity)
    }

    /**
     * Called before User update.
     */
    async beforeUpdate(event: UpdateEvent<User>) {
        if(!(event.entity instanceof event.databaseEntity.constructor))
        throw new Error("Expected entity to be an entity instance not a literal object.")
        await this.validate(event.databaseEntity)
    }
}