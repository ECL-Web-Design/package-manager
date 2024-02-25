import {Answers} from "inquirer"
import * as https from "https"
import fs from "fs"
import {printError, printStep, printSuccess} from "@/packages/@ecl-server/create-site/src/progressManager.ts"
import {spawn} from "child_process"

const sqlUrl = 'https://raw.githubusercontent.com/ECL-Web-Design/directus-template-sql/main/template.sql'

async function fillDatabase(dbName: string, rootDir: string, ownerName: string, ownerPassword: string) {
    const idProcess = spawn('id -u postgres', {shell: true})

    return new Promise<void>((resolve, reject) => {
        idProcess.on('error', () => {
            printError('Could not get postgres user id -- Aborting template creation')
            reject()
        })

        idProcess.stdout.on('data', (data) => {

            printStep(`got postgres user id: ${data}`)
            const postgresId = parseInt(data)

            if (!isNaN(postgresId)) {
                const process = spawn(
                    `PGPASSWORD='${ownerPassword}' psql ${dbName} < ${rootDir}directus/template.sql --username=${ownerName} --no-password`,
                    {stdio: ['ignore', "inherit", "inherit"], shell: true, uid: postgresId}
                )

                process.on('error', () => {
                    printError('Could not import template')
                    reject()
                })

                process.on('exit', () => {
                    printSuccess(`Directus template imported`)
                    resolve()
                })
            } else {
                printError('Invalid user Id')
                reject()
            }
        })
    })
}

export async function initDirectusTemplate(answers: Answers) {
    const sqlPath = answers['rootDir'] + 'directus/template.sql'

    return new Promise<void>((resolve, reject) => {
        printStep('Starting Template download...')
        https.get(sqlUrl, resp => {
            resp.pipe(fs.createWriteStream(sqlPath))

            resp.on('end', async () => {
                printSuccess('Directus Template Downloaded')

                await fillDatabase(
                    answers['directusDbName'],
                    answers['rootDir'],
                    answers['directusDbUser'],
                    answers['directusDbPassword']
                )
                resolve()
            })

            resp.on("error", () => {
                printError('Could not download Directus Template')
                reject()
            })
        })
    })
}
