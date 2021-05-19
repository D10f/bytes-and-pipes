import { get, set } from 'idb-keyval';

/**
* Creates an cryptographic key used for decryption
* @param  {string}      password  User input used to derive the encryption key
* @param  {Uint8Array}  salt      Array of random values used to derive the key
* @return {CryptoKey}             Cryptographic key used for decryption
*/
export const deriveDecryptionKey = async (password, salt) => {
  // Attempts to retrieve existing key material from IndexedDB first
  let keyMaterial = await get('cryptoKey');

  if (!keyMaterial) {
    keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      [ 'deriveKey' ]
    );

    await set('cryptoKey', keyMaterial);
  }

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 250000,
      hash: 'SHA-256'
    },
    keyMaterial,
    {
      name: 'AES-GCM',
      length: 256
    },
    false,
    [ 'decrypt' ]
  );
};

/**
* Decrypt data
* @param  {buffer}      plaintext Data to be encrypted in ArrayBuffer, TypedArray of ArrayBufferView form
* @param  {string}      password  User input used to derive the encryption key
* @return {buffer}                Decrypted data in ArrayBuffer form
*/
export const decryptData = async (ciphertext, password) => {

  const salt            = ciphertext.slice(0, 32);
  const iv              = ciphertext.slice(32, 32 + 16);
  const encryptedBytes  = ciphertext.slice(32 + 16);

  const key = await deriveDecryptionKey(password, salt);

  return await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    encryptedBytes
  );
};
