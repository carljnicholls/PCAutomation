import { ICommandRunner } from '../../../../interfaces/services/command-runners/commands/i-command-runner';
import { ILoggerService } from '../../../../interfaces/services/core/i-logger-service';
import { CommandResult } from '../../../../data-transfer/dtos/command-result.dto';
import { readdir } from 'fs-extra';
import { CommandErrorMessages } from '../../../../data-transfer/enums/command-error-messages.enum';
import path from 'path';
import execa from "execa";
import { path as appRoot } from "app-root-path";



/**
 * TODO: Add DI so all of these dependancies can be wrapped in
 * interfaces so it can be tested 
 */
export class RunScriptCommandRunner implements ICommandRunner {
    private readonly className: string = 'RunScriptCommandRunner';
    private readonly runName: string = `${this.className}.run`;

    constructor(private readonly logger: ILoggerService) { }
    
    public async run(args?: string[] | undefined): Promise<CommandResult> {
        this.logger.debug(`${this.runName}`, args);
        let error: Error | undefined = undefined;

        try {
            if (args == undefined || args.length === 0) {
                this.logger.error(`${this.runName} - ${CommandErrorMessages.NoArgs}`);
                throw(CommandErrorMessages.NoArgs);
            } 
            this.logger.debug(`${this.runName} approot`, appRoot);
            
            const scriptDir = path.join(appRoot, 'build', 'src', 'scripts');
            this.logger.debug(`${this.runName}`, { scriptDir });
            
            const files = await readdir(scriptDir);
            this.logger.debug(`${this.runName}`, files);

            const scriptFile = files.find(filename => filename.trim().includes(args[0])); 
            this.logger.debug(`${this.runName}`, scriptFile);

            if(scriptFile) {
                throw new Error(CommandErrorMessages.ScriptDoesNotExist);
            }

            // const scriptPath = path.join([scriptDir, scriptFile]);
            // const executionResult = await execa(scriptPath);

            // if(this.executionFailed(executionResult)) {
            //     this.logger.error(`${this.runName}.execution of ${scriptPath} failed`, executionResult.stderr);
            //     throw new Error(executionResult.stderr);
            // }

            // const executionResult = await execa('echo', ['unicorns']);
            const executionResult = await execa('Write-Output', ["hello world!"]);
            console.log(executionResult.stdout);
        
            this.logger.info(executionResult.stdout);

            // return new CommandResult();

        } catch (e) {
            this.logger.error(`${this.runName}.error`, JSON.stringify(error)); 
            error = e;

        } finally {
            return error === undefined
                ? new CommandResult()
                : new CommandResult(true, false, error.message);
        }
    }
    

    private executionFailed(executionResult: execa.ExecaReturnValue<string>): boolean {
        return executionResult.failed || (executionResult.stderr != undefined && executionResult.stderr.length > 0);
    }
}