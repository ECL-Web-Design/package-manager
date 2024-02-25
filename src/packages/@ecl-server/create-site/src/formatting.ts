import chalk from "chalk"

const separator = chalk.grey('\n------------------------------------------------------------\n')

export function title(str: string) {
    return separator + '\n' + chalk.bold.green(str) + '\n\n'
}
