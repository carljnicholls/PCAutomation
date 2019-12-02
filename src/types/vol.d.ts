/**
 * https://www.npmjs.com/package/vol
 * Used in IVolumeControl Implementation VolumeControl  
 */

declare module 'vol';

declare function get(): Promise<number>;
declare function set(value: number): Promise<void>;

