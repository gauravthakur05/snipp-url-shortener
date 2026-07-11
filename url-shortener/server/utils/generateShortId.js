import { customAlphabet } from 'nanoid';

// Alphanumeric, URL-safe alphabet without visually ambiguous characters
// (no 0/O, 1/l/I) so short links are easy to read and type by hand.
const ALPHABET = '23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';

const length = Number(process.env.SHORT_ID_LENGTH) || 7;

const nanoid = customAlphabet(ALPHABET, length);

/**
 * Generates a new random short ID for a URL document.
 */
const generateShortId = () => nanoid();

export default generateShortId;
