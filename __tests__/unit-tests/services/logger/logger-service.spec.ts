import { LoggerService } from "../../../../src/services/logger/logger-service";
import winston from 'winston';

describe('logger-service', () => {
    const testMessage: string = 'test log message';
    const emptyFn = () => { return undefined; };

    const createLoggerFn = jest.fn();
    const debugFn = jest.fn();
    const infoFn = jest.fn();
    const warnFn = jest.fn();
    const errorFn = jest.fn();

    let service: LoggerService; 

    beforeEach(() => {
        jest.clearAllMocks();

        createLoggerFn.mockReset();
        debugFn.mockReset();
        infoFn.mockReset();
        warnFn.mockReset();
        errorFn.mockReset();

        debugFn.mockReturnValue(emptyFn);
        infoFn.mockReturnValue(emptyFn);
        warnFn.mockReturnValue(emptyFn);
        errorFn.mockReturnValue(emptyFn);

        winston.createLogger = createLoggerFn;
        createLoggerFn.mockReturnValue({
            debug: debugFn,
            info: infoFn,
            warn: warnFn,
            error: errorFn,
            add: emptyFn,
            remove: emptyFn
        });

        service = new LoggerService(true);
    });

    describe('debug', () => {
        it('should call winston.debug once', async () => {
            service.debug(testMessage);
    
            expect(debugFn)
                .toBeCalledTimes(1);
        });
    });

    describe('info', () => {
        it('should call winston.info once', async () => {
            service.info(testMessage);
    
            expect(infoFn)
                .toBeCalledTimes(1);
        });
    });

    describe('warn', () => {
        it('should call winston.warn once', async () => {
            service.warn(testMessage);
    
            expect(warnFn)
                .toBeCalledTimes(1);
        });
    });

    describe('error', () => {
        it('should call winston.error once', async () => {
            service.error(testMessage);
    
            expect(errorFn)
                .toBeCalledTimes(1);
        });
    });
});