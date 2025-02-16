#!/usr/bin/env node

'use strict';

const gitPrompts = require('./git-prompts');
const { exec } = require('./utils');
const fs = require('node:fs');


(async () => {

    try {

        const msgFile = (await exec("git rev-parse --show-toplevel")) + "/.git/COMMIT_EDITMSG";
        const commitMessage = fs.readFileSync(msgFile);
        const retry = await gitPrompts.retry(commitMessage);
        if (retry !== true) {
            console.log("exiting")
            process.exit(1);
        };
    } catch (error) {
        console.log(error.message);
    }
})()





