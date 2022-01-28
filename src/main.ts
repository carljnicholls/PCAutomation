import { config } from 'dotenv';
import { CommandRunnerFactory } from "./services/command-runners/command-runner-factory";
import { LoggerService } from "./services/logger/logger-service";

import { App } from "./app";
import { StateManager } from './services/state/state-manager.service';

// Set up dependencies 
const env = config();
const logger = new LoggerService();  
const state = new StateManager(logger);
const commandRunnerFactory = new CommandRunnerFactory(state, logger);
const args = process.argv.slice(2);
const app = new App(commandRunnerFactory, env, logger);

// Execute App
app.Run(args)
    .catch((ex) => {
        logger.error(ex);
    });

