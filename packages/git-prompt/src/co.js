#!/usr/bin/env node

'use strict';

const gitPrompts = require('./git-prompts');
const { exec } = require('./utils');

(async () => {
    try {
        const currentBranch = await exec("git rev-parse --abbrev-ref HEAD");
        const nextBranch = await gitPrompts.checkout(currentBranch);
        console.log(`Checking out ${currentBranch.replace(/\n/g, '')} => "${nextBranch}"`);
        exec(`git checkout -b ${nextBranch}`, (e) => { if (e) throw e; });
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
})()

