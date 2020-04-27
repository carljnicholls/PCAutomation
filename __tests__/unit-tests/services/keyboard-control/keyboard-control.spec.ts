jest.mock('../../../../src/services/logger/logger-service');

import { KeyboardControl } from "../../../../src/services/keyboard-control/keyboard-control";
import { LoggerTestHelper } from "../../../../__test-helpers__/logger-test-helper";
import { LoggerService } from "../../../../src/services/logger/logger-service";

const loggerTestHelper = new LoggerTestHelper();

describe('keyboard control', () => {
    var logger: LoggerService;
    var service: KeyboardControl;

    beforeEach(() => {
        jest.clearAllMocks();

        logger = new LoggerService();
        service = new KeyboardControl(logger);
    });

    describe('mediaPlay', () => {
        it('should not throw error', () => {
                expect(() => service.mediaPlay())
                    .not
                    .toThrowError();

                loggerTestHelper.checkLoggerCalls(logger, 1, 0, 0, 0);
            });
    });

    describe('mediaPause', () => {
        it('should not throw error', () => {
                expect(() => service.mediaPause())
                    .not
                    .toThrowError();

                loggerTestHelper.checkLoggerCalls(logger, 1, 0, 0, 0);
            });
    });
});