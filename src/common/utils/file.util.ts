import { APP_PREFIX, APP_HOST } from 'src/configs/config';

export function fusionxPath(path: string): string {
  let prefix = APP_PREFIX;
  if (prefix.endsWith('/')) prefix = prefix.slice(0, -1);
  if (prefix.startsWith('/')) prefix = prefix.slice(1);
  if (path.startsWith('/')) path = path.slice(1);
  return prefix === '' ? `/${path}` : `/${prefix}/${path}`;
}

export function fusionxURL(url: string): string {
  let host = APP_HOST;
  let prefix = APP_PREFIX;
  if (host.endsWith('/')) host = host.slice(0, -1);
  if (prefix.endsWith('/')) prefix = prefix.slice(0, -1);
  if (prefix.startsWith('/')) prefix = prefix.slice(1);
  if (url.startsWith('/')) url = url.slice(1);

  return prefix === '' ? `${host}/${url}` : `${host}/${prefix}/${url}`;
}
