import {Answers} from "inquirer"
import {createNginxServerBlock} from "@/packages/@ecl-server/create-site/src/fileFragments.ts"


export function createMainNginxConf(answers: Answers) {
    const {
        domainName,
        portOrLocation,
        mainPort,
        mainLocation,
        subdomainOrSubdirectory,
        directusSubdirectory,
        directusPort
    } = answers

    let content = createNginxServerBlock(domainName, {
        redirectTo:       portOrLocation,
        redirectPort:     mainPort,
        redirectLocation: mainLocation,
        ...(subdomainOrSubdirectory === 'subdirectory' && {
            directusConfig: {
                subDir: directusSubdirectory as string,
                port:   directusPort
            }
        })
    })

    if (subdomainOrSubdirectory === 'subdomain') {
        content += '\n\n' + createNginxServerBlock(`${directusSubdirectory}.${domainName}`, {
            redirectTo:   'port',
            redirectPort: directusPort
        })
    }

    return {
        filename: domainName + '.conf',
        content:  content
    }
}
