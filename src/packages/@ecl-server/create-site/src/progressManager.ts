import chalk from "chalk"

export function printStep(msg: string) {
    console.log(chalk.bold.blue(msg + '...'))
}

export function printSuccess(msg: string) {
    console.log(chalk.green('\u2713 ') + chalk.bold(msg))
}

export function printError(msg: string) {
    console.log(chalk.bold.red('\u2A3B  ' + msg))
}

export function printIssue(msg: string) {
    console.log(chalk.bold.yellow('\u26A0  ' + msg))
}
