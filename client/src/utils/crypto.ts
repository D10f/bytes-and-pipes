import {
  RANDOM_SALT_LENGTH,
  INIT_VECTOR_LENGTH,
  ENCRYPTION_KEY_LENGTH,
  ITERATION_COUNT
} from '@utils/constants';

interface IDecryptedData {
  buffer: ArrayBuffer;
  key: CryptoKey;
}

// Creates a password using a cryptographically strong random generator function
export const generateRandomPassword = (length = 16): string => {
  const decoder = new TextDecoder();
  let password = '';

  while (password.length < length) {
    const byte = crypto.getRandomValues(new Uint8Array(1));


    // included characters: A-Z a-z 0-9 "#$%&\'()*+,-./:;<=>?@[\\]^_`{|}
    if (byte[0] > 33 && byte[0] < 126) {
      password += decoder.decode(byte);
    }
  }

  return password;
};

// Returns an array of unsigned 8-bit cryptographically random values
export const generateRandomValues = (length: number): Uint8Array => {
  return crypto.getRandomValues(new Uint8Array(length));
};

// Creates a checksum of a message using a hash function
export const sha256sum = async (msg = ''): Promise<string> => {
  const msgUint8 = new TextEncoder().encode(msg);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

// Exports a key into its JWT form and appends it to the URL string provided.
export const generateShareableUrl = async(url: string, key: CryptoKey): Promise<string> => {
  const { k } = await crypto.subtle.exportKey('jwk', key);
  return url + '#' + k;
};

// Imports a key fragment from a previously exported JWT Web Key and produces a key
export const importKey = async (keyParam: string): Promise<CryptoKey> => {
  return await crypto.subtle.importKey(
    'jwk',
    {
      k: keyParam,
      alg: 'A256GCM',
      ext: true,
      key_ops: ['encrypt', 'decrypt'],
      kty: 'oct',
    },
    {
      name: 'AES-GCM',
      length: ENCRYPTION_KEY_LENGTH
    },
    false,
    ['encrypt', 'decrypt'],
  );
};

// Creates an cryptographic key used for encryption/decryption
export const generateEncryptionKey = async (): Promise<CryptoKey> => {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: ENCRYPTION_KEY_LENGTH
    },
    true,
    ['encrypt', 'decrypt'],
  );
};

// Creates an cryptographic key used for encryption
export const deriveEncryptionKey = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    [ 'deriveKey' ]
  );

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATION_COUNT,
      hash: 'SHA-256'
    },
    keyMaterial,
    {
      name: 'AES-GCM' ,
      length: ENCRYPTION_KEY_LENGTH
    },
    false,
    [ 'encrypt' ]
  );
};

// Encrypts data
export const encryptData = async (plaintext: ArrayBuffer, key: CryptoKey, salt: Uint8Array): Promise<Uint8Array> => {
  const iv = generateRandomValues(INIT_VECTOR_LENGTH);

  const ciphertext: ArrayBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    plaintext
  );

  return new Uint8Array([
    ...salt,
    ...iv,
    ...new Uint8Array(ciphertext)
  ]);
};

// Creates an cryptographic key used for decryption
export const deriveDecryptionKey = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    [ 'deriveKey' ]
  );

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATION_COUNT,
      hash: 'SHA-256'
    },
    keyMaterial,
    {
      name: 'AES-GCM',
      length: ENCRYPTION_KEY_LENGTH
    },
    false,
    [ 'decrypt' ]
  );
};

// Decrypt data
export const decryptData = async (
  ciphertext: ArrayBuffer,
  password = '',
  keyParam = ''
): Promise<IDecryptedData> => {

  if (!keyParam && !password) {
    throw new Error('Cannot decrypt without a password or key parameter!')
  }

  // The ciphertext is prepended with a random salt and initialization vector
  // By default these values are 32 and 16 bytes, respectively.
  const salt           = ciphertext.slice(0, RANDOM_SALT_LENGTH);
  const iv             = ciphertext.slice(RANDOM_SALT_LENGTH, RANDOM_SALT_LENGTH + INIT_VECTOR_LENGTH);
  const encryptedBytes = ciphertext.slice(RANDOM_SALT_LENGTH + INIT_VECTOR_LENGTH);

  const key: CryptoKey = keyParam
    ? await importKey(keyParam)
    : await deriveDecryptionKey(password, salt as Uint8Array);

  // if (keyParam) {
  //   key = await importKey(keyParam);
  // } else {
  //   key = typeof password === 'string'
  //     ? await deriveDecryptionKey(password, salt as Uint8Array)
  //     : password
  // }

  const decryptedBuffer: ArrayBuffer = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    encryptedBytes
  );

  return { buffer: decryptedBuffer, key }
};
