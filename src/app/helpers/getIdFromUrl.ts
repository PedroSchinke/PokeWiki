export default function getIdFromUrl(url: string) {
  return url.split('/').filter(Boolean).pop();
}
