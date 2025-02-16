#!/usr/bin/env node

'use strict';
const gitPrompts = require('./git-prompts');
const { exec } = require('./utils');
const fs = require('node:fs');

(async () => {

    const msgFileAsOption = process.argv[2];
    try {

        const msgFileDefault = (await exec("git rev-parse --show-toplevel")) + "/.git/COMMIT_EDITMSG";
        const currentBranch = await exec("git rev-parse --abbrev-ref HEAD");
        const commitMessage = await gitPrompts.commit(currentBranch);
        console.log(`Committing with message "${commitMessage}"`);
        fs.writeFileSync(msgFileAsOption || msgFileDefault, commitMessage);
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
})()





