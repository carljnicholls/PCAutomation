jest.mock('../../../../src/services/logger/logger-service.ts');

import { PushbulletWebsocketClient } from "../../../../src/clients/pushbullet-websocket-client";
import { LoggerService } from "../../../../src/services/logger/logger-service";
import { LoggerTestHelper } from "../../../../__test-helpers__/logger-test-helper";

const loggerTestHelper = new LoggerTestHelper();

describe('pushbullet websocket client', () => {
    let logger: LoggerService; 

    let service: PushbulletWebsocketClient;

    beforeAll(() => {
        jest.clearAllMocks();

        logger = new LoggerService();
    });

    describe('ctor', () => {
        
        it.each([['', ' ', '  ']])
            ('should throw when apiKey param is null or empty', async (value: string) => {
                
                expect(() => new PushbulletWebsocketClient(value, logger))
                    .toThrowError('Pushbullet api key cannot be null, undefined or empty');

                loggerTestHelper.checkLoggerCalls(logger, 0, 1, 0, 1);
            });
    });

});
