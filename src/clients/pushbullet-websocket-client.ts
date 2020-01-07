import WebSocket = require('ws');

import { PushbulletMessageResponse } from '../data-transfer/dtos/pushbullet-message-response.dto';
import { ILoggerService } from '../interfaces/core/i-logger-service';
import { isNullOrUndefined, isNull } from 'util';
import { PushbulletClient as PushbulletHttpClient } from './pushbullet-http-client';

export class PushbulletWebsocketClient {
    private readonly className: string = 'PushbulletWebsocketClient';
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
        private readonly logger: ILoggerService
    ) {
        logger.info(`${this.className}.ctor`);

        if(isNullOrUndefined(apiKey) || apiKey.trim().length == 0) {
            this.logger.error(`${this.className}.ctor ${this.invalidApiKeyMessage}`)
            throw new Error(this.invalidApiKeyMessage)
        }

        this.websocket = new WebSocket(`${this.websocketAddress}${this.apiKey}`);
        this.pushbulletClient = new PushbulletHttpClient(this.apiKey, logger);

        this.websocket.on('message', async (data: WebSocket.Data) => await this.onMessage(data));

        // TODO: Additional event handlers 
    }

    /**
     * Handles message events from a websocket. Parses the param into `PushbulletMessageResponse` objects. 
     * If a message type is not undefined or `nop` handle the response by getting a list of the most recent pushes 
     * to pushbullet
     * @param data Data received from websocket connection
     */
    private async onMessage(data: WebSocket.Data): Promise<void> {
        this.logger.info(`${this.className}.on.message`, data);
        const response = JSON.parse(data.toString()) as PushbulletMessageResponse;
        this.logger.debug(`${this.className}.on.message`, response);

        // `nop` message every 30 seconds
        if(isNullOrUndefined(response) || response.type === 'nop') {
            this.logger.debug(`${this.className}.on.message.nop`);
            return;
        }

        // when something is pushed or received 
        if(response.type === 'tickle') {
            // if(response.type == PushbulletResponseTypeEnum.tickle) {
            this.logger.info(`${this.className}.on.message.tickle`, response.subtype);

            if(!isNullOrUndefined(response.subtype) && response.subtype == 'push') {
                this.logger.info(`${this.className}.on.message.tickle.push`);

                const pushes = await this.pushbulletClient.getPushes();
                this.logger.info(`${this.className}.on.message.tickle.push.response`, pushes);

                // ---------------------------------------------
                // TODO: Handle response 
                // ---------------------------------------------
            } else {
                this.logger.warn(`${this.className}.on.message.tickle - received no subtype`);
                return;
            }
        }
    }
}
