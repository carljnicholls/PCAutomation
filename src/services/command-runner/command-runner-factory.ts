import { ICommandRunnerFactory } from "../../interfaces/commands/i-command-runner-factory";
import { ICommandRunner } from "../../interfaces/commands/i-command-runner";
import { LockCommandRunner } from "./lock-command-runner";
import { CommandParameterEnum } from '../../data-transfer/enums/command-parameter.enum';

/**
 * A factory that provides a `ICommandRunner` implementations
 */
export class CommandRunnerFactory implements ICommandRunnerFactory {
    
    /**
     * Returns a specific `ICommandRunner` implementation for the given `commandType` param 
     * compared to a `CommandParameterEnum` value or throws an error if it doesn't exist
     * @param commandType command string variable
     * @throws When `CommandParameterEnum` value does not exist 
     */
    public Get(commandType: string): ICommandRunner {
        console.log("CommandRunnerFactory.Get()", commandType);
        const command = commandType.toLowerCase();

        if(command === CommandParameterEnum.lock) { return new LockCommandRunner(); }
        if(command === CommandParameterEnum.setVolume) { throw new Error('Not Implemented'); }
        
        throw new Error('Command does not exist');
    }
}