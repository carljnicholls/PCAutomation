import { ILoggerService } from "../src/interfaces/services/core/i-logger-service";

/**
 * Provides ILogger tests
 */
export class LoggerTestHelper {
    
    /**
     * Checks the number of calls for the given `ILoggerService` for each 
     * `..calls` parameter count
     * requires jest.mock('.../logger/logger-service');
     * @param loggerService The mocked logger instance
     * @param debugCalls The number `debug` of calls expected 
     * @param infoCalls The number `info` of calls expected 
     * @param warnCalls The number of `warn` calls expected 
     * @param errorCalls The number of `error` calls expected 
     */
    public checkLoggerCalls(
        loggerService: ILoggerService, 
        debugCalls: number = 0, 
        infoCalls: number = 0, 
        warnCalls: number = 0, 
        errorCalls: number = 0
    ): void {
        expect(loggerService.debug, `loggerService.debug called ${debugCalls} times`)
            .toBeCalledTimes(debugCalls);
        expect(loggerService.info, `loggerService.info called ${infoCalls} times`)
            .toBeCalledTimes(infoCalls);
        expect(loggerService.warn, `loggerService.warn called ${warnCalls} times`)
            .toBeCalledTimes(warnCalls);
        expect(loggerService.error, `loggerService.error called ${errorCalls} times`)
            .toBeCalledTimes(errorCalls);
    }
}
