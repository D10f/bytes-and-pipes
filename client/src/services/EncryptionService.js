import {
  generateShareableUrl,
  generateEncryptionKey,
  deriveEncryptionKey,
  encryptData,
  sha256sum,
} from '@/utils/crypto';

/**
 * Base class
 */
class EncryptionStrategy {
  constructor(password) {
    this._password = password;
    this.type;
  }

  generatePassword() {
    throw new Error('Method not implemented!');
  }
}

export class RandomPasswordStrategy extends EncryptionStrategy {
  constructor() {
    super();
    this.type = 'RANDOMLY_GENERATED';
  }
  generatePassword() {
    return generateEncryptionKey();
  }
}

export class PasswordBasedStrategy extends EncryptionStrategy {
  constructor(password) {
    super(password);
    this.type = 'PASSWORD_BASED';
  }
  generatePassword(salt) {
    return deriveEncryptionKey(this._password, salt);
  }
}

export class EncryptionService {
  constructor(encryptionStrategy) {
    this._encryptionStrategy = encryptionStrategy;
    this._salt = crypto.getRandomValues(new Uint8Array(32));
    this._key;
  }

  get strategy() {
    return this._encryptionStrategy.type;
  }

  async encrypt(data) {
    if (!this._key) {
      this._key = await this._encryptionStrategy.generatePassword(this._salt);
    }
    return encryptData(data, this._key, this._salt);
  }

  async generateUrl(url) {
    switch (this.strategy) {
      case 'RANDOMLY_GENERATED':
        return generateShareableUrl(url, this._key);
      case 'PASSWORD_BASED':
        return url;
    }
  }

  sha256sum(data) {
    return sha256sum(data);
  }
}
