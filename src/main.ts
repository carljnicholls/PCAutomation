import { config } from 'dotenv';
import { CommandRunnerFactory } from "./services/command-runners/command-runner-factory";
import { LoggerService } from "./services/logger/logger-service";

import { App } from "./app";

// Set up dependencies 
const env = config();
const logger = new LoggerService();  
const commandRunnerFactory = new CommandRunnerFactory(logger);
const args = process.argv.slice(2);
const app = new App(commandRunnerFactory, env, logger);

// Execute App
app.Run(args)
    .catch((ex) => {
        logger.error(ex);
    });

