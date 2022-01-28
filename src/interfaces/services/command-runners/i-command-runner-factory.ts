import { ICommandRunner } from "./commands/i-command-runner";
import { CommandParameterEnum } from '../../../data-transfer/enums/command-parameter.enum';

/**
 * A factory Class that provides a `ICommandRunner` implementation  
 */
export interface ICommandRunnerFactory {
    /**
     * Returns a specific `ICommandRunner` implementation 
     * for the given `commandType` param 
     * or throws an error if it doesn't exist
     * @param commandType command string variable
     */
    get(commandType: string): ICommandRunner;
}