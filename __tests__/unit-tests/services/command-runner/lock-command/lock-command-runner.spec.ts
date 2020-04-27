jest.mock('lock-system');

import lockSystem from 'lock-system';
import { ILoggerService } from '../../../../../src/interfaces/services/core/i-logger-service';
import { LockCommandRunner } from '../../../../../src/services/command-runners/commands/lock-command/lock-command-runner';
import { LoggerService } from '../../../../../src/services/logger/logger-service';

describe('lock command runner', () => {
    var logger: ILoggerService; 
    var service: LockCommandRunner; 

    beforeEach(() => {
        jest.clearAllMocks();

        logger = new LoggerService();
        service = new LockCommandRunner(logger);
    })

    describe('run', () => {
        it('should call lockSystem()', () => {
            service.run();

            expect(lockSystem)
                .toBeCalledTimes(1);
        });

        it('should call lockSystem()', async () => {
            expect(() => service.run())
                .not
                .toThrowError();
        });

        // TODO: Mock lockSystem(), make it throw, check doesn't throw and the result
        // TODO: Wrap lock-system dependency in interface to test  
    });
});