#!/usr/bin/env node

import {existsSync} from "node:fs"
import {mkdir, readFile, writeFile} from "node:fs/promises"
import path from "node:path"
import {parseArgs} from "node:util"
import {confirm, input} from "@inquirer/prompts"

const PACKAGE_SCOPE = "@ecl-design"
const PACKAGES_ROOT = path.join("src", "packages", PACKAGE_SCOPE)
const PACKAGE_AUTHOR = "ECL Web Design"
const PACKAGE_LICENSE = "GNU"
const INITIAL_VERSION = "0.1.0"
const VUE_PEER_DEPENDENCY = ">=3.5.0"

const {values} = parseArgs({
    options: {
        name: {
            type: "string",
            short: "n",
        },
        description: {
            type: "string",
            short: "d",
        },
        force: {
            type: "boolean",
            short: "f",
        },
        "dry-run": {
            type: "boolean",
        },
        help: {
            type: "boolean",
            short: "h",
        },
    },
})

if (values.help) {
    printHelp()
    process.exit(0)
}

try {
    await main()
} catch (error) {
    console.error(`\n${error instanceof Error ? error.message : error}`)
    process.exit(1)
}

async function main() {
    const rootDir = process.cwd()
    const rootPackagePath = path.join(rootDir, "package.json")
    const rootPackage = await readJson(rootPackagePath)

    const packageNameInput = await resolvePromptValue(
        values.name,
        "Package folder name",
        "e.g. animated-heading",
        validatePackageNameInput
    )
    const folderName = normalizePackageName(packageNameInput)
    const packageName = `${PACKAGE_SCOPE}/${folderName}`
    const componentName = toPascalCase(folderName)

    const description = await resolvePromptValue(
        values.description,
        "Package description",
        `Vue design component for ${toTitleCase(folderName)}.`
    )
    const version = INITIAL_VERSION
    const author = PACKAGE_AUTHOR
    const license = PACKAGE_LICENSE
    const vuePeer = VUE_PEER_DEPENDENCY

    const packageRelativePath = path.posix.join("src", "packages", PACKAGE_SCOPE, folderName)
    const packageDir = path.join(rootDir, PACKAGES_ROOT, folderName)
    const componentFileName = `${componentName}.vue`
    const licenseContent = await readFile(path.join(rootDir, "LICENSE"), "utf8")
    const files = buildPackageFiles({
        author,
        componentFileName,
        componentName,
        description,
        folderName,
        license,
        licenseContent,
        packageName,
        version,
        vuePeer,
    })

    const workspaceExists = Array.isArray(rootPackage.workspaces) && rootPackage.workspaces.includes(packageRelativePath)
    const packageDirExists = existsSync(packageDir)

    if (packageDirExists && !values.force) {
        const shouldOverwrite = await confirm({
            message: `${packageRelativePath} already exists. Overwrite boilerplate files?`,
            default: false,
        })

        if (!shouldOverwrite) {
            throw new Error("Package creation cancelled.")
        }
    }

    if (values["dry-run"]) {
        printPlan({
            componentFileName,
            componentName,
            packageName,
            packageRelativePath,
            rootPackagePath,
            workspaceExists,
        })
        return
    }

    await mkdir(packageDir, {recursive: true})

    for (const [fileName, fileContent] of Object.entries(files)) {
        const filePath = path.join(packageDir, fileName)

        if (existsSync(filePath) && !values.force && !packageDirExists) {
            throw new Error(`${path.join(packageRelativePath, fileName)} already exists.`)
        }

        await writeFile(filePath, fileContent)
    }

    if (!Array.isArray(rootPackage.workspaces)) {
        rootPackage.workspaces = []
    }

    if (!workspaceExists) {
        rootPackage.workspaces.push(packageRelativePath)
        await writeJson(rootPackagePath, rootPackage)
    }

    console.log(`\nCreated ${packageName}`)
    console.log(`Package path: ${packageRelativePath}`)
    console.log(`Component: ${componentFileName}`)
}

function buildPackageFiles({author, componentFileName, componentName, description, folderName, license, licenseContent, packageName, version, vuePeer}) {
    return {
        "README.md": buildReadme({componentName, description, folderName, packageName}),
        "LICENSE.md": licenseContent,
        [componentFileName]: buildVueComponent({componentName, folderName}),
        "index.ts": `import ${componentName} from "./${componentFileName}"\n\nexport default ${componentName}\n`,
        "package.json": `${JSON.stringify(buildPackageJson({
            author,
            description,
            folderName,
            license,
            packageName,
            version,
            vuePeer,
        }), null, 2)}\n`,
    }
}

function buildPackageJson({author, description, folderName, license, packageName, version, vuePeer}) {
    return {
        name: packageName,
        version,
        description,
        main: "dist/index.umd.cjs",
        type: "module",
        module: "dist/index.js",
        types: "dist/index.d.ts",
        scripts: {
            build: `set PACKAGE_NAME=${folderName}&& vite build --config ../../../../vite.config.js`,
        },
        files: [
            "dist",
            "README.md",
            "LICENSE.md",
        ],
        exports: {
            ".": {
                import: "./dist/index.js",
                require: "./dist/index.umd.cjs",
                types: "./dist/index.d.ts",
            },
        },
        publishConfig: {
            access: "public",
        },
        author,
        license,
        sideEffects: [
            "./dist/index.css",
        ],
        peerDependencies: {
            vue: vuePeer,
        },
        devDependencies: {
            "@types/vue": "^2.0.0",
            typescript: "^5.2.2",
            vite: "^4.4.10",
            "vite-plugin-libcss": "^1.1.1",
            "vue-tsc": "^1.8.15",
        },
    }
}

function buildReadme({componentName, description, folderName, packageName}) {
    return `# ${toTitleCase(folderName)}\n\n${description}\n\n## Prerequisites\n\nRequires Vue 3.\n\n## Installation\n\n\`\`\`bash\nnpm i ${packageName}\n\`\`\`\n\n## Getting Started\n\n\`\`\`vue\n<script setup lang="ts">\nimport ${componentName} from "${packageName}"\n</script>\n\n<template>\n  <${folderName}>\n    Content\n  </${folderName}>\n</template>\n\`\`\`\n\n## Authors\n\nThis package was created by Elliott Chisholm-Loxley, lead developer at [ECL Web Design](https://eclwebdesign.co.uk).\n\n## License\n\nThis project is licensed under the GNU License - see the [LICENSE.md](LICENSE.md) file for details.\n`
}

function buildVueComponent({componentName, folderName}) {
    return `<template>\n  <div class="${folderName}">\n    <slot />\n  </div>\n</template>\n\n<script lang="ts" setup>\ndefineOptions({\n    name: "${componentName}",\n})\n</script>\n\n<style scoped lang="scss">\n.${folderName} {\n  display: block;\n}\n</style>\n`
}

async function resolvePromptValue(value, message, defaultValue, validate) {
    if (typeof value === "string" && value.trim() !== "") {
        const trimmed = value.trim()
        const validationResult = validate?.(trimmed)

        if (validationResult !== true && typeof validationResult === "string") {
            throw new Error(validationResult)
        }

        return trimmed
    }

    return input({
        message,
        default: defaultValue,
        validate,
    })
}

function normalizePackageName(value) {
    const trimmedValue = value.trim()

    return trimmedValue.startsWith(`${PACKAGE_SCOPE}/`)
        ? trimmedValue.slice(`${PACKAGE_SCOPE}/`.length)
        : trimmedValue
}

function validatePackageNameInput(value) {
    const folderName = normalizePackageName(value.trim())

    if (!folderName) {
        return "Package name is required."
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(folderName)) {
        return "Use a lowercase kebab-case package name, for example animated-heading."
    }

    return true
}

function toPascalCase(value) {
    return value
        .split("-")
        .filter(Boolean)
        .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
        .join("")
}

function toTitleCase(value) {
    return value
        .split("-")
        .filter(Boolean)
        .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
        .join(" ")
}

async function readJson(filePath) {
    return JSON.parse(await readFile(filePath, "utf8"))
}

async function writeJson(filePath, value) {
    await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`)
}

function printPlan({componentFileName, componentName, packageName, packageRelativePath, rootPackagePath, workspaceExists}) {
    console.log("\nDry run complete. No files were changed.")
    console.log(`Package: ${packageName}`)
    console.log(`Path: ${packageRelativePath}`)
    console.log(`Component: ${componentName} (${componentFileName})`)
    console.log(`Root package: ${rootPackagePath}`)
    console.log(`Workspace entry: ${workspaceExists ? "already present" : "will be added"}`)
}

function printHelp() {
    console.log(`Create a Vue design package in ${PACKAGE_SCOPE}.\n\nUsage:\n  npm run create-vue-design-package\n  npm run create-vue-design-package -- --name animated-heading --description "Animated heading component"\n\nOptions:\n  -n, --name <name>                 Package folder name, e.g. animated-heading\n  -d, --description <text>          Package description\n  -f, --force                       Overwrite generated boilerplate files if they exist\n      --dry-run                     Show what would be created without writing files\n  -h, --help                        Show this help text\n`)
}
