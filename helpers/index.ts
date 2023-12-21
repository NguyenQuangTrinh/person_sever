import CryptoJS from 'crypto-js'

export function getJwtToken(password: string) {
    const key = CryptoJS.SHA256(password);

    return key.toString(CryptoJS.enc.Base64);
}

// Hash function using CryptoJS
export function hashPassword(password: string) {
    const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    return hashedPassword;
}