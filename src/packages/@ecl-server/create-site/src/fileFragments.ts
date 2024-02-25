import YAML, {Node} from 'yaml'

export function createNginxServerBlock(domainName: string, options: {
    redirectTo: 'port' | 'file',
    redirectLocation?: string,
    redirectPort?: string,
    directusConfig?: {
        subDir: string,
        port: string | number
    }
}) {

    const directusBlock =
        options.directusConfig ? '' +
                                 `location /${options.directusConfig.subDir}/ {
        rewrite ^/${options.directusConfig.subDir}/(.*)$ /$1 break;
        proxy_pass http://localhost:${options.directusConfig.port};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }`
                               : ''

    if (options.redirectTo === 'port') {
        return '' +
               `server {
    server_name ${domainName} www.${domainName};
    
    ${directusBlock}

    location / {
        proxy_pass http://localhost:${options.redirectPort};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`
    } else {
        return '' +
               `server {
    server_name ${domainName} www.${domainName};

    ${directusBlock}

    location / {
        alias ${options.redirectLocation};
    }
}`
    }
}

function createKey(stringLength = 24) {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz"
    let randomString = ''
    for (var i = 0; i < stringLength; i++) {
        const ranNum = Math.floor(Math.random() * chars.length)
        randomString += chars[ranNum]
    }
    return randomString
}

export interface DirectusYmlConfig {
    siteName: string,
    port: string | number,
    directusVersion?: string | 'latest',
    rootDir: string,
    admin: {
        email: string,
        password: string
    },
    dbSetup: {
        client: 'pg' | 'mysql' | 'mssql' | 'oracledb'
        host: string,
        name: string,
        user: string,
        password: string,
        port: string | number,
    },
    subDirSetup?: {
        publicUrl: string
    },
    gcsSetup?: {
        keyFile: string,
        bucketName: string,
        bucketRoot?: string,
    },
    sendGridSetup?: {
        senderEmail: string,
        sendgridApiKey: string
    },
    enableCache?: boolean,
}

export function createDirectusYml({
                                      siteName,
                                      port,
                                      directusVersion = 'latest',
                                      rootDir,
                                      admin,
                                      dbSetup,
                                      subDirSetup,
                                      gcsSetup,
                                      sendGridSetup,
                                      enableCache = true,
                                  }: DirectusYmlConfig) {

    const ymlJson = {
        version:  '1.0.0',
        name:     siteName,
        services: {
            directus: {
                image:       `directus/directus:${directusVersion}`,
                ports:       [`${port}:8055`],
                user:        'root',
                restart:     'unless-stopped',
                volumes:     [
                    `${rootDir}directus/keys:/directus/keys`,
                    `${rootDir}directus/uploads:/directus/uploads`,
                    `${rootDir}directus/extensions:/directus/extensions`
                ],
                environment: {
                    KEY:    createKey(),
                    SECRET: createKey(),

                    ...(subDirSetup && {PUBLIC_URL: subDirSetup.publicUrl}),

                    STORAGE_LOCATIONS: gcsSetup ? 'gcs, local' : 'local',

                    STORAGE_LOCAL_ROOT: './uploads',

                    ...(gcsSetup && {
                        STORAGE_GCS_DRIVER:                'gcs',
                        STORAGE_GCS_KEY_FILENAME:          gcsSetup.keyFile,
                        STORAGE_GCS_BUCKET:                gcsSetup.bucketName,
                        STORAGE_GCS_ROOT:                  gcsSetup.bucketRoot ?? './uploads',
                        STORAGE_GCS_HEALTHCHECK_THRESHOLD: 750
                    }),

                    EXTENSIONS_AUTO_RELOAD: true,
                    EXTENSIONS_FOLDER:      './extensions',

                    ...(sendGridSetup && {
                        EMAIL_VERIFY_SETUP:     true,
                        EMAIL_FROM:             sendGridSetup.senderEmail,
                        EMAIL_TRANSPORT:        'sendgrid',
                        EMAIL_SENDGRID_API_KEY: sendGridSetup.sendgridApiKey,
                    }),

                    ...(enableCache && {
                        CACHE_ENABLED:    true,
                        CACHE_AUTO_PURGE: true,
                        CACHE_TTL:        '1 day',
                        CORS_ENABLED:     true,
                        CORS_ORIGIN:      true,
                    }),

                    DB_CLIENT:   dbSetup.client,
                    DB_HOST:     dbSetup.host,
                    DB_PORT:     dbSetup.port,
                    DB_DATABASE: dbSetup.name,
                    DB_USER:     dbSetup.user,
                    DB_PASSWORD: dbSetup.password,

                    ADMIN_EMAIL:    admin.email,
                    ADMIN_PASSWORD: admin.password
                }
            }
        }
    }

    const ymlDoc = new YAML.Document()

    ymlDoc.contents = ymlJson as unknown as Node

    return {
        filename: 'docker-compose.yml',
        content:  ymlDoc.toString()
    }
}
