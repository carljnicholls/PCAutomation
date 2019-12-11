import { ILoggerService } from "../src/interfaces/core/i-logger-service";

/**
 * Provides Ilogger tests
 */
export class LoggerTestHelper {
    
    /**
     * Checks the number of calls for the given `ILoggerService` for each 
     * `..calls` parameter count
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
        expect(loggerService.debug)
            .toBeCalledTimes(debugCalls);
        expect(loggerService.info)
            .toBeCalledTimes(infoCalls);
        expect(loggerService.warn)
            .toBeCalledTimes(warnCalls);
        expect(loggerService.error)
            .toBeCalledTimes(errorCalls);
    }
}
