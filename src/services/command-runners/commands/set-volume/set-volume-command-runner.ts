import { CommandResult } from '../../../../data-transfer/dtos/command-result.dto';
import { ILoggerService } from '../../../../interfaces/services/core/i-logger-service';
import { VolumeControl } from './volume-control';
import { ICommandRunner } from '../../../../interfaces/services/command-runners/commands/i-command-runner';
import { IVolumeControl } from '../../../../interfaces/services/command-runners/commands/I-volume-control';
import { wordsToNumbers } from 'words-to-numbers';
import { CommandErrorMessages } from '../../../../data-transfer/enums/command-error-messages.enum';

/**
 * This implementation of `ICommandRunner` should set the current volume value of speaker devices
 */
export class SetVolumeCommandRunner implements ICommandRunner {
    private readonly className = 'SetVolumeCommandRunner';
    private readonly volumeControl: IVolumeControl; 

    constructor(private readonly logger: ILoggerService) {
        this.volumeControl = new VolumeControl();
    }

    /**
     * Sets the speaker volume on Windows, Mac or Linux 
     */
    public async run(args: string[]): Promise<CommandResult> {
        this.logger.debug(`${this.className}.Run()`, args);

        try {
            if (args == undefined || args.length === 0) {
                this.logger.error(CommandErrorMessages.NoArgs);
                throw(CommandErrorMessages.NoArgs);
            } 

            let value = this.tryParseNumber(args[0]);
            if (value == undefined || !Number.isInteger(value)) {
                this.logger.error(CommandErrorMessages.VolumeNaN);
                throw(CommandErrorMessages.VolumeNaN);
            }
            
            await this.volumeControl.set(value / 100);

            return new CommandResult();
            // return new CommandResultDto(false, true, [ "warn" ]);
            // return new CommandResultDto(false, true);
            // return new CommandResultDto(true, false, [ "err" ]);
        } catch (error) {
            var ex = JSON.stringify(error);
            return new CommandResult(true, false, ex);
        }
    }

    private tryParseNumber(value: string): number | undefined {
        try {
            const x = wordsToNumbers(value); 
            if(x == undefined) throw Error(`Can not turn ${value} to number`);

            if(typeof x === 'number') return x;

            return Number.parseInt(x, 10);
    
        } catch(ex) {
            this.logger.warn(`${this.className} Error parsing input`, value);
            return undefined;
        }
    }
}