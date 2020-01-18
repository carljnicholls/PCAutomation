export interface IPushbulletWebsocketClient {
    /**
     * Opens a WebSocket connection to Pushbullet and listens for 
     * `tickle` messages and if they match a specific pattern it 
     * will run execute commands.
     */
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}