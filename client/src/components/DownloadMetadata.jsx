import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setError } from '../redux/actions/error';
import PasswordInput from './PasswordInput';
import Button from './Button';
import { decryptData } from '../scripts/crypto';

const DownloadMetadata = ({ fileMetadata, setFileMetadata, decryptionKey, setKey, path, setError }) => {

  const [password, setPassword] = useState('watermelon');

  // useEffect(() => {
  //   if (decryptionKey) {
  //     // derive key from decryptionKey (location.hash)
  //     // Decrypt filename
  //     // Continue with downloading file if success
  //     // Error out if not (meaning decryption failed due to incorrect crypto key)
  //   }
  // }, []);

  const decryptMetadata = async (e) => {
    if (e.target.disabled) return;

    try {
      const { decryptedBuffer, key } = await decryptData(fileMetadata, password);
      const decryptedFileMetadata = new TextDecoder().decode(decryptedBuffer);
      setFileMetadata(JSON.parse(decryptedFileMetadata));
      setKey(key);
    } catch (e) {
      console.error(e);
      setError('Invalid decryption key');
      setPassword('');
    }
  };

  return (
    <>
      <h3 className="download__step-title mb2">
      {
        decryptionKey ? 'Extracting decryption key...' : 'Enter a password to decrypt this file'
      }
      </h3>
      { !decryptionKey && (
        <>
          <PasswordInput password={password} setPassword={setPassword} passwordSuggestions={false} />
          <Button text={'Decrypt'} action={decryptMetadata} />
        </>
        )}
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setError: (msg) => dispatch(setError(msg))
})

export default connect(undefined, mapDispatchToProps)(DownloadMetadata);
