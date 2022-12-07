export class ValidationError extends Error {
    /**
     * (ex. an instance of User)
     */
    target: object

    /**
     * string (ex. 'email', 'firstname', etc.).
     */
    property: string

    constructor(error: Error, target: object, property: string) {
        super(error.message)
        this.stack = error.stack
        this.target = target
        this.property = property
    }
}