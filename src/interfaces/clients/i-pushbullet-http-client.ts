import { PushbulletPush } from '../../data-transfer/dtos/clients/pushbullet-push.dto';

export interface IPushbulletHttpClient {
    
    /**
     * Makes a http call to the pushes route of the pushbullet api and 
     * returns the pushes property of the response if it exists or an empty array. 
     * @throws `node-fetch` call to api fails
     */
    getPushes(): Promise<PushbulletPush[]>;
}