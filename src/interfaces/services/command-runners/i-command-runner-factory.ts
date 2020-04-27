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

    /**
     * Adds a collection of commands to be ignored when getting an `ICommandRunner` implementation
     * @param commands 
     */
    addCommandsToIgnore(commands: CommandParameterEnum[]): void;

    /**
     * Adds a command to be ignored when getting an `ICommandRunner` implementation
     * @param command 
     */
    addCommandToIgnore(command: CommandParameterEnum): void;

    /**
     * Removes a collection of commands from being ignored when getting an `ICommandRunner` implementation
     * @param commands 
     */
    removeCommandsToIgnore(commands: CommandParameterEnum[]): void;

    /**
     * Removes a command from being ignored when getting an `ICommandRunner` implementation
     * @param commands 
     */
    removeCommandToIgnore(command: CommandParameterEnum): void;

    /**
     * Removes all commands from being ignored when getting an `ICommandRunner` implementation
     */
    clearCommandsToIgnore(): void;
}