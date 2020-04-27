import { CommandResult } from '../../../../../../data-transfer/dtos/command-result.dto';
import { ICommandRunner } from '../../../../../../interfaces/services/command-runners/commands/i-command-runner';
import { KeyboardControl } from '../../../../../keyboard-control/keyboard-control';
import { ILoggerService } from '../../../../../../interfaces/services/core/i-logger-service';

export class MediaPauseRunner implements ICommandRunner {
    private readonly className: string = 'MediaKeysRunner';
    private readonly runName: string = `${this.className}.run`;

    constructor(private readonly logger: ILoggerService) {}

    public async run(args?: string[] | undefined): Promise<CommandResult> {
        this.logger.debug(this.runName, args);
        
        const keyboard = new KeyboardControl(this.logger);

        await keyboard.mediaPause();

        return new CommandResult(false);
    }
}