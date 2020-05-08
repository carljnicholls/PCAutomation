# Win 10 Automation 

This Console Application takes string params to automate tasks. The first command should be the task with any addition values following.

## Run

### From root
Install dependancies: `npm i` 
Build: `tsc -b`
Test `jest` or `npm run test`
Run: `node .\build\src\main.js [args]`

### VsCode

1. Show all commands: `<ctrl + shift + p> or F1`

1. Select `Tasks:Run Task`

1. Run the NPM command `run-param-lock` or `run-param-server`. 
<sub> These can be extended with your desired parameter. </sub>

1. F5
    This launch functionality can be edited in `/.vscode/launch.json`
    1. `Launch w/ param server` 
        Debug with breakpoints with `server` parameter. 
    1. `vscode-jest-tests`
        Run Jest Unit Tests with breakpoints

## Params

1. `pushbullet` or `server`
    This will launch a websocket server listening subscribing to [Pushbullet](https://www.pushbullet.com/). On pushes to pushbullet it will check for parameters and execute any command matched.  
    This requires `PUSHBULLET_API_KEY` to be set in your `.env` file in the project root. You can create an API key from [Pushbullet Settings](https://www.pushbullet.com/#settings) under Access Tokens.
    You will also need to create a mechanism to push to messages to your pushbullet account. I suggest [IFTT](https://ifttt.com/). A recipe for creating this is:

        1. If
            1. Google Assistant
            2. Say a phrase with a text ingredient  
            3. Selector command followed by a `$` for your text ingredient. e.g "PC $" or "Computer $".
        2. Then
            1. Push a note
            2. Message should be `textfield`
        3. Create

1. `lock` 
    Locks the user space on win, linux and mac using lock-system.

1. `volume <1-100>`
    This command will set the volume of the current playback device to the given value.

1. `play` or `pause`
    This command emulates a keyboard media button press of play or pause.
