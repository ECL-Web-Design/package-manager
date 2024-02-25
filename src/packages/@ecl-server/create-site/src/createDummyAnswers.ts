import {Answers, DistinctQuestion} from "inquirer"

const presetAnswers: { [key: string]: any } = {
    rootDir:                 './test',
    onlyDomain:              'full',
    portOrLocation:          'port',
    subdomainOrSubdirectory: 'subdirectory',
    directusDbClient:        'pg',
    directusStorageConfig:   'gcs',
    directusUseSendgrid:     true
}

export function createDummyAnswers(questions: DistinctQuestion[]): Answers {

    const answers: { [key: string]: any } = {}

    questions.forEach(question => {

        if (!question.name) {
            return
        }

        let value: string | boolean = 'Dummy Value 12345'

        if (question.type === 'confirm') {
            value = true
        }

        if (question.name in presetAnswers) {
            value = presetAnswers[question.name]
        }

        answers[question.name] = value
    })

    return answers
}
