let appHost = process.env.APP_HOST ?? 'http://127.0.0.1';

if (!appHost.startsWith('http')) {
  appHost = `https://${appHost}`;
}

export const APP_HOST = appHost;
export const APP_PREFIX = process.env.APP_PREFIX ?? '';
