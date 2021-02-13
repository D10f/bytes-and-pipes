
// TESTING PURPOSES!
let masterKey
(async function(){
  masterKey = await generateKey()
})()
// END

function generateKey(){
  return crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 128 },
    true,
    ['encrypt', 'decrypt']
  );
}

function getKeyMaterial(){

  const enc = new TextEncoder()
//   const input = prompt('type in a passsowrd')
  const password = enc.encode('password123')

  return crypto.subtle.importKey(
    "raw",
    password,
    "PBKDF2",
    false,
    ['deriveKey']
  );
}

async function deriveKey(salt = crypto.getRandomValues(new Uint8Array(32))){
// async function deriveKey(salt = new Uint8Array(32)){

  const keyMaterial = await getKeyMaterial()

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
  }
}

async function encryptData(data){

  const iv = crypto.getRandomValues(new Uint8Array(12))
  // const iv = new Uint8Array(12)
  const { key, salt } = await deriveKey()

  const encryptedContent = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    data
  );

  return new Uint8Array([...salt, ...iv, ...new Uint8Array(encryptedContent)])

  // return {
  //   encryptedBytes: new Uint8Array(encryptedContent),
  //   iv,
  //   salt
  // }
}

async function decryptData(encryptedBuffer){

  const encryptedBytes = new Uint8Array(encryptedBuffer)

  const salt = encryptedBytes.slice(0, 32)
  const iv = encryptedBytes.slice(32, 32 + 12)
  const data = encryptedBytes.slice(32 + 12)

  const { key } = await deriveKey(salt)

  const decryptedBytes = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    data
  );

  return new Uint8Array(decryptedBytes)
}
