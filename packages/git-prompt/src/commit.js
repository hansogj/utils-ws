'use strict';

const { prompt } = require('prompts');
const { exec } = require('child_process');
const conventions = require('./conventions');

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
        console.log(`Committing with message ${message}`);
        exec(`git commit -m "${message}"`);
    } catch (error) {
        console.error(error);
    }
});
