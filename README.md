# Win 10 Automation 

This Console Application takes string params to automate tasks. The first command should be the task with any addition values following.

## Run

### From root

1. `tsc -b`

1. `node .\build\src\main.js args`

### VsCode

1. Show all commands: `<ctrl + shift + p> or F1`

1. Select `Tasks:Run Task`

1. Run the NPM command `run-param-lock`

## Accepted params

1. `lock` - locks the user space on win, linux and mac using lock-system. [GitHub](https://github.com/sindresorhus/lock-system), [NPM](https://www.npmjs.com/package/lock-system)
