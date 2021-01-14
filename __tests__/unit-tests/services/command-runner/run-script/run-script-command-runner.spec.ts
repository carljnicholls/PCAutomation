jest.mock('../../../../../src/services/logger/logger-service.ts');

import { ICommandRunner } from "../../../../../src/interfaces/services/command-runners/commands/i-command-runner";
import { ILoggerService } from '../../../../../src/interfaces/services/core/i-logger-service';
import { LoggerService } from '../../../../../src/services/logger/logger-service';

import { LoggerTestHelper } from "../../../../../__test-helpers__/logger-test-helper";

import { RunScriptCommandRunner } from "../../../../../src/services/command-runners/commands/run-script/run-script-command-runner";

/** 
 * TODO: FIX 
 * TODO: Need to mock the sound thingy because it keeps muting me! 
 */
xdescribe('set-volume-command-runner', () => {
    const loggerTestHelper = new LoggerTestHelper();

    var logger: ILoggerService; 

    let service: ICommandRunner;

    beforeEach(() => {
        jest.clearAllMocks();
        
        logger = new LoggerService();

        service = new RunScriptCommandRunner(logger);
    });

    it('should return error result if no args', async () => {
        const result = await service.run()
                
        expect(result.isError)
            .toBeTruthy();

        loggerTestHelper.checkLoggerCalls(logger, 1, 0, 0, 2);
    });

    it('should return error result if script does not exist', async () => {
        const result = await service.run(['beans'])
                
        expect(result.isError)
            .toBeTruthy();

        loggerTestHelper.checkLoggerCalls(logger, 5, 0, 0, 1);
    });

    it('should return success result if given valid script', async () => {
        // const result = await service.run(['2']);
        const result = await service.run(['hello']);
        
        expect(result.isError)
            .toBeFalsy();
        expect(result.messages.length)
            .toBe(0);

        expect(result.isWarning)
            .toBeFalsy();

        loggerTestHelper.checkLoggerCalls(logger, 1, 0, 0, 0);
    });
});