import convertBytes from '../scripts/convertBytes';

const FileInfo = ({ file }) => (
  <label tabIndex="0" className="upload-form__label" htmlFor="file">
    { file ?
      <output className="is-centered">
        <h3>{file.name}</h3>
        <p>{convertBytes(file.size)}</p>
      </output>
      :
      'No File Selected'
    }
  </label>
);

export default FileInfo;
