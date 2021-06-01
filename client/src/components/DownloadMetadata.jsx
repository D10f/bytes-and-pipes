import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setError } from '../redux/actions/error';
import { decryptData } from '../scripts/crypto';
import PasswordInput from './PasswordInput';
import Button from './Button';

const DownloadMetadata = ({ fileId, hash, setFileMetadata, setDecryptionKey, history, setError }) => {

  const [metadata, setMetadata] = useState(undefined);
  const [password, setPassword] = useState(undefined);

  useEffect(() => {
    fetch(`http://localhost:3000/d/meta/${fileId}`)
      .then(res => {
        if (res.status !== 200) {
          throw new Error('File does not exist or has expired');
        }
        return res.arrayBuffer();
      })
      .then(buffer => (
        hash
          ? decryptMetadata(undefined, buffer)
          : setMetadata(buffer)
      ))
      .catch(err => {
        // setMetadata(undefined);
        // setPassword(undefined);
        // setFileMetadata(undefined);
        setError(err);
        history.push('/');
      });
  }, []);

  const decryptMetadata = async (e, data) => {
    try {
      const { decryptedBuffer, key } = await decryptData(data || metadata, password, hash);
      const decryptedFileMetadata = new TextDecoder().decode(decryptedBuffer);
      setFileMetadata(JSON.parse(decryptedFileMetadata));
      setDecryptionKey(key);
    } catch (e) {
      console.error(e);
      setError('Invalid decryption key');
      setPassword('');
    }
  };

  return (
    <>
      <h3 className="download__title mb2">
      {
        hash ? 'Extracting decryption key...' : 'Enter a password to decrypt this file'
      }
      </h3>
      { !hash && (
        <>
          <PasswordInput password={password} setPassword={setPassword} passwordSuggestions={false} />
          <Button text="Decrypt" action={decryptMetadata} />
        </>
        )}
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setError: (msg) => dispatch(setError(msg))
});

export default connect(undefined, mapDispatchToProps)(DownloadMetadata);
