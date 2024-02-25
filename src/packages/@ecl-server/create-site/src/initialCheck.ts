import inquirer from "inquirer"
import prompt = inquirer.prompt
import chalk from "chalk"

export default async function initialCheck() {

    return prompt({
        name: 'checkInitial',
        type: "confirm",
        prefix: `\n${chalk.bold.blue('Create nginx directus site'.toUpperCase())}\n`+
                `--------------------------------------\n\n` +
                chalk.inverse(`PLEASE READ THE FOLLOWING\n\n`) +
                `-- This tool will walk you through adding a new site to the server.\n`+
                `-- Please ensure ${chalk.bold.inverse('NGINX')}, ${chalk.bold.inverse('POSTGRESQL')}, and ${chalk.bold.inverse('DOCKER')} are installed on this user profile\n`+
                `-- ${chalk.bold(`Also ensure your domain dns points to your server ip address via A records.`)}\n` +
                `-- ${chalk.bold(`This tool is naive and ${chalk.inverse('WILL NOT')} check for existing setups with matching names, it will delete and replace all associated files`)}\n` +
                `-- ${chalk.bold('Note: This tool will not create a new database for directus when connecting' +
                ' remotely, please ensure a db exists with the site name, or provide a different db name during' +
                ' directus setup.\n')}` +
                `-- When connecting to a database locally, the postgres user will be used, ensure this user is accessible by your current user.\n\n` +
                chalk.green('?'),

        message: 'Would you like to continue?'
                  })
}
