import { ICommandRunner } from "./i-command-runner";

/**
 * A factory Class that provides a `ICommandRunner` implementation  
 */
export interface ICommandRunnerFactory {
    /**
     * Returns a specific `ICommandRunner` implementation  for the given `commandType` param 
     * or throws an error if it doesn't exist
     * @param commandType command string variable
     */
    Get(commandType: string): ICommandRunner;
}