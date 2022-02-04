export const formatFileSize = (size: number) => {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;
  if (size < MB) {
    return `${(size / KB).toFixed(1)} KB`;
  } else if (size < GB) {
    return `${(size / MB).toFixed(1)} MB`;
  } else {
    return `${(size / GB).toFixed(1)} GB`;
  }
};
