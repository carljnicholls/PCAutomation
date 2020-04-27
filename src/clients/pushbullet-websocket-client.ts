import WebSocket = require('ws');

import { PushbulletMessageResponse } from '../data-transfer/dtos/pushbullet-message-response.dto';
import { ILoggerService } from '../interfaces/services/core/i-logger-service';
import { isNullOrUndefined } from 'util';
import { PushbulletClient as PushbulletHttpClient } from './pushbullet-http-client';
import { IPushbulletWebsocketClient } from '../interfaces/clients/i-pushbullet-websocket-client';
import { ICommandRunnerFactory } from '../interfaces/services/command-runners/i-command-runner-factory';
import { CommandParameterEnum } from '../data-transfer/enums/command-parameter.enum';
import { PushbulletResponseTypeEnum } from '../data-transfer/enums/pushbullet-response-type.enum';
import { CommandResult } from '../data-transfer/dtos/command-result.dto';

export class PushbulletWebsocketClient implements IPushbulletWebsocketClient {
    private readonly className: string = 'PushbulletWebsocketClient';
    private readonly onMessageName: string = `${this.className}.on.message`;
    private readonly handlePushMessageName: string = `${this.className}.handlePushMessage`;
    private readonly invalidApiKeyMessage: string = 'Pushbullet api key cannot be null, undefined or empty';
    private readonly websocketAddress = 'wss://stream.pushbullet.com/websocket/';

    private readonly websocket: WebSocket;
    private readonly pushbulletClient: PushbulletHttpClient
    
    /**
     * Initializes a new Http Client and sets up the websocket connection to Pushbullet. 
     * It then listens for messages on this open websocket connection. 
     * @param apiKey api key for pushbullet api 
     * @param logger 
     * @throws when api key is null, empty or undefined.
     */
    constructor(
        private readonly apiKey: string, 
        private readonly commandRunnerFactory: ICommandRunnerFactory,
        private readonly logger: ILoggerService
    ) {
        logger.info(`${this.className}.ctor`);

        if(isNullOrUndefined(apiKey) || apiKey.trim().length == 0) {
            this.logger.error(`${this.className}.ctor ${this.invalidApiKeyMessage}`)
            throw new Error(this.invalidApiKeyMessage)
        }

        this.websocket = new WebSocket(`${this.websocketAddress}${this.apiKey}`);
        this.pushbulletClient = new PushbulletHttpClient(this.apiKey, logger);

        // Ignored `server` and `pushbullet` commands. 
        commandRunnerFactory.addCommandsToIgnore([CommandParameterEnum.pushbullet, CommandParameterEnum.server]);
    }

    /**
     * Starts listening for messages
     */
    public async connect(): Promise<void> {
        this.logger.debug(`${this.className}.connect`);

        this.websocket.on('message', async (data: WebSocket.Data) => await this.onMessage(data));

        /** Add Additional event listeners */
    }

    /**
     * Closes the WebSocket connection to Pushbullet
     */
    public async disconnect(): Promise<void> {
        this.websocket.close();
    }

    /**
     * Handles message events from a websocket. Parses the param into `PushbulletMessageResponse` objects. 
     * If a message type is not undefined or `nop` handle the response by getting a list of the most recent pushes 
     * to pushbullet
     * @param data Data received from websocket connection
     */
    private async onMessage(data: WebSocket.Data): Promise<void> {
        this.logger.debug(`${this.onMessageName}`, data);
        const response = JSON.parse(data.toString()) as PushbulletMessageResponse;
        this.logger.info(`${this.onMessageName}`, response);

        // `nop` message every 30 seconds
        if(isNullOrUndefined(response) || PushbulletResponseTypeEnum[response.type] === PushbulletResponseTypeEnum.nop) {
            this.logger.debug(`${this.onMessageName}.nop`);
            return;
        }

        // when something is pushed or received 
        if(PushbulletResponseTypeEnum[response.type] === PushbulletResponseTypeEnum.tickle) {
            this.logger.info(`${this.onMessageName}.tickle`, response.subtype);

            if(!isNullOrUndefined(response.subtype) && PushbulletResponseTypeEnum[response.subtype] === PushbulletResponseTypeEnum.push) {
                this.logger.info(`${this.onMessageName}.tickle.push`);

                const commandResult = await this.handlePushMessage();
    
                if(commandResult.isError) {
                    throw new Error(commandResult.messages[0]);
                }

            } else {
                this.logger.warn(`${this.onMessageName}.tickle - received no subtype`);
            }
            
            return;
        }
    }

    /**
     * Gets the most recent push response and uses it to get an `ICommandRunner` implementation
     * dependant on the first string argument 
     */
    private async handlePushMessage(): Promise<CommandResult> {
        const pushes = await this.pushbulletClient.getPushes();
        this.logger.info(`${this.handlePushMessageName}.pushes`, pushes);

        const args = pushes[0].body;
        if (isNullOrUndefined(args) || args.trim().length === 0) {
            throw new Error(`No Arguments provided`);
        }

        const currentPushArgs = args.split(' ');
        const commandRunner = this.commandRunnerFactory.get(currentPushArgs[0]);
        const commandResult = await commandRunner.Run(currentPushArgs.slice(1, args.length));
        
        return commandResult;
    }
}
