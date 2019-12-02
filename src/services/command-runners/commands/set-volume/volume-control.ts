import * as vol from "vol";
import { IVolumeControl } from '../../../../interfaces/command-runners/commands/I-volume-control';

export class VolumeControl implements IVolumeControl {
    public async get(): Promise<number> {
        return vol.get().then((level: number) => {
            return level;
        });    
    }    
    
    public async set(value: number): Promise<void> {
        vol.set(value).then(() => {
            return;
        });    
    }
    
    public async mute(): Promise<void> {
        vol.set(0).then(() => {
            return;
        }); 
    }
    
    public async unmute(value: number = 40): Promise<void> {
        vol.set(value);
    }
}