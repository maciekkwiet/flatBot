import * as winston from 'winston';
import type { OtodomConfig } from './config';
import { proxyGet } from './proxy';

const OTODOM_BASE = 'https://www.otodom.pl';
const BUILD_ID_SOURCE = `${OTODOM_BASE}/pl/wyniki/sprzedaz/mieszkanie/cala-polska`;
const BUILD_ID_REGEX = /"buildId"\s*:\s*"([^"]+)"/;

const HEADERS = {
  Accept: 'application/json, text/plain, */*',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
} as const;

const HTML_HEADERS = {
  Accept: 'text/html,application/xhtml+xml',
  'User-Agent': HEADERS['User-Agent'],
} as const;

async function fetchBuildId(logger: winston.Logger): Promise<string | null> {
  try {
    const html = await proxyGet<string>(BUILD_ID_SOURCE, { headers: HTML_HEADERS as any, timeoutMs: 20_000 }, logger);
    const match = html.match(BUILD_ID_REGEX);
    if (!match) {
      logger.warn('Otodom: nie znaleziono buildId w HTML');
      return null;
    }
    return match[1];
  } catch (err) {
    const e = err as any;
    logger.warn(`Otodom: błąd pobierania buildId — ${e?.message ?? String(e)}`);
    return null;
  }
}

export async function otodomRequest(config: OtodomConfig, logger: winston.Logger): Promise<string[]> {
  const buildId = await fetchBuildId(logger);
  if (!buildId) return [];

  const url = `${OTODOM_BASE}/_next/data/${buildId}/pl/wyniki/${config.path}.json?${config.query}`;
  try {
    const data = await proxyGet(url, { headers: HEADERS as any, timeoutMs: 30_000 }, logger);
    return (
      data.pageProps?.data?.searchAds?.items?.map((item: any) => `${OTODOM_BASE}/pl/oferta/${item.slug as string}`) ??
      []
    );
  } catch (err) {
    const e = err as any;
    const status = e?.response?.status;
    logger.warn(`Otodom: błąd zapytania status=${status ?? 'n/a'} url=${url} — ${e?.message ?? String(e)}`);
    return [];
  }
}

