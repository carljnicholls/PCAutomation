import { ILoggerService } from '../interfaces/core/i-logger-service';
import fetch from 'node-fetch';
import { PushbulletPush } from '../data-transfer/dtos/clients/pushbullet-push.dto';
import { PushbulletGetPushesResponse } from '../data-transfer/dtos/clients/pushbullet-get-pushes-response.dto';
import { isNullOrUndefined } from 'util';

export class PushbulletClient {
    private readonly className: string = 'PushbulletClient';
    private readonly invalidApiKeyMessage: string = 'Pushbullet api key cannot be null, undefined or empty'
    private readonly listPushesUrl: string = 'https://api.pushbullet.com/v2/pushes';

    /**
     * 
     * @param apiKey api key for pushbullet api 
     * @param logger 
     * @throws when api key is null, empty or undefined.
     */
    constructor(
        private readonly apiKey: string, 
        private readonly logger: ILoggerService) {
            logger.info(`${this.className}.ctor`);

            if(isNullOrUndefined(apiKey) || apiKey.trim().length == 0) {
                this.logger.error(`${this.className}.ctor ${this.invalidApiKeyMessage}`)
                throw new Error(this.invalidApiKeyMessage)
            }
        }

    /**
     * Makes a http call to the pushes route of the pushbullet api and 
     * returns the pushes property of the response if it exists or an empty array. 
     * @throws `node-fetch` call to api fails
     */
    public async getPushes(): Promise<PushbulletPush[]> {
        this.logger.info(`${this.className}.getPushes`);
        const options = {
            headers: {
                // 'Access-Token': 'o.sv37ZRXTh6jVacBdSYf0fcVVg6lYTKEk',
                'Access-Token': this.apiKey,
                'Content-Type': 'application/json'
            }
        };

        try { 
            const response = await fetch(this.listPushesUrl, options);
            const data = await response.json() as PushbulletGetPushesResponse;

            this.logger.info(`${this.className}.getPushes.fetch`, data);

            if(data.pushes.length === 0) {
                return [];
            }

            return data.pushes;
            
        } catch (error) {
            this.logger.error(`${this.className}.getPushes`, error);

            throw error;
        } 
    }
}