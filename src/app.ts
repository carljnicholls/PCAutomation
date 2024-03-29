import { DotenvConfigOutput } from 'dotenv/types';
import { CommandResult } from './data-transfer/dtos/command-result.dto';
import { ILoggerService } from './interfaces/services/core/i-logger-service';
import { ICommandRunnerFactory } from './interfaces/services/command-runners/i-command-runner-factory';
import { CommandParameterEnum } from './data-transfer/enums/command-parameter.enum';

/**
 * Asynchronous Starting Point for Application
 */
export class App {

    constructor(
        private readonly commandRunnerFactory: ICommandRunnerFactory,
        private readonly config: DotenvConfigOutput | undefined,
        private readonly logger: ILoggerService
    ) {
        if(config === undefined) throw 'Env variables are undefined';
        if(config.error) throw config.error;
        
        // console.warn("err ", config);
        // check obj.keys against ctor for config
    }

    /**
     * The Asynchronous Entry Point for the Application
     * @param args string array of arguments. 
     * First is command, anything after is omitted or used as additional params 
     */
    public async Run(args: string[]): Promise<void> { 
        try{
            this.logger.debug('App.Run() - start', args);
            const commandRunner = this.commandRunnerFactory.get(args[0]); 

            if(commandRunner == undefined) return;

            const commandResult = await commandRunner.run(args.slice(1, args.length));
            
            this.handleResult(commandResult, args);
        
        } catch(error) {
            this.logger.error('Application Error Catch: ', error);
            // Do not rethrow due to Promise
        } finally {
            this.logger.debug('App.Run() - finish', args);
        }
    }

    /**
     * Handles logging of result from ICommandRunner.Run()
     * @param commandResult Result returned from ICommandRunner.Run()
     * @param args Arguments passed to the application
     * @throws When `CommandResult` is not successful, unsuccessful or hasWarnings 
     */
    private handleResult(commandResult: CommandResult, args: string[]): void {
        if(!commandResult.isError && !commandResult.isWarning) {
            this.logger.debug('Successfully executed command: ', args)
            return;
        }

        if(commandResult.isError) {
            commandResult.messages.forEach(message => {
                this.logger.error(message);
            });
            throw new Error("Command not successful");
        }

        if(commandResult.isWarning) {
            commandResult.messages.forEach(message => {
                this.logger.warn(message);
            });
            return; 
        }

        this.logger.error('Command Result is neither successful, error or warn');
        throw new Error('Command Result is neither successful, error or warn');
    }
}