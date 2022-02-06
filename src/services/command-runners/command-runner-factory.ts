import { LockCommandRunner } from "./commands/lock-command/lock-command-runner";
import { CommandParameterEnum } from '../../data-transfer/enums/command-parameter.enum';
import { ILoggerService } from '../../interfaces/services/core/i-logger-service';
import { SetVolumeCommandRunner } from './commands/set-volume/set-volume-command-runner';
import { ICommandRunnerFactory } from '../../interfaces/services/command-runners/i-command-runner-factory';
import { ICommandRunner } from '../../interfaces/services/command-runners/commands/i-command-runner';
import { PushbulletServerCommandRunner } from './commands/pushbullet-server/pushbullet-server-command-runner';
import { MediaPlayRunner } from './commands/keyboard/media/play/media-play-command-runner';
import { MediaPauseRunner } from './commands/keyboard/media/pause/media-pause-command-runner';
import { RunScriptCommandRunner } from './commands/run-script/run-script-command-runner';
import { StateManager } from "../state/state-manager.service";

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

    constructor(
        private readonly state: StateManager,
        private readonly logger: ILoggerService
    ) {  
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

        // Do not return implementation when command ignored
        if(this.state.isCommandIgnored(command))
            throw new Error(this.commandIgnoredError);

        // Return command runner implementation
        if(this.isPushBulletServerCommend(command)) { return new PushbulletServerCommandRunner(this, this.state, this.logger); }
        if(this.isDeviceLockCommand(command)) { return new LockCommandRunner(this.logger); }
        if(command === CommandParameterEnum.setVolume) { return new SetVolumeCommandRunner(this.logger); }
        if(command === CommandParameterEnum.mediaPlay) { return new MediaPlayRunner(this.logger); }
        if(command === CommandParameterEnum.mediaPause) { return new MediaPauseRunner(this.logger); }
        if(this.isRunCustomCommand(command)) { 
            return new RunScriptCommandRunner(this.logger); 
        }

        // Handle unexpected command 
        this.logger.error(this.doesNotExistError, commandType);
        throw new Error(this.doesNotExistError);
    }

    private isPushBulletServerCommend(command: string) {
        return command === CommandParameterEnum.server
            || command === CommandParameterEnum.pushbullet;
    }

    private isRunCustomCommand(command: string) {
        return command === CommandParameterEnum.command
            || command === CommandParameterEnum.run
            || command === CommandParameterEnum.script;
    }

    private isDeviceLockCommand(command: string) {
        return command === CommandParameterEnum.lock
            || command === CommandParameterEnum.lockDevice;
    }
}


