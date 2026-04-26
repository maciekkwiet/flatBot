import { ProxyAgent } from 'undici';
import * as winston from 'winston';
import { retry } from './retry';

export type Proxy = {
  host: string;
  port: number;
  username: string;
  password: string;
};

let proxies: Proxy[] = [];

export function getProxies(): Proxy[] {
  return proxies;
}

export function getRandomProxy(): Proxy | null {
  if (proxies.length === 0) return null;
  return proxies[Math.floor(Math.random() * proxies.length)];
}

export function buildProxyUrl(proxy: Proxy): string {
  return `http://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`;
}

export function removeProxy(proxy: Proxy): void {
  proxies = proxies.filter(p => p.host !== proxy.host || p.port !== proxy.port);
}

type FetchOptions = RequestInit & { timeoutMs?: number };

async function undiciFetch(url: string, proxy: Proxy | null, options: FetchOptions = {}): Promise<Response> {
  const { timeoutMs = 30_000, ...init } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      ...(proxy ? { dispatcher: new ProxyAgent(buildProxyUrl(proxy)) } : {}),
    } as any);
  } finally {
    clearTimeout(timer);
  }
}

function handleProxyError(proxy: Proxy | null, status: number, logger?: winston.Logger): void {
  if (proxy && status === 403) {
    if (logger) logger.warn(`Proxy: usuwam zablokowane ${proxy.host}:${proxy.port} (pozostało: ${proxies.length - 1})`);
    removeProxy(proxy);
  }
}

export async function proxyGet<T = any>(
  url: string,
  options: { headers?: Record<string, string>; timeoutMs?: number } = {},
  logger?: winston.Logger,
): Promise<T> {
  return retry(
    async () => {
      const proxy = process.env.DISABLE_PROXY ? null : getRandomProxy();
      if (logger)
        logger.info(`proxyGet ${new URL(url).hostname} via ${proxy ? `${proxy.host}:${proxy.port}` : 'direct'}`);
      const resp = await undiciFetch(url, proxy, {
        method: 'GET',
        headers: options.headers,
        timeoutMs: options.timeoutMs,
      });
      if (!resp.ok) {
        handleProxyError(proxy, resp.status, logger);
        throw Object.assign(new Error(`HTTP ${resp.status}`), { status: resp.status });
      }
      const ct = resp.headers.get('content-type') ?? '';
      return (ct.includes('json') ? resp.json() : resp.text()) as Promise<T>;
    },
    { maxAttempts: 2, shouldRetry: (err: any) => err?.status !== 403 },
  );
}

export async function proxyPost<T = any>(
  url: string,
  body: unknown,
  options: { headers?: Record<string, string>; timeoutMs?: number } = {},
  logger?: winston.Logger,
): Promise<T> {
  return retry(
    async () => {
      const proxy = process.env.DISABLE_PROXY ? null : getRandomProxy();
      if (logger)
        logger.info(`proxyPost ${new URL(url).hostname} via ${proxy ? `${proxy.host}:${proxy.port}` : 'direct'}`);
      const resp = await undiciFetch(url, proxy, {
        method: 'POST',
        headers: options.headers,
        body: JSON.stringify(body),
        timeoutMs: options.timeoutMs,
      });
      if (!resp.ok) {
        handleProxyError(proxy, resp.status, logger);
        throw Object.assign(new Error(`HTTP ${resp.status}`), { status: resp.status });
      }
      return resp.json() as Promise<T>;
    },
    { maxAttempts: 2, shouldRetry: (err: any) => err?.status !== 403 },
  );
}

export async function syncProxies(logger: winston.Logger): Promise<void> {
  const apiKey = process.env.WEBSHARE_API_KEY;
  if (!apiKey) {
    logger.warn('Proxy: brak WEBSHARE_API_KEY — pomijam sync');
    return;
  }

  try {
    const resp = await fetch('https://proxy.webshare.io/api/v2/proxy/list/?mode=direct&page=1&page_size=100', {
      headers: { Authorization: `Token ${apiKey}` },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = (await resp.json()) as {
      results: Array<{ proxy_address: string; port: number; username: string; password: string }>;
    };

    proxies = data.results.map(p => ({
      host: p.proxy_address,
      port: p.port,
      username: p.username,
      password: p.password,
    }));

    logger.info(`Proxy: zsynchronizowano ${proxies.length} proxy`);
  } catch (err) {
    const e = err as any;
    logger.warn(`Proxy: błąd sync — ${e?.message ?? String(e)}`);
  }
}

