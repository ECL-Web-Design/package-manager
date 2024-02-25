import {Answers} from "inquirer"

export function nameTransformer(val: string) {
    return val.toLowerCase().replace(/[^a-z0-9\-_]/g, "").substring(0, 255)
}

export function domainTransformer(val: string) {
    return val.toLowerCase().replace(/[^a-z0-9\-_\.]/g, "").substring(0, 253)
}

export function subdomainListTransformer(val: string) {
    return val.toLowerCase().replace(/[^a-z0-9\-_\. ]/g, "").substring(0, 253)
}

export function subdirectoryTransformer(val: string, answers: Answers) {
    return 'https://' + answers['domainName'] + '/' + val.toLowerCase().replace(/[^a-z0-9\-_/]/g, "").substring(0, 253)
}

export function portTransform(val: string) {
    return val.replace(/[^0-9]/g, "")
}

export function rootDirTransform(val: string, answers: Answers) {
    return val + `/${answers['siteName']}`
}
