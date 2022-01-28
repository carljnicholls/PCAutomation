import { CommandParameterEnum } from "../../data-transfer/enums/command-parameter.enum";
import { ILoggerService } from "../../interfaces/services/core/i-logger-service";

export class StateManager {
    private readonly className = 'StateManager';
    private readonly isCommandIgnoredName: string = `${this.className}.isCommandIgnored`;
    private readonly doesNotExistError = 'Command does not exist'; // move me..
    private readonly ignoredCommandAlreadyExistError = 'Ignored command already exists';
    private readonly commandIgnoredError = 'Command is ignored';
    private ignoredCommands: CommandParameterEnum[] = []; 

    constructor(private readonly logger: ILoggerService) {
        
    }

    /**
     * Adds the given commands to the list of commands to ignore in the backing store
     * @param commands 
     */
    public addCommandsToIgnore(commands: CommandParameterEnum[]): void {
        if(commands === undefined || commands.length === 0) { throw new Error(this.doesNotExistError)};

        commands.forEach(command => {
            this.addCommandToIgnore(command);
        });
    }
    
    /**
     * Adds a command to a backing store to be ignored if called at a later time
     * @param command 
     */
    public addCommandToIgnore(command: CommandParameterEnum): void {
        const methodName = `${this.className}.addCommandToIgnore(${command})`;

        if(command === undefined) { throw new Error(this.doesNotExistError)};

        var commandIndex = this.ignoredCommands.indexOf(command); 

        if(commandIndex !== -1) { 
            this.logger.warn(`${methodName} ${this.ignoredCommandAlreadyExistError}, not adding`);
            return;
        }
        
        this.ignoredCommands.push(command);
    }

    /**
     * Removes commands from the backing store if they exist
     * @param commands 
     */
    public removeCommandsToIgnore(commands: CommandParameterEnum[]): void {
        if(commands === undefined || commands.length === 0) { throw new Error(this.doesNotExistError)};

        commands.forEach(command => {
            this.removeCommandToIgnore(command);
        });
    }
    
    /**
     * Removes a single command from the backing store if they exist
     * @param command 
     */
    public removeCommandToIgnore(command: CommandParameterEnum): void {
        if(command === undefined) { throw new Error(this.doesNotExistError)};

        var i = this.ignoredCommands.indexOf(command); 

        if(i === -1) { 
            this.logger.warn(`${this.doesNotExistError} in ignored commands, not removing`);
            return;
        }
        
        this.ignoredCommands.splice(i, 1);
    }

    /**
     * Clears all commands from the ignore list backing store
     */
    public clearCommandsToIgnore(): void {
        this.ignoredCommands = [];
    }

    /**
     * Throws error if command is on `ignoredCommands` property
     * @param command 
     */
    public isCommandIgnored(command: string): boolean {
        for(let i; i < this.ignoredCommands.length; i++) {
            if (this.ignoredCommands[i] == command) {
                this.logger.warn(`${this.isCommandIgnoredName}() ${this.commandIgnoredError}`);
                return true;
            }
        }

        return false;
    }
}