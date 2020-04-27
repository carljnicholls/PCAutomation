jest.mock('../../../../src/services/logger/logger-service');

import { CommandRunnerFactory } from '../../../../src/services/command-runners/command-runner-factory';
import { LoggerService } from '../../../../src/services/logger/logger-service';
import { LockCommandRunner } from '../../../../src/services/command-runners/commands/lock-command/lock-command-runner';
import { SetVolumeCommandRunner } from '../../../../src/services/command-runners/commands/set-volume/set-volume-command-runner';
import { LoggerTestHelper } from '../../../../__test-helpers__/logger-test-helper';
import { CommandParameterEnum } from '../../../../src/data-transfer/enums/command-parameter.enum';
import { PushbulletServerRunner } from '../../../../src/services/command-runners/commands/pushbullet-server/pushbullet-server-command-runner';
import { MediaPlayRunner } from '../../../../src/services/command-runners/commands/keyboard/media/play/media-play-command-runner';
import { MediaPauseRunner } from '../../../../src/services/command-runners/commands/keyboard/media/pause/media-pause-command-runner';

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
                expect(() => service.get(cmd))
                    .toThrowError();

                loggerTestHelper.checkLoggerCalls(logger, 1, 0, 0, 1);
            });

        it.each(['server', 'pushbullet', 'Server', 'Pushbullet'])
            ('should throw when command is ignored', async(cmd: string) => {
                const validCmd = 'lock'
                service.addCommandsToIgnore([CommandParameterEnum.pushbullet, CommandParameterEnum.server]);
                
                expect(() => service.get(cmd))
                    .toThrowError();

                expect(() => service.get(validCmd))
                    .not
                    .toThrowError();
            });

        it.each(['lock', 'Lock', 'LOck', 'lockdevice', 'lockDevice'])
            ('should return a `LockCommandRunner` when param equals `lock` or `Lock`', (cmd: string) => {
                expect(service.get(cmd))
                    .toBeInstanceOf(LockCommandRunner);
                
                loggerTestHelper.checkLoggerCalls(logger, 1, 0, 0, 0);
            });
        
        it.each(['volume', 'Volume', 'VolumE'])
            ('should return a `SetVolumeCommandRunner` when param equals `setvolume`', (cmd: string) => {
                expect(service.get(cmd))
                    .toBeInstanceOf(SetVolumeCommandRunner);
                
                loggerTestHelper.checkLoggerCalls(logger, 1, 0, 0, 0);
            });

        it.each(['server', 'Server', 'SeRveR', 'pushbullet', 'Pushbullet', 'PUSHbullet'])
            ('should return a `PushbulletServerRunner` when param equals `server` or `pushbullet` ', (cmd: string) => {
                expect(service.get(cmd))
                    .toBeInstanceOf(PushbulletServerRunner);
                
                loggerTestHelper.checkLoggerCalls(logger, 1, 0, 0, 0);
            });

        it.each(['play', 'Play', 'PlaY'])
            ('should return a `MediaPlayRunner` when param equals `play`', (cmd: string) => {
                expect(service.get(cmd))
                    .toBeInstanceOf(MediaPlayRunner);
                
                loggerTestHelper.checkLoggerCalls(logger, 1, 0, 0, 0);
            });

        it.each(['pause', 'Pause', 'PAuSE'])
            ('should return a `MediaPauseRunner` when param equals `pause`', (cmd: string) => {
                expect(service.get(cmd))
                    .toBeInstanceOf(MediaPauseRunner);
                
                loggerTestHelper.checkLoggerCalls(logger, 1, 0, 0, 0);
            });
    });

    describe('addCommandsToIgnore', () => {
        it.each([undefined, CommandParameterEnum[-1], null, []])
            ('should throw when `commandParameterEnum` not recognized', (cmd: CommandParameterEnum[]) => {
                expect(() => service.addCommandsToIgnore(cmd))
                    .toThrowError();

                loggerTestHelper.checkLoggerCalls(logger, 0, 0, 0, 0);
            });

        it.each([CommandParameterEnum.lock, CommandParameterEnum.pushbullet, CommandParameterEnum.lockDevice, CommandParameterEnum.server, CommandParameterEnum.setVolume])
            ('should not throw when command already ignored', (cmd: CommandParameterEnum) => {
                service.addCommandsToIgnore([cmd]); 
                expect(() => service.addCommandsToIgnore([cmd]))
                    .not
                    .toThrowError();

                loggerTestHelper.checkLoggerCalls(logger, 0, 0, 1, 0);
            });
    });

    describe('addCommandToIgnore', () => {
        it.each([CommandParameterEnum[-1]])
            ('should throw when `commandParameterEnum` not recognized', (cmd: CommandParameterEnum) => {
                expect(() => service.addCommandToIgnore(cmd))
                    .toThrowError();

                loggerTestHelper.checkLoggerCalls(logger, 0, 0, 0, 0);
            });

        it.each([CommandParameterEnum.lock, CommandParameterEnum.pushbullet, CommandParameterEnum.lockDevice, CommandParameterEnum.server, CommandParameterEnum.setVolume])
            ('should not throw when command already ignored', (cmd: CommandParameterEnum) => {
                service.addCommandsToIgnore([cmd]); 
                expect(() => service.addCommandToIgnore(cmd))
                    .not
                    .toThrowError();

                loggerTestHelper.checkLoggerCalls(logger, 0, 0, 1, 0);
            });
    });

    describe('removeCommandsToIgnore', () => {
        it.each([undefined, CommandParameterEnum[-1], null, []])
            ('should throw when `commandParameterEnum` not recognized', (cmd: CommandParameterEnum[]) => {
                expect(() => service.removeCommandsToIgnore(cmd))
                    .toThrowError();

                loggerTestHelper.checkLoggerCalls(logger, 0, 0, 0, 0);
            });

        it.each([CommandParameterEnum.lock, CommandParameterEnum.pushbullet, CommandParameterEnum.lockDevice, CommandParameterEnum.server, CommandParameterEnum.setVolume])
            ('should not throw when command is ignored', (cmd: CommandParameterEnum) => {
                service.addCommandsToIgnore([cmd]); 
                expect(() => service.removeCommandsToIgnore([cmd]))
                    .not
                    .toThrowError();

                loggerTestHelper.checkLoggerCalls(logger, 0, 0, 0, 0);
            });

        it.each([CommandParameterEnum.lock, CommandParameterEnum.pushbullet, CommandParameterEnum.lockDevice, CommandParameterEnum.server, CommandParameterEnum.setVolume])
            ('should not throw when command is not ignored but stout warn', (cmd: CommandParameterEnum) => {
                service.clearCommandsToIgnore();

                expect(() => service.removeCommandsToIgnore([cmd]))
                    .not
                    .toThrowError();

                loggerTestHelper.checkLoggerCalls(logger, 0, 0, 1, 0);
            });
    });

    describe('removeCommandToIgnore', () => {
        it.each([CommandParameterEnum[-1]])
            ('should throw when `commandParameterEnum` not recognized', (cmd: CommandParameterEnum) => {
                expect(() => service.removeCommandToIgnore(cmd))
                    .toThrowError();

                loggerTestHelper.checkLoggerCalls(logger, 0, 0, 0, 0);
            });

        it.each([CommandParameterEnum.lock, CommandParameterEnum.pushbullet, CommandParameterEnum.lockDevice, CommandParameterEnum.server, CommandParameterEnum.setVolume])
            ('should not throw when command is ignored', (cmd: CommandParameterEnum) => {
                service.addCommandToIgnore(cmd); 
                expect(() => service.removeCommandToIgnore(cmd))
                    .not
                    .toThrowError();

                loggerTestHelper.checkLoggerCalls(logger, 0, 0, 0, 0);
            });

        it.each([CommandParameterEnum.lock, CommandParameterEnum.pushbullet, CommandParameterEnum.lockDevice, CommandParameterEnum.server, CommandParameterEnum.setVolume])
            ('should not throw when command is not ignored but stout warn', (cmd: CommandParameterEnum) => {
                service.clearCommandsToIgnore();

                expect(() => service.removeCommandToIgnore(cmd))
                    .not
                    .toThrowError();

                loggerTestHelper.checkLoggerCalls(logger, 0, 0, 1, 0);
            });
    });

    describe('clearCommandsToRun', () => {
        it('should not throw', async() => {
            expect(() => service.clearCommandsToIgnore())
                .not
                .toThrowError();
        });
    });
});
