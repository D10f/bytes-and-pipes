// import { get., set } from 'idb-keyval';

export const generateRandomPassword = (length = 16) => {
  const decoder = new TextDecoder();
  let password = '';

  while (password.length < length) {
    const byte = crypto.getRandomValues(new Uint8Array(1));
    if (byte[0] < 33 || byte[0] > 126) {
      continue;
    }
    password += decoder.decode(byte);
  }

  return password;
};

// export const sha1sum = async msg => {
//   const msgUint8 = new TextEncoder().encode(msg);
//   const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);
//   const hashArray = Array.from(new Uint8Array(hashBuffer));
//   const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
//   return hashHex;
// };

export const generateCryptoKey = async (password, salt) => {

  // const encoder = new TextEncoder();
  // const encodedPassword = encoder.encode(password);

  const encodedPassword = new TextEncoder().encode(password);

  try {
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encodedPassword,
      "PBKDF2",
      false,
      ['deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 250000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      [ "encrypt", "decrypt" ]
    );

    return key;

  } catch (e) {
    console.error(e.message)
  }
};

// export const deriveKey = async (salt = crypto.getRandomValues(new Uint8Array(32))) => {
//
//   // Retrieve key material from store
//   // const keyMaterial = await get('cryptoKey');
//
//   const key = await crypto.subtle.deriveKey(
//     {
//       name: "PBKDF2",
//       salt: salt,
//       iterations: 250000,
//       hash: "SHA-256"
//     },
//     keyMaterial,
//     { name: "AES-GCM", length: 256 },
//     false,
//     [ "encrypt", "decrypt" ]
//   );
//
//   return { key, salt };
// };

export const encryptData = async (data, key, salt) => {

  // Initialization vector is different everytime
  const iv = crypto.getRandomValues(new Uint8Array(16));
  // const { key, salt } = await deriveKey();

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );

  return new Uint8Array([
    ...salt,
    ...iv,
    ...new Uint8Array(encryptedBuffer)
  ]);
};

export const decryptData = async (encryptedBuffer) => {

  const encryptedBytes = new Uint8Array(encryptedBuffer);

  const salt = encryptedBytes.slice(0, 32);
  const iv = encryptedBytes.slice(32, 32 + 12);
  const data = encryptedBytes.slice(32 + 12);

  const { key } = await deriveKey(salt);

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );

  return decryptedBuffer;
};
