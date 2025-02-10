'use strict';

const fs = require('node:fs');
const { prompt } = require('prompts');
const { exec } = require('child_process');
const conventions = require('./conventions');

const args = process.argv.slice(2);
const msgFile = args[0] || ".git/COMMIT_EDITMSG";

exec('git rev-parse --abbrev-ref HEAD', async (err, currentBranch) => {
    if (err) console.log(err);

    try {
        const [type, ticker, topic] = currentBranch.split('/');
        const co = await prompt(conventions.getQuestions({ type, ticker, topic, action: 'commit' }));
        const message = [
            co.type.trim(),
            !!co.scope.trim() ? `(${co.scope.trim()})` : ``,
            !!co.breaking ? '!' : '',
            ': ',
            !!co.ticker.trim() ? `[${co.ticker.trim()}]` : ``,
            ' ',
            co.topic.trim(),
        ].join('');

        fs.writeFileSync(msgFile, message);
    } catch (error) {
        console.error(error);
    }
});
