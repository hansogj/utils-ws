#!/usr/bin/env node

'use strict';

const { prompt } = require('prompts');
const { exec } = require('child_process');
const conventions = require('./conventions');

exec('git rev-parse --abbrev-ref HEAD', async (err, currentBranch) => {
    if (err) {
        console.error(err);
    }

    try {
        const [type, ticker] = currentBranch.split('/');
        const co = await prompt(
            conventions
                .getQuestions({ type, ticker, topic: '', action: 'branch' })
                .filter((e) => e.name !== 'topic' && e.name !== 'breaking')
        );

        const nextBranch = [co.type, co.ticker, co.scope.split(/\s/).filter(Boolean).join('-')]
            .filter(Boolean)
            .join('/');

        console.log(`Checking out ${currentBranch.replace(/\n/, '')} => "${nextBranch}"`);
        exec(`git checkout -b ${nextBranch}`);
    } catch (error) {
        console.log('error', error);
    }
});
