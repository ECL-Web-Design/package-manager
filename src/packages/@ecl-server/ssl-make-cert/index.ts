import {spawn} from "child_process"
import fs from "fs"
import * as readline from "readline"

const confDir = '/etc/nginx/conf.d'

async function getServerNamesFromFile(filename: string) {
    const fileStream = fs.createReadStream(filename)

    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity})

    let serverNames = []

    for await (const line of rl) {
        if (line.includes('server_name')) {
            const lineNames = line.replace('server_name', '').replace(';', '').trim().split(' ')

            serverNames.push(...lineNames)
        }
    }

    return serverNames
}

export default async function makeCert() {

    return new Promise<void>(async (resolve, reject) => {
        console.log('Configuring certbot... \n')

        // -n forces non-interactive mode
        const siteListArgs = ['--nginx', '-n']

        const files = fs.readdirSync(confDir)
        for (const file of files) {
            if (file !== 'default.conf') {
                const fullFile = `${confDir}/${file}`

                const names = await getServerNamesFromFile(fullFile)
                siteListArgs.push(...(names.map(val => '-d ' + val)))
            }
        }

        const siteArgsNoDupes = [...new Set(siteListArgs)]

        const proc = spawn('certbot', siteArgsNoDupes,
                           {stdio: 'inherit', shell: true}
        )

        proc.on('exit', () => {
            console.log('\n Finished!')
            resolve()
        })

        proc.on('error', () => {
            console.log('Certification Error')
            reject()
        })
    })

}

