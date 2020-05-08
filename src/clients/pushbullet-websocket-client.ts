import WebSocket from "ws";

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
     * Starts `open`, `message`, `close` and `error` listeners 
     */
    public async connect(): Promise<void> {
        this.logger.debug(`${this.className}.connect`);

        this.websocket.on('open', () => this.logger.debug(`${this.className}.connect.ws. open`)); 
        this.websocket.on('message', async (data: WebSocket.Data) => await this.onMessage(data));
        this.websocket.on('error', async (error: Error) => { await this.onError(error)});
        this.websocket.on('close', async () => { await this.onClose(); });
    }

    /**
     * Closes the WebSocket connection to Pushbullet
     */
    public async disconnect(): Promise<void> {
        this.logger.debug(`${this.className}.disconnect`);
        this.websocket.close();
    }

    /**
     * Handles message events from a websocket. Parses the param into `PushbulletMessageResponse` objects. 
     * If a message type is not undefined or `nop` handle the response by getting a list of the most recent pushes 
     * to pushbullet
     * @param data Data received from websocket connection
     */
    private async onMessage(data: WebSocket.Data): Promise<void> {
        try {
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
                await this.handleTickleResponse(response);
            }

        }
        catch(err) {
            this.logger.error(`${this.onMessageName}.error`, err);
            // no reason to rethrow as its not going to be caught anywhere 
        }
    }

    /**
     * Error message from `WS` event handler
     */
    private async onError(error: Error): Promise<void> {
        this.logger.error(`${this.className}.onError`, error);
    }

    /**
     * Close message from `WS` event handler
     * Disconnects the websocket server
     */
    private async onClose(): Promise<void> {
        this.logger.debug(`${this.className}.onClose`);
        this.disconnect();
    }

    /**
     * Gets the most recent push response and uses it to get an `ICommandRunner` implementation
     * dependant on the first string argument 
     * @throws If it receives no body from pushbullet request
     * @throws If command does not exist
     * @throws If command.run throws 
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
        const commandResult = await commandRunner.run(currentPushArgs.slice(1, args.length));
        
        return commandResult;
    }

        /**
     * Gets the most recent push from Pushbullet API decides which command it is, 
     * runs it and handles the command result. 
     * @param response Tickle message from websocket server
     * @throws when command result `isError` or `isWarning`
     */
    private async handleTickleResponse(response: PushbulletMessageResponse) {
        if (!isNullOrUndefined(response.subtype) && PushbulletResponseTypeEnum[response.subtype] === PushbulletResponseTypeEnum.push) {
            this.logger.info(`${this.onMessageName}.tickle.push`);
            const commandResult = await this.handlePushMessage();
            if (commandResult.isError) {
                throw new Error(this.getResultMessage(commandResult));
            }
            if (commandResult.isWarning) {
                throw new Error(this.getResultMessage(commandResult));
            }
            this.logger.info(`${this.onMessage}.tickle.push.success`, commandResult);
        }
        else {
            this.logger.warn(`${this.onMessageName}.tickle - subtype is undefined or not expected type`);
        }
    }

    /**
     * Returns the first element in message array if it exists
     */
    private getResultMessage(commandResult: CommandResult): string | undefined {
        return commandResult.messages[0];
    }
}
