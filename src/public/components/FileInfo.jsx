import convertBytes from '../scripts/convertBytes';

const FileInfo = ({ file }) => (
  <output>
    <h3>{file.name}</h3>
    <p>{convertBytes(file.size)}</p>
  </output>
);

export default FileInfo;
