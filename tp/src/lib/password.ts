export const getPasswordEntropy = (password: string): number => {
    const characterSet = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', '!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/',
        ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'
    ]
    const passwordLength = password.length
    const log2CharacterSet = Math.log2(characterSet.length)
    let entropy = 0

    // calculate the entropy of the password
    for (let i = 0; i < passwordLength; i++) {
        const character = password[i]

        if (characterSet.includes(character)) {
            entropy += log2CharacterSet
        }
    }

    return entropy
}

export const validatePassword = (password: string): {result: boolean, entropy: number} => {
    const minEntropy = 80  // minimum entropy in bits
    const entropy = getPasswordEntropy(password)  // compute the entropy of the password

    if (entropy >= minEntropy) {
        return {result: true, entropy}
    } else {
        return {result: false, entropy}
    }
}

export class PasswordNotStrongEnough extends Error {
    constructor(message: string) {
        super(message)
        this.name = "PasswordNotStrongEnough"
    }
}

export class PasswordDoesNotMatch extends Error {
    constructor(message: string) {
        super(message)
        this.name = "PasswordDoesNotMatch"
    }
}
