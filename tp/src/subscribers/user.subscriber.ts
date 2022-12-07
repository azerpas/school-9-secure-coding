import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm"
import { ValidationError } from "validators"
import { User } from "../entities"

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    /**
     * Indicates that this subscriber only listen to User events.
     */
    listenTo() {
        return User
    }

    validateUser(user: User) {
        /*
        if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(user.email))
        {
            return (true)
        }
        */
        for (const [key, value] of Object.entries(user)) {
            if (value === undefined) {
                throw new ValidationError(new Error(`User.${key} is undefined`), user, key)
            }
        }
    }

    /**
     * Called before User insertion.
     */
    beforeInsert(event: InsertEvent<User>) {
        console.log(`BEFORE POST INSERTED: `, event.entity)
        this.validateUser(event.entity)
    }

    /**
     * Called before User update.
     */
    beforeUpdate(event: UpdateEvent<User>) {
        console.log(`BEFORE POST UPDATED: `, event.entity)
        this.validateUser(event.databaseEntity)
    }
}