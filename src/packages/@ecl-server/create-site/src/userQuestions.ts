import {Answers, DistinctQuestion} from "inquirer"
import chalk from "chalk"
import {fullSetupQuestions} from "@/packages/@ecl-server/create-site/src/fullSetupQuestions.ts"
import {
    domainTransformer,
    nameTransformer,
    portTransform,
    rootDirTransform
} from "@/packages/@ecl-server/create-site/src/transformers.ts"
import {title} from "@/packages/@ecl-server/create-site/src/formatting.ts"

const userQuestions: DistinctQuestion[] = [
    {
        name:        'siteName',
        type:        'input',
        transformer: nameTransformer,
        prefix:      title('Create a name for your new site') +
                     `-- This will dictate the labelling of the database, db user, folder structure, and directus container of your site\n` +
                     '-- The name can be any of your choosing and is not related to the domain setup.\n\n' +
                     chalk.green('$'),
        message:     'Site Name (Max: 255ch): ',
    },
    {
        name:    'onlyDomain',
        type:    'list',
        default: 'full',
        prefix:  title('STARTING DOMAIN SETUP') +
                 title('Choose Your Setup Configuration') +
                 `-- Full setup creates a new pg database and directus instance.\n` +
                 `-- Add a new domain creates a new domain in your nginx config, then you can choose which location or port to point it to if you have an existing application running\n`,
        choices: [
            {name: 'Install full setup for new site', value: 'full'},
            {name: 'Add a new domain to existing app', value: 'domain'}
        ]
    },
    {
        name:        'rootDir',
        type:        'input',
        prefix:      title('Set the Root Directory') +
                     `-- All site files and folder will be placed here. A new folder will be creating using the site name\n` +
                     `-- If you're only adding a new domain, the nginx conf will be linked here.\n` +
                     chalk.bold(`-- Absolute file path required\n\n`) +
                     chalk.green('$'),
        message:     'Root Directory: ',
        transformer: rootDirTransform,
        validate(input) {
            if (input[0] && input[0] !== '/') {
                return 'Root directory must be an absolute path from server root, eg. /projects/etc'
            }

            if (!input) {
                return 'Must enter a value'
            }

            return true
        },
    },
    {
        name:        'domainName',
        type:        'input',
        transformer: domainTransformer,
        prefix:      title('Provide the Domain Name For The Site') +
                     `-- Provide only the root domain, www.* will be handled automatically.\n` +
                     `-- Note that example.com and example.org are counted as distinct domains and would need separate setups\n\n` +
                     chalk.green('$'),
        message:     "Site Domain (Max: 253ch): "
    },
    {
        name:    'portOrLocation',
        type:    'list',
        default: 'port',
        prefix:  title('Domain Proxy Setup') +
                 `-- Choose if the domain should redirect to a local port, or to the site www folder to serve raw files.\n` +
                 `-- Default www folder is located at <site-root>/www\n` +
                 chalk.green('$'),
        message: 'Choose Which: ',
        choices: [
            {name: 'Redirect to local port', value: 'port'},
            {name: 'Serve files from location', value: 'file'}
        ]
    },
    {
        name:        'mainPort',
        type:        'input',
        default:     '8000',
        transformer: portTransform,
        message:     "Port for main domain: ",
        when(answers) {
            return answers['portOrLocation'] === 'port'
        },
    },
    {
        name:        'mainLocation',
        type:        'input',
        transformer: portTransform,
        default(answers: Answers) {
            return answers['rootDir'] + 'www'
        },
        message: "Folder alias for main domain: ",
        when(answers) {
            return answers['portOrLocation'] === 'location'
        },
    },
    // {
    //     name: 'subdomainsConfirm',
    //     type: 'confirm',
    //     message: "Do you want to add any subdomains?"
    // },
    // {
    //     name:        'subdomains',
    //     type:        'input',
    //     transformer: subdomainListTransformer,
    //     prefix: title('List Subdomains here') +
    //             `-- Provide a list of subdomains seperated by spaces to prefix onto the root domain\n` +
    //             `-- eg. api client archive etc.\n\n` +
    //             chalk.green('$'),
    //     message:     "Subdomain list: ",
    //     when(answers) {
    //         return answers['subdomainsConfirm']
    //     },
    // },
]

userQuestions.push(...fullSetupQuestions)

export default userQuestions
