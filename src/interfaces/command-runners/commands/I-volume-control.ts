/**
 * Implementations will access  
 * system/os level audio playback devices 
 */
export interface IVolumeControl {
    /**
     * Gets the current playback device audio value
     */
    get(): Promise<number>;
    
    /**
     * Sets the current playback device audio value
     */
    set(value: number): Promise<void>;
    
    /**
     * Sets the current playback device audio value to 0
     */
    
    mute(): Promise<void>; 

    /**
     * Sets the current playback device audio value to a default or given value
     */
    unmute(value?: number): Promise<void>;
}