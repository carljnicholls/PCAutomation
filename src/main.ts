import { config } from 'dotenv';
import { CommandRunnerFactory } from "./services/command-runner/command-runner-factory";

import { App } from "./app";

// Set up dependencies 
const env = config();
const commandRunnerFactory = new CommandRunnerFactory(); 
const args = process.argv.slice(2);
const app = new App(commandRunnerFactory, env );

// Execute App
app.Run(args)
    .catch((ex) => {
        console.error(ex);
    });

