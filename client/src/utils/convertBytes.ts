
// Converts an amount of bytes into a more human-friendly format
// 22484985480 -> 20.9 GB
export default (bytes: number): string => {
  const sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB' ];

  if (bytes === 0) {
    return 'N/A';
  }

  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  if (i === 0) {
    return bytes + ' ' + sizes[i];
  }

  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};
