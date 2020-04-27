import lockSystem from 'lock-system';

import { CommandResult } from '../../../../data-transfer/dtos/command-result.dto';
import { ILoggerService } from '../../../../interfaces/services/core/i-logger-service';
import { ICommandRunner } from '../../../../interfaces/services/command-runners/commands/i-command-runner';

/**
 * This implementation of `ICommandRunner` should lock the current user account
 * of the OS
 */
export class LockCommandRunner implements ICommandRunner {
    
    constructor(private readonly logger: ILoggerService) {
    }

    /**
     * Locks the current Windows, Mac or Linux user session
     */
    public async run(): Promise<CommandResult> {
        this.logger.debug("LockCommandRunner.Run()");

        try {
            lockSystem();    

            return new CommandResult();
            // return new CommandResultDto(false, true, [ "warn" ]);
            // return new CommandResultDto(false, true);
            // return new CommandResultDto(true, false, [ "err" ]);
        } catch (error) {
            var ex = JSON.stringify(error);
            return new CommandResult(true, false, ex);
        }
    }
}