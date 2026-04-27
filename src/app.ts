import cron from 'node-cron';
import * as dotenv from 'dotenv';
import express from 'express';
import * as http from 'http';
import mongoose from 'mongoose';
import TelegramBot from 'node-telegram-bot-api';
import * as winston from 'winston';
import { searches } from './config';
import { syncProxies } from './proxy';
import { startWatcher } from './watcher';

dotenv.config();

const app = express();
const server = http.createServer(app);

const dbKey = process.env.DB_KEY;

if (dbKey) {
  mongoose
    .connect(dbKey, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected with DB'))
    .catch(() => console.error('Error with DB'));
} else {
  console.log(`Enviroment variable 'DB_KEY' not set. Cannot connect to DataBase`);
}

const port = process.env.PORT || 4001;
server.listen(port, () => console.log(`Server listening on port ${port}`));

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

logger.info('App started');

const telegramTokenRent = process.env.TELEGRAM_TOKEN_RENT ?? '';
const rentBot = new TelegramBot(telegramTokenRent, { polling: true });

logger.info('Bot created');

syncProxies(logger);
cron.schedule('0 */30 * * * *', () => syncProxies(logger));

searches.forEach((config, i) => {
  startWatcher(config, rentBot, logger, i, i + 15);
});

