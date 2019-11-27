/**
 * Contains the success state of a `ICommandRunner.Run()`result.
 * If constructed without params it is successful. If constructed with 
 * messages but warning false it will set warnings true. If it is 
 * constructed with success and warning as false a default message is added.
 */
export class CommandResultDto {
    private _isWarning: boolean;
    public readonly isError: boolean;
    public isWarning = () => { 
        return !this.isError 
            || !this.isWarning
            || (this.messages !== undefined 
                && this.messages.length > 0); 
    } 
    public readonly messages: string[] = [];

    constructor(
        isError: boolean = false,
        isWarning: boolean = false,
        messages: string[] = []   
    ) {
        this.isError = isError;
        this._isWarning = isWarning;

        // if(!isError && !isWarning && messages.length === 0) {
        //     // this.messages = ["Warning: No Message"];
        // } else{
        //     this.messages = messages;
        // }
        this.messages = messages;

    }
}