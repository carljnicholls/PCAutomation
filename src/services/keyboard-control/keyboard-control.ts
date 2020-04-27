import { keyTap } from "robotjs";
import { ILoggerService } from '../../interfaces/services/core/i-logger-service';
import { IKeyboardControl } from '../../interfaces/services/keyboard-control/i-keyboard-control';

/**
 * Uses `robotjs` to register keyboard key presses 
 * http://robotjs.io/docs/syntax#keys 
 */
export class KeyboardControl implements IKeyboardControl {
    private readonly className: string = 'KeyboardControl';
    private readonly mediaPlayName: string = `${this.className}.mediaPlay`;
    private readonly mediaPauseName: string = `${this.className}.mediaPause`;
    
    constructor(private readonly logger: ILoggerService) {}

    public async mediaPlay(): Promise<boolean> {
        this.logger.debug(this.mediaPlayName);
        return this.run('audio_play');
    }

    public async mediaPause(): Promise<boolean> {
        this.logger.debug(this.mediaPauseName);
        return this.run('audio_pause');
    }

    /**
     * Tries to use `robotjs` to create keypress and returns a boolean success indicator
     * @param key 
     */
    private run(key: string) {
        try {
            keyTap(key);

            return true;
        } catch (error) {
            this.logger.error(`${this.className}.run`, error);
            return false;
        }
    }
}