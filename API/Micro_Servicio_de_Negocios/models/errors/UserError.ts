class UserError extends Error {
    constructor(message:string) {
        super(message);
        this.message = message;
    }
}

module.exports = UserError;