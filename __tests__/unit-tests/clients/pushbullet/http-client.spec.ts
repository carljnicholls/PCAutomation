jest.mock('../../../../src/services/logger/logger-service.ts');

import { PushbulletClient } from "../../../../src/clients/pushbullet-http-client";
import { LoggerService } from "../../../../src/services/logger/logger-service";
import { LoggerTestHelper } from "../../../../__test-helpers__/logger-test-helper";

const loggerTestHelper = new LoggerTestHelper();

describe('pushbullet http client', () => {
    let logger: LoggerService; 

    let service: PushbulletClient;

    beforeAll(() => {
        jest.clearAllMocks();

        logger = new LoggerService();
    });

    describe('ctor', () => {
        
        it.each([['', ' ', '  ']])
            ('should throw when apiKey param is null or empty', async (value: string) => {
                
                expect(() => new PushbulletClient(value, logger))
                    .toThrowError('Pushbullet api key cannot be null, undefined or empty');

                loggerTestHelper.checkLoggerCalls(logger, 0, 1, 0, 1);
            });
    });

});
