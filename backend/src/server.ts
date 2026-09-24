import { app } from './app.js';
import { appConfig } from './config/app.js';
import { sequelize } from './config/database.js';
import { logger } from './utils/logger.js';

async function bootstrap() {
  await sequelize.authenticate();
  app.listen(appConfig.port, () => logger.info(`BizStarter API listening on ${appConfig.port}`));
}

bootstrap().catch((error) => {
  logger.error(error);
  process.exit(1);
});
