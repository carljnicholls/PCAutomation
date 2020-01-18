import { LockCommandRunner } from "./commands/lock-command/lock-command-runner";
import { CommandParameterEnum } from '../../data-transfer/enums/command-parameter.enum';
import { ILoggerService } from '../../interfaces/services/core/i-logger-service';
import { SetVolumeCommandRunner } from './commands/set-volume/set-volume-command-runner';
import { ICommandRunnerFactory } from '../../interfaces/services/command-runners/i-command-runner-factory';
import { ICommandRunner } from '../../interfaces/services/command-runners/commands/i-command-runner';
import { PushbulletServerRunner } from './commands/pushbullet-server/pushbullet-server-command-runner';

/**
 * A factory that provides a `ICommandRunner` implementations
 */
export class CommandRunnerFactory implements ICommandRunnerFactory {
    
    constructor(private readonly logger: ILoggerService) {    
    }

    private readonly doesNotExistError = 'Command does not exist';

    /**
     * Returns a specific `ICommandRunner` implementation for the given `commandType` param 
     * compared to a `CommandParameterEnum` value or throws an error if it doesn't exist
     * @param commandType command string variable
     * @throws When `CommandParameterEnum` value does not exist 
     */
    public Get(commandType: string): ICommandRunner {
        this.logger.debug("CommandRunnerFactory.Get()", commandType);
        const command = commandType.toLowerCase();

        if(command === CommandParameterEnum.server
            || command === CommandParameterEnum.pushbullet) { return new PushbulletServerRunner(this.logger); }
        if(command === CommandParameterEnum.lock
            || command === CommandParameterEnum.lockDevice) { return new LockCommandRunner(this.logger); }
        if(command === CommandParameterEnum.setVolume) { return new SetVolumeCommandRunner(this.logger); }
        // if(command === CommandParameterEnum...) { throw new Error('Not Implemented'); }
        
        this.logger.error(this.doesNotExistError, commandType);
        throw new Error(this.doesNotExistError);
    }
}