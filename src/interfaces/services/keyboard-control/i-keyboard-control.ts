/**
 * Registers keyboard key presses
 */
export interface IKeyboardControl {
    /**
     * Creates a `play` keyboard media control event
     */
    mediaPlay(): Promise<boolean>;
    /**
     * Creates a `pause` keyboard media control event
     */
    mediaPause(): Promise<boolean>;
}