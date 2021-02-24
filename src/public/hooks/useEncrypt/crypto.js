export default async function encryptData(data, password){

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const { key, salt } = await deriveKey(password);

  const encryptedContent = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    data
  );

  return new Uint8Array(
    [
      ...salt,
      ...iv,
      ...new Uint8Array(encryptedContent)
    ]
  );
}

async function deriveKey(password, salt = crypto.getRandomValues(new Uint8Array(32))){

  const keyMaterial = await getKeyMaterial(password)

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 250000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    [ "encrypt", "decrypt" ]
  );

  return {
    key,
    salt
  };
}

function getKeyMaterial(password){

  const encoder = new TextEncoder()
  const encodedPassword = encoder.encode(password)

  return crypto.subtle.importKey(
    "raw",
    encodedPassword,
    "PBKDF2",
    false,
    ['deriveKey']
  );
}
