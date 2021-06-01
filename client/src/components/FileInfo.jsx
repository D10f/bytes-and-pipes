import convertBytes from '../scripts/convertBytes';

const FileInfo = ({ file }) => (
  <label tabIndex="0" className="upload-form__label mb2" htmlFor="file">
    { file ?
      <output>
        <h3>{file.name}</h3>
        <p>{convertBytes(file.size)}</p>
      </output>
      :
      'No File Selected'
    }
  </label>
);

export default FileInfo;
