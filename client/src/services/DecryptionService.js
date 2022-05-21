import { decryptData, deriveDecryptionKey, importKey } from '@/utils/crypto';

/**
 * Base class
 */
class DecryptionStrategy {
  constructor(password) {
    this._password = password;
    this.type;
  }
  deriveKey() {
    throw new Error('Method not implemented!');
  }
}

export class RandomPasswordStrategy extends DecryptionStrategy {
  constructor(password) {
    super(password);
    this.type = 'RANDOMLY_GENERATED';
  }
  deriveKey() {
    return importKey(this._password);
  }
}

export class PasswordBasedStrategy extends DecryptionStrategy {
  constructor(password) {
    super(password);
    this.type = 'PASSWORD_BASED';
  }
  deriveKey(salt) {
    return deriveDecryptionKey(this._password, salt);
  }
}

export class DecryptionService {
  constructor(decryptionStrategy) {
    this._decryptionStrategy = decryptionStrategy;
  }

  async decrypt(ciphertext) {
    const salt = ciphertext.slice(0, 32);
    const iv = ciphertext.slice(32, 32 + 16);
    const bytes = ciphertext.slice(32 + 16);
    const key = await this._decryptionStrategy.deriveKey(salt);
    return await decryptData(bytes, iv, key);
  }
}
