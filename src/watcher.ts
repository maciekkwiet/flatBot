import TelegramBot from 'node-telegram-bot-api';
import * as winston from 'winston';
import cron from 'node-cron';
import { SearchConfig } from './config';
import { olxRequest } from './olxRequest';
import { otodomRequest } from './otodomRequest';
import { flatOfferRepository } from './repository';

async function fetchAll(config: SearchConfig, logger: winston.Logger): Promise<string[]> {
  const [olxUrls, otodomUrls] = await Promise.all([
    config.olx ? olxRequest(config.olx.searchParams, config.olx.referer, logger) : Promise.resolve([]),
    config.otodom ? otodomRequest(config.otodom, logger) : Promise.resolve([]),
  ]);
  return [...olxUrls, ...otodomUrls];
}

export async function startWatcher(
  config: SearchConfig,
  bot: TelegramBot,
  logger: winston.Logger,
  offset: number = 0,
): Promise<void> {
  const initUrls = await fetchAll(config, logger);
  await flatOfferRepository.upsertUrls(initUrls, config.type);

  logger.info(`[${config.type}] Watcher uruchomiony (${initUrls.length} ofert w bazie)`);

  cron.schedule(`${offset}/${config.intervalSeconds} * * * * *`, async () => {
    const urls = [...new Set(await fetchAll(config, logger))];

    const existingUrls = await flatOfferRepository.findExistingUrls(urls, config.type);
    const newOffers = urls.filter(url => !existingUrls.includes(url));

    await flatOfferRepository.upsertUrls(urls, config.type);

    if (newOffers.length > 0 && newOffers.length < 10) {
      for (const offer of newOffers) {
        logger.info(`[${config.type}] Nowa oferta: ${offer}`);
        bot.sendMessage(-1001870792878, offer);
      }
    } else {
      logger.info(`[${config.type}] Brak nowych ofert`);
    }
  });
}

