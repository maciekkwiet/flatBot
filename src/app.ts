import * as http from 'http';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as TelegramBot from 'node-telegram-bot-api';
import { getNewFlatOffers } from './newFlatOffers';
import * as winston from 'winston';

// const qrcode = require('qrcode-terminal');
// const { Client } = require('whatsapp-web.js');

// const whatsAppClient = new Client();

// whatsAppClient.on('qr', (qr: any) => {
//   qrcode.generate(qr, {small: true});
// });

// whatsAppClient.on('ready', () => {
//   console.log('Client is ready!');
// });

// whatsAppClient.initialize()

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

const telegramToken = process.env.TELEGRAM_TOKEN ?? '';
const bot = new TelegramBot(telegramToken, { polling: true });

logger.info('Bot created');

// getNewFlatOffers(bot, logger, whatsAppClient);
getNewFlatOffers(bot, logger);

