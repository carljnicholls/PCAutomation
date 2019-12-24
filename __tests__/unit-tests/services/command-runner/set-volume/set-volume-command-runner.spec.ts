jest.mock('../../../../../src/services/logger/logger-service.ts');

import { ICommandRunner } from "../../../../../src/interfaces/command-runners/commands/i-command-runner";
import { SetVolumeCommandRunner } from "../../../../../src/services/command-runners/commands/set-volume/set-volume-command-runner";
import { ILoggerService } from '../../../../../src/interfaces/core/i-logger-service';
import { LoggerService } from '../../../../../src/services/logger/logger-service';

import { LoggerTestHelper } from "../../../../../__test-helpers__/logger-test-helper";

describe('set-volume-command-runner', () => {
    const loggerTestHelper = new LoggerTestHelper();

    var logger: ILoggerService; 

    let service: ICommandRunner;

    beforeEach(() => {
        jest.clearAllMocks();
        
        logger = new LoggerService();

        service = new SetVolumeCommandRunner(logger);
    });

    it('should return error result if no args', async () => {
        const result = await service.Run()
                
        expect(result.isError)
            .toBeTruthy();

        loggerTestHelper.checkLoggerCalls(logger, 1, 0, 0, 1);
    });

    it('should return error result if first arg not number', async () => {
        const result = await service.Run(['beans'])
                
        expect(result.isError)
            .toBeTruthy();

        loggerTestHelper.checkLoggerCalls(logger, 1, 0, 0, 1);
    });

    it('should return success result if given number', async () => {
        const result = await service.Run(['2'])
                
        expect(result.isError)
            .toBeFalsy();
        expect(result.messages.length)
            .toBe(0);

        expect(result.isWarning)
            .toBeFalsy();

        loggerTestHelper.checkLoggerCalls(logger, 1, 0, 0, 0);
    });
});