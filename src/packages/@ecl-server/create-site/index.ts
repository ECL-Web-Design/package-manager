#!/usr/bin/env node

import inquirer, {Answers} from 'inquirer'
import userQuestions from "./src/userQuestions.ts"
import initialCheck from "@/packages/@ecl-server/create-site/src/initialCheck.ts"
import * as process from "process"
import {formatAnswers} from "@/packages/@ecl-server/create-site/src/formatAnswers.ts"
import {createMainNginxConf} from "@/packages/@ecl-server/create-site/src/createMainNginxConf.ts"
import {createDirectusYml} from "@/packages/@ecl-server/create-site/src/fileFragments.ts"
import {extractDirectusInfo} from "@/packages/@ecl-server/create-site/src/extractDirectusInfo.ts"
import {createFolderStructure} from "@/packages/@ecl-server/create-site/src/createFolderStructure.ts"
import * as fs from "fs"
import {confirmNginxLocation} from "@/packages/@ecl-server/create-site/src/confirmNginxLocation.ts"
import {createDummyAnswers} from "@/packages/@ecl-server/create-site/src/createDummyAnswers.ts"
import {printError, printStep, printSuccess} from "@/packages/@ecl-server/create-site/src/progressManager.ts"
import {
    shouldCreateDb,
    shouldRefreshSsl,
    shouldReloadNginx,
    shouldStartDirectusDocker,
    shouldUseDirectusTemplate
} from "@/packages/@ecl-server/create-site/src/optionalSteps.ts"

const TEST = false

async function afterQuestions(answers: Answers) {

    answers = formatAnswers(answers, userQuestions)

    const nginxConf = createMainNginxConf(answers)

    if (!TEST) {
        createFolderStructure(answers)
    }

    const nginxLocation = TEST ? '/etc/nginx' : await confirmNginxLocation()

    const locationFinal = nginxLocation.slice(-1) === '/' ?
                          nginxLocation.substring(0, nginxLocation.length - 1) :
                          nginxLocation

    const confLocation = locationFinal + '/conf.d/' + nginxConf.filename
    const symLinkLocation = answers['rootDir'] + 'nginx/server-configuration.conf'

    //create conf file
    if (!TEST) {
        printStep('Creating conf file at: ' + confLocation)
        fs.writeFileSync(confLocation, nginxConf.content, {mode: 0o777})

        printStep('Creating conf link: ' + symLinkLocation)
        fs.symlinkSync(confLocation, symLinkLocation, 'file')

        printSuccess('Nginx conf created')
    }

    if (answers['onlyDomain'] === 'full') {
        //create directus yaml
        const directusYml = createDirectusYml(extractDirectusInfo(answers))
        const ymlLocation = answers['rootDir'] + 'directus/' + directusYml.filename

        if (!TEST) {
            fs.writeFileSync(ymlLocation, directusYml.content)
            printSuccess('Created Directus yml at: ' + ymlLocation)
        }

        if (answers['directusStorageConfig'] === 'gcs' && !TEST) {

            const keyLocation = answers['rootDir'] + 'directus/keys/gcs-key.json'
            fs.writeFileSync(keyLocation, answers['directusGcsKeyJson'])
            printSuccess('Created Directus key file at: ' + keyLocation)
        }

        if (!TEST) {
            await shouldCreateDb(answers)
            await shouldUseDirectusTemplate(answers)
            await shouldStartDirectusDocker(answers)
        }
    }

    if (!TEST) {
        await shouldReloadNginx()
        await shouldRefreshSsl()
    }
}

async function runCli() {

    const {checkInitial} = await initialCheck()

    if (!checkInitial) {
        printError('exiting...')
        process.exit(0)
    }

    return inquirer.prompt(userQuestions)
}

try {
    if (TEST) {
        afterQuestions(createDummyAnswers(userQuestions))
            .then(() => {
                printSuccess('Site Created!')
            })
    } else {
        runCli().then(afterQuestions)
                .then(() => {
                    printSuccess('Site Created!')
                })
    }
} catch {
    printError('Runtime error - Exiting now')
}


