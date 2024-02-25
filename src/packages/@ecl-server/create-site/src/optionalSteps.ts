import {Answers} from "inquirer"
import {spawn} from "child_process"
import createPgDb from "@/packages/@ecl-server/create-site/src/createPgDb.ts"
import {initDirectusTemplate} from "@/packages/@ecl-server/create-site/src/initDirectusTemplate.ts"
import {confirm} from "@inquirer/prompts"
import {printStep, printSuccess} from "@/packages/@ecl-server/create-site/src/progressManager.ts"
import makeCert from "@ecl-server/ssl-make-cert"

export async function shouldCreateDb(answers: Answers) {
    if (answers['directusDbClient'] === 'pg') {

        printStep('Starting DB Creation')
        await createPgDb(answers['directusDbName'], answers['directusDbPassword'], answers['directusDbUser'])
    }
}

export async function shouldUseDirectusTemplate(answers: Answers) {
    const useDirectusTemplate = await confirm({message: 'Would you like to use a default site template for directus? ',})

    if (useDirectusTemplate) {
        await initDirectusTemplate(answers)
    }
}

export async function shouldStartDirectusDocker(answers: Answers) {
    const startDirectus = await confirm({message: 'Would you like to start the Directus instance now? '})

    return new Promise<void>((resolve) => {
        if (startDirectus) {
            const proc = spawn(
                'docker compose up --pull=always -d',
                {shell: true, stdio: 'inherit', cwd: `${answers['rootDir']}directus`}
            )

            proc.on('exit', () => {
                printSuccess('Directus Started')
                resolve()
            })
        } else {
            resolve()
        }
    })
}

export async function shouldReloadNginx() {
    return new Promise<void>(async (resolve) => {
        const reloadNginx = await confirm({message: 'Would you like to reload Nginx now? '})

        if (reloadNginx) {
            const proc = spawn('sudo -t && sudo service nginx reload', {shell: true, stdio: 'ignore'})

            proc.on("exit", () => {
                printSuccess('Nginx Reloaded')
                resolve()
            })
        } else {
            resolve()
        }
    })
}

export async function shouldRefreshSsl() {
    return new Promise<void>(async (resolve) => {
        const refreshSsl = await confirm({message: 'Would you like to refresh your ssl certificates? '})

        if (refreshSsl) {
            await makeCert()

            printSuccess('successfully refreshed SSL certificates')
            resolve()
        } else {
            resolve()
        }
    })
}
