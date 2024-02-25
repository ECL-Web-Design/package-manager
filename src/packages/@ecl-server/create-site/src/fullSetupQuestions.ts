import {Answers, DistinctQuestion} from "inquirer"
import {title} from "@/packages/@ecl-server/create-site/src/formatting.ts"
import chalk from "chalk"
import {
    domainTransformer,
    portTransform,
    subdirectoryTransformer
} from "@/packages/@ecl-server/create-site/src/transformers.ts"

function whenFn(answers: Answers) {
    return answers['onlyDomain'] === 'full'
}

function validatePassword(input: string) {

    if (!input) {
        return 'Please enter the password twice with a space in-between'
    }

    const passes = input.trim().split(' ')

    if (passes.length < 2) {
        return 'Please enter the password twice with a space in-between'
    }

    if (passes[0] !== passes[1]) {
        return 'Passwords do not match'
    }

    return true
}

export const fullSetupQuestions: DistinctQuestion[] = [
    {
        name:        'directusPort',
        type:        "input",
        prefix:      title('STARTING DIRECTUS SETUP') +
                     title('Choose Which Port Directus Will Listen On') +
                     chalk.green('$'),
        transformer: portTransform,
        message:     'Choose Directus Port: ',
        when:        whenFn
    },
    {
        name:    'subdomainOrSubdirectory',
        type:    'list',
        default: 'subdomain',
        prefix:  title('Host Directus on Subdomain or Subdirectory?') +
                 `-- Choose if Directus cms will be hosted on a subdomain (api.site.com) or a subdirectory (site.com/api)\n` +
                 chalk.green('$'),
        message: 'Choose Which: ',
        choices: [
            {name: 'Subdomain', value: 'subdomain'},
            {name: 'Subdirectory', value: 'subdirectory'}
        ],
        when:    whenFn
    },
    {
        name:        'directusSubdomain',
        type:        "input",
        prefix:      chalk.green('$'),
        transformer: domainTransformer,
        default:     'api',
        message:     'Directus Subdomain ',
        when(answers) {
            return whenFn(answers) && answers['subdomainOrSubdirectory'] === 'subdomain'
        }
    },
    {
        name:        'directusSubdirectory',
        type:        "input",
        prefix:      chalk.green('$'),
        transformer: subdirectoryTransformer,
        message:     'Directus Subdirectory: ',
        when(answers) {
            return whenFn(answers) && answers['subdomainOrSubdirectory'] === 'subdirectory'
        }
    },
    {
        name:    'directusDbClient',
        type:    'list',
        prefix:  title('Directus DB Setup') +
                 title('Choose Directus DB Client') +
                 `-- note only pg is supported for this tool locally, other options will require manual setup\n` +
                 chalk.green('$'),
        message: 'Which DB Client?',
        default: 'pg',
        choices: [
            {name: 'postgresql', value: 'pg'},
            {name: 'mysql', value: 'mysql'},
            {name: 'mssql', value: 'mssql'},
            {name: 'oracledb', value: 'oracledb'}
        ],
        when:    whenFn
    },
    {
        name:    'directusDbHost',
        type:    'input',
        prefix:  title('Choose Directus DB hostname') +
                 `-- If the db is hosted locally use default value\n` +
                 chalk.green('$'),
        default: '172.17.0.1',
        message: 'DB Hostname: ',
        when:    whenFn
    },
    {
        name:        'directusDbPort',
        type:        'input',
        prefix:      chalk.green('$'),
        transformer: portTransform,
        default:     '5432',
        message:     'DB Port: ',
        when:        whenFn
    },
    {
        name:   'directusDbName',
        type:   'input',
        prefix: `-- A new database will be made locally using the site name provided, but you can set a different db if needed\n` +
                chalk.green('$'),
        default(answers: Answers) {
            return answers['siteName'] ?? 'default'
        },
        message: 'DB Name: ',
        when:    whenFn
    },
    {
        name:   'directusDbUser',
        type:   'input',
        prefix: `-- The user will be the site name by default\n` +
                chalk.green('$'),
        default(answers: Answers) {
            return answers['siteName'] ?? 'default'
        },
        message: 'DB User: ',
        when:    whenFn
    },
    {
        name:     'directusDbPassword',
        type:     "password",
        prefix:   '-- Please type the password twice with a space in-between to confirm they match\n' +
                  chalk.green('$'),
        message:  'DB Password: ',
        validate: validatePassword,
        when:     whenFn
    },
    {
        name:    'directusStorageConfig',
        type:    'list',
        prefix:  title('Choose How Directus Will Store Your Files') +
                 `-- Note only gcs and local is supported by this tool currently\n` +
                 `-- Local files will be stored at: <site root>/directus/uploads\n`,
        message: 'Directus Storage Config: ',
        default: 'local',
        choices: [
            {name: 'Store On Server', value: 'local'},
            {name: 'Google GCS Bucket', value: 'gcs'}
        ],
        when:    whenFn
    },
    {
        name:    'directusGCSBucket',
        type:    'input',
        message: 'GCS Bucket Name: ',
        when(answers) {
            return whenFn(answers) && answers['directusStorageConfig'] === 'gcs'
        }
    },
    {
        // name: 'directusKeyAcknowledge',
        // type: "input",
        // prefix: title('Setting Your GCS API Key') +
        //         `-- Please Note that the GCS api key json must be pasted into the file located at: \n` +
        //         chalk.bold(`<site root folder>/directus/keys/gcs-key.json\n`) +
        //         `-- Before this is done manually directus will default to local storage.\n\n` +
        //         chalk.inverse(`-- Please press enter to acknowledge`),
        // when(answers) {
        //     return whenFn(answers) && answers['directusStorageConfig'] === 'gcs'
        // }

        name:    'directusGcsKeyJson',
        type:    'editor',
        message: 'Paste your gcs key file here: ',
        when(answers) {
            return whenFn(answers) && answers['directusStorageConfig'] === 'gcs'
        }
    },
    {
        name:    'directusUseSendgrid',
        type:    'confirm',
        prefix:  title('Choose whether to use sendgrid') +
                 `-- sendgrid can be used for automating emails through directus\n` +
                 `-- Other options are available but not currently supported by this tool\n\n` +
                 chalk.green('?'),
        message: 'Setup Sendgrid with Directus?',
        when:    whenFn
    },
    {
        name:    'directusSendgridKey',
        type:    "password",
        message: 'Paste your sendgrid api key here: ',
        when(answers) {
            return whenFn(answers) && answers['directusUseSendgrid']
        },
    },
    {
        name: 'directusSendgridSenderAddress',
        type: "input",
        default(answers: Answers) {
            return `noreply@${answers['domainName']}`
        },
        message: 'Sender Email Address: ',
        when(answers) {
            return whenFn(answers) && answers['directusUseSendgrid']
        },
    },
    {
        name:    'directusAdminEmail',
        type:    "input",
        prefix:  title('Directus Admin Login Information') +
                 chalk.green('$'),
        message: 'Directus Admin Email: ',
        when:    whenFn
    },
    {
        name:     'directusAdminPassword',
        prefix:   '-- Please type the password twice with a space in-between to confirm they match\n' +
                  chalk.green('$'),
        type:     "password",
        validate: validatePassword,
        when:     whenFn
    },
]
