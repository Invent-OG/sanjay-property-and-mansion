import crypto from 'node:crypto';

/**
 * Hashes a plaintext password using crypto.scrypt with a secure random salt.
 * Produces format: `<salt>:<derivedKeyHex>`
 */
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

/**
 * Synchronous version of hashPassword for seeds and migrations.
 */
export function hashPasswordSync(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verifies a plaintext password against a stored salt:hash string.
 * Uses timingSafeEqual to protect against timing attacks.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!storedHash || !password) return false;

  return new Promise((resolve) => {
    try {
      if (storedHash.includes(':')) {
        const [salt, key] = storedHash.split(':');
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
          if (err) return resolve(false);
          const keyBuffer = Buffer.from(key, 'hex');
          if (keyBuffer.length !== derivedKey.length) return resolve(false);
          resolve(crypto.timingSafeEqual(keyBuffer, derivedKey));
        });
      } else {
        // Fallback SHA-256 for simple / legacy hashes
        const hash = crypto.createHash('sha256').update(password).digest('hex');
        resolve(hash === storedHash);
      }
    } catch {
      resolve(false);
    }
  });
}

/**
 * Generates a cryptographically random session token.
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

