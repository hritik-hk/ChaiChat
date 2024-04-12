export const getUrl = (path: string): string => {
  const baseUri = import.meta.env.VITE_SERVER_URI;
  return `${baseUri}/${path}`;
};
