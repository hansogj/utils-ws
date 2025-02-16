'use strict';
const conventions = require('./conventions');
const prompt = require('prompts');

const splitBranchName = (currentBranch) => {
    const splits = currentBranch.trim().split('/');

    let type,
        ticker,
        scope = '';

    if (splits.length === 1) [type] = splits;
    if (splits.length === 2) [type, scope] = splits;
    if (splits.length === 3) [type, ticker, scope] = splits;
    return { type, ticker, scope };
};

const trimValues = (obj) => Object.entries(obj).reduce((self, [key, val]) => ({
    ...self, [key]:
        typeof val === "string" ?
            val.trim().replace(/\s+/g, " ") : val
}), {});

const checkout = async (currentBranch) => {
    const { type, ticker, scope } = await prompt(
        conventions
            .getQuestions({ ...splitBranchName(currentBranch), scope: '', action: 'branch' })
            .filter((e) => e.name !== 'topic' && e.name !== 'breaking')
    ).then(trimValues)

    if (!type) {
        throw Error('Cannot create branch with empty type');
    }


    if (!scope && !ticker) {
        throw Error('Cannot create branch with both scope and ticker being empty');
    }


    return [type, ticker, scope?.split(/\s/).filter(Boolean).join('-')].filter(Boolean).join('/');
};

const commit = async (currentBranch) => {
    const { type, ticker, scope, breaking, topic } = await prompt(
        conventions.getQuestions({ ...splitBranchName(currentBranch), action: 'commit' }))
        .then(trimValues)


    if (!type) {
        throw Error('Cannot commit with empty type');
    }

    if (!scope && !topic && !ticker) {
        throw Error('Cannot commit with both ticker, scope and topic being empty');
    }


    return [
        type,
        !!scope ? `(${scope})` : ``,
        !!breaking ? '!' : '',
        !!ticker || topic ? ': ' : '',
        !!ticker ? `[${ticker}]`.replace(/\s/g, "-") + " " : ``,
        topic,
    ].join('').trim();

};


const retry = async (commitMessage) => (await prompt([
    {
        type: 'confirm',
        name: 'retry',
        message: `Do you want to commit changes with message:\n\n\t${commitMessage}\n\n`,
        initial: false
    }
])).retry

module.exports = { checkout, commit, retry };
