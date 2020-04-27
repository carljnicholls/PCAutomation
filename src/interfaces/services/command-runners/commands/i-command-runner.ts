import { CommandResult } from '../../../../data-transfer/dtos/command-result.dto';

/**
 * Provides methods to perform a specific task on the host
 */
export interface ICommandRunner {

    /**
     * Runs a command or process that performs specific task on the host
     */
    run(args?: string[]): Promise<CommandResult>;
}