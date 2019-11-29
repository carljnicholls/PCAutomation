import lockSystem from 'lock-system';

import { ICommandRunner } from "../../interfaces/commands/i-command-runner";
import { CommandResult } from '../../data-transfer/dtos/command-result.dto';

/**
 * This implementation of `ICommandRunner` should lock the current user account
 * of the OS
 */
export class LockCommandRunner implements ICommandRunner {
    
    /**
     * Locks the current Windows, Mac or Linux user session
     */
    public async Run(): Promise<CommandResult> {
        console.log("LockCommandRunner.Run()");

        try {
            lockSystem();    

            return new CommandResult();
            // return new CommandResultDto(false, true, [ "warn" ]);
            // return new CommandResultDto(false, true);
            // return new CommandResultDto(true, false, [ "err" ]);
        } catch (error) {
            var ex = JSON.stringify(error);
            return new CommandResult(true, false, [ex])
        }
    }
}