import CryptoJS from 'crypto-js'
import { createHash } from 'crypto';
import { v5 as uuidv5 } from 'uuid';


export function getJwtToken(password: string) {
    const key = CryptoJS.SHA256(password);

    return key.toString(CryptoJS.enc.Base64);
}

// Hash function using CryptoJS
export function hashPassword(password: string) {
    const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    return hashedPassword;
}


export const createCustomUUID = (A: string, B: string): string => {
    let sortedParams = [A, B].sort();
    console.log(sortedParams);
    const hash = createHash('sha256').update(`${sortedParams[0]}:${sortedParams[1]}`).digest('hex');

    // Sử dụng chuỗi băm để tạo UUID với namespace là URL
    const customUUID = uuidv5(hash, uuidv5.URL);

    return customUUID;
}
