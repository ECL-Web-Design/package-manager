import {spawn} from "child_process"
import {printError, printStep, printSuccess} from "@/packages/@ecl-server/create-site/src/progressManager.ts"
import chalk from "chalk"

export default function createPgDb(name: string, password: string, user?: string) {
    return new Promise<void>((resolve) => {
        printStep('Getting postgres user id')

        const idProcess = spawn('id -u postgres', {shell: true})

        user = user ?? name

        idProcess.on('error', () => {
            printError('Could not get postgres user id:')
        })

        idProcess.stdout.on('data', (data) => {

            printStep(`got postgres user id: ${data}`)
            const postgresId = parseInt(data)

            if (!isNaN(postgresId)) {
                const process = spawn(
                    `psql -c 'CREATE DATABASE ${name};' -c "CREATE USER ${user} WITH PASSWORD '${password}';" -c 'GRANT ALL PRIVILEGES ON DATABASE ${name} TO ${user};'`,
                    {stdio: 'ignore', shell: true, uid: postgresId}
                )

                process.on('error', () => {
                    printError('Could not create database')
                    resolve()
                })

                process.on('exit', () => {
                    printSuccess(`New Database Created ${chalk.inverse(` DB Name: ${name} `)} - ${chalk.inverse(` User: ${user} `)}`)

                    resolve()
                })

            } else {
                printError('Invalid user Id')
                resolve()
            }
        })

    })
}
