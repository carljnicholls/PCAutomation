/**
 * Contains the success state of a `ICommandRunner.Run()`result.
 */
export class CommandResult {
    public readonly isError: boolean;
    public readonly isWarning: boolean;
    public readonly messages: string[] = [];

    /**
     * When constructed without params it defaults to successful. If constructed with 
     * messages but warning false it will set warning true. If it is 
     * constructed with isError true and warning as false a default message is added.
     * @param isError default: false
     * @param isWarning default: false
     * @param messages default: []
     */
    constructor(
        isError: boolean = false,
        isWarning: boolean = false,
        messages: string | string[] = []   
    ) {
        this.isError = isError;
        this.isWarning = isWarning;

        if(typeof messages === 'string') {
            this.messages = [ messages ];
        } else {
            this.messages = messages;
        }

        if(isWarning && messages.length === 0) {
            this.isWarning = true;
            this.messages = ['Undefined Warning'];
        }

        if(!isError && !isWarning && messages.length > 0) {
            this.isWarning = true;
        }
    }
}