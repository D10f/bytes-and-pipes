import { useState } from 'react';
import { setFile } from '../redux/actions/file';
import { useEncrypt } from '../hooks/useEncrypt';

const ProgressBar = ({ file, setFile, password }) => {

  const { progress, url } = useEncrypt(file, password);

  // listen to changing value of url and set 'file' to null when there's a download url.
  useEffect(() => {
    if (url) {
      setFile(null);
    }
  }, [url]);

  return (

  );
};

const mapStateToProps = (state) => ({
  file: state.file,
  password: state.password.password
});

const mapDispatchToProps = (dispatch) => ({
  setFile: (file) => dispatch(setFile(file))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProgressBar);
