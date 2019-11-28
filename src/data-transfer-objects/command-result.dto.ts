/**
 * Contains the success state of a `ICommandRunner.Run()`result.
 * If constructed without params it is successful. If constructed with 
 * messages but warning false it will set warnings true. If it is 
 * constructed with success and warning as false a default message is added.
 */
export class CommandResultDto {
    public readonly isError: boolean;
    public readonly isWarning: boolean;
    public readonly messages: string[] = [];

    constructor(
        isError: boolean = false,
        isWarning: boolean = false,
        messages: string[] = []   
    ) {
        this.isError = isError;
        this.isWarning = isWarning;
        this.messages = messages;

        if(isWarning && messages.length === 0) {
            this.isWarning = true;
            this.messages = ['Undefined Warning'];
        }

        if(!isError && !isWarning && messages.length > 0) {
            this.isWarning = true;
        }
    }
}