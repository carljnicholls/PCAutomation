import { PushbulletResponseTypeEnum } from '../enums/pushbullet-response-type.enum';

export interface PushbulletMessageResponse {
    // type: PushbulletResponseTypeEnum; 
    type: string; 
    subtype?: string;
    targets?: string;
    push?: unknown;
}