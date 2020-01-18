import { ICommandRunner } from '../../../../interfaces/services/command-runners/commands/i-command-runner';
import { CommandResult } from '../../../../data-transfer/dtos/command-result.dto';
import { ILoggerService } from '../../../../interfaces/services/core/i-logger-service';
import { IPushbulletWebsocketClient } from '../../../../interfaces/clients/i-pushbullet-websocket-client';
import { PushbulletWebsocketClient } from '../../../../clients/pushbullet-websocket-client';
import { config } from "dotenv";
import { isNullOrUndefined } from 'util';

export class PushbulletServerRunner implements ICommandRunner {
    private server: IPushbulletWebsocketClient | undefined;

    constructor(private readonly logger: ILoggerService) {
        // this.server = {};        
    }

    /**
     * Creates a Websocket connection to Pushbullet using `PUSHBULLET_API_KEY` 
     * from environment values. This listens to Pushbullet `pushes` and executes 
     * commands upon specific requests 
     * @param args unused
     */
    public async Run(args?: string[] | undefined): Promise<CommandResult> {
        this.logger.debug("ServerCommandRunner.Run()");
        try {
            const apiKey = process.env.PUSHBULLET_API_KEY;

            if(isNullOrUndefined(apiKey) || apiKey.trim().length === 0) {
                throw new Error(`PUSHBULLET_API_KEY must be declared in .env file in app root`)
            }

            if(isNullOrUndefined(this.server)){ 
                this.server = new PushbulletWebsocketClient(apiKey, this.logger);
            }

            await this.server.connect();

            return new Promise(() => new CommandResult(false));

        } catch (error) {
            this.logger.error(`ServerCommandRunner.Run()`, error);

            if(!isNullOrUndefined(this.server)){
                this.server.disconnect();
                this.server = undefined;
            }

            throw error;
        }
    }
}