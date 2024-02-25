import {Answers, DistinctQuestion} from "inquirer"

const ignoreList = ['directusSubdirectory', 'rootDir']

// Mutates original answers
export function formatAnswers(answers: Answers, questions: DistinctQuestion[]): Answers {
    const formatted = answers

    questions.forEach(question => {
        if ('transformer' in
            question &&
            typeof question.transformer ===
            'function' &&
            question.name &&
            !ignoreList.includes(question.name) &&
            answers[question.name]) {

            //apply transformer to answer value since this is only applied visually by inquirer for some reason
            formatted[question.name] = question.transformer(formatted[question.name], formatted, {isFinal: true})
        }
    })

    formatted['rootDir'] = (formatted['rootDir'] + '/')?.trim().replace(/\/\/+/g, '/')
    formatted['rootDir'] = (formatted['rootDir'] + answers['siteName'] + '/')

    formatted['directusDbPassword'] = formatted['directusDbPassword'].split(' ')[0]
    formatted['directusAdminPassword'] = formatted['directusAdminPassword'].split(' ')[0]

    return formatted
}
