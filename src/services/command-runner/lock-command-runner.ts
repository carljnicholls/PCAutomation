import lockSystem from 'lock-system';

import { ICommandRunner } from "../../interfaces/i-command-runner";
import { CommandResultDto } from '../../data-transfer-objects/command-result.dto';

/**
 * This implementation of `ICommandRunner` should lock the current user account
 * of the OS
 */
export class LockCommandRunner implements ICommandRunner {
    
    /**
     * Locks the current Windows session
     */
    public async Run(): Promise<CommandResultDto> {
        console.log("LockCommandRunner.Run()");

        lockSystem();

        return new CommandResultDto();
        // return new CommandResultDto(false, true, [ "warn" ]);
        // return new CommandResultDto(false, true);
        // return new CommandResultDto(true, false, [ "err" ]);
    }
}