/**
 * Exports a key into its JWT form and appends it to the URL string provided.
 * @param  {string}    url A string representing the download url for a resource
 * @param  {CryptoKey} key An encryption key to be exported into JWT object form
 * @return {string}        The final url form to be shared.
 */
export const generateShareableUrl = async (url, key) => {
  const { k } = await crypto.subtle.exportKey('jwk', key);
  return `${url}#${k}`;
};

/**
 * Imports a key fragment from a previously exported JWT Web Key and produces a key
 * @param  {string}    keyParam  The k parameter from an exported key in JWT Web Key format
 * @return {CryptoKey}           A reconstructed cryptographic key for decryption purposes.
 */
export const importKey = async (keyParam) => {
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
      length: 256,
    },
    false,
    ['encrypt', 'decrypt']
  );
};

/**
 * Creates an cryptographic key used for encryption/decryption
 * @return {CryptoKey} Cryptographic key used for encryption/decryption
 */
export const generateEncryptionKey = async () => {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
};

/**
 * Creates an cryptographic key used for encryption
 * @param  {string}      password  User input used to derive the encryption key
 * @param  {Uint8Array}  salt      Array of random values used to derive the key
 * @return {CryptoKey}             Cryptographic key used for encryption
 */
export const deriveEncryptionKey = async (password, salt) => {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 250_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt']
  );
};

/**
 * Encrypts data
 * @param  {buffer}      plaintext Data to be encrypted in ArrayBuffer, TypedArray of ArrayBufferView form
 * @param  {CryptoKey}   key       Cryptographic key used to encrypt the data
 * @param  {Uint8Array}  salt      Random value used to derive the encryption key; appended to the output result.
 * @return {Uint8Array}            Array of unsigned int containing the salt, IV and encrypted content.
 */
export const encryptData = async (plaintext, key, salt) => {
  const iv = crypto.getRandomValues(new Uint8Array(16));

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    plaintext
  );

  return new Uint8Array([...salt, ...iv, ...new Uint8Array(ciphertext)]);
};

/**
 * Creates an cryptographic key used for decryption
 * @param  {string}      password  User input used to derive the encryption key
 * @param  {Uint8Array}  salt      Array of random values used to derive the key
 * @return {CryptoKey}             Cryptographic key used for decryption
 */
export const deriveDecryptionKey = async (password, salt) => {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 250000,
      hash: 'SHA-256',
    },
    keyMaterial,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['decrypt']
  );
};

/**
 * Decrypt data
 * @param  {buffer}     ciphertext  The data to be decrypted
 * @param  {buffer}     iv          Initialization Vector used to decrypt this ciphertext
 * @param  {CryptoKey}  Key         Crypto Key object used for decryption
 * @return {buffer}
 */
export const decryptData = async (ciphertext, iv, key) => {
  return await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    ciphertext
  );
};
