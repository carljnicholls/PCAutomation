import { DotenvConfigOutput } from 'dotenv/types';
import { ICommandRunnerFactory } from "./interfaces/i-command-runner-factory";
import { CommandResultDto } from './data-transfer-objects/command-result.dto';

/**
 * Asynchronous Starting Point for Application
 */
export class App {

    constructor(
        private readonly commandRunnerFactory: ICommandRunnerFactory,
        private readonly config: DotenvConfigOutput | undefined
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
        console.log('App.Run() - start', args);
        const commandRunner = this.commandRunnerFactory.Get(args[0]); 
        const commandResult = await commandRunner.Run();
        
        // this.config.parsed    
        this.handleResult(commandResult, args);

        console.log('App.Run() - finish', args);
    }

    /**
     * Handles logging of result from ICommandRunner.Run()
     * @param commandResult Result returned from ICommandRunner.Run()
     * @param args Arguments passed to the application
     * @throws When `CommandResult` is not successful, unsuccesful or hasWarnings 
     */
    private handleResult(commandResult: CommandResultDto, args: string[]): void {
        if(!commandResult.isError && !commandResult.isWarning) {
            console.log('Successfully executed command: ', args)
            return;
        }

        if(commandResult.isError) {
            commandResult.messages.forEach(message => {
                console.error(message);
            });
            throw new Error("Command not successful");
        }

        if(commandResult.isWarning) {
            commandResult.messages.forEach(message => {
                console.warn(message);
            });
            return; 
        }

        console.log('Command Result is neither successful, error or warn');
        throw new Error('Command Result is neither successful, error or warn');
    }
}