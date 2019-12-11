jest.mock('../../../../src/services/logger/logger-service');

import { CommandRunnerFactory } from '../../../../src/services/command-runners/command-runner-factory';
import { LoggerService } from '../../../../src/services/logger/logger-service';
import { LockCommandRunner } from '../../../../src/services/command-runners/commands/lock-command/lock-command-runner';
import { SetVolumeCommandRunner } from '../../../../src/services/command-runners/commands/set-volume/set-volume-command-runner';
import { LoggerTestHelper } from '../../../../__test-helpers__/logger-test-helper';


const loggerTestHelper = new LoggerTestHelper();

describe('command runner factory', () => {
    var logger: LoggerService;
    var service: CommandRunnerFactory;

    beforeEach(() => {
        jest.clearAllMocks();

        logger = new LoggerService();
        service = new CommandRunnerFactory(logger);
    });

    describe('get', () => {
        it.each(['fission', 'mash', 'beans'])
            ('should throw when `commandType` param not recognized', (cmd: string) => {
                expect(() => service.Get(cmd))
                    .toThrowError();

                loggerTestHelper.checkLoggerCalls(logger, 1, 0, 0, 1);
            });

        it.each(['lock', 'Lock'])
            ('should return a `LockCommandRunner` when param equals `lock` or `Lock`', (cmd: string) => {
                expect(service.Get(cmd))
                    .toBeInstanceOf(LockCommandRunner);
                
                loggerTestHelper.checkLoggerCalls(logger, 1, 0, 0, 0);
            });
        
        it.each(['setvolume', 'setVolume', 'SetVolume'])
            ('should return a `SetVolumeCommandRunner` when param equals `setvolume`', (cmd: string) => {
                expect(service.Get(cmd))
                    .toBeInstanceOf(SetVolumeCommandRunner);
                
                loggerTestHelper.checkLoggerCalls(logger, 1, 0, 0, 0);
            });
    });
});
