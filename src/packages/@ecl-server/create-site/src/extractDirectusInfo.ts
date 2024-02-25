import {Answers} from "inquirer"
import {DirectusYmlConfig} from "@/packages/@ecl-server/create-site/src/fileFragments.ts"

export function extractDirectusInfo(answers: Answers): DirectusYmlConfig {

    const publicUrl = answers['directusSubdirectory']
    const keyFile = answers['rootDir'] + 'directus/keys/gcs-key.json'

    return {
        siteName:    answers['siteName'],
        rootDir:     answers['rootDir'],
        port:        answers['directusPort'],
        admin:       {
            email:    answers['directusAdminEmail'],
            password: answers['directusAdminPassword']
        },
        enableCache: true,
        dbSetup:     {
            client:   answers['directusDbClient'],
            host:     answers['directusDbHost'],
            port:     answers['directusDbPort'],
            name:     answers['directusDbName'],
            user:     answers['directusDbUser'],
            password: answers['directusDbPassword']
        },
        ...(answers['subdomainOrSubdirectory'] === 'subdirectory' && {
            subDirSetup: {
                publicUrl: publicUrl
            }
        }),
        ...(answers['directusStorageConfig'] === 'gcs' && {
            gcsSetup: {
                keyFile:    keyFile,
                bucketName: answers['directusGCSBucket'],
                bucketRoot: './uploads',
            }
        }),
        ...(answers['directusUseSendgrid'] && {
            sendGridSetup: {
                sendgridApiKey: answers['directusSendgridKey'],
                senderEmail:    answers['directusSendgridSenderAddress']
            }
        }),
    }
}
