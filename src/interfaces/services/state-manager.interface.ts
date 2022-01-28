import { CommandParameterEnum } from "../../data-transfer/enums/command-parameter.enum";

export interface StateManager {
    
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