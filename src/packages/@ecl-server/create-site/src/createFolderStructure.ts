import {Answers} from "inquirer"
import * as fs from "fs"
import {printIssue, printStep, printSuccess} from "@/packages/@ecl-server/create-site/src/progressManager.ts"

function createProjectFolder(path: string) {
    printStep('Creating site folder structure')

    const dirs = [
        'directus',
        'directus/uploads',
        'directus/keys',
        'directus/extensions',
        'nginx',
        'www'
    ]

    dirs.forEach(addPath => fs.mkdirSync(path + addPath, {recursive: true, mode: 0o777}))

    printSuccess('Site folders created at: ' + path)
}

export function createFolderStructure(answers: Answers) {
    if (answers['onlyDomain'] === 'full') {

        createProjectFolder(answers['rootDir'])

    } else {
        // if only adding a domain just check if folder structure exists first so new nginx conf can be linked here

        if (fs.existsSync(answers['rootDir'] + 'nginx')) {
            printSuccess('Verified site folder structure')
        } else {
            printIssue('Could not find project folder')

            createProjectFolder(answers['rootDir'])

            printSuccess('Site folder structure created')
        }
    }
}
