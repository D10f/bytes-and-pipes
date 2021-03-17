const useRandomPassword = (length = 16) => {

  const decoder = new TextDecoder();

  return () => {
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
};

export default useRandomPassword;
