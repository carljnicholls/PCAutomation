import { ICommandRunner } from '../../../../interfaces/services/command-runners/commands/i-command-runner';
import { CommandResult } from '../../../../data-transfer/dtos/command-result.dto';
import { ILoggerService } from '../../../../interfaces/services/core/i-logger-service';
import { IPushbulletWebsocketClient } from '../../../../interfaces/clients/i-pushbullet-websocket-client';
import { PushbulletWebsocketClient } from '../../../../clients/pushbullet-websocket-client';
import { ICommandRunnerFactory } from '../../../../interfaces/services/command-runners/i-command-runner-factory';
import { StateManager } from '../../../state/state-manager.service';
import { CommandParameterEnum } from '../../../../data-transfer/enums/command-parameter.enum';

export class PushbulletServerCommandRunner implements ICommandRunner {
    private server: IPushbulletWebsocketClient | undefined;

    constructor(
        private readonly commandFactory: ICommandRunnerFactory,
        private readonly state: StateManager,
        private readonly logger: ILoggerService) { }

    /**
     * Creates a Websocket connection to Pushbullet using `PUSHBULLET_API_KEY` 
     * from environment values. This listens to Pushbullet `pushes` and executes 
     * commands upon specific requests 
     * @param args unused
     */
    public async run(args?: string[] | undefined): Promise<CommandResult> {
        this.logger.debug("ServerCommandRunner.Run()", args);
        try {
            const apiKey = process.env.PUSHBULLET_API_KEY;

            if(apiKey == undefined || apiKey.trim().length === 0) {
                throw new Error(`PUSHBULLET_API_KEY must be declared in .env file in app root`)
            }

            if(this.server == undefined){ 
                this.server = new PushbulletWebsocketClient(apiKey, this.commandFactory, this.logger);

                // Ignore `server` and `pushbullet` commands. 
                this.state.addCommandsToIgnore([CommandParameterEnum.pushbullet, CommandParameterEnum.server]);
            }

            await this.server.connect();

            return new CommandResult(false);

        } catch (error) {
            this.logger.error(`ServerCommandRunner.Run()`, error);

            if(this.server != undefined){
                this.server.disconnect();
                this.server = undefined;
            }

            throw error;
        }
    }
}