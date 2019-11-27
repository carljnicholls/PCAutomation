import { ICommandRunnerFactory } from "../../interfaces/i-command-runner-factory";
import { ICommandRunner } from "../../interfaces/i-command-runner";
import { LockCommandRunner } from "./lock-command-runner";

export class CommandRunnerFactory implements ICommandRunnerFactory {
    public Get(commandType: string): ICommandRunner {
        console.log("CommandRunnerFactory.Get()", commandType);
        
        if(commandType === 'lock') { return new LockCommandRunner(); }
        
        throw new Error('Command does not exist');
    }

}