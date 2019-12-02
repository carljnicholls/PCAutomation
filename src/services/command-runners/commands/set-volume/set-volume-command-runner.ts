import { ICommandRunner } from "../../../../interfaces/command-runners/commands/i-command-runner";
import { CommandResult } from '../../../../data-transfer/dtos/command-result.dto';
import { ILoggerService } from '../../../../interfaces/core/i-logger-service';
import { IVolumeControl } from '../../../../interfaces/command-runners/commands/I-volume-control';
import { VolumeControl } from './volume-control';
import { isNumber, isNullOrUndefined } from 'util';

/**
 * This implementation of `ICommandRunner` should set the current volume value of speaker devices
 */
export class SetVolumeCommandRunner implements ICommandRunner {
    private readonly volumeControl: IVolumeControl; 

    constructor(private readonly logger: ILoggerService) {
        this.volumeControl = new VolumeControl();
    }

    /**
     * Sets the speaker volume on Windows, Mac or Linux 
     */
    public async Run(args: string[]): Promise<CommandResult> {
        this.logger.debug("SetVolumeCommandRunner.Run()", args);

        try {
            if (isNullOrUndefined(args) || args.length === 0) {
                throw("Set volume value missing");
            } else if(isNumber(args[0])) {
                throw("Volume value is not a number");
            }
            
            await this.volumeControl.set(Number.parseInt(args[0]) / 100);
0
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