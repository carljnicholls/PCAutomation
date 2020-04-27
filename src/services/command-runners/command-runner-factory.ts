import { LockCommandRunner } from "./commands/lock-command/lock-command-runner";
import { CommandParameterEnum } from '../../data-transfer/enums/command-parameter.enum';
import { ILoggerService } from '../../interfaces/services/core/i-logger-service';
import { SetVolumeCommandRunner } from './commands/set-volume/set-volume-command-runner';
import { ICommandRunnerFactory } from '../../interfaces/services/command-runners/i-command-runner-factory';
import { ICommandRunner } from '../../interfaces/services/command-runners/commands/i-command-runner';
import { PushbulletServerRunner } from './commands/pushbullet-server/pushbullet-server-command-runner';
import { MediaPlayRunner } from './commands/keyboard/media/play/media-play-command-runner';
import { MediaPauseRunner } from './commands/keyboard/media/pause/media-pause-command-runner';

/**
 * A factory that provides a `ICommandRunner` implementations
 */
export class CommandRunnerFactory implements ICommandRunnerFactory {
    private readonly className: string = 'CommandRunnerFactory';
    private readonly getName: string = `${this.className}.get`;
    private readonly isCommandIgnoredName: string = `${this.className}.isCommandIgnored`;

    private readonly doesNotExistError = 'Command does not exist';
    private readonly ignoredCommandAlreadyExistError = 'Ignored command already exists';
    private readonly commandIgnoredError = 'Command is ignored';

    private ignoredCommands: CommandParameterEnum[]; 

    constructor(private readonly logger: ILoggerService) {  
        this.ignoredCommands = [];  
    }

    /**
     * Returns a specific `ICommandRunner` implementation for the given `commandType` param 
     * compared to a `CommandParameterEnum` value or throws an error if it doesn't exist or command is ignored
     * @param commandType command string variable
     * @throws When `CommandParameterEnum` value does not exist 
     */
    public get(commandType: string): ICommandRunner {
        this.logger.debug(`${this.getName}`, [ commandType, { ignoredCommands: this.ignoredCommands } ]);
        const command = commandType.toLowerCase();

        // throws if command is ignored.. 
        this.isCommandIgnored(command);

        // Return command runner implementation
        if(command === CommandParameterEnum.server
            || command === CommandParameterEnum.pushbullet) { return new PushbulletServerRunner(this, this.logger); }
        if(command === CommandParameterEnum.lock
            || command === CommandParameterEnum.lockDevice) { return new LockCommandRunner(this.logger); }
        if(command === CommandParameterEnum.setVolume) { return new SetVolumeCommandRunner(this.logger); }
        if(command === CommandParameterEnum.mediaPlay) { return new MediaPlayRunner(this.logger); }
        if(command === CommandParameterEnum.mediaPause) { return new MediaPauseRunner(this.logger); }
        
        this.logger.error(this.doesNotExistError, commandType);
        throw new Error(this.doesNotExistError);
    }

    public addCommandsToIgnore(commands: CommandParameterEnum[]): void {
        if(commands === undefined || commands.length === 0) { throw new Error(this.doesNotExistError)};

        commands.forEach(command => {
            this.addCommandToIgnore(command);
        });
    }
    
    public addCommandToIgnore(command: CommandParameterEnum): void {
        if(command === undefined) { throw new Error(this.doesNotExistError)};

        var i = this.ignoredCommands.indexOf(command); 

        if(i !== -1) { 
            this.logger.warn(`${this.ignoredCommandAlreadyExistError}, not adding`);
            return;
        }
        
        this.ignoredCommands.push(command);
    }

    public removeCommandsToIgnore(commands: CommandParameterEnum[]): void {
        if(commands === undefined || commands.length === 0) { throw new Error(this.doesNotExistError)};

        commands.forEach(command => {
            this.removeCommandToIgnore(command);
        });
    }
    
    public removeCommandToIgnore(command: CommandParameterEnum): void {
        if(command === undefined) { throw new Error(this.doesNotExistError)};

        var i = this.ignoredCommands.indexOf(command); 

        if(i === -1) { 
            this.logger.warn(`${this.doesNotExistError} in ignored commands, not removing`);
            return;
        }
        
        this.ignoredCommands.splice(i, 1);
    }

    public clearCommandsToIgnore(): void {
        this.ignoredCommands = [];
    }

    /**
     * Throws error if command is on `ignoredCommands` property
     * @param command 
     */
    private isCommandIgnored(command: string) {
        this.ignoredCommands.forEach((cmd) => {
            if (cmd == command) {
                this.logger.error(`${this.isCommandIgnoredName}() ${this.commandIgnoredError}`);
                throw new Error(this.commandIgnoredError);
            }
        });
    }
}