import * as fs from "fs"
import inquirer from "inquirer"

const nginxDefaultLocation = '/etc/nginx'

export async function confirmNginxLocation() {

    if (!fs.existsSync(nginxDefaultLocation)) {
        console.log(`Nginx configuration not found at "${nginxDefaultLocation}"`)

        const {nginxLocation} = await inquirer.prompt({
                                                          name:    'nginxLocation',
                                                          type:    "input",
                                                          message: 'Provide the nginx install location',
                                                          validate(input) {
                                                              if (!fs.existsSync(input)) {
                                                                  return 'Location does not exist, please try again'
                                                              }

                                                              return true
                                                          }
                                                      })

        return nginxLocation
    }

    return nginxDefaultLocation
}
