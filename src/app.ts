import * as http from 'http';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as TelegramBot from 'node-telegram-bot-api';
import { getNewFlatOffers } from './newFlatOffers';
import * as winston from 'winston'

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

const token = process.env.TELEGRAM_TOKEN ?? ''
const bot = new TelegramBot(token, {polling: true});

logger.info('Bot created');

getNewFlatOffers(bot, logger)
