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
    this.password = password;
    this.salt = crypto.getRandomValues(new Uint8Array(32));
    this.key;
    this.type;
    this.generatePassword();
  }
  encrypt(data) {
    return encryptData(data, this.key, this.salt);
  }
  generatePassword() {
    throw new Error('Method not implemented!');
  }
  generateShareableUrl(url) {
    return generateShareableUrl(url, this.key);
  }
}

export class RandomPasswordStrategy extends EncryptionStrategy {
  constructor(password) {
    super(password);
    this.type = 'RANDOMLY_GENERATED';
  }
  async generatePassword() {
    this.key = await generateEncryptionKey();
  }
}

export class PasswordBasedStrategy extends EncryptionStrategy {
  constructor(password) {
    super(password);
    this.type = 'PASSWORD_BASED';
  }
  async generatePassword() {
    this.key = await deriveEncryptionKey(this.password, this.salt);
  }
}

export class EncryptionService {
  constructor(encryptionStrategy) {
    this._encryptionStrategy = encryptionStrategy;
  }

  get strategy() {
    return this._encryptionStrategy.type;
  }

  async encrypt(chunk) {
    return this._encryptionStrategy.encrypt(chunk);
  }

  async generateShareableUrl(url) {
    return this._encryptionStrategy.generateShareableUrl(url);
  }

  sha256sum(data) {
    return sha256sum(data);
  }
}
