import { PushbulletPush } from './pushbullet-push.dto';

export interface PushbulletGetPushesResponse {
    accounts: [],
    blocks: [],
    channels: [],
    chats: [],
    clients: [],
    contacts: [],
    devices: [],
    grants: [],
    pushes: PushbulletPush[];
    profiles: [],
    subscriptions: [],
    texts: [],
    cursor: string
}